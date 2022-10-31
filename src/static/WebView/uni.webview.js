!function (e, n) {
  "object" === typeof exports && "undefined" !== typeof module ? module.exports = n() : "function" === typeof define && define.amd ? define(n) : (e = e || self).webUni = n()
}(this, (function () {
  "use strict"
  try {
    const e = {}
    Object.defineProperty(e, "passive", {
      get: function () {
        !0
      }
    }), window.addEventListener("test-passive", null, e)
  } catch (e) {}
  const n = Object.prototype.hasOwnProperty

  function t(e, t) {
    return n.call(e, t)
  }
  const i = [],
    a = function (e, n) {
      const t = {
        options: {
          timestamp: +new Date
        },
        name: e,
        arg: n
      }
      if (window.__dcloud_weex_postMessage || window.__dcloud_weex_) {
        if ("postMessage" === e) {
          const a = {
            data: [n]
          }
          return window.__dcloud_weex_postMessage ? window.__dcloud_weex_postMessage(a) : window.__dcloud_weex_.postMessage(JSON.stringify(a))
        }
        const o = {
          type: "WEB_INVOKE_APPSERVICE",
          args: {
            data: t,
            webviewIds: i
          }
        }
        window.__dcloud_weex_postMessage ? window.__dcloud_weex_postMessageToService(o) : window.__dcloud_weex_.postMessageToService(JSON.stringify(o))
      }
      if (!window.plus) return window.parent.postMessage({
        type: "WEB_INVOKE_APPSERVICE",
        data: t,
        pageId: ""
      }, "*")
      if (0 === i.length) {
        const r = plus.webview.currentWebview()
        if (!r) throw new Error("plus.webview.currentWebview() is undefined")
        let d = r.parent(),
          s = ""
        s = d ? d.id : r.id, i.push(s)
      }
      if (plus.webview.getWebviewById("__uniapp__service")) plus.webview.postMessageToUniNView({
        type: "WEB_INVOKE_APPSERVICE",
        args: {
          data: t,
          webviewIds: i
        }
      }, "__uniapp__service")
      else {
        const w = JSON.stringify(t)
        plus.webview.getLaunchWebview().evalJS('UniPlusBridge.subscribeHandler("'.concat("WEB_INVOKE_APPSERVICE", '",').concat(w, ",").concat(JSON.stringify(i), ");"))
      }
    },
    o = {
      navigateTo: function () {
        const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url
        a("navigateTo", {
          url: encodeURI(n)
        })
      },
      navigateBack: function () {
        const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.delta
        a("navigateBack", {
          delta: parseInt(n) || 1
        })
      },
      switchTab: function () {
        const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url
        a("switchTab", {
          url: encodeURI(n)
        })
      },
      reLaunch: function () {
        const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url
        a("reLaunch", {
          url: encodeURI(n)
        })
      },
      redirectTo: function () {
        const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          n = e.url
        a("redirectTo", {
          url: encodeURI(n)
        })
      },
      getEnv: function (e) {
        window.plus ? e({
          plus: !0
        }) : e({
          h5: !0
        })
      },
      postMessage: function () {
        const e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        a("postMessage", e.data || {})
      }
    },
    r = /uni-app/i.test(navigator.userAgent),
    d = /Html5Plus/i.test(navigator.userAgent),
    s = /complete|loaded|interactive/
  const w = window.my && navigator.userAgent.indexOf("AlipayClient") > -1
  const u = window.swan && window.swan.webView && /swan/i.test(navigator.userAgent)
  const c = window.qq && window.qq.miniProgram && /QQ/i.test(navigator.userAgent) && /miniProgram/i.test(navigator.userAgent)
  const g = window.tt && window.tt.miniProgram && /toutiaomicroapp/i.test(navigator.userAgent)
  const v = window.wx && window.wx.miniProgram && /micromessenger/i.test(navigator.userAgent) && /miniProgram/i.test(navigator.userAgent)
  const p = window.qa && /quickapp/i.test(navigator.userAgent)
  for (var l, _ = function () {
      window.UniAppJSBridge = !0, document.dispatchEvent(new CustomEvent("UniAppJSBridgeReady", {
        bubbles: !0,
        cancelable: !0
      }))
    }, f = [function (e) {
      if (r || d) return window.__dcloud_weex_postMessage || window.__dcloud_weex_ ? document.addEventListener("DOMContentLoaded", e) : window.plus && s.test(document.readyState) ? setTimeout(e, 0) : document.addEventListener("plusready", e), o
    }, function (e) {
      if (v) return window.WeixinJSBridge && window.WeixinJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("WeixinJSBridgeReady", e), window.wx.miniProgram
    }, function (e) {
      if (c) return window.QQJSBridge && window.QQJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("QQJSBridgeReady", e), window.qq.miniProgram
    }, function (e) {
      if (w) {
        document.addEventListener("DOMContentLoaded", e)
        const n = window.my
        return {
          navigateTo: n.navigateTo,
          navigateBack: n.navigateBack,
          switchTab: n.switchTab,
          reLaunch: n.reLaunch,
          redirectTo: n.redirectTo,
          postMessage: n.postMessage,
          getEnv: n.getEnv
        }
      }
    }, function (e) {
      if (u) return document.addEventListener("DOMContentLoaded", e), window.swan.webView
    }, function (e) {
      if (g) return document.addEventListener("DOMContentLoaded", e), window.tt.miniProgram
    }, function (e) {
      if (p) {
        window.QaJSBridge && window.QaJSBridge.invoke ? setTimeout(e, 0) : document.addEventListener("QaJSBridgeReady", e)
        const n = window.qa
        return {
          navigateTo: n.navigateTo,
          navigateBack: n.navigateBack,
          switchTab: n.switchTab,
          reLaunch: n.reLaunch,
          redirectTo: n.redirectTo,
          postMessage: n.postMessage,
          getEnv: n.getEnv
        }
      }
    }, function (e) {
      return document.addEventListener("DOMContentLoaded", e), o
    }], m = 0; m < f.length && !(l = f[m](_)); m++);
  l || (l = {})
  const E = "undefined" !== typeof webUni ? webUni : {}
  if (!E.navigateTo)
    for (const b in l) t(l, b) && (E[b] = l[b])
  return E.webView = l, E
}))