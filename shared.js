/* ============================================================
   GloForEx — Shared JavaScript
   shared.js
   ============================================================ */

/* ── Theme ─────────────────────────────────────────────────── */
(function () {
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body && document.body.setAttribute('data-theme', theme);
  }

  function initTheme() {
    applyTheme(getSystemTheme());
  }

  // React to OS-level changes in real time
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    applyTheme(e.matches ? 'dark' : 'light');
  });

  // Run immediately so there's no flash of wrong theme
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();  // ← this was missing

/* ── Analytics ─────────────────────────────────────────────── */
(function() {
  var s = document.createElement('script');
  s.async = true;
  s.src = '//gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://bk-gdb.goatcounter.com/count');
  document.head.appendChild(s);
})();
