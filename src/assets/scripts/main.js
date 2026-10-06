/* ============================================================
   main.js — compartido por TODAS las páginas XandA
   1) Inversión de paleta (toggle + persistencia + atajo "D")
   2) Auto-tema del footer (.ftr-light) — determinista
   3) Newsletter del footer (reutiliza toast global si existe)
   4) Nav/Header: scroll-fixed, anuncio y menú móvil
   5) Command Palette (⌘K) — motor global + API de registro
      (index.js añade sus órdenes de sección con
       XandA.registerCmdkCommands)
   Todas las consultas al DOM son defensivas: corre en
   cualquier página, exista o no cada elemento.
============================================================ */

/* ---------- Namespace compartido ---------- */
window.XandA = window.XandA || {};

/* ============================================================
   1) INVERSIÓN DE PALETA
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

  /* Atajo de teclado "D" (fuera de inputs) */
  document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() !== 'd' || e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || e.target.isContentEditable) return;
    toggle();
  });
})();

/* ============================================================
   2) AUTO-TEMA DEL FOOTER — versión determinista
   Prioridad:
   1) data-footer-theme="light|dark" en <html> o <body> (gana siempre)
   2) Luminancia del background-color del body
   3) Luminancia del color de texto del body (texto claro ⇒ tema oscuro)
   4) Fallback: oscuro (tema del ecosistema)
============================================================ */
(function () {
  'use strict';

  function lum(rgb) {
    var m = rgb.match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    if (m.length > 3 && parseFloat(m[3]) < 0.5) return null; // transparente
    return (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) / 255;
  }

  function resolve() {
    /* 1) Declaración explícita de la página */
    var explicit = document.body.getAttribute('data-footer-theme') ||
                   document.documentElement.getAttribute('data-footer-theme');
    if (explicit === 'light') return true;
    if (explicit === 'dark') return false;

    /* 2) Fondo del body (si es medible) */
    var L = lum(getComputedStyle(document.body).backgroundColor);

    /* 3) Color del texto: indicador más fiable que el fondo */
    if (L === null) {
      var t = lum(getComputedStyle(document.body).color);
      if (t !== null) L = 1 - t;
    }

    /* 4) Fallback: oscuro */
    if (L === null) L = 0;
    return L > 0.5;
  }

  function applyFooterTheme() {
    var footer = document.querySelector('footer');
    if (!footer) return;
    footer.classList.toggle('ftr-light', resolve());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFooterTheme);
  } else {
    applyFooterTheme();
  }
  /* Re-evaluar al terminar de cargar todo */
  window.addEventListener('load', applyFooterTheme);
})();

/* ============================================================
   TOAST COMPARTIDO — XandA.toast(msg, ok)
   Reutiliza el #toast global si existe; si no, crea uno.
   La usa el newsletter y la command palette.
============================================================ */
(function () {
  'use strict';

  var fToast = null, fTimer = null;

  window.XandA.toast = function (msg, ok) {
    var globalToast = document.getElementById('toast');
    var globalMsg   = document.getElementById('toastMsg');

    /* Index: reutiliza el toast existente */
    if (globalToast && globalMsg) {
      globalMsg.textContent = msg;
      globalToast.classList.toggle('err', ok === false);
      globalToast.classList.add('show');
      clearTimeout(fTimer);
      fTimer = setTimeout(function () {
        globalToast.classList.remove('show');
      }, 2300);
      return;
    }

    /* Otras páginas: toast autónomo */
    if (!fToast) {
      fToast = document.createElement('div');
      fToast.style.cssText =
        'position:fixed;bottom:28px;left:50%;transform:translate(-50%,90px);' +
        'background:#1E1940;color:#F1EFFC;font-family:Inter,sans-serif;font-size:14px;' +
        'font-weight:600;padding:14px 24px;border-radius:14px;border:1px solid #342C66;' +
        'box-shadow:0 20px 50px -12px rgba(0,0,0,.7);transition:.45s cubic-bezier(.2,1.2,.4,1);' +
        'z-index:2600;display:flex;align-items:center;gap:11px;max-width:90vw;';
      document.body.appendChild(fToast);
    }
    fToast.innerHTML =
      '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:' +
      (ok === false ? '#EF4444' : '#3ECF8E') +
      ';fill:none;stroke-width:2.6;stroke-linecap:round;flex:none;">' +
      (ok === false
        ? '<path d="M6 6l12 12M18 6L6 18"/>'
        : '<path d="m5 12.5 4.5 4.5L19 7.5"/>') +
      '</svg><span>' + msg + '</span>';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { fToast.style.transform = 'translate(-50%,0)'; });
    });
    clearTimeout(fTimer);
    fTimer = setTimeout(function () {
      fToast.style.transform = 'translate(-50%,90px)';
    }, 2300);
  };
})();

/* ============================================================
   3) FOOTER · Newsletter
============================================================ */
(function () {
  'use strict';

  var nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('nlEmail');
      var v = (input.value || '').trim();
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
        window.XandA.toast('¡Listo! Te avisamos en el próximo drop ✦');
        input.value = '';
      } else {
        window.XandA.toast('Escribe un correo válido, por favor', false);
      }
    });
  }
})();

/* ============================================================
   4) NAV / HEADER — comportamiento al hacer scroll
============================================================ */
(function () {
  'use strict';

  function onScroll() {
    /* Nav nuevo (index y páginas migradas) */
    var navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 12);
    }
    /* Header viejo de las herramientas */
    var header = document.querySelector('.header');
    if (header) {
      header.classList.toggle('header-fixed', window.scrollY > 10);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Barra de anuncio: cerrar */
  var annClose = document.getElementById('annClose');
  if (annClose) {
    annClose.addEventListener('click', function () {
      var ann = document.getElementById('announ');
      if (ann) ann.remove();
    });
  }

  /* Menú móvil */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
      });
    });
  }
})();

/* ============================================================
   5) COMMAND PALETTE (⌘K) — motor global
   · Se inyecta su markup si la página no lo tiene
   · Órdenes base: páginas (desde los links del nav) + acciones
   · Las páginas pueden añadir órdenes con:
       XandA.registerCmdkCommands([{g, t, ic, kw, run}])
============================================================ */
(function () {
  'use strict';

  /* API pública de registro (disponible de inmediato) */
  var extraCommands = [];
  window.XandA.registerCmdkCommands = function (arr) {
    if (Array.isArray(arr)) extraCommands = extraCommands.concat(arr);
  };

  var ICONS = {
    page: '<svg class="icon" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3 7 9 6 9-6"/></svg>',
    down: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  };

  function ensureMarkup() {
    var ov = document.getElementById('cmdk');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.className = 'cmdk';
    ov.id = 'cmdk';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Paleta de comandos');
    ov.innerHTML =
      '<div class="cmdk-box">' +
        '<div class="cmdk-head">' +
          '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
          '<input id="cmdkInput" placeholder="Busca herramientas o acciones…" autocomplete="off">' +
          '<kbd>esc</kbd>' +
        '</div>' +
        '<div class="cmdk-list" id="cmdkList"></div>' +
        '<div class="cmdk-foot">' +
          '<span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>' +
          '<span><kbd>↵</kbd> ejecutar</span>' +
          '<span><kbd>esc</kbd> cerrar</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function init() {
    var ov = ensureMarkup();
    var input = document.getElementById('cmdkInput');
    var list = document.getElementById('cmdkList');
    if (!ov || !input || !list) return;

    /* ---- Órdenes base ---- */

    /* Páginas: construidas desde los links reales del nav,
       así funcionan sin importar desde qué carpeta se navegue */
    var commands = [];
    document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return; // anclas internas: no
      var label = (a.textContent || '').trim();
      if (!label) return;
      commands.push({
        g: 'Páginas',
        t: 'Abrir: ' + label,
        ic: ICONS.page,
        kw: label.toLowerCase() + ' abrir ir pagina ' + href.toLowerCase(),
        run: function () { window.location.href = href; }
      });
    });

    /* Acciones globales */
    commands.push({
      g: 'Acciones', t: 'Copiar correo: hola@xanda.dev', ic: ICONS.mail,
      kw: 'email contacto correo copiar',
      run: function () {
        try { navigator.clipboard.writeText('hola@xanda.dev'); } catch (e) {}
        window.XandA.toast('Correo copiado ✦');
      }
    });
    commands.push({
      g: 'Acciones', t: 'Copiar comando: npx xanda create mi-sitio', ic: ICONS.down,
      kw: 'terminal comando crear proyecto',
      run: function () {
        try { navigator.clipboard.writeText('npx xanda create mi-sitio'); } catch (e) {}
        window.XandA.toast('Comando copiado ✦');
      }
    });

    /* ---- Órdenes registradas por la página (index.js, etc.) ---- */
    extraCommands.forEach(function (c) { commands.push(c); });

    /* ---- Motor ---- */
    var items = [], act = 0;

    function render() {
      var q = input.value.trim().toLowerCase();
      items = commands.filter(function (c) {
        return (c.t + ' ' + c.kw).toLowerCase().indexOf(q) !== -1;
      });
      act = 0;
      if (!items.length) {
        list.innerHTML = '<div class="cmdk-empty">Sin resultados para “' + q + '”…</div>';
        return;
      }
      var html = '', lastG = '';
      items.forEach(function (c, k) {
        if (c.g !== lastG) { html += '<div class="cmdk-group">' + c.g + '</div>'; lastG = c.g; }
        html += '<div class="cmdk-item' + (k === 0 ? ' sel' : '') + '" data-k="' + k + '">' +
                  '<span class="ci">' + (c.ic || ICONS.search) + '</span>' +
                  '<span>' + c.t + '</span>' +
                  '<span class="enter">↵</span>' +
                '</div>';
      });
      list.innerHTML = html;
      list.querySelectorAll('.cmdk-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () { setAct(+el.dataset.k); });
        el.addEventListener('click', function () { exec(+el.dataset.k); });
      });
    }

    function setAct(n) {
      act = n;
      list.querySelectorAll('.cmdk-item').forEach(function (el, k) {
        el.classList.toggle('sel', k === n);
      });
      var el = list.querySelectorAll('.cmdk-item')[n];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }

    function exec(n) {
      close();
      if (items[n] && items[n].run) items[n].run();
    }

    function open() {
      ov.classList.add('open');
      document.body.style.overflow = 'hidden';
      input.value = '';
      render();
      setTimeout(function () { input.focus(); }, 60);
    }

    function close() {
      ov.classList.remove('open');
      document.body.style.overflow = '';
    }

    /* Botones que abren la paleta (nav en todas las páginas,
       + botón del hero si existe) */
    var btnNav = document.getElementById('cmdkBtn');
    if (btnNav) btnNav.addEventListener('click', open);
    var btnHero = document.getElementById('cmdkBtn2');
    if (btnHero) btnHero.addEventListener('click', open);

    ov.addEventListener('click', function (e) {
      if (e.target === ov) close();
    });
    input.addEventListener('input', render);

    addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        ov.classList.contains('open') ? close() : open();
        return;
      }
      if (!ov.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setAct(Math.min(act + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(Math.max(act - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); exec(act); }
    });

    /* Hint según plataforma */
    var kbdHint = document.getElementById('kbdHint');
    if (kbdHint) {
      kbdHint.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---------- Typing de #code (solo si la página lo usa) ---------- */
(function () {
  'use strict';

  var codeElement = document.getElementById('code');
  if (!codeElement) return; // esta página no lo usa

  var codeLines = [
    '<span class="comment">// Inicializando XandA</span>\n',
    '<span class="keyword">import</span> { <span class="func">createProject</span> } <span class="keyword">from</span> <span class="string">"xanda"</span>\n\n',
    '<span class="keyword">const</span> app = <span class="func">createProject</span>({\n',
    '  <span class="property">name</span>: <span class="string">"MiWeb"</span>,\n',
    '  <span class="property">ui</span>: <span class="boolean">true</span>,\n',
    '  <span class="property">seo</span>: <span class="boolean">true</span>\n',
    '})\n\n',
    'app.<span class="func">deploy</span>()\n'
  ];

  var fullText = codeLines.join('');
  var index = 0;
  var isDeleting = false;

  function typeEffect() {
    codeElement.innerHTML = isDeleting
      ? fullText.substring(0, index--)
      : fullText.substring(0, index++);

    if (index === fullText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
    if (index <= 0) isDeleting = false;

    setTimeout(typeEffect, isDeleting ? 8 : 18);
  }
  typeEffect();
})();