<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })
import { EditorServer } from '../core/editor-server'
import { MockSocket, io } from '../core/mock-socket'
import { createXHRProxy } from '../core/xhr-proxy'
import { getDocumentType } from '../core/utils'
import type { DocEditor, OfficeTheme, User } from '../core/types'

interface Props {
  assetsPath: string
  x2tPath?: string
  file?: File
  fileUrl?: string
  newDocument?: 'docx' | 'xlsx' | 'pptx' | 'pdf'
  language?: string
  theme?: OfficeTheme
  user?: User
}

const props = withDefaults(defineProps<Props>(), {
  x2tPath: '/x2t-1',
  language: 'en',
  theme: 'theme-light',
  user: () => ({ id: 'uid', name: 'User' }),
})

const emit = defineEmits<{
  ready: []
  documentStateChange: [isDirty: boolean]
  save: [blob: Blob, filename: string]
  error: [error: Error]
}>()

const isDirty = ref(false)
let server: EditorServer | null = null
let editor: DocEditor | null = null

const handleConnect = ({ socket }: { socket: MockSocket }) => server?.handleConnect({ socket })
const handleDisconnect = ({ socket }: { socket: MockSocket }) => server?.handleDisconnect({ socket })

onMounted(() => {
  const apiUrl = props.assetsPath + '/web-apps/apps/api/documents/api.js'
  const user = props.user ?? { id: 'uid', name: 'User' }

  server = new EditorServer({ x2tPath: props.x2tPath, user })

  if (props.file) {
    server.open(props.file)
  } else if (props.fileUrl) {
    server.openUrl(props.fileUrl)
  } else if (props.newDocument) {
    server.openNew(props.newDocument)
  } else {
    server.openNew('docx')
  }

  const doc = server.getDocument()
  const documentType = getDocumentType(doc.fileType)

  MockSocket.on('connect', handleConnect)
  MockSocket.on('disconnect', handleDisconnect)

  const onAppReady = () => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe[name="frameEditor"]')
    const win = iframe?.contentWindow as typeof window
    const iframeDoc = iframe?.contentDocument
    if (!iframeDoc || !win) { emit('error', new Error('Iframe not loaded')); return }

    const XHR = createXHRProxy(win.XMLHttpRequest)
    const _Worker = win.Worker

    XHR.use((request: Request) => server!.handleRequest(request))
    Object.assign(win, {
      io,
      XMLHttpRequest: XHR,
      Worker: (url: string, options?: WorkerOptions) => {
        const u = new URL(url, location.origin)
        return new _Worker(u.href.replace(u.origin, location.origin), options)
      },
    })

    const script = iframeDoc.createElement('script')
    script.src = apiUrl
    iframeDoc.body.appendChild(script)
    emit('ready')
  }

  const createEditor = () => {
    editor = new (window as any).DocsAPI.DocEditor('placeholder', {
      document: {
        fileType: doc.fileType,
        key: doc.key,
        title: doc.title,
        url: doc.url,
        permissions: { edit: doc.fileType !== 'pdf', chat: false, rename: true, protect: true, review: false, print: false },
      },
      documentType,
      editorConfig: {
        lang: props.language,
        coEditing: { mode: 'fast', change: false },
        user: { ...user },
        customization: { uiTheme: props.theme, features: { spellcheck: { change: false } } },
      },
      events: {
        onAppReady: () => onAppReady(),
        onDocumentStateChange: (e: { data: boolean }) => {
          if (e.data) isDirty.value = true
          emit('documentStateChange', e.data)
        },
        onError: (e: unknown) => emit('error', new Error(String(e))),
        onSaveDocument: () => { isDirty.value = false },
        writeFile: () => { isDirty.value = false },
      },
      width: '100%',
      height: '100%',
    })
  }

  if ((window as any).DocsAPI?.DocEditor) {
    createEditor()
    return
  }
  let script = document.querySelector<HTMLScriptElement>(`script[src="${apiUrl}"]`)
  if (!script) {
    script = document.createElement('script')
    script.src = apiUrl
    document.head.appendChild(script)
  }
  script.onload = () => createEditor()
  script.onerror = () => emit('error', new Error('Failed to load DocsAPI script'))
})

onUnmounted(() => {
  MockSocket.off('connect', handleConnect)
  MockSocket.off('disconnect', handleDisconnect)
  editor?.destroyEditor?.()
  server?.destroy()
})
</script>

<template>
  <div v-bind="$attrs" style="width: 100%; height: 100%">
    <div id="placeholder" style="width: 100%; height: 100%">
      <iframe
        style="width: 0; height: 0; display: none"
        :src="assetsPath + '/web-apps/apps/api/documents/preload.html'"
      />
    </div>
  </div>
</template>
