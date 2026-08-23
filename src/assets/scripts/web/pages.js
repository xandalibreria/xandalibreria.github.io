// ═══════════════════════════════════════════════════════════════
// pages.js — Gestión de páginas: crear, cambiar, renombrar,
// eliminar y renderizar la barra de pestañas.
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';
import { showToast } from './ui.js';
import { saveHistory } from './history.js';
import { reattachCanvasEvents } from './canvas.js';
import { renderRightPanel } from './panel.js';
import { renderTree } from './layers.js';

// ── Init ─────────────────────────────────────────────────────

export function initPages() {
  // Guardar HTML inicial en la primera página
  State.pages[0].content = document.getElementById('canvasFrame').innerHTML;
  renderPageBar();
}

// ── Barra de pestañas ────────────────────────────────────────

export function renderPageBar() {
  const bar = document.getElementById('pageBar');
  if (!bar) return;
  bar.innerHTML = '';

  State.pages.forEach(page => {
    const btn       = document.createElement('button');
    btn.className   = 'page-tab' + (page.id === State.currentPageId ? ' active' : '');
    btn.dataset.pageId = page.id;
    btn.innerHTML = `
      <i class="fa-solid fa-file-code"></i>
      <span class="page-tab-name" ondblclick="startRenamePageInline(event,'${page.id}')">${page.name}.html</span>
      <span class="page-tab-actions">
        <button class="page-tab-btn" onclick="renamePage(event,'${page.id}')" title="Renombrar">
          <i class="fa-solid fa-pen"></i>
        </button>
        ${State.pages.length > 1
          ? `<button class="page-tab-btn danger" onclick="deletePage(event,'${page.id}')" title="Eliminar">
               <i class="fa-solid fa-trash"></i>
             </button>`
          : ''}
      </span>`;
    btn.addEventListener('click', function (e) {
      if (e.target.closest('.page-tab-btn') || e.target.closest('.page-tab-name')) return;
      switchPage(page.id);
    });
    bar.appendChild(btn);
  });

  // Botón nueva página
  const addBtn     = document.createElement('button');
  addBtn.className = 'page-add-btn';
  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i><span>Nueva página</span>';
  addBtn.onclick   = addPage;
  bar.appendChild(addBtn);
}

// ── Cambiar de página ────────────────────────────────────────

export function switchPage(pageId) {
  if (pageId === State.currentPageId) return;
  _saveCurrentCanvas();
  State.setCurrentPageId(pageId);
  const target = State.pages.find(p => p.id === pageId);
  if (target?.content) {
    document.getElementById('canvasFrame').innerHTML = target.content;
    reattachCanvasEvents();
  }
  State.setSelectedElId(null);
  renderRightPanel(null, null);
  renderTree();
  saveHistory();
  renderPageBar();
  showToast('Página: ' + target.name + '.html');
}

// ── Añadir página ────────────────────────────────────────────

export function addPage() {
  _saveCurrentCanvas();
  const newId   = 'page-' + State.incrementPageCounter();
  const newName = 'pagina-' + State.pageCounter;
  State.pages.push({ id: newId, name: newName, content: _emptyCanvas() });
  State.setCurrentPageId(newId);
  document.getElementById('canvasFrame').innerHTML = State.pages.at(-1).content;
  reattachCanvasEvents();
  State.setSelectedElId(null);
  renderRightPanel(null, null);
  renderTree();
  saveHistory();
  renderPageBar();
  showToast('Nueva página: ' + newName + '.html', 'success');
}

// ── Eliminar página ──────────────────────────────────────────

export function deletePage(e, pageId) {
  e.stopPropagation();
  if (State.pages.length <= 1) {
    showToast('No puedes eliminar la única página', 'error');
    return;
  }
  if (!confirm('¿Eliminar esta página? Esta acción no se puede deshacer.')) return;

  const idx = State.pages.findIndex(p => p.id === pageId);
  State.pages.splice(idx, 1);

  if (State.currentPageId === pageId) {
    const newCur = State.pages[Math.max(0, idx - 1)];
    State.setCurrentPageId(newCur.id);
    document.getElementById('canvasFrame').innerHTML = newCur.content;
    reattachCanvasEvents();
    State.setSelectedElId(null);
    renderRightPanel(null, null);
    renderTree();
    saveHistory();
  }
  renderPageBar();
  showToast('Página eliminada');
}

// ── Renombrar página ─────────────────────────────────────────

export function renamePage(e, pageId) {
  e.stopPropagation();
  const page = State.pages.find(p => p.id === pageId);
  if (page) showRenameModal(page);
}

export function startRenamePageInline(e, pageId) {
  e.stopPropagation();
  const page = State.pages.find(p => p.id === pageId);
  if (page) showRenameModal(page);
}

function showRenameModal(page) {
  const overlay = document.getElementById('renameModal');
  const input   = document.getElementById('renameInput');
  input.value   = page.name;
  overlay.classList.add('show');
  input.focus();
  input.select();
  document.getElementById('renameConfirmBtn').onclick = function () {
    const newName = input.value.trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    if (!newName) return;
    page.name = newName;
    overlay.classList.remove('show');
    renderPageBar();
    showToast('Renombrada: ' + newName + '.html', 'success');
  };
}

export function closeRenameModal() {
  document.getElementById('renameModal').classList.remove('show');
}

// ── Helpers privados ─────────────────────────────────────────

function _saveCurrentCanvas() {
  const cur = State.pages.find(p => p.id === State.currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;
}

function _emptyCanvas() {
  return `
  <div class="xanda-section-wrap" id="sec-header" data-section="header">
    <span class="section-label">header</span>
    <header id="xanda-header" style="background:#6B5CE7;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;min-height:64px">
      <div class="empty-drop"><i class="fa-solid fa-arrow-down"></i> Arrastra elementos aquí</div>
    </header>
  </div>
  <div class="xanda-section-wrap" id="sec-main" data-section="main">
    <span class="section-label">main</span>
    <main id="xanda-main" style="min-height:400px;padding:60px 48px">
      <div class="empty-drop"><i class="fa-solid fa-arrow-down"></i> Arrastra elementos aquí</div>
    </main>
  </div>
  <div class="xanda-section-wrap" id="sec-footer" data-section="footer">
    <span class="section-label">footer</span>
    <footer id="xanda-footer" style="background:#1A1633;padding:32px 48px;color:rgba(255,255,255,0.6);min-height:80px;display:flex;align-items:center;justify-content:space-between">
      <div class="empty-drop"><i class="fa-solid fa-arrow-down"></i> Arrastra elementos aquí</div>
    </footer>
  </div>`;
}
