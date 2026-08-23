// ═══════════════════════════════════════════════════════════════
// style-applicators.js — Aplica estilos y atributos al elemento
// seleccionado, y actualiza los indicadores de color del panel.
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';
import { toHex, hexToRgb, rgbToCmyk, hexToHsl, parseBorderParts, parseClamp } from './color-utils.js';
import { saveHistory } from './history.js';

// ── Estilos inline ───────────────────────────────────────────

export function applyStyle(prop, val) {
  const el = _selected(); if (!el) return;
  el.style[prop] = val;
  saveHistory();
}

export function applyClamp(prop) {
  const el = _selected(); if (!el) return;
  const prefix = { width: 'w', height: 'h', fontSize: 'fs' }[prop] || '';
  const minEl = document.getElementById(prefix + '-min');
  const vwEl  = document.getElementById(prefix + '-vw');
  const maxEl = document.getElementById(prefix + '-max');
  if (!minEl || !vwEl || !maxEl) return;
  const min = minEl.value.trim(), mid = vwEl.value.trim(), max = maxEl.value.trim();
  el.style[prop] = (min && mid && max) ? `clamp(${min}, ${mid}, ${max})` : (min || '');
  saveHistory();
}

// ── Atributos HTML ───────────────────────────────────────────

export function applyAttr(attr, val) {
  const el = _selected(); if (!el) return;
  el.setAttribute(attr, val);
  saveHistory();
}

export function applyToggleAttr(attr, on) {
  const el = _selected(); if (!el) return;
  on ? el.setAttribute(attr, '') : el.removeAttribute(attr);
  saveHistory();
}

// ── Colores de fondo ─────────────────────────────────────────

export function applyBgColor(val, swatchId, hexId) {
  const el = _selected(); if (!el) return;
  el.style.background = val;
  el.style.backgroundColor = val;
  _syncInput(swatchId, 'style.background', val);
  _syncInput(hexId, 'value', val);
  updateColorInfos('bg', toHex(val));
  saveHistory();
}

export function applyBgColorHex(val, swatchId) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(val)) return;
  const el = _selected(); if (!el) return;
  el.style.background = val;
  _syncSwatch(swatchId, val);
  updateColorInfos('bg', val);
  saveHistory();
}

// ── Color de texto ───────────────────────────────────────────

export function applyTextColor(val, swatchId, hexId) {
  const el = _selected(); if (!el) return;
  el.style.color = val;
  _syncSwatch(swatchId, val);
  _syncInput(hexId, 'value', val);
  updateColorInfos('tc', toHex(val));
  saveHistory();
}

export function applyTextColorHex(val, swatchId) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(val)) return;
  const el = _selected(); if (!el) return;
  el.style.color = val;
  _syncSwatch(swatchId, val);
  updateColorInfos('tc', val);
  saveHistory();
}

// ── Degradado ────────────────────────────────────────────────

export function toggleGradient(on) {
  const ctrl = document.getElementById('gradientControls');
  if (ctrl) ctrl.style.display = on ? 'flex' : 'none';
  if (!on) {
    const el = _selected(); if (!el) return;
    const bgHex = document.getElementById('bg-hex');
    if (bgHex) el.style.background = bgHex.value;
  }
}

export function applyGradient() {
  const el = _selected(); if (!el) return;
  const inputs = document.querySelectorAll('#gradientControls input[type=color]');
  const angle  = document.getElementById('gradAngle');
  if (inputs.length >= 2 && angle) {
    el.style.background = `linear-gradient(${angle.value}deg, ${inputs[0].value}, ${inputs[1].value})`;
  }
}

// ── Borde ────────────────────────────────────────────────────

export function applyBorder(aspect, val) {
  const el = _selected(); if (!el) return;
  const parts = parseBorderParts(el.style.border || '');
  if (aspect === 'width') parts.width = val;
  if (aspect === 'style') parts.style = val;
  if (aspect === 'color') parts.color = val;
  el.style.border = parts.style === 'none'
    ? 'none'
    : `${parts.width || '1px'} ${parts.style || 'solid'} ${parts.color || '#E2DEFF'}`;
  saveHistory();
}

// ── Border-radius por esquina ────────────────────────────────

export function applyRadius(corner, val) {
  const el = _selected(); if (!el) return;
  const map = {
    tl: 'borderTopLeftRadius',    tr: 'borderTopRightRadius',
    bl: 'borderBottomLeftRadius', br: 'borderBottomRightRadius',
  };
  el.style[map[corner]] = val;
  saveHistory();
}

// ── Color info (RGB / CMYK / HSL) ───────────────────────────

export function updateColorInfos(prefix, hex) {
  if (!hex || hex.length < 7) return;
  const { r, g, b } = hexToRgb(hex);
  const { c, m, y, k } = rgbToCmyk(r, g, b);
  const { h, s, l } = hexToHsl(hex);
  _setText(prefix + '-rgb',  `rgb(${r}, ${g}, ${b})`);
  _setText(prefix + '-cmyk', `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`);
  _setText(prefix + '-hsl',  `hsl(${h}°, ${s}%, ${l}%)`);
}

export function showColorMode(prefix, mode, btn) {
  btn.parentElement.querySelectorAll('.color-type-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['rgb', 'cmyk', 'hsl'].forEach(m => {
    const el = document.getElementById(prefix + '-' + m);
    if (el) el.style.display = m === mode ? 'block' : 'none';
  });
}

// ── Font preview ─────────────────────────────────────────────

export function updateFontPreview() {
  const fp = document.getElementById('fontPreview');
  if (!fp || !State.selectedElId) return;
  const el = document.querySelector('[data-id="' + State.selectedElId + '"]');
  if (!el) return;
  fp.style.fontFamily = el.style.fontFamily;
  fp.style.fontWeight = el.style.fontWeight;
  fp.style.fontStyle  = el.style.fontStyle;
}

// ── Helpers privados ─────────────────────────────────────────

function _selected() {
  return State.selectedElId
    ? document.querySelector('[data-id="' + State.selectedElId + '"]')
    : null;
}

function _syncSwatch(id, color) {
  const el = document.getElementById(id);
  if (el) el.style.background = color;
}

function _syncInput(id, prop, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (prop === 'value') el.value = val;
  else if (prop === 'style.background') el.style.background = val;
}

function _setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
