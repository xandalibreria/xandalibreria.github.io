// ═══════════════════════════════════════════════════════════════
// history.js — Undo / Redo del canvas
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';
import { showToast } from './ui.js';

// renderRightPanel y renderTree se inyectan desde main para evitar
// dependencia circular (canvas → history → panel → canvas).
let _renderRightPanel = () => {};
let _renderTree       = () => {};
let _reattach         = () => {};

export function initHistory(renderRightPanel, renderTree, reattachCanvasEvents) {
  _renderRightPanel = renderRightPanel;
  _renderTree       = renderTree;
  _reattach         = reattachCanvasEvents;
}

export function saveHistory() {
  const state = document.getElementById('canvasFrame').innerHTML;
  State.setHistory(State.history.slice(0, State.historyIndex + 1).concat([state]));
  State.setHistoryIndex(State.historyIndex + 1);
  // Limitar a 50 estados
  if (State.history.length > 50) {
    State.setHistory(State.history.slice(1));
    State.setHistoryIndex(State.historyIndex - 1);
  }
  _updateBtns();
}

export function undo() {
  if (State.historyIndex <= 0) return;
  State.setHistoryIndex(State.historyIndex - 1);
  _restore();
}

export function redo() {
  if (State.historyIndex >= State.history.length - 1) return;
  State.setHistoryIndex(State.historyIndex + 1);
  _restore();
}

function _restore() {
  const frame = document.getElementById('canvasFrame');
  frame.innerHTML = State.history[State.historyIndex];
  _reattach();
  State.setSelectedElId(null);
  _renderRightPanel(null, null);
  _renderTree();
  _updateBtns();
  showToast(State.historyIndex < State.history.length - 1 ? 'Acción deshecha' : 'Acción rehecha');
}

function _updateBtns() {
  const u = document.getElementById('undoBtn');
  const r = document.getElementById('redoBtn');
  if (u) u.disabled = State.historyIndex <= 0;
  if (r) r.disabled = State.historyIndex >= State.history.length - 1;
}
