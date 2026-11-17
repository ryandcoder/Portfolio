/* Motion setup. Load this in <head> so there is no flash of content.
   It hides the elements that motion-effects.js will animate in, but only when motion is
   allowed. If the animation library has not started after 3.5 seconds, everything is shown. */
(function () {
  var root = document.documentElement;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    console.info("[motion] Skipped: this device is set to reduce motion (an accessibility setting), so animations are off on purpose.");
    return;
  }

  // Elements that fade in. Change this list to change what animates.
  var sel = [
    "#home h1", "#home > p", "#home .flex > *",
    "main > section:not(#home) > h2",
    "#about > p", "#about li",
    "#experience .grid", "#education .grid", "#certs li",
    "#tabs", "#grid > *",
    "#contact > p", "#contact .flex > *",
    "#fab",
    'main[data-anim="case"] section > *'
  ];
  window.__moSel = sel;

  root.classList.add("mo");
  var st = document.createElement("style");
  st.textContent = sel.map(function (s) { return ".mo " + s; }).join(",") + "{opacity:0}";
  document.head.appendChild(st);

  setTimeout(function () {
    if (!window.__moReady) root.classList.remove("mo");
  }, 3500);
})();