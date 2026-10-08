/* ============================================================
   libreria.js — lógica de la página "Librería de recursos"
   Depende de: libreria-iconos.js (base de datos) y main.js
   (toast global, command palette, reveal…).
   ------------------------------------------------------------
   · Explorador: búsqueda sin acentos, categorías, tamaños.
   · Ficha lateral con código copiable y enlace directo #i=nombre.
   · Pieza de muestra del hero que rota íconos.
   · Registra sus órdenes en la command palette (⌘K).
   ============================================================ */

(function () {
  'use strict';

  var DATA = window.XANDA_ICONOS;
  if (!DATA || !DATA.iconos || !DATA.iconos.length) return;

  /* Cambia a true cuando publiques la hoja de estilos del CDN:
     los íconos se renderizarán como <i class="xa-nombre"></i>. */
  var MODO_FUENTE = false;

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CLAVE_TAM = 'xanda-lib-tam';
  var CORREO = 'hola@xanda.dev';

  /* ---------- referencias ---------- */
  function $(id) { return document.getElementById(id); }

  var malla        = $('malla');
  var chipsEl      = $('chips');
  var inputBusqueda= $('buscadorInput');
  var infoEl       = $('infoResultado');
  var sinRes       = $('sinResultados');
  var btnLimpiar   = $('btnLimpiar');
  var segmentosEl  = $('segmentos');

  var cajon        = $('cajon');
  var cajonFondo   = $('cajonFondo');
  var cajonPreview = $('cajonPreview');
  var cajonTam     = $('cajonTam');
  var cajonTamVal  = $('cajonTamVal');
  var cajonTamanos = $('cajonTamanos');
  var cajonNombre  = $('cajonNombre');
  var cajonCategoria = $('cajonCategoria');
  var cajonContador  = $('cajonContador');
  var cajonCodigo    = $('cajonCodigo');
  var cajonCopiar    = $('cajonCopiar');
  var cajonPrev    = $('cajonPrev');
  var cajonNext    = $('cajonNext');
  var cajonCerrar  = $('cajonCerrar');

  var espIcono  = $('espIcono');
  var espNombre = $('espNombre');
  var espCodigo = $('espCodigo');
  var espNum    = $('espNum');

  if (!malla) return; // esta página es la única que usa la malla

  /* ---------- utilidades ---------- */
  function normalizar(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad2(n) { return ('0' + n).slice(-2); }

  function textoClase(ic) {
    return '<i class="' + DATA.prefijo + ic.n + '"></i>';
  }

  /* Trazo SVG (o etiqueta <i> cuando exista la fuente del CDN) */
  function svgStr(ic) {
    if (MODO_FUENTE) return '<i class="' + DATA.prefijo + ic.n + '"></i>';
    var ps = ic.d.map(function (d) { return '<path d="' + d + '"/>'; }).join('');
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ps + '</svg>';
  }

  function nombreCat(id) {
    for (var i = 0; i < DATA.categorias.length; i++) {
      if (DATA.categorias[i].id === id) return DATA.categorias[i].nombre;
    }
    return id;
  }

  function buscarPorNombre(n) {
    for (var i = 0; i < DATA.iconos.length; i++) {
      if (DATA.iconos[i].n === n) return i;
    }
    return -1;
  }

  /* ---------- copiar al portapapeles (con respaldo) ---------- */
  function copiar(texto, mensaje) {
    function listo() { window.XandA.toast(mensaje || 'Copiado ✦'); }

    function respaldo() {
      var ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); listo(); }
      catch (e) { window.XandA.toast('No se pudo copiar', false); }
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(listo, respaldo);
    } else {
      respaldo();
    }
  }

  /* ---------- estado ---------- */
  var catActiva = 'todas';
  var consulta = '';
  var listaActual = [];
  var indiceCajon = -1;
  var tileEnfoque = null;
  var tamCajon = 64;

  var tamGuardado = 28;
  try { tamGuardado = parseInt(localStorage.getItem(CLAVE_TAM), 10) || 28; } catch (e) {}

  /* ---------- chips de categoría ---------- */
  function construirChips() {
    if (!chipsEl) return;
    var html = DATA.categorias.map(function (cat) {
      var total = cat.id === 'todas'
        ? DATA.iconos.length
        : DATA.iconos.filter(function (ic) { return ic.c === cat.id; }).length;
      return '<button type="button" class="chip" data-cat="' + cat.id + '" aria-pressed="false">' +
             escapar(cat.nombre) + ' <span class="n">' + total + '</span></button>';
    }).join('');
    chipsEl.innerHTML = html;

    chipsEl.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      catActiva = chip.dataset.cat;
      sincronizarChips();
      renderMalla();
    });
  }

  function sincronizarChips() {
    if (!chipsEl) return;
    chipsEl.querySelectorAll('.chip').forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.dataset.cat === catActiva ? 'true' : 'false');
    });
  }

  /* ---------- render de la malla ---------- */
  function filtrar() {
    var q = normalizar(consulta);
    listaActual = DATA.iconos.filter(function (ic) {
      var okCat = catActiva === 'todas' || ic.c === catActiva;
      if (!okCat) return false;
      if (!q) return true;
      return normalizar(ic.t).indexOf(q) !== -1 ||
             ic.n.indexOf(q) !== -1 ||
             normalizar(nombreCat(ic.c)).indexOf(q) !== -1;
    });
  }

  function actualizarInfo() {
    if (!infoEl) return;
    var partes = [listaActual.length + (listaActual.length === 1 ? ' ícono' : ' íconos')];
    if (catActiva !== 'todas') partes.push(nombreCat(catActiva));
    if (consulta) partes.push('“' + consulta + '”');
    infoEl.textContent = partes.join('  ·  ');
  }

  function renderMalla() {
    filtrar();
    actualizarInfo();

    var esperando = malla.classList.contains('en-espera');

    if (!listaActual.length) {
      malla.innerHTML = '';
      if (sinRes) {
        sinRes.hidden = false;
        var vacio = sinRes.querySelector('h3 + p');
        if (vacio && consulta) vacio.textContent = 'Sin resultados para “' + consulta + '”. Prueba con otra palabra.';
      }
      return;
    }
    if (sinRes) sinRes.hidden = true;

    malla.innerHTML = listaActual.map(function (ic, i) {
      return '<button type="button" class="icono-tile" data-i="' + i + '" ' +
             'aria-label="Ícono ' + escapar(ic.t) + ', abrir ficha" ' +
             'style="animation-delay:' + Math.min(i * 12, 240) + 'ms">' +
               svgStr(ic) +
               '<span class="icono-nombre">' + escapar(ic.n) + '</span>' +
               '<span class="tile-copiar" title="Copiar clase" aria-hidden="true">' +
                 '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' +
               '</span>' +
             '</button>';
    }).join('');

    /* la primera tanda espera a entrar en pantalla */
    if (esperando && 'IntersectionObserver' in window) return;
    malla.classList.remove('en-espera');
    malla.classList.add('animar');
  }

  /* eventos de la malla: copia rápida y ficha */
  malla.addEventListener('click', function (e) {
    var rapido = e.target.closest('.tile-copiar');
    if (rapido) {
      e.preventDefault();
      e.stopPropagation();
      var tile = rapido.closest('.icono-tile');
      var ic = listaActual[+tile.dataset.i];
      if (ic) copiar(textoClase(ic), 'Clase copiada: ' + DATA.prefijo + ic.n + ' ✦');
      return;
    }
    var t = e.target.closest('.icono-tile');
    if (t) abrirCajon(+t.dataset.i, t);
  });

  /* ---------- control de tamaño de la malla ---------- */
  function aplicarTamMalla(tam) {
    malla.style.setProperty('--tam', tam + 'px');
    if (segmentosEl) {
      segmentosEl.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', +b.dataset.tam === tam ? 'true' : 'false');
      });
    }
    try { localStorage.setItem(CLAVE_TAM, String(tam)); } catch (e) {}
  }

  if (segmentosEl) {
    segmentosEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-tam]');
      if (b) aplicarTamMalla(+b.dataset.tam);
    });
  }
  aplicarTamMalla(tamGuardado);

  /* ---------- buscador ---------- */
  var temporizador = null;
  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        consulta = inputBusqueda.value.trim();
        renderMalla();
      }, 70);
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', function () {
      if (inputBusqueda) inputBusqueda.value = '';
      consulta = '';
      catActiva = 'todas';
      sincronizarChips();
      renderMalla();
      if (inputBusqueda) inputBusqueda.focus();
    });
  }

  /* atajo "/" para buscar */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/') return;
    var t = e.target;
    var ocupado = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (ocupado) return;
    e.preventDefault();
    if (inputBusqueda) inputBusqueda.focus();
  });

  /* ---------- ficha lateral (cajón) ---------- */
  function pintarCajon() {
    var ic = listaActual[indiceCajon];
    if (!ic) return;

    cajonPreview.innerHTML = svgStr(ic);
    var nodo = cajonPreview.querySelector('svg, i');
    if (nodo && !MODO_FUENTE) {
      nodo.style.width = tamCajon + 'px';
      nodo.style.height = tamCajon + 'px';
    } else if (nodo) {
      nodo.style.fontSize = tamCajon + 'px';
    }

    cajonNombre.textContent = ic.t;
    cajonCategoria.textContent = nombreCat(ic.c);
    cajonContador.textContent = pad2(indiceCajon + 1) + ' / ' + listaActual.length;
    cajonCodigo.textContent = textoClase(ic);

    /* muestras fijas */
    var tamanios = [16, 24, 32, 40];
    cajonTamanos.innerHTML = tamanios.map(function (t) {
      return '<button type="button" class="tam-caja" data-tam="' + t + '" aria-label="Vista previa a ' + t + ' píxeles">' +
             svgStr(ic) + '<span>' + t + '</span></button>';
    }).join('');
    cajonTamanos.querySelectorAll('svg').forEach(function (s, k) {
      s.style.width = tamanios[k] + 'px';
      s.style.height = tamanios[k] + 'px';
    });

    try { history.replaceState(null, '', '#i=' + ic.n); } catch (e) {}
  }

  function abrirCajon(indice, tileOrigen) {
    indiceCajon = indice;
    tileEnfoque = tileOrigen || null;
    pintarCajon();
    cajon.classList.add('abierto');
    if (cajonFondo) cajonFondo.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (cajonCerrar) cajonCerrar.focus(); }, 90);
  }

  function cerrarCajon() {
    cajon.classList.remove('abierto');
    if (cajonFondo) cajonFondo.classList.remove('abierto');
    document.body.style.overflow = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (tileEnfoque && tileEnfoque.focus) tileEnfoque.focus();
    tileEnfoque = null;
  }

  function moverCajon(paso) {
    if (!listaActual.length) return;
    indiceCajon = (indiceCajon + paso + listaActual.length) % listaActual.length;
    pintarCajon();
  }

  /* abre una ficha por nombre aunque los filtros actuales no la muestren */
  function abrirFichaPorNombre(n) {
    var global = buscarPorNombre(n);
    if (global === -1) return;
    catActiva = 'todas';
    consulta = '';
    if (inputBusqueda) inputBusqueda.value = '';
    sincronizarChips();
    renderMalla();
    for (var i = 0; i < listaActual.length; i++) {
      if (listaActual[i].n === n) { abrirCajon(i, null); return; }
    }
  }

  if (cajonFondo) cajonFondo.addEventListener('click', cerrarCajon);
  if (cajonCerrar) cajonCerrar.addEventListener('click', cerrarCajon);
  if (cajonPrev) cajonPrev.addEventListener('click', function () { moverCajon(-1); });
  if (cajonNext) cajonNext.addEventListener('click', function () { moverCajon(1); });

  if (cajonCopiar) {
    cajonCopiar.addEventListener('click', function () {
      var ic = listaActual[indiceCajon];
      if (ic) copiar(textoClase(ic), 'Clase copiada: ' + DATA.prefijo + ic.n + ' ✦');
    });
  }

  if (cajonTam) {
    cajonTam.addEventListener('input', function () {
      tamCajon = +cajonTam.value;
      if (cajonTamVal) cajonTamVal.textContent = cajonTam.value;
      var nodo = cajonPreview ? cajonPreview.querySelector('svg, i') : null;
      if (nodo) {
        if (MODO_FUENTE) { nodo.style.fontSize = tamCajon + 'px'; }
        else { nodo.style.width = tamCajon + 'px'; nodo.style.height = tamCajon + 'px'; }
      }
    });
  }

  if (cajonTamanos) {
    cajonTamanos.addEventListener('click', function (e) {
      var caja = e.target.closest('.tam-caja');
      if (!caja) return;
      tamCajon = +caja.dataset.tam;
      if (cajonTam) cajonTam.value = tamCajon;
      if (cajonTamVal) cajonTamVal.textContent = tamCajon;
      pintarCajon();
    });
  }

  /* teclas dentro de la ficha */
  document.addEventListener('keydown', function (e) {
    var abierto = cajon.classList.contains('abierto');
    if (!abierto) return;
    var enInput = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
    if (e.key === 'Escape') { cerrarCajon(); return; }
    if (enInput) return;
    if (e.key === 'ArrowLeft') moverCajon(-1);
    if (e.key === 'ArrowRight') moverCajon(1);
  });

  /* botones que copian el contenido de su ventana de código */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.ventana-copiar');
    if (!btn) return;
    var ventana = btn.closest('.ventana');
    var codigo = ventana ? ventana.querySelector('code') : null;
    if (codigo && codigo.textContent) copiar(codigo.textContent, 'Código copiado ✦');
  });

  /* ---------- pieza de muestra del hero ---------- */
  var CICLO = ['capas', 'rayo', 'corazon', 'pluma', 'hoja', 'luna', 'estrella', 'paleta', 'campana', 'musica']
    .map(function (n) { var i = buscarPorNombre(n); return i === -1 ? null : DATA.iconos[i]; })
    .filter(Boolean);

  var posCiclo = 0;
  var temporizadorCiclo = null;

  function pintarEspecimen() {
    if (!CICLO.length || !espIcono) return;
    var ic = CICLO[posCiclo];
    espIcono.innerHTML = svgStr(ic);
    if (espNombre) espNombre.textContent = ic.t;
    if (espCodigo) {
      espCodigo.innerHTML = '&lt;i class="<b>' + DATA.prefijo + escapar(ic.n) + '</b>"&gt;&lt;/i&gt;';
    }
    if (espNum) espNum.textContent = pad2(posCiclo + 1) + ' / ' + pad2(CICLO.length);
  }

  function girarEspecimen() {
    if (!espIcono || document.hidden) return;
    espIcono.classList.add('girando');
    setTimeout(function () {
      posCiclo = (posCiclo + 1) % CICLO.length;
      pintarEspecimen();
    }, 260);
    setTimeout(function () { espIcono.classList.remove('girando'); }, 580);
  }

  function arrancarCiclo() {
    detenerCiclo();
    temporizadorCiclo = setInterval(girarEspecimen, 2800);
  }
  function detenerCiclo() {
    if (temporizadorCiclo) clearInterval(temporizadorCiclo);
    temporizadorCiclo = null;
  }

  if (espIcono) {
    pintarEspecimen();
    arrancarCiclo();

    /* pausa al pasar el cursor; clic para copiar */
    espIcono.addEventListener('mouseenter', detenerCiclo);
    espIcono.addEventListener('mouseleave', arrancarCiclo);
    espIcono.addEventListener('click', function () {
      var ic = CICLO[posCiclo];
      if (ic) copiar(textoClase(ic), 'Clase copiada: ' + DATA.prefijo + ic.n + ' ✦');
    });
    if (espCodigo) {
      espCodigo.addEventListener('click', function () {
        var ic = CICLO[posCiclo];
        if (ic) copiar(textoClase(ic), 'Clase copiada: ' + DATA.prefijo + ic.n + ' ✦');
      });
    }
  }

  /* ---------- íconos decorativos por nombre (flotantes, hoja de ruta) ---------- */
  document.querySelectorAll('[data-icono]').forEach(function (el) {
    var i = buscarPorNombre(el.dataset.icono);
    if (i !== -1) el.innerHTML = svgStr(DATA.iconos[i]);
  });

  /* ---------- conteos animados del hero ---------- */
  function animarConteo(el, valor) {
    if (!valor) { el.textContent = valor; return; }
    var inicio = null, duracion = 900;
    function paso(ts) {
      if (!inicio) inicio = ts;
      var p = Math.min((ts - inicio) / duracion, 1);
      p = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(valor * p);
      if (p < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  setTimeout(function () {
    document.querySelectorAll('[data-conteo]').forEach(function (el) {
      animarConteo(el, el.dataset.conteo === 'iconos' ? DATA.iconos.length : DATA.categorias.length - 1);
    });
  }, 350);

  /* ---------- sugerir un ícono ---------- */
  function sugerirIcono() {
    copiar(CORREO, 'Correo copiado: ' + CORREO + ' ✦');
  }
  var btnSugerir = $('btnSugerir');
  if (btnSugerir) btnSugerir.addEventListener('click', sugerirIcono);

  /* ---------- revelado al hacer scroll ---------- */
  var revelables = document.querySelectorAll('[data-reveal]');
  if (revelables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            io.unobserve(en.target);
          }
        });
      }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
      revelables.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    } else {
      revelables.forEach(function (el) { el.classList.add('reveal', 'visible'); });
    }
  }

  /* la malla arranca su animación al entrar en pantalla */
  if ('IntersectionObserver' in window) {
    var ioMalla = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          malla.classList.remove('en-espera');
          malla.classList.add('animar');
          ioMalla.disconnect();
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    ioMalla.observe(malla);
  } else {
    malla.classList.remove('en-espera');
    malla.classList.add('animar');
  }

  /* ---------- command palette (⌘K): órdenes de la librería ---------- */
  function irA(selector) {
    return function () {
      var destino = document.querySelector(selector);
      if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  var icLupa   = '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var icLibro  = '<svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>';
  var icReloj  = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var icCorreo = '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';

  if (window.XandA && window.XandA.registerCmdkCommands) {
    window.XandA.registerCmdkCommands([
      { g: 'Librería', t: 'Ir al explorador de íconos', ic: icLupa, kw: 'iconos explorador buscar malla', run: irA('#explorador') },
      { g: 'Librería', t: 'Ir a la guía de uso', ic: icLibro, kw: 'guia uso pasos codigo', run: irA('#guia') },
      { g: 'Librería', t: 'Ver la hoja de ruta', ic: icReloj, kw: 'camino fases proximamente plantillas', run: irA('#camino') },
      { g: 'Librería', t: 'Ver ficha de ejemplo: computadora', ic: icLupa, kw: 'ficha ejemplo demo computadora', run: function () { abrirFichaPorNombre('computadora'); } },
      { g: 'Librería', t: 'Sugerir un ícono', ic: icCorreo, kw: 'sugerir pedir contacto correo', run: sugerirIcono }
    ]);
  }

  /* ---------- enlace directo #i=nombre ---------- */
  var coincidencia = location.hash.match(/^#i=([a-z0-9-]+)$/);
  if (coincidencia) abrirFichaPorNombre(coincidencia[1]);

  /* ---------- arranque ---------- */
  construirChips();
  sincronizarChips();
  renderMalla();
})();