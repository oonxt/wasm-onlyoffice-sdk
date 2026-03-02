import { X2tConvertParams, X2tConvertResult } from './types'

interface PendingMessage {
  resolve: (value: any) => void
  reject: (error: Error) => void
}

interface WorkerResponse {
  id: number
  type: 'ready' | 'init:done' | 'convert:done' | 'error'
  payload?: any
  error?: string
}

export class X2tConverter {
  private worker: Worker | null = null
  private initPromise: Promise<void> | null = null
  private messageId = 0
  private pendingMessages = new Map<number, PendingMessage>()
  private x2tPath: string

  constructor(x2tPath = '/x2t-1') {
    this.x2tPath = x2tPath
    if (globalThis.Worker) {
      this.init()
    }
  }

  private getNextId(): number {
    return ++this.messageId
  }

  private sendMessage<T>(type: string, payload?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Worker not initialized'))
        return
      }
      const id = this.getNextId()
      this.pendingMessages.set(id, { resolve, reject })

      if (type === 'convert' && payload?.data instanceof ArrayBuffer) {
        this.worker.postMessage({ id, type, payload }, [payload.data])
      } else {
        this.worker.postMessage({ id, type, payload })
      }
    })
  }

  private handleWorkerMessage = (event: MessageEvent<WorkerResponse>) => {
    const { id, type, payload, error } = event.data

    if (type === 'ready') {
      console.log('[X2tConverter] Worker ready')
      return
    }

    const pending = this.pendingMessages.get(id)
    if (!pending) return
    this.pendingMessages.delete(id)

    if (type === 'error') {
      pending.reject(new Error(error || 'Unknown worker error'))
    } else {
      pending.resolve(payload)
    }
  }

  private handleWorkerError = (error: ErrorEvent) => {
    console.error('[X2tConverter] Worker error:', error)
    for (const [, pending] of this.pendingMessages) {
      pending.reject(new Error(`Worker error: ${error.message}`))
    }
    this.pendingMessages.clear()
  }

  public init(): Promise<void> {
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise<void>((resolve, reject) => {
      try {
        this.worker = new Worker(new URL('./x2t.worker.ts', import.meta.url), { type: 'module' })
        this.worker.onmessage = this.handleWorkerMessage
        this.worker.onerror = this.handleWorkerError

        // Send init message with x2tPath — worker needs this before it loads WASM
        this.sendMessage<void>('init', { x2tPath: this.x2tPath })
          .then(resolve)
          .catch(reject)
      } catch (err) {
        this.initPromise = null
        reject(err)
      }
    })

    return this.initPromise
  }

  public async convert(params: X2tConvertParams): Promise<X2tConvertResult> {
    await this.init()

    const cloneMap = (map?: { [key: string]: Uint8Array }) => {
      if (!map) return undefined
      return Object.fromEntries(
        Object.entries(map).map(([key, value]) => [key, value.slice(0)])
      )
    }

    const dataClone = params.data.slice(0)
    const payload = {
      ...params,
      data: dataClone,
      media: cloneMap(params.media),
      fonts: cloneMap(params.fonts),
      themes: cloneMap(params.themes),
    }
    return this.sendMessage<X2tConvertResult>('convert', payload)
  }

  public terminate(): void {
    if (this.worker) {
      for (const [, pending] of this.pendingMessages) {
        pending.reject(new Error('Worker terminated'))
      }
      this.pendingMessages.clear()
      this.worker.terminate()
      this.worker = null
      this.initPromise = null
    }
  }

  public get isInitialized(): boolean {
    return this.worker !== null && this.initPromise !== null
  }
}
