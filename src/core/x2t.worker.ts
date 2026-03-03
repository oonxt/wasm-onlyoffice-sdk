/// <reference lib="webworker" />

import { AvsFileType, X2tConvertParams, X2tConvertResult } from "./types";

/* eslint-disable no-restricted-globals */

// BASE_URL is set via 'init' message from X2tConverter
let BASE_URL = '';

let x2t: any = null;
let initPromise: Promise<void> | null = null;

async function initX2t(): Promise<void> {
  if (x2t) return;

  const scriptUrl = BASE_URL + "x2t.js";

  Object.assign(self, {
    __filename: /^https?:\/\//.test(BASE_URL) ? BASE_URL : self.location.origin + BASE_URL,
  });

  importScripts(scriptUrl);

  x2t = (self as any).Module;

  await new Promise<void>((resolve) => {
    x2t.onRuntimeInitialized = () => resolve();
  });

  try {
    x2t.FS.mkdir("/working");
    x2t.FS.mkdir("/working/media");
    x2t.FS.mkdir("/working/fonts");
    x2t.FS.mkdir("/working/themes");
  } catch (err) {
    console.error("[x2t.worker] mkdir error:", err);
  }

  console.log("[x2t.worker] Initialized successfully");
}

async function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = initX2t();
  }
  return initPromise;
}

function cleanupFiles(files: string[]): void {
  for (const file of files) {
    try { x2t.FS.unlink(file); } catch {}
  }
  cleanMedia();
}

function cleanMedia() {
  try {
    const mediaFiles = x2t.FS.readdir("/working/media/");
    for (const file of mediaFiles) {
      if (file !== "." && file !== "..") {
        x2t.FS.unlink("/working/media/" + file);
      }
    }
  } catch {}
}

function readMedia(): { [key: string]: Uint8Array<ArrayBuffer> } {
  const media: { [key: string]: Uint8Array<ArrayBuffer> } = {};
  try {
    const files = x2t.FS.readdir("/working/media/");
    for (const file of files) {
      if (file !== "." && file !== "..") {
        media[file] = x2t.FS.readFile("/working/media/" + file, { encoding: "binary" });
      }
    }
  } catch {}
  return media;
}

const xmlPath = "/working/params.xml";

function writeInputs({ fileFrom, fileTo, formatFrom, formatTo, data, media }: X2tConvertParams) {
  const params = {
    m_sFileFrom: fileFrom,
    m_sThemeDir: "/working/themes",
    m_sFileTo: fileTo,
    m_nFormatFrom: formatFrom,
    m_nFormatTo: formatTo,
    m_bIsPDFA: formatTo === AvsFileType.AVS_FILE_CROSSPLATFORM_PDFA,
    m_bIsNoBase64: false,
    m_sFontDir: "/working/fonts/",
  };

  const content = Object.entries(params)
    .filter(([, v]) => v)
    .reduce((a, [k, v]) => a + `<${k}>${v}</${k}>\n`, "");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<TaskQueueDataConvert
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
>
${content}
</TaskQueueDataConvert>`;

  x2t.FS.writeFile(xmlPath, xml);
  if (data) x2t.FS.writeFile(fileFrom, new Uint8Array(data));

  if (media) {
    cleanMedia();
    for (const [key, value] of Object.entries(media)) {
      try { x2t.FS.writeFile("/working/" + key, value); } catch (err) {
        console.error(key, err);
      }
    }
  }
}

async function convert(params: X2tConvertParams): Promise<X2tConvertResult> {
  const fromPath = "/working/" + params.fileFrom;
  const toPath = "/working/" + params.fileTo;
  const files = [fromPath, toPath, xmlPath];

  writeInputs({ ...params, fileFrom: fromPath, fileTo: toPath });

  if (params.fileFrom.endsWith(".doc") || params.formatFrom === AvsFileType.AVS_FILE_DOCUMENT_DOC) {
    const viaPath = fromPath + ".docx";
    writeInputs({ fileFrom: fromPath, fileTo: viaPath, data: null as never });
    x2t.ccall("main1", ["number"], ["string"], [xmlPath]);
    writeInputs({ fileFrom: viaPath, fileTo: toPath, data: null as never });
    files.push(viaPath);
  }

  try {
    if (x2t.FS.analyzePath(toPath).exists) x2t.FS.unlink(toPath);
  } catch {}

  try {
    x2t.ccall("main1", ["number"], ["string"], [xmlPath]);
  } catch (e) {
    console.error("ccall", e);
  }

  let output: Uint8Array<ArrayBuffer> | null = null;
  try { output = x2t.FS.readFile(toPath); } catch {}

  const outputMedia = readMedia();
  setTimeout(() => cleanupFiles(files));

  return { output, media: outputMedia };
}

interface WorkerMessage {
  id?: number;
  type: 'init' | 'convert';
  payload?: any;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case 'init': {
        // Set BASE_URL from payload before initializing WASM
        BASE_URL = (payload.x2tPath as string).replace(/\/$/, '') + '/';
        await ensureInit();
        self.postMessage({ id, type: 'init:done' });
        break;
      }
      case 'convert': {
        await ensureInit();
        const result = await convert(payload);
        const transferables: Transferable[] = [];
        if (result.output) transferables.push(result.output.buffer);
        Object.values(result.media).forEach((m) => transferables.push(m.buffer));
        self.postMessage(
          { id, type: 'convert:done', payload: result },
          { transfer: transferables }
        );
        break;
      }
      default:
        self.postMessage({ id, type: 'error', error: `Unknown message type: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

self.postMessage({ type: 'ready' });
