// ═══════════════════════════════════════════════════════════════
// ui.js — Toast, modal helpers y utilidades visuales puras
// Sin dependencias de estado de negocio.
// ═══════════════════════════════════════════════════════════════

// ── Toast ────────────────────────────────────────────────────

/** @param {'success'|'error'|undefined} type */
export function showToast(msg, type) {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  const icon = type === 'success' ? 'fa-circle-check'
             : type === 'error'   ? 'fa-circle-xmark'
             :                      'fa-circle-info';
  t.innerHTML = `<i class="fa-solid ${icon}"></i>${msg}`;
  c.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 2400);
}

// ── Carga dinámica de scripts ────────────────────────────────

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
