// ═══════════════════════════════════════════════════════════════
// export.js — Preview, generación de HTML/CSS y descarga ZIP
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';
import { showToast, loadScript } from './ui.js';

// ── Modal de exportar ────────────────────────────────────────

export function showExport() {
  _saveCurrentCanvas();
  const preview = `/* main.css */\n${generateMainCSS()}\n\n/* ${_currentName()}.css — estilos de página */\n/* (extraídos al descargar ZIP) */`;
  document.getElementById('exportPreview').textContent = preview;
  document.getElementById('exportModal').classList.add('show');
}

export function closeExport() {
  document.getElementById('exportModal').classList.remove('show');
}

// ── Preview en nueva pestaña ─────────────────────────────────

export function previewPage() {
  _saveCurrentCanvas();
  const name        = _currentName();
  const rawHTML     = document.getElementById('canvasFrame').innerHTML;
  const cleanedBody = cleanCanvas(rawHTML);
  const css         = generateMainCSS() + '\n' + generatePageCSS(name, cleanedBody);
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>${cleanedBody}</body>
</html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  window.open(url, '_blank');
  showToast('Abriendo preview de ' + name + '…', 'success');
}

// ── Descarga ZIP ─────────────────────────────────────────────

export async function downloadZip() {
  _saveCurrentCanvas();
  closeExport();
  showToast('Generando ZIP…', 'success');

  if (!window.JSZip) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  }

  const zip = new window.JSZip();
  zip.file('main.css', generateMainCSS());

  State.pages.forEach(page => {
    const rawHTML     = page.id === State.currentPageId
      ? document.getElementById('canvasFrame').innerHTML
      : (page.content || '');
    const cleanedBody = cleanCanvas(rawHTML);
    const pageCSS     = generatePageCSS(page.name, cleanedBody);
    zip.file(page.name + '.html', buildPageHTML(page.name, cleanedBody));
    zip.file(page.name + '.css',  pageCSS);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'xanda-proyecto.zip';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('ZIP descargado ✓', 'success');
}

// ── Generadores ──────────────────────────────────────────────

/** Limpia el HTML del canvas de todo markup del builder */
export function cleanCanvas(rawHTML) {
  const wrap = document.createElement('div');
  wrap.innerHTML = rawHTML;
  wrap.querySelectorAll('.el-toolbar, .section-label, .empty-drop').forEach(e => e.remove());
  wrap.querySelectorAll('.xanda-el').forEach(e => {
    e.classList.remove('xanda-el', 'selected');
    if (e.classList.length === 0) e.removeAttribute('class');
    ['data-id', 'contenteditable', 'onclick', 'ondblclick'].forEach(a => e.removeAttribute(a));
  });
  wrap.querySelectorAll('.xanda-section-wrap').forEach(e => {
    if (/^sec-/.test(e.id)) e.removeAttribute('id');
    ['class', 'data-section', 'ondragover', 'ondrop', 'ondragleave'].forEach(a => e.removeAttribute(a));
  });
  return wrap.innerHTML.trim();
}

/** HTML completo de una página apuntando a main.css + [name].css */
export function buildPageHTML(pageName, bodyHTML) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="${pageName}.css">
</head>
<body>
${bodyHTML}
</body>
</html>`;
}

/** CSS base compartido por todas las páginas */
export function generateMainCSS() {
  return `/* ═══════════════════════════════════════
   main.css — Base compartida · XandA
   ═══════════════════════════════════════ */
:root {
  --xanda-purple: #6B5CE7;
  --xanda-purple-dark: #4A3DB5;
  --xanda-blue: #4F8EF7;
  --xanda-text: #1A1633;
  --xanda-text2: #5B5379;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--xanda-text);
  line-height: 1.6;
}

img, video { max-width: 100%; display: block; }
a { text-decoration: none; }`;
}

/** CSS específico: extrae estilos inline y los convierte a clases */
export function generatePageCSS(pageName, bodyHTML) {
  const wrap  = document.createElement('div');
  wrap.innerHTML = bodyHTML;
  const rules = [`/* ${pageName}.css — Estilos de página · XandA */\n`];
  let n = 1;
  wrap.querySelectorAll('[style]').forEach(el => {
    const cls = `x-${pageName}-${n++}`;
    rules.push(`.${cls} {\n  ${el.getAttribute('style').replace(/;\s*/g, ';\n  ').trim()}\n}`);
    el.removeAttribute('style');
    el.classList.add(cls);
  });
  return rules.join('\n');
}

// ── Helpers privados ─────────────────────────────────────────

function _currentName() {
  return State.pages.find(p => p.id === State.currentPageId)?.name ?? 'index';
}

function _saveCurrentCanvas() {
  const cur = State.pages.find(p => p.id === State.currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;
}
