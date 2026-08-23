// ═══════════════════════════════════════════════════════════════
// canvas.js — Viewport, zoom, secciones, drag & drop y gestión
// de elementos del canvas.
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';
import { saveHistory } from './history.js';
import { showToast } from './ui.js';
import { renderRightPanel } from './panel.js';
import { renderTree } from './layers.js';

// ── Viewport & Zoom ──────────────────────────────────────────

export function setViewport(vp) {
  State.setViewport(vp);
  ['desktop', 'tablet', 'mobile'].forEach(v =>
    document.getElementById('vp-' + v).classList.toggle('active', v === vp)
  );
  document.getElementById('canvasFrame').className = 'canvas-frame ' + vp;
}

export function changeZoom(delta) {
  const z = Math.max(25, Math.min(200, State.zoom + delta));
  State.setZoom(z);
  document.getElementById('zoomVal').textContent = z + '%';
  const frame = document.getElementById('canvasFrame');
  frame.style.transform       = `scale(${z / 100})`;
  frame.style.transformOrigin = 'top center';
}

// ── Secciones ────────────────────────────────────────────────

export function toggleSection(name) {
  State.sections[name] = !State.sections[name];
  document.getElementById('toggle-' + name).classList.toggle('active', State.sections[name]);
  document.getElementById('sec-' + name).classList.toggle('disabled-section', !State.sections[name]);
  showToast(name.charAt(0).toUpperCase() + name.slice(1) +
    (State.sections[name] ? ' activado' : ' desactivado'));
}

// ── Drag & Drop de elementos del panel ───────────────────────

export function elDragStart(e, type) {
  State.setDragType(type);
  e.dataTransfer.setData('text/plain', type);
  e.dataTransfer.effectAllowed = 'copy';
}

export function sectionDragOver(e, section) {
  e.preventDefault(); e.stopPropagation();
  State.setDropTarget(section);
  e.currentTarget.classList.add('drag-over');
}

export function sectionDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
  State.setDropTarget(null);
}

export function sectionDrop(e, section) {
  e.preventDefault(); e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');
  if (!State.dragType) return;
  const target = document.getElementById('xanda-' + section);
  if (!target) return;
  addElement(State.dragType, target);
  State.setDragType(null);
  renderTree();
  saveHistory();
}

export function canvasDragOver(e)  { e.preventDefault(); }
export function canvasDrop(e)      { e.preventDefault(); }
export function canvasDragLeave()  {}

// ── Selección de elementos ───────────────────────────────────

export function selectEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (State.selectedElId) {
    const prev = document.querySelector('[data-id="' + State.selectedElId + '"]');
    if (prev) prev.classList.remove('selected');
  }
  State.setSelectedElId(id);
  const el = document.querySelector('[data-id="' + id + '"]');
  if (el) el.classList.add('selected');
  renderRightPanel(id, el);
}

// Deseleccionar al hacer clic fuera
document.addEventListener('click', function (e) {
  if (!e.target.closest('.xanda-el') &&
      !e.target.closest('.panel-right') &&
      !e.target.closest('.add-popover')) {
    if (State.selectedElId) {
      const prev = document.querySelector('[data-id="' + State.selectedElId + '"]');
      if (prev) prev.classList.remove('selected');
      State.setSelectedElId(null);
      renderRightPanel(null, null);
    }
    document.getElementById('addPopover').classList.remove('show');
  }
});

// ── Edición inline (doble clic) ──────────────────────────────

export function startInlineEdit(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (e && e.preventDefault)  e.preventDefault();
  const el  = document.querySelector('[data-id="' + id + '"]');
  if (!el) return;
  const tag = el.tagName.toLowerCase();
  if (['input', 'img', 'hr', 'iframe', 'video'].includes(tag)) return;
  el.contentEditable = 'true';
  el.focus();
  const range = document.createRange();
  const sel   = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  el.addEventListener('blur', function finish() {
    el.contentEditable = 'false';
    saveHistory();
    el.removeEventListener('blur', finish);
  }, { once: true });
  el.addEventListener('keydown', function keyEsc(ev) {
    if (ev.key === 'Escape') {
      el.contentEditable = 'false';
      el.removeEventListener('keydown', keyEsc);
    }
  });
}

export function dblEditEl(e, id) { startInlineEdit(e, id); }

// ── Duplicar / Eliminar ──────────────────────────────────────

export function duplicateEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  const el = document.querySelector('[data-id="' + id + '"]');
  if (!el || !el.parentNode) return;
  const clone = el.cloneNode(true);
  const newId = 'el-' + State.incrementElCounter();
  clone.dataset.id = newId;
  clone.classList.remove('selected');
  clone.onclick = function (ev) { selectEl(ev, newId); };
  el.parentNode.insertBefore(clone, el.nextSibling);
  renderTree();
  saveHistory();
  showToast('Elemento duplicado');
}

export function deleteEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  const el = document.querySelector('[data-id="' + id + '"]');
  if (!el) return;
  el.remove();
  if (State.selectedElId === id) {
    State.setSelectedElId(null);
    renderRightPanel(null, null);
  }
  renderTree();
  saveHistory();
  showToast('Elemento eliminado');
}

export function addChildEl(e, parentId) {
  if (e && e.stopPropagation) e.stopPropagation();
  const parent = document.querySelector('[data-id="' + parentId + '"]');
  if (!parent) return;
  showAddPopover(e, parent);
}

// ── Popover "agregar elemento hijo" ─────────────────────────

const ADD_TYPES = [
  { type: 'div',    label: 'Contenedor (div)', icon: 'fa-regular fa-square' },
  { type: 'h1',     label: 'Título H1',        icon: 'fa-solid fa-heading' },
  { type: 'h2',     label: 'Título H2',        icon: 'fa-solid fa-h' },
  { type: 'h3',     label: 'Título H3',        icon: 'fa-solid fa-text-height' },
  { type: 'p',      label: 'Párrafo',          icon: 'fa-solid fa-paragraph' },
  { type: 'button', label: 'Botón',            icon: 'fa-solid fa-computer-mouse' },
  { type: 'a',      label: 'Enlace',           icon: 'fa-solid fa-link' },
  { type: 'img',    label: 'Imagen',           icon: 'fa-solid fa-image' },
  { type: 'input',  label: 'Input',            icon: 'fa-solid fa-input-text' },
  { type: 'span',   label: 'Span',             icon: 'fa-solid fa-font' },
];

function showAddPopover(e, parent) {
  const pop  = document.getElementById('addPopover');
  const list = document.getElementById('addPopoverList');
  list.innerHTML = '';
  ADD_TYPES.forEach(({ type, label, icon }) => {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>${label}`;
    btn.onclick = function () {
      addElement(type, parent);
      pop.classList.remove('show');
      renderTree();
      saveHistory();
    };
    list.appendChild(btn);
  });
  const rect  = e.target.getBoundingClientRect();
  const frame = document.getElementById('canvasWrap').getBoundingClientRect();
  pop.style.left = (rect.left - frame.left + 16) + 'px';
  pop.style.top  = (rect.top  - frame.top  + 24) + 'px';
  pop.classList.add('show');
}

// ── Añadir elemento al canvas ────────────────────────────────

// Tags que no pueden contener block-level children → toolbar como <span>
const INLINE_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'button', 'a', 'span', 'strong', 'em',
  'label', 'li', 'td', 'th', 'dt', 'dd',
]);

export function addElement(type, parent) {
  const id = 'el-' + State.incrementElCounter();
  const defaults = _elementDefaults(type, id);

  const el = document.createElement(type);
  el.className  = 'xanda-el';
  el.dataset.id = id;
  el.onclick    = function (ev) { selectEl(ev, id); };

  Object.assign(el.style, defaults.style || {});

  // Toolbar
  el.appendChild(_createToolbar(id, type));

  // Contenido inicial
  if (defaults.content !== undefined &&
      !['input', 'img', 'hr', 'iframe'].includes(type)) {
    el.appendChild(document.createTextNode(defaults.content));
  }

  // Configuración especial por tipo
  _configureElement(el, type, id);

  parent.appendChild(el);
  selectEl({ stopPropagation: () => {} }, id);
  showToast('<' + type + '> agregado');
}

function _configureElement(el, type, id) {
  if (type === 'img') {
    el.src          = 'https://via.placeholder.com/400x250/6B5CE7/FFFFFF?text=Imagen';
    el.alt          = 'imagen';
    el.style.maxWidth = '100%';
    el.style.display  = 'block';
  }
  if (type === 'input') {
    el.placeholder        = 'Escribe aquí...';
    el.style.width        = '100%';
    el.style.padding      = '10px 14px';
    el.style.border       = '1.5px solid #E2DEFF';
    el.style.borderRadius = '8px';
    el.style.fontFamily   = 'inherit';
    el.style.fontSize     = '14px';
    el.onclick = function (ev) { ev.stopPropagation(); selectEl(ev, id); };
  }
  if (type === 'hr') {
    el.style.border    = 'none';
    el.style.borderTop = '1.5px solid #E2DEFF';
    el.style.margin    = '20px 0';
  }
  if (type === 'ul') {
    ['Elemento 1', 'Elemento 2'].forEach(txt => {
      const li = document.createElement('li');
      li.textContent = txt;
      el.appendChild(li);
    });
    el.style.paddingLeft = '20px';
  }
  if (type === 'iframe') {
    el.src                = 'https://www.google.com/maps/embed';
    el.style.width        = '100%';
    el.style.height       = '200px';
    el.style.border       = 'none';
    el.style.borderRadius = '8px';
  }
  if (['h1','h2','h3','p','span','strong','a'].includes(type)) {
    el.ondblclick = function (ev) { startInlineEdit(ev, id); };
  }
  if (type === 'button') {
    el.type = 'button';
    el.addEventListener('click', function (ev) {
      if (!ev.shiftKey) selectEl(ev, id);
    });
  }
}

function _createToolbar(id, type) {
  const tb  = document.createElement(INLINE_TAGS.has(type) ? 'span' : 'div');
  tb.className = 'el-toolbar';

  const lbl = document.createElement('span');
  lbl.className   = 'el-tool-label';
  lbl.textContent = type;
  tb.appendChild(lbl);

  // Botón editar (solo elementos de texto)
  if (!['img', 'hr', 'iframe', 'input', 'video'].includes(type)) {
    tb.appendChild(_toolBtn('fa-pen-to-square', 'Editar texto', ev => startInlineEdit(ev, id)));
  }
  // Botón duplicar
  tb.appendChild(_toolBtn('fa-copy', 'Duplicar', ev => duplicateEl(ev, id)));
  // Botón eliminar
  const del = _toolBtn('fa-trash', 'Eliminar', ev => deleteEl(ev, id));
  del.classList.add('danger');
  tb.appendChild(del);

  return tb;
}

function _toolBtn(icon, title, handler) {
  const btn  = document.createElement('button');
  btn.className = 'el-tool-btn';
  btn.title     = title;
  btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  btn.onclick   = handler;
  return btn;
}

function _elementDefaults(type) {
  const map = {
    div:      { content: '', style: { padding: '20px', border: '1px dashed #C9C3F5', borderRadius: '8px', minHeight: '60px' } },
    section:  { content: '', style: { padding: '40px 32px', background: '#F8F7FF', minHeight: '80px' } },
    article:  { content: '', style: { padding: '24px', background: '#fff', border: '1px solid #E2DEFF', borderRadius: '10px' } },
    nav:      { content: '', style: { display: 'flex', gap: '20px', padding: '12px 0' } },
    aside:    { content: '', style: { width: '240px', padding: '20px', background: '#F4F2FF', borderRadius: '8px' } },
    ul:       { content: '', style: { marginBottom: '16px' } },
    h1:       { content: 'Título Principal',  style: { fontSize: 'clamp(28px,4vw,48px)', fontWeight: '800', marginBottom: '16px', color: '#1A1633' } },
    h2:       { content: 'Subtítulo',         style: { fontSize: 'clamp(22px,3vw,36px)', fontWeight: '700', marginBottom: '12px', color: '#1A1633' } },
    h3:       { content: 'Encabezado 3',      style: { fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: '700', marginBottom: '10px', color: '#1A1633' } },
    p:        { content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', style: { fontSize: 'clamp(14px,1.5vw,16px)', lineHeight: '1.7', color: '#5B5379', marginBottom: '16px' } },
    span:     { content: 'Texto en línea',    style: { fontSize: '14px', color: '#5B5379' } },
    strong:   { content: 'Texto importante',  style: { fontWeight: '700', color: '#1A1633' } },
    a:        { content: 'Enlace aquí',       style: { color: '#6B5CE7', fontWeight: '600', textDecoration: 'none', fontSize: '14px' } },
    button:   { content: 'Botón',            style: { background: '#6B5CE7', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '50px', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer' } },
    input:    { style: {} },
    textarea: { content: '', style: { width: '100%', padding: '12px 14px', border: '1.5px solid #E2DEFF', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', minHeight: '80px', resize: 'vertical' } },
    img:      { style: {} },
    video:    { content: '', style: { width: '100%', background: '#1A1633', borderRadius: '8px', minHeight: '160px', display: 'block' } },
    hr:       { style: {} },
    iframe:   { style: {} },
  };
  return map[type] || { content: '', style: {} };
}

// ── Reattach eventos tras undo/redo o cambio de página ───────

export function reattachCanvasEvents() {
  const frame = document.getElementById('canvasFrame');
  frame.querySelectorAll('.xanda-el').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    el.onclick = function (ev) { selectEl(ev, id); };
    if (['H1','H2','H3','P','SPAN','STRONG','A'].includes(el.tagName)) {
      el.ondblclick = function (ev) { startInlineEdit(ev, id); };
    }
  });
  ['header', 'main', 'footer'].forEach(sec => {
    const wrap = document.getElementById('sec-' + sec);
    if (!wrap) return;
    wrap.ondragover  = function (e) { sectionDragOver(e, sec); };
    wrap.ondrop      = function (e) { sectionDrop(e, sec); };
    wrap.ondragleave = function (e) { sectionDragLeave(e); };
  });
}

// ── Navegación ───────────────────────────────────────────────

export function goToLanding() {
  if (confirm('¿Volver al inicio? Perderás los cambios no guardados.')) {
    window.location.href = 'constructor.html';
  }
}
