/* Page animations, powered by Motion (https://motion.dev), loaded from a CDN.
   Load this at the end of <body> with "defer". Needs motion-init.js in <head>.
   If Motion fails to load, or the visitor prefers reduced motion, nothing is animated
   and the page is simply shown. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains("mo")) {   // reduced motion, motion-init.js missing, or the failsafe already ran
    console.info("[motion] Skipped: motion-init.js did not run (is the file uploaded?), reduced motion is on, or the page timed out.");
    return;
  }

  var SEL = window.__moSel || [];
  var EASE = [0.22, 1, 0.36, 1];

  function showAll() {
    root.classList.remove("mo");
    if (!SEL.length) return;
    document.querySelectorAll(SEL.join(",")).forEach(function (el) {
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  import("https://cdn.jsdelivr.net/npm/motion@12/+esm")
    .then(function (M) {
      if (!root.classList.contains("mo")) return; // took too long, the page is already shown
      try {
        window.__moReady = true;
        run(M);
        console.info("[motion] Animations running.");
      } catch (e) {
        console.warn("Animations turned off:", e);
        showAll();
      }
    })
    .catch(function (e) {
      console.warn("Animation library did not load, showing the page without animation:", e);
      showAll();
    });

  function run(M) {
    var animate = M.animate, inView = M.inView, scroll = M.scroll, stagger = M.stagger;
    var hover = M.hover, press = M.press;
    var done = new WeakSet();

    // Fade and rise a group of elements, one after another. Each element animates only once.
    function reveal(list, o) {
      o = o || {};
      var els = Array.prototype.filter.call(list, function (e) { return !done.has(e); });
      if (!els.length) return;
      els.forEach(function (e) { done.add(e); });
      animate(
        els,
        { opacity: [0, 1], y: [o.y || 22, 0] },
        { duration: o.duration || 0.7, ease: EASE, delay: stagger(o.step || 0.06, { startDelay: o.start || 0 }) }
      );
    }

    function watch(el, opts, fn) {
      if (el) new MutationObserver(fn).observe(el, opts);
    }

    // 1. Sections: the hero plays on load, every other section plays when it scrolls into view.
    var all = SEL.join(",");
    document.querySelectorAll("main > section").forEach(function (sec) {
      if (sec.id === "home") {
        reveal(sec.querySelectorAll(all), { y: 30, duration: 0.9, step: 0.1, start: 0.1 });
        return;
      }
      inView(sec, function () { reveal(sec.querySelectorAll(all)); }, { margin: "0px 0px -12% 0px" });
    });

    // 2. Scroll progress bar at the top of the page.
    var bar = document.createElement("div");
    bar.setAttribute("aria-hidden", "true");
    bar.className = "fixed top-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left z-50 pointer-events-none";
    bar.style.transform = "scaleX(0)";
    document.body.appendChild(bar);
    scroll(animate(bar, { scaleX: [0, 1] }));

    // 3. Project cards animate in again each time a tab is opened.
    watch(document.getElementById("grid"), { childList: true }, function (muts) {
      var added = [];
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) { if (n.nodeType === 1) added.push(n); });
      });
      reveal(added, { y: 18, step: 0.08, duration: 0.5 });
    });

    // 4. Chat button pops in after the hero, the panel opens smoothly, messages slide in.
    var fab = document.getElementById("fab");
    if (fab) {
      done.add(fab);
      animate(fab, { opacity: [0, 1] }, { delay: 1.2, duration: 0.3 });
      animate(fab, { scale: [0.6, 1] }, { delay: 1.2, type: "spring", stiffness: 320, damping: 22 });
    }
    var panel = document.getElementById("panel");
    if (panel) {
      panel.style.transformOrigin = "100% 100%";
      watch(panel, { attributes: true, attributeFilter: ["hidden"] }, function () {
        if (!panel.hidden) animate(panel, { opacity: [0, 1], y: [14, 0], scale: [0.97, 1] }, { duration: 0.28, ease: EASE });
      });
    }
    watch(document.getElementById("log"), { childList: true }, function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) animate(n, { opacity: [0, 1], y: [8, 0] }, { duration: 0.3, ease: EASE });
        });
      });
    });

    // 5. Resume popup.
    var dlg = document.getElementById("resumeDlg");
    watch(dlg, { attributes: true, attributeFilter: ["open"] }, function () {
      if (dlg.open) animate(dlg, { opacity: [0, 1], y: [18, 0], scale: [0.98, 1] }, { duration: 0.3, ease: EASE });
    });

    // 6. Buttons grow slightly on hover and shrink slightly when pressed.
    var pills = Array.prototype.slice.call(
      document.querySelectorAll(":is(a, button).rounded-full:not(#tabs button)")
    );
    if (hover) {
      hover(pills, function (el) {
        if (el.disabled) return;
        animate(el, { scale: 1.04 }, { duration: 0.18 });
        return function () { animate(el, { scale: 1 }, { duration: 0.18 }); };
      });
    }
    if (press) {
      press(pills, function (el) {
        if (el.disabled) return;
        animate(el, { scale: 0.96 }, { duration: 0.1 });
        return function () { animate(el, { scale: 1 }, { duration: 0.18 }); };
      });
    }
  }
})();