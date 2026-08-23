// ═══════════════════════════════════════════════════════════════
// layers.js — Árbol de capas (panel Capas)
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';

// Se inyecta desde main para evitar dependencia circular
let _selectEl = () => {};
export function initLayers(selectEl) { _selectEl = selectEl; }

// ── Render principal ─────────────────────────────────────────

export function renderTree() {
  const tree = document.getElementById('treeList');
  if (!tree) return;
  tree.innerHTML = '';
  ['header', 'main', 'footer'].forEach(sec => {
    const container = document.getElementById('xanda-' + sec);
    if (!container) return;
    const secItem = _createTreeItem('fa-solid fa-cube', sec.toUpperCase(), null, false);
    secItem.style.fontWeight = '700';
    secItem.style.color = 'var(--xanda-purple)';
    tree.appendChild(secItem);
    const children = document.createElement('div');
    children.className = 'tree-children';
    _renderChildren(container, children);
    tree.appendChild(children);
  });
}

function _renderChildren(parent, container) {
  parent.querySelectorAll(':scope > .xanda-el').forEach(el => {
    const tag  = el.tagName.toLowerCase();
    const id   = el.dataset.id;
    const item = _createTreeItem(_tagIcon(tag), `<${tag}> ${id || ''}`, id, true);
    container.appendChild(item);
    const nested = el.querySelectorAll(':scope > .xanda-el');
    if (nested.length > 0) {
      const ch = document.createElement('div');
      ch.className = 'tree-children';
      _renderChildren(el, ch);
      container.appendChild(ch);
    }
  });
}

function _createTreeItem(icon, label, id, selectable) {
  const item = document.createElement('div');
  item.className = 'tree-item' + (id && id === State.selectedElId ? ' selected' : '');
  item.innerHTML = `<i class="${icon}"></i><span class="tree-label">${label}</span>`;
  if (selectable && id) {
    item.onclick = function () {
      const el = document.querySelector('[data-id="' + id + '"]');
      if (el) {
        _selectEl({ stopPropagation: () => {} }, id);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
  }
  return item;
}

function _tagIcon(tag) {
  const icons = {
    div:      'fa-regular fa-square',
    section:  'fa-solid fa-table-cells-large',
    article:  'fa-solid fa-file-lines',
    nav:      'fa-solid fa-bars',
    aside:    'fa-solid fa-sidebar',
    ul:       'fa-solid fa-list',
    h1:       'fa-solid fa-heading',
    h2:       'fa-solid fa-h',
    h3:       'fa-solid fa-text-height',
    p:        'fa-solid fa-paragraph',
    span:     'fa-solid fa-font',
    strong:   'fa-solid fa-bold',
    a:        'fa-solid fa-link',
    button:   'fa-solid fa-computer-mouse',
    input:    'fa-solid fa-input-text',
    textarea: 'fa-solid fa-text-slash',
    img:      'fa-solid fa-image',
    video:    'fa-solid fa-film',
    hr:       'fa-solid fa-grip-lines',
    iframe:   'fa-solid fa-window-restore',
  };
  return icons[tag] || 'fa-solid fa-circle-dot';
}
