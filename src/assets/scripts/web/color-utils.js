// ═══════════════════════════════════════════════════════════════
// color-utils.js — Helpers de color y parsing CSS
// Sin dependencias de estado ni DOM.
// ═══════════════════════════════════════════════════════════════

// ── Conversión de colores ────────────────────────────────────

export function toHex(color) {
  if (!color) return '#ffffff';
  if (color.startsWith('#')) return color.length === 7 ? color : '#ffffff';
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    return '#' + [m[1], m[2], m[3]]
      .map(x => parseInt(x).toString(16).padStart(2, '0'))
      .join('');
  }
  return '#ffffff';
}

export function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToCmyk(r, g, b) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round((1 - rr - k) / (1 - k) * 100),
    m: Math.round((1 - gg - k) / (1 - k) * 100),
    y: Math.round((1 - bb - k) / (1 - k) * 100),
    k: Math.round(k * 100),
  };
}

export function hexToHsl(hex) {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// ── Parsing de clamp() ───────────────────────────────────────

export function parseClamp(val, part) {
  if (!val) return '';
  const m = val.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
  if (m) {
    if (part === 'min') return m[1].trim();
    if (part === 'mid') return m[2].trim();
    if (part === 'max') return m[3].trim();
  }
  return part === 'min' ? val : '';
}

// ── Parsing de border ────────────────────────────────────────

export function parseBorderParts(border) {
  if (!border || border === 'none') return { width: '1px', style: 'solid', color: '#E2DEFF' };
  const parts = border.split(' ');
  return {
    width: parts[0] || '1px',
    style: parts[1] || 'solid',
    color: parts.slice(2).join(' ') || '#E2DEFF',
  };
}

export function parseBorderWidth(border) { return parseBorderParts(border).width; }
export function parseBorderStyle(border) { return parseBorderParts(border).style; }
export function parseBorderColor(border) { return toHex(parseBorderParts(border).color); }

export function parseRadiusCorner(radius, corner) {
  if (!radius) return '';
  const parts = radius.split(' ');
  const map = { tl: 0, tr: 1, br: 2, bl: 3 };
  return parts[map[corner]] || parts[0] || '';
}
