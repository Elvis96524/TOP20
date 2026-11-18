// Registers the service worker on every page and offers an Install button.
(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (e) { console.warn("SW failed:", e); });
    });
  }
  var standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) return;

  function banner(text, btnText, onClick) {
    if (document.getElementById("pwaBanner")) return;
    var b = document.createElement("div");
    b.id = "pwaBanner";
    b.style.cssText = "position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-width:520px;margin:auto;background:#2fd38c;color:#06281a;border-radius:16px;padding:12px 14px;display:flex;gap:12px;align-items:center;font:600 14px system-ui,sans-serif;z-index:99;box-shadow:0 8px 24px rgba(0,0,0,.25)";
    var t = document.createElement("span"); t.style.flex = "1"; t.textContent = text; b.appendChild(t);
    if (btnText) {
      var i = document.createElement("button"); i.textContent = btnText;
      i.style.cssText = "border:0;border-radius:10px;padding:9px 14px;background:#06281a;color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer";
      i.onclick = onClick; b.appendChild(i);
    }
    var x = document.createElement("button"); x.textContent = "\u2715"; x.setAttribute("aria-label", "Dismiss");
    x.style.cssText = "border:0;background:none;color:#06281a;font-size:16px;cursor:pointer";
    x.onclick = function () { b.remove(); }; b.appendChild(x);
    document.body.appendChild(b);
  }

  var deferred;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    banner("Install this app on your device", "Install", function () {
      deferred.prompt(); deferred.userChoice.then(function () { deferred = null; var b = document.getElementById("pwaBanner"); if (b) b.remove(); });
    });
  });
  window.addEventListener("appinstalled", function () { var b = document.getElementById("pwaBanner"); if (b) b.remove(); });

  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (ios) window.addEventListener("load", function () {
    banner("To install: tap Share, then Add to Home Screen", null);
  });
})();
