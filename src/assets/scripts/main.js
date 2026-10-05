/* ============================================================
   main.js — compartido por todas las páginas XandA
   Inversión de paleta: persistente + auto-inyección del botón
============================================================ */
(function () {
  'use strict';

  var KEY = 'xanda-inverted';
  var root = document.documentElement;

  function apply(on) {
    root.classList.toggle('inverted', on);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.title = on ? 'Volver al tema oscuro' : 'Invertir paleta';
    }
  }

  function toggle() {
    var on = !root.classList.contains('inverted');
    apply(on);
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
  }

  /* Aplica la preferencia guardada lo antes posible (evita destello) */
  var saved = false;
  try { saved = localStorage.getItem(KEY) === '1'; } catch (e) {}
  apply(saved);

  /* Botón: usa el del footer o inyecta uno si no existe */
  function ensureButton() {
    var btn = document.getElementById('themeToggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'theme-toggle';
      btn.id = 'themeToggle';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Invertir paleta de colores');
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML =
        '<svg class="ico-sun" viewBox="0 0 24 24" aria-hidden="true">' +
          '<circle cx="12" cy="12" r="4.5"/>' +
          '<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>' +
        '</svg>' +
        '<svg class="ico-moon" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>' +
        '</svg>';

      // destino: .foot-bottom > .mono, o el footer a secas
      var anchor = document.querySelector('footer .foot-bottom .mono') ||
                   document.querySelector('footer .foot-bottom') ||
                   document.querySelector('footer .container') ||
                   document.querySelector('footer');
      if (anchor) {
        if (anchor.classList.contains('mono') || anchor.classList.contains('foot-bottom')) {
          anchor.parentNode.insertBefore(btn, anchor.nextSibling);
          if (anchor.classList.contains('foot-bottom')) {
            btn.style.marginLeft = 'auto';
          }
        } else {
          anchor.appendChild(btn);
        }
      } else {
        return; // no hay footer en esta página
      }
    }
    btn.addEventListener('click', toggle);
    apply(root.classList.contains('inverted')); // sincroniza icono/título
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureButton);
  } else {
    ensureButton();
  }

  /* Opcional: atajo de teclado "D" (fuera de inputs) */
  document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() !== 'd' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || e.target.isContentEditable) return;
    toggle();
  });
})();