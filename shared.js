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
})();
