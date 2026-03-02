import { jsx as f } from "react/jsx-runtime";
import { useRef as W, useEffect as X, useLayoutEffect as j } from "react";
import { EditorServer as M, getDocumentType as O, MockSocket as d, createXHRProxy as P, io as C } from "../index.mjs";
function _({
  assetsPath: h,
  x2tPath: L = "/x2t-1",
  file: m,
  fileUrl: w,
  newDocument: y,
  language: q = "en",
  theme: x = "theme-light",
  user: g = { id: "uid", name: "User" },
  onReady: l,
  onDocumentStateChange: a,
  onSave: F,
  onError: n,
  style: A,
  className: R
}) {
  const r = W(!1);
  return X(() => {
    const c = (t) => {
      r.current && (t.preventDefault(), t.returnValue = "");
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, []), j(() => {
    const c = h + "/web-apps/apps/api/documents/api.js", t = new M({ x2tPath: L, user: g });
    m ? t.open(m) : w ? t.openUrl(w) : y ? t.openNew(y) : t.openNew("docx");
    const i = t.getDocument(), H = O(i.fileType);
    let s = null;
    const v = ({ socket: e }) => t.handleConnect({ socket: e }), D = ({ socket: e }) => t.handleDisconnect({ socket: e });
    d.on("connect", v), d.on("disconnect", D);
    const I = () => {
      const e = document.querySelector('iframe[name="frameEditor"]'), o = e == null ? void 0 : e.contentWindow, p = e == null ? void 0 : e.contentDocument;
      if (!p || !o) {
        n == null || n(new Error("Iframe not loaded"));
        return;
      }
      const T = P(o.XMLHttpRequest), S = o.Worker;
      T.use((u) => t.handleRequest(u)), Object.assign(o, {
        io: C,
        XMLHttpRequest: T,
        Worker: function(u, U) {
          const E = new URL(u, location.origin);
          return new S(E.href.replace(E.origin, location.origin), U);
        }
      });
      const b = p.createElement("script");
      b.src = c, p.body.appendChild(b), l == null || l();
    }, k = () => {
      s = new window.DocsAPI.DocEditor("placeholder", {
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
        documentType: H,
        editorConfig: {
          lang: q,
          coEditing: { mode: "fast", change: !1 },
          user: { ...g },
          customization: {
            uiTheme: x,
            features: { spellcheck: { change: !1 } }
          }
        },
        events: {
          onAppReady: () => I(),
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
  }, []), /* @__PURE__ */ f("div", { style: { width: "100%", height: "100%", ...A }, className: R, children: /* @__PURE__ */ f("div", { id: "placeholder", style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ f(
    "iframe",
    {
      style: { width: 0, height: 0, display: "none" },
      src: h + "/web-apps/apps/api/documents/preload.html"
    }
  ) }) });
}
export {
  _ as OnlyOfficeEditor
};
