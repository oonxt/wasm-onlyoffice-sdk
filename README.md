# wasm-onlyoffice-sdk

Offline OnlyOffice document editor SDK for React and Vue, powered by WebAssembly.

**Demo:** [oonxt/wasm-onlyoffice-demo](https://github.com/oonxt/wasm-onlyoffice-demo)

## Prerequisites

This SDK requires two sets of static assets:

**OnlyOffice web-apps scaffold** — a small set of HTML files (~2 MB) that must be served from the **same origin** as your app. These HTML files contain `<base href>` tags pointing to a CDN, so the browser loads the actual heavy content (SDK JS, fonts, CSS) from the CDN at runtime. You do not need to self-host the full OnlyOffice SDK.

**x2t WASM converter** — `x2t.js` and `x2t.wasm`. Can be served from the same origin or a CDN.

### Setup

Download the web-apps scaffold from the [demo repo](https://github.com/oonxt/wasm-onlyoffice-demo) (`public/` directory) and place it in your project:

```
your-project/
  public/
    v9.3.0.24-1/   ← web-apps scaffold (HTML files + api.js, ~2 MB)
    x2t-1/         ← x2t WASM converter (x2t.js + x2t.wasm), optional if using CDN
```

```tsx
<OnlyOfficeEditor assetsPath="/v9.3.0.24-1" x2tPath="/x2t-1" ... />
```

The scaffold's HTML files have `<base href>` tags pre-configured to load assets from a public CDN. You can swap those URLs to your own CDN if needed.

### Using a CDN for x2t

`x2tPath` accepts either a local path or a full CDN URL:

```tsx
<OnlyOfficeEditor
  assetsPath="/v9.3.0.24-1"
  x2tPath="https://cdn.example.com/x2t"
  ...
/>
```

The x2t worker script is bundled inside the SDK (always same-origin). `x2tPath` only controls where the worker fetches `x2t.js` and `x2t.wasm`.

Both files are brotli-compressed and must be served with the following headers:

| File | `Content-Type` | `Content-Encoding` |
|------|---------------|-------------------|
| `x2t.js` | `application/javascript` | `br` |
| `x2t.wasm` | `application/wasm` | `br` |

When using a CDN, also add `Access-Control-Allow-Origin: *` on both files.

### Vite setup

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['wasm-onlyoffice-sdk'],
  },
  server: {
    fs: {
      allow: ['../..'],  // only needed when referencing the SDK via a local file: path
    },
  },
})
```

`optimizeDeps.exclude` is required because the SDK resolves its bundled worker via `new URL(...)`, which Vite's pre-bundler would break.

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

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0-or-later).

This license is chosen to comply with the licenses of the third-party components this project depends on:

- **OnlyOffice Web Apps** — Copyright (C) Ascensio System SIA, licensed under [AGPL-3.0](https://github.com/ONLYOFFICE/web-apps/blob/master/LICENSE)
- **office-website** (architectural reference) — Copyright (C) baotlake, licensed under [AGPL-3.0](https://github.com/baotlake/office-website/blob/main/LICENSE.txt)

## Credits

- SDK implementation references [baotlake/office-website](https://github.com/baotlake/office-website)
- OnlyOffice web-apps static assets are extracted from the OnlyOffice DocumentServer Docker image: [onlyoffice/documentserver](https://hub.docker.com/r/onlyoffice/documentserver)
