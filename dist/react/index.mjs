import { jsx as w } from "react/jsx-runtime";
import { useRef as X, useEffect as j, useLayoutEffect as F } from "react";
import { EditorServer as M, getDocumentType as N, MockSocket as l, createXHRProxy as $, io as B } from "../index.mjs";
function J({
  assetsPath: R,
  x2tPath: S = "/x2t-1",
  file: y,
  fileUrl: v,
  newDocument: g,
  language: q = "en",
  theme: x = "theme-light",
  user: D = { id: "uid", name: "User" },
  onReady: p,
  onDocumentStateChange: u,
  onSave: z,
  onError: t,
  style: A,
  className: P
}) {
  const d = X(!1), r = R.replace(/\/$/, ""), f = /^https?:\/\//.test(r);
  j(() => {
    const c = (a) => {
      d.current && (a.preventDefault(), a.returnValue = "");
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, []), F(() => {
    const c = r + "/web-apps/apps/api/documents/api.js", a = f ? r + "/web-apps/apps/api/documents/" : location.origin, n = new M({ x2tPath: S, user: D });
    y ? n.open(y) : v ? n.openUrl(v) : g ? n.openNew(g) : n.openNew("docx");
    const s = n.getDocument(), H = N(s.fileType);
    let i = null;
    const b = ({ socket: e }) => n.handleConnect({ socket: e }), k = ({ socket: e }) => n.handleDisconnect({ socket: e });
    l.on("connect", b), l.on("disconnect", k);
    const I = () => {
      const e = document.querySelector('iframe[name="frameEditor"]'), o = e == null ? void 0 : e.contentWindow, h = e == null ? void 0 : e.contentDocument;
      if (!h || !o) {
        t == null || t(new Error("Iframe not loaded"));
        return;
      }
      const T = $(o.XMLHttpRequest), O = o.Worker;
      T.use((m) => n.handleRequest(m)), Object.assign(o, {
        io: B,
        XMLHttpRequest: T,
        Worker: function(m, W) {
          return new O(new URL(m, a).href, W);
        }
      });
      const E = h.createElement("script");
      E.src = new URL(c, location.origin).href, h.body.appendChild(E), p == null || p();
    }, L = () => {
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
        documentType: H,
        editorConfig: {
          lang: q,
          coEditing: { mode: "fast", change: !1 },
          user: { ...D },
          customization: {
            uiTheme: x,
            features: { spellcheck: { change: !1 } }
          }
        },
        events: {
          onAppReady: () => I(),
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
        L();
        return;
      }
      let e = document.querySelector(`script[src="${c}"]`);
      e || (e = document.createElement("script"), e.src = c, document.head.appendChild(e)), e.onload = () => L(), e.onerror = () => t == null ? void 0 : t(new Error("Failed to load DocsAPI script"));
    })(), () => {
      var e;
      l.off("connect", b), l.off("disconnect", k), (e = i == null ? void 0 : i.destroyEditor) == null || e.call(i), n.destroy();
    };
  }, []);
  const U = f ? void 0 : r + "/web-apps/apps/api/documents/preload.html", C = f ? `<!DOCTYPE html><html><head><base href="${r}/web-apps/apps/api/documents/"></head><body></body></html>` : void 0;
  return /* @__PURE__ */ w("div", { style: { width: "100%", height: "100%", ...A }, className: P, children: /* @__PURE__ */ w("div", { id: "placeholder", style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ w(
    "iframe",
    {
      style: { width: 0, height: 0, display: "none" },
      src: U,
      srcDoc: C
    }
  ) }) });
}
export {
  J as OnlyOfficeEditor
};
