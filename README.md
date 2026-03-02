# wasm-onlyoffice-sdk

Offline OnlyOffice document editor SDK for React and Vue, powered by WebAssembly.

## Prerequisites

This SDK requires two sets of static assets to be self-hosted on the same origin as your application.

**OnlyOffice web-apps** — the `v9.3.0.24-1/` directory from the WASM build.

**x2t WASM converter** — the `x2t-1/` directory containing `x2t.js` and `x2t.wasm`.

Both directories must be served from the same origin as your app. The simplest approach is to place them in your project's `public/` folder so they are accessible at `/v9.3.0.24-1/` and `/x2t-1/` respectively.

```
your-project/
  public/
    v9.3.0.24-1/   ← OnlyOffice web-apps assets
    x2t-1/         ← x2t WASM converter (x2t.js + x2t.wasm)
```

## Installation

```bash
npm install wasm-onlyoffice-sdk
# React users also need:
npm install react react-dom
# Vue users also need:
npm install vue
```

## React Usage

```tsx
import { OnlyOfficeEditor } from 'wasm-onlyoffice-sdk/react'

export default function App() {
  return (
    <OnlyOfficeEditor
      assetsPath="/v9.3.0.24-1"
      x2tPath="/x2t-1"
      newDocument="docx"
      language="en"
      theme="theme-light"
      user={{ id: 'user1', name: 'Alice' }}
      onReady={() => console.log('Editor ready')}
      onDocumentStateChange={(isDirty) => console.log('Dirty:', isDirty)}
      onSave={(blob, filename) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
      }}
      onError={(error) => console.error('Editor error:', error)}
      style={{ width: '100%', height: '100vh' }}
    />
  )
}
```

Opening an existing file:

```tsx
<OnlyOfficeEditor
  assetsPath="/v9.3.0.24-1"
  file={selectedFile}    // File object from <input type="file">
/>
```

## Vue Usage

```vue
<script setup>
import { OnlyOfficeEditor } from 'wasm-onlyoffice-sdk/vue'

const onReady = () => console.log('Editor ready')
const onSave = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}
</script>

<template>
  <OnlyOfficeEditor
    assets-path="/v9.3.0.24-1"
    x2t-path="/x2t-1"
    new-document="docx"
    language="en"
    theme="theme-dark"
    :user="{ id: 'user1', name: 'Alice' }"
    @ready="onReady"
    @save="onSave"
    style="width: 100%; height: 100vh"
  />
</template>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `assetsPath` | `string` | **required** | URL prefix for OnlyOffice web-apps assets |
| `x2tPath` | `string` | `"/x2t-1"` | URL prefix for x2t WASM converter files |
| `file` | `File` | — | Open an existing File object |
| `fileUrl` | `string` | — | Open a document from a remote URL |
| `newDocument` | `"docx" \| "xlsx" \| "pptx" \| "pdf"` | — | Create a new blank document |
| `language` | `string` | `"en"` | Editor UI language |
| `theme` | `OfficeTheme` | `"theme-light"` | Editor color theme |
| `user` | `{ id: string; name: string }` | `{ id: "uid", name: "User" }` | Current user identity |
| `onReady` / `@ready` | `() => void` | — | Fired when the editor is fully loaded |
| `onDocumentStateChange` / `@document-state-change` | `(isDirty: boolean) => void` | — | Fired on unsaved change state |
| `onSave` / `@save` | `(blob: Blob, filename: string) => void` | — | Fired when user triggers Save As |
| `onError` / `@error` | `(error: Error) => void` | — | Fired on editor errors |

Only one of `file`, `fileUrl`, or `newDocument` should be provided. If none is provided, a new blank `.docx` is created.

## Supported Themes

- `theme-light`
- `theme-classic-light`
- `theme-white`
- `theme-dark`
- `theme-night`
- `theme-contrast-dark`

## Supported Document Formats

**Documents:** docx, doc, odt, ott, rtf, txt, html, epub, fb2, dotx, docm, dotm

**Spreadsheets:** xlsx, xls, ods, ots, csv, xlsm, xltx, xltm, xlsb

**Presentations:** pptx, ppt, odp, otp, ppsx, pptm, ppsm, potx, potm

**PDF / cross-platform:** pdf, djvu, xps

**Diagrams:** vsdx, vssx, vstx, vsdm, vssm, vstm

## Core API (Advanced)

For framework-agnostic usage or custom integrations, the underlying classes can be imported directly:

```ts
import { EditorServer, X2tConverter, MockSocket } from 'wasm-onlyoffice-sdk'
```

`EditorServer` manages the editor lifecycle and document communication. `X2tConverter` wraps the WASM-based file format converter. `MockSocket` provides the in-browser socket layer that replaces the OnlyOffice server backend.
