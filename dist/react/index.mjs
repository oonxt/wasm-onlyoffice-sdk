import { jsx as w } from "react/jsx-runtime";
import { useRef as X, useEffect as j, useLayoutEffect as F } from "react";
import { EditorServer as M, getDocumentType as N, MockSocket as l, createXHRProxy as $, io as B } from "../index.mjs";
function J({
  assetsPath: S,
  x2tPath: q = "/x2t-1",
  file: y,
  fileUrl: v,
  newDocument: D,
  language: x = "en",
  theme: A = "theme-light",
  user: b = { id: "uid", name: "User" },
  onReady: p,
  onDocumentStateChange: u,
  onSave: z,
  onError: t,
  style: P,
  className: R
}) {
  const d = X(!1), r = S.replace(/\/$/, ""), f = /^https?:\/\//.test(r);
  j(() => {
    const c = (a) => {
      d.current && (a.preventDefault(), a.returnValue = "");
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, []), F(() => {
    const c = r + "/web-apps/apps/api/documents/api.js", a = f ? r + "/web-apps/apps/api/documents/" : location.origin, n = new M({ x2tPath: q, user: b });
    y ? n.open(y) : v ? n.openUrl(v) : D ? n.openNew(D) : n.openNew("docx");
    const s = n.getDocument(), I = N(s.fileType);
    let i = null;
    const g = ({ socket: e }) => n.handleConnect({ socket: e }), k = ({ socket: e }) => n.handleDisconnect({ socket: e });
    l.on("connect", g), l.on("disconnect", k);
    const O = () => {
      const e = document.querySelector('iframe[name="frameEditor"]'), o = e == null ? void 0 : e.contentWindow, h = e == null ? void 0 : e.contentDocument;
      if (!h || !o) {
        t == null || t(new Error("Iframe not loaded"));
        return;
      }
      const E = $(o.XMLHttpRequest), U = o.Worker;
      E.use((m) => n.handleRequest(m)), Object.assign(o, {
        io: B,
        XMLHttpRequest: E,
        Worker: function(m, W) {
          return new U(new URL(m, a).href, W);
        }
      });
      const L = h.createElement("script");
      L.src = c, h.body.appendChild(L), p == null || p();
    }, T = () => {
      i = new window.DocsAPI.DocEditor("placeholder", {
        isLocalFile: !0,
        document: {
          fileType: s.fileType,
          key: s.key,
          title: s.title,
          url: s.url,
          permissions: {
            edit: s.fileType !== "pdf",
            chat: !1,
            rename: !0,
            protect: !0,
            review: !1,
            print: !1
          }
        },
        documentType: I,
        editorConfig: {
          lang: x,
          coEditing: { mode: "fast", change: !1 },
          user: { ...b },
          customization: {
            uiTheme: A,
            features: { spellcheck: { change: !1 } }
          }
        },
        events: {
          onAppReady: () => O(),
          onDocumentStateChange: (e) => {
            e.data && (d.current = !0), u == null || u(e.data);
          },
          onError: (e) => t == null ? void 0 : t(new Error(String(e))),
          onSaveDocument: () => {
            d.current = !1;
          },
          writeFile: () => {
            d.current = !1;
          }
        },
        width: "100%",
        height: "100%"
      });
    };
    return (() => {
      var o;
      if ((o = window.DocsAPI) != null && o.DocEditor) {
        T();
        return;
      }
      let e = document.querySelector(`script[src="${c}"]`);
      e || (e = document.createElement("script"), e.src = c, document.head.appendChild(e)), e.onload = () => T(), e.onerror = () => t == null ? void 0 : t(new Error("Failed to load DocsAPI script"));
    })(), () => {
      var e;
      l.off("connect", g), l.off("disconnect", k), (e = i == null ? void 0 : i.destroyEditor) == null || e.call(i), n.destroy();
    };
  }, []);
  const C = f ? void 0 : r + "/web-apps/apps/api/documents/preload.html", H = f ? `<!DOCTYPE html><html><head><base href="${r}/web-apps/apps/api/documents/"></head><body></body></html>` : void 0;
  return /* @__PURE__ */ w("div", { style: { width: "100%", height: "100%", ...P }, className: R, children: /* @__PURE__ */ w("div", { id: "placeholder", style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ w(
    "iframe",
    {
      style: { width: 0, height: 0, display: "none" },
      src: C,
      srcDoc: H
    }
  ) }) });
}
export {
  J as OnlyOfficeEditor
};
