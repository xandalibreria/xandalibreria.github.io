// ═══════════════════════════════════════════════════════════════
// web.js — Entry point del constructor XandA
//
// Para añadir una nueva funcionalidad:
//   → Crea un módulo en /modules/
//   → Impórtalo aquí
//   → Expón al window las funciones que el HTML necesite
// ═══════════════════════════════════════════════════════════════

import * as State        from 'web/state.js';
import { showToast }     from 'web/ui.js';
import { initHistory, saveHistory, undo, redo } from 'web/history.js';
import { renderTree, initLayers }               from 'web/layers.js';
import { renderRightPanel, switchRTab, switchPanelTab } from 'web/panel.js';
import {
  setViewport, changeZoom, toggleSection,
  elDragStart, sectionDragOver, sectionDragLeave, sectionDrop,
  canvasDragOver, canvasDrop, canvasDragLeave,
  selectEl, startInlineEdit, dblEditEl,
  duplicateEl, deleteEl, addChildEl,
  reattachCanvasEvents, goToLanding,
} from 'web/canvas.js';
import {
  initPages, switchPage, addPage,
  deletePage, renamePage, startRenamePageInline, closeRenameModal,
} from 'web/pages.js';
import {
  showExport, closeExport, previewPage, downloadZip,
} from 'web/export.js';
import {
  applyStyle, applyAttr, applyToggleAttr, applyClamp,
  applyBgColor, applyBgColorHex,
  applyTextColor, applyTextColorHex,
  toggleGradient, applyGradient,
  applyBorder, applyRadius,
  showColorMode, updateFontPreview,
} from 'web/style-applicators.js';

// ── Resolver dependencias circulares ─────────────────────────
initHistory(renderRightPanel, renderTree, reattachCanvasEvents);
initLayers(selectEl);

// ── Exponer al scope global ───────────────────────────────────
Object.assign(window, {
  goToLanding,
  setViewport, changeZoom,
  toggleSection,
  elDragStart,
  sectionDragOver, sectionDragLeave, sectionDrop,
  canvasDragOver, canvasDrop, canvasDragLeave,
  selectEl, startInlineEdit, dblEditEl,
  duplicateEl, deleteEl, addChildEl,
  switchRTab, switchPanelTab,
  applyStyle, applyAttr, applyToggleAttr, applyClamp,
  applyBgColor, applyBgColorHex,
  applyTextColor, applyTextColorHex,
  toggleGradient, applyGradient,
  applyBorder, applyRadius,
  showColorMode, updateFontPreview,
  undo, redo,
  switchPage, addPage, deletePage,
  renamePage, startRenamePageInline, closeRenameModal,
  showExport, closeExport, previewPage, downloadZip,
});

// ── Atajos de teclado ────────────────────────────────────────
document.addEventListener('keydown', function (e) {
  const active = document.activeElement;
  if (active?.isContentEditable || ['INPUT','TEXTAREA','SELECT'].includes(active?.tagName)) return;
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === 'z' && !e.shiftKey)                   { e.preventDefault(); undo(); }
  if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))){ e.preventDefault(); redo(); }
  if (ctrl && e.key === 'd') {
    e.preventDefault();
    if (State.selectedElId) duplicateEl(null, State.selectedElId);
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && State.selectedElId) {
    deleteEl(null, State.selectedElId);
  }
  if (e.key === 'Escape' && State.selectedElId) {
    const el = document.querySelector('[data-id="' + State.selectedElId + '"]');
    if (el) el.classList.remove('selected');
    State.setSelectedElId(null);
    renderRightPanel(null, null);
  }
});

// ── Init ─────────────────────────────────────────────────────
window.onload = function () {
  initPages();
  saveHistory();
  renderTree();
  showToast('¡Bienvenido al constructor XandA!', 'success');
};