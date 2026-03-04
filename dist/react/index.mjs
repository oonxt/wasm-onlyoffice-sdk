import { jsx as u } from "react/jsx-runtime";
import { useRef as W, useEffect as X, useLayoutEffect as j } from "react";
import { EditorServer as F, getDocumentType as M, MockSocket as d, createXHRProxy as O, io as C } from "../index.mjs";
function _({
  assetsPath: T,
  x2tPath: E = "/x2t-1",
  file: h,
  fileUrl: m,
  newDocument: w,
  language: R = "en",
  theme: q = "theme-light",
  user: y = { id: "uid", name: "User" },
  onReady: l,
  onDocumentStateChange: a,
  onSave: N,
  onError: n,
  style: x,
  className: A
}) {
  const r = W(!1), g = T.replace(/\/$/, "");
  X(() => {
    const c = (t) => {
      r.current && (t.preventDefault(), t.returnValue = "");
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, []), j(() => {
    const c = g + "/web-apps/apps/api/documents/api.js", t = new F({ x2tPath: E, user: y });
    h ? t.open(h) : m ? t.openUrl(m) : w ? t.openNew(w) : t.openNew("docx");
    const i = t.getDocument(), U = M(i.fileType);
    let s = null;
    const v = ({ socket: e }) => t.handleConnect({ socket: e }), D = ({ socket: e }) => t.handleDisconnect({ socket: e });
    d.on("connect", v), d.on("disconnect", D);
    const H = () => {
      const e = document.querySelector('iframe[name="frameEditor"]'), o = e == null ? void 0 : e.contentWindow, p = e == null ? void 0 : e.contentDocument;
      if (!p || !o) {
        n == null || n(new Error("Iframe not loaded"));
        return;
      }
      const L = O(o.XMLHttpRequest), I = o.Worker;
      L.use((f) => t.handleRequest(f)), Object.assign(o, {
        io: C,
        XMLHttpRequest: L,
        Worker: function(f, P) {
          return new I(new URL(f, location.origin).href, P);
        }
      });
      const b = p.createElement("script");
      b.src = new URL(c, location.origin).href, p.body.appendChild(b), l == null || l();
    }, k = () => {
      s = new window.DocsAPI.DocEditor("placeholder", {
        isLocalFile: !0,
        document: {
          fileType: i.fileType,
          key: i.key,
          title: i.title,
          url: i.url,
          permissions: {
            edit: i.fileType !== "pdf",
            chat: !1,
            rename: !0,
            protect: !0,
            review: !1,
            print: !1
          }
        },
        documentType: U,
        editorConfig: {
          lang: R,
          coEditing: { mode: "fast", change: !1 },
          user: { ...y },
          customization: {
            uiTheme: q,
            features: { spellcheck: { change: !1 } }
          }
        },
        events: {
          onAppReady: () => H(),
          onDocumentStateChange: (e) => {
            e.data && (r.current = !0), a == null || a(e.data);
          },
          onError: (e) => n == null ? void 0 : n(new Error(String(e))),
          onSaveDocument: () => {
            r.current = !1;
          },
          writeFile: () => {
            r.current = !1;
          }
        },
        width: "100%",
        height: "100%"
      });
    };
    return (() => {
      var o;
      if ((o = window.DocsAPI) != null && o.DocEditor) {
        k();
        return;
      }
      let e = document.querySelector(`script[src="${c}"]`);
      e || (e = document.createElement("script"), e.src = c, document.head.appendChild(e)), e.onload = () => k(), e.onerror = () => n == null ? void 0 : n(new Error("Failed to load DocsAPI script"));
    })(), () => {
      var e;
      d.off("connect", v), d.off("disconnect", D), (e = s == null ? void 0 : s.destroyEditor) == null || e.call(s), t.destroy();
    };
  }, []);
  const S = g + "/web-apps/apps/api/documents/preload.html";
  return /* @__PURE__ */ u("div", { style: { width: "100%", height: "100%", ...x }, className: A, children: /* @__PURE__ */ u("div", { id: "placeholder", style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ u(
    "iframe",
    {
      style: { width: 0, height: 0, display: "none" },
      src: S
    }
  ) }) });
}
export {
  _ as OnlyOfficeEditor
};
