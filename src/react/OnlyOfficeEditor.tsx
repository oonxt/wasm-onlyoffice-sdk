import { useLayoutEffect, useRef, useEffect, CSSProperties } from 'react'
import { EditorServer } from '../core/editor-server'
import { MockSocket, io } from '../core/mock-socket'
import { createXHRProxy } from '../core/xhr-proxy'
import { getDocumentType } from '../core/utils'
import type { DocEditor, OfficeTheme, User } from '../core/types'

export interface OnlyOfficeEditorProps {
  /** URL prefix for OnlyOffice web-apps assets, e.g. "/v9.3.0.24-1" */
  assetsPath: string
  /** URL prefix for x2t WASM files, e.g. "/x2t-1". Defaults to "/x2t-1" */
  x2tPath?: string

  /** Open an existing File object */
  file?: File
  /** Open a document from a remote URL */
  fileUrl?: string
  /** Create a new blank document of the given type */
  newDocument?: 'docx' | 'xlsx' | 'pptx' | 'pdf'

  language?: string
  theme?: OfficeTheme
  user?: User

  onReady?: () => void
  onDocumentStateChange?: (isDirty: boolean) => void
  /** Called when the user triggers Save As / Download */
  onSave?: (blob: Blob, filename: string) => void
  onError?: (error: Error) => void

  style?: CSSProperties
  className?: string
}

export function OnlyOfficeEditor({
  assetsPath,
  x2tPath = '/x2t-1',
  file,
  fileUrl,
  newDocument,
  language = 'en',
  theme = 'theme-light',
  user = { id: 'uid', name: 'User' },
  onReady,
  onDocumentStateChange,
  onSave,
  onError,
  style,
  className,
}: OnlyOfficeEditorProps) {
  const isDirty = useRef(false)
  const base = assetsPath.replace(/\/$/, '')

  // Warn on unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.current) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useLayoutEffect(() => {
    const apiUrl = base + '/web-apps/apps/api/documents/api.js'
    const server = new EditorServer({ x2tPath, user })

    // Open document from the provided source
    if (file) {
      server.open(file)
    } else if (fileUrl) {
      server.openUrl(fileUrl)
    } else if (newDocument) {
      server.openNew(newDocument)
    } else {
      server.openNew('docx')
    }

    const doc = server.getDocument()
    const documentType = getDocumentType(doc.fileType)
    let editor: DocEditor | null = null

    const handleConnect = ({ socket }: { socket: MockSocket }) => server.handleConnect({ socket })
    const handleDisconnect = ({ socket }: { socket: MockSocket }) => server.handleDisconnect({ socket })

    MockSocket.on('connect', handleConnect)
    MockSocket.on('disconnect', handleDisconnect)

    const onAppReady = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe[name="frameEditor"]')
      const win = iframe?.contentWindow as typeof window
      const iframeDoc = iframe?.contentDocument
      if (!iframeDoc || !win) { onError?.(new Error('Iframe not loaded')); return }

      const XHR = createXHRProxy(win.XMLHttpRequest)
      const _Worker = win.Worker

      XHR.use((request: Request) => server.handleRequest(request))
      Object.assign(win, {
        io,
        XMLHttpRequest: XHR,
        Worker: function (url: string, options?: WorkerOptions) {
          return new _Worker(new URL(url, location.origin).href, options)
        },
      })

      const script = iframeDoc.createElement('script')
      script.src = new URL(apiUrl, location.origin).href
      iframeDoc.body.appendChild(script)
      onReady?.()
    }

    const createEditor = () => {
      editor = new (window as any).DocsAPI.DocEditor('placeholder', {
        isLocalFile: true,
        document: {
          fileType: doc.fileType,
          key: doc.key,
          title: doc.title,
          url: doc.url,
          permissions: {
            edit: doc.fileType !== 'pdf',
            chat: false,
            rename: true,
            protect: true,
            review: false,
            print: false,
          },
        },
        documentType,
        editorConfig: {
          lang: language,
          coEditing: { mode: 'fast', change: false },
          user: { ...user },
          customization: {
            uiTheme: theme,
            features: { spellcheck: { change: false } },
          },
        },
        events: {
          onAppReady: () => onAppReady(),
          onDocumentStateChange: (e: { data: boolean }) => {
            if (e.data) isDirty.current = true
            onDocumentStateChange?.(e.data)
          },
          onError: (e: unknown) => onError?.(new Error(String(e))),
          onSaveDocument: () => { isDirty.current = false },
          writeFile: () => { isDirty.current = false },
        },
        width: '100%',
        height: '100%',
      })
    }

    const loadEditor = () => {
      if ((window as any).DocsAPI?.DocEditor) { createEditor(); return }

      let script = document.querySelector<HTMLScriptElement>(`script[src="${apiUrl}"]`)
      if (!script) {
        script = document.createElement('script')
        script.src = apiUrl
        document.head.appendChild(script)
      }
      script.onload = () => createEditor()
      script.onerror = () => onError?.(new Error('Failed to load DocsAPI script'))
    }

    loadEditor()

    return () => {
      MockSocket.off('connect', handleConnect)
      MockSocket.off('disconnect', handleDisconnect)
      editor?.destroyEditor?.()
      server.destroy()
    }
  }, []) // Run only once on mount

  const preloadSrc = base + '/web-apps/apps/api/documents/preload.html'

  return (
    <div style={{ width: '100%', height: '100%', ...style }} className={className}>
      <div id="placeholder" style={{ width: '100%', height: '100%' }}>
        <iframe
          style={{ width: 0, height: 0, display: 'none' }}
          src={preloadSrc}
        />
      </div>
    </div>
  )
}
