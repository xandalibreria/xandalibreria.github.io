// ═══════════════════════════════════════════════════════════════
// panel.js — Panel derecho de propiedades (Estilo / Tipografía
// / Espaciado) y tabs del panel izquierdo.
// ═══════════════════════════════════════════════════════════════

import * as State from './state.js';
import {
  toHex, parseClamp, parseBorderWidth, parseBorderStyle,
  parseBorderColor, parseRadiusCorner,
} from './color-utils.js';
import { updateColorInfos, updateFontPreview } from './style-applicators.js';

// ── Tab derecho ──────────────────────────────────────────────

export function switchRTab(idx) {
  State.setActiveRTab(idx);
  document.querySelectorAll('.rtab').forEach((t, i) => t.classList.toggle('active', i === idx));
  if (State.selectedElId) {
    const el = document.querySelector('[data-id="' + State.selectedElId + '"]');
    renderRightPanel(State.selectedElId, el);
  }
}

// ── Render principal ─────────────────────────────────────────

export function renderRightPanel(id, el) {
  const title    = document.getElementById('rightTitle');
  const subtitle = document.getElementById('rightSubtitle');
  const scroll   = document.getElementById('rightScroll');
  const rtabs    = document.getElementById('rtabs');

  if (!id || !el) {
    title.textContent    = 'Propiedades';
    subtitle.textContent = 'Selecciona un elemento para editar';
    rtabs.style.display  = 'none';
    scroll.innerHTML = `<div class="no-selection">
      <i class="fa-solid fa-arrow-pointer"></i>
      <p>Haz clic en cualquier elemento del canvas para editar sus propiedades de estilo.</p>
    </div>`;
    return;
  }

  const tag = el.tagName.toLowerCase();
  title.textContent    = '<' + tag + '>';
  subtitle.textContent = id;
  rtabs.style.display  = 'flex';

  const s = el.style;
  if      (State.activeRTab === 0) renderStyleTab(el, s, scroll);
  else if (State.activeRTab === 1) renderTypoTab(el, s, scroll);
  else if (State.activeRTab === 2) renderSpacingTab(el, s, scroll);
}

// ── Tab: Estilo ──────────────────────────────────────────────

function renderStyleTab(el, s, scroll) {
  const tag     = el.tagName.toLowerCase();
  const isImg   = tag === 'img';
  const isVideo = tag === 'video';
  const isAnchor = tag === 'a';
  const isMedia = isImg || isVideo;

  const mediaSection = isImg ? `
    <div class="prop-section">
      <div class="prop-title"><i class="fa-solid fa-image"></i>Imagen</div>
      <div class="prop-row">
        <span class="prop-label">URL / src</span>
        <input class="prop-input" type="text" placeholder="https://…/imagen.jpg"
          value="${el.getAttribute('src') || ''}" onchange="applyAttr('src',this.value)">
      </div>
      <div class="prop-row">
        <span class="prop-label">Alt text</span>
        <input class="prop-input" type="text" placeholder="Descripción…"
          value="${el.getAttribute('alt') || ''}" onchange="applyAttr('alt',this.value)">
      </div>
      <div class="prop-row">
        <span class="prop-label">Object fit</span>
        <select class="prop-select" onchange="applyStyle('objectFit',this.value)">
          <option value="" ${!s.objectFit ? 'selected' : ''}>—</option>
          <option value="cover"   ${s.objectFit === 'cover'   ? 'selected' : ''}>Cover</option>
          <option value="contain" ${s.objectFit === 'contain' ? 'selected' : ''}>Contain</option>
          <option value="fill"    ${s.objectFit === 'fill'    ? 'selected' : ''}>Fill</option>
        </select>
      </div>
    </div>` : isVideo ? `
    <div class="prop-section">
      <div class="prop-title"><i class="fa-solid fa-film"></i>Video</div>
      <div class="prop-row">
        <span class="prop-label">URL / src</span>
        <input class="prop-input" type="text" placeholder="https://…/video.mp4"
          value="${el.getAttribute('src') || ''}" onchange="applyAttr('src',this.value)">
      </div>
      <div class="prop-row" style="flex-wrap:wrap;gap:8px">
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer">
          <input type="checkbox" ${el.hasAttribute('controls') ? 'checked' : ''} onchange="applyToggleAttr('controls',this.checked)"> Controles
        </label>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer">
          <input type="checkbox" ${el.hasAttribute('autoplay') ? 'checked' : ''} onchange="applyToggleAttr('autoplay',this.checked)"> Autoplay
        </label>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer">
          <input type="checkbox" ${el.hasAttribute('loop') ? 'checked' : ''} onchange="applyToggleAttr('loop',this.checked)"> Loop
        </label>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer">
          <input type="checkbox" ${el.hasAttribute('muted') ? 'checked' : ''} onchange="applyToggleAttr('muted',this.checked)"> Muted
        </label>
      </div>
    </div>` : '';

  const anchorSection = isAnchor ? `
    <div class="prop-section">
      <div class="prop-title"><i class="fa-solid fa-link"></i>Enlace</div>
      <div class="prop-row">
        <span class="prop-label">URL (href)</span>
        <input class="prop-input" type="text" placeholder="https://…"
          value="${el.getAttribute('href') || ''}" onchange="applyAttr('href',this.value)">
      </div>
      <div class="prop-row">
        <span class="prop-label">Target</span>
        <select class="prop-select" onchange="applyAttr('target',this.value)">
          <option value="" ${!el.getAttribute('target') ? 'selected' : ''}>Misma pestaña</option>
          <option value="_blank" ${el.getAttribute('target') === '_blank' ? 'selected' : ''}>Nueva pestaña</option>
        </select>
      </div>
    </div>` : '';

  scroll.innerHTML = `
    <div class="rtab-panel active">
      ${mediaSection}
      ${anchorSection}

      <!-- DIMENSIONES -->
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-ruler-combined"></i>Dimensiones (clamp)</div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--xanda-text2);margin-bottom:4px">Ancho</div>
          <div class="clamp-labels"><span>Min</span><span>vw</span><span>Max</span></div>
          <div class="clamp-group">
            <input type="text" id="w-min" placeholder="200px" value="${parseClamp(s.width, 'min')}" onchange="applyClamp('width')">
            <input type="text" id="w-vw"  placeholder="50vw"  value="${parseClamp(s.width, 'mid')}" onchange="applyClamp('width')">
            <input type="text" id="w-max" placeholder="800px" value="${parseClamp(s.width, 'max')}" onchange="applyClamp('width')">
          </div>
        </div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--xanda-text2);margin-bottom:4px">Alto</div>
          <div class="clamp-labels"><span>Min</span><span>vh</span><span>Max</span></div>
          <div class="clamp-group">
            <input type="text" id="h-min" placeholder="auto"  value="${parseClamp(s.height, 'min')}" onchange="applyClamp('height')">
            <input type="text" id="h-vw"  placeholder="30vh"  value="${parseClamp(s.height, 'mid')}" onchange="applyClamp('height')">
            <input type="text" id="h-max" placeholder="600px" value="${parseClamp(s.height, 'max')}" onchange="applyClamp('height')">
          </div>
        </div>
      </div>

      ${!isMedia ? `
      <!-- FONDO -->
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-fill-drip"></i>Fondo</div>
        <div class="color-preview-row">
          <div class="color-swatch" id="bg-swatch" style="background:${s.background || s.backgroundColor || '#ffffff'}">
            <input type="color" value="${toHex(s.background || s.backgroundColor || '#ffffff')}"
              oninput="applyBgColor(this.value,'bg-swatch','bg-hex')">
          </div>
          <input class="color-hex" type="text" id="bg-hex" placeholder="#FFFFFF"
            value="${toHex(s.background || s.backgroundColor || '#ffffff')}"
            oninput="applyBgColorHex(this.value,'bg-swatch')">
        </div>
        <div class="color-type-tabs">
          <button class="color-type-tab active" onclick="showColorMode('bg','hex',this)">HEX</button>
          <button class="color-type-tab" onclick="showColorMode('bg','rgb',this)">RGB</button>
          <button class="color-type-tab" onclick="showColorMode('bg','cmyk',this)">CMYK</button>
          <button class="color-type-tab" onclick="showColorMode('bg','hsl',this)">HSL</button>
        </div>
        <div class="color-info" id="bg-rgb"></div>
        <div class="color-info" id="bg-cmyk"></div>
        <div class="color-info" id="bg-hsl"></div>
        <div class="grad-checkbox">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:var(--xanda-text2)">
            <input type="checkbox" id="bgGradient" onchange="toggleGradient(this.checked)"> Usar degradado
          </label>
        </div>
        <div id="gradientControls" style="display:none;margin-top:8px;gap:6px;flex-direction:column">
          <div class="prop-row"><span class="prop-label">Color 1</span>
            <div class="color-swatch" style="background:#6B5CE7;width:24px;height:24px">
              <input type="color" value="#6B5CE7" oninput="applyGradient()">
            </div>
          </div>
          <div class="prop-row"><span class="prop-label">Color 2</span>
            <div class="color-swatch" style="background:#4F8EF7;width:24px;height:24px">
              <input type="color" value="#4F8EF7" oninput="applyGradient()">
            </div>
          </div>
          <div class="prop-row"><span class="prop-label">Ángulo</span>
            <input class="prop-input" type="number" value="135" id="gradAngle" onchange="applyGradient()">
          </div>
        </div>
      </div>

      <!-- COLOR DE TEXTO -->
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-palette"></i>Color de texto</div>
        <div class="color-preview-row">
          <div class="color-swatch" id="tc-swatch" style="background:${s.color || '#1A1633'}">
            <input type="color" value="${toHex(s.color || '#1A1633')}"
              oninput="applyTextColor(this.value,'tc-swatch','tc-hex')">
          </div>
          <input class="color-hex" type="text" id="tc-hex" placeholder="#1A1633"
            value="${toHex(s.color || '#1A1633')}"
            oninput="applyTextColorHex(this.value,'tc-swatch')">
        </div>
        <div class="color-type-tabs">
          <button class="color-type-tab active" onclick="showColorMode('tc','hex',this)">HEX</button>
          <button class="color-type-tab" onclick="showColorMode('tc','rgb',this)">RGB</button>
          <button class="color-type-tab" onclick="showColorMode('tc','cmyk',this)">CMYK</button>
        </div>
        <div class="color-info" id="tc-rgb"></div>
        <div class="color-info" id="tc-cmyk"></div>
      </div>

      <!-- BORDE -->
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-border-all"></i>Borde</div>
        <div class="prop-row"><span class="prop-label">Grosor</span>
          <input class="prop-input" type="text" placeholder="1px"
            value="${parseBorderWidth(s.border)}" onchange="applyBorder('width',this.value)">
        </div>
        <div class="prop-row"><span class="prop-label">Estilo</span>
          <select class="prop-select" onchange="applyBorder('style',this.value)">
            <option value="none"   ${parseBorderStyle(s.border) === 'none'   ? 'selected' : ''}>Ninguno</option>
            <option value="solid"  ${parseBorderStyle(s.border) === 'solid'  ? 'selected' : ''}>Sólido</option>
            <option value="dashed" ${parseBorderStyle(s.border) === 'dashed' ? 'selected' : ''}>Discontinuo</option>
            <option value="dotted" ${parseBorderStyle(s.border) === 'dotted' ? 'selected' : ''}>Punteado</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Color</span>
          <div class="color-swatch" style="width:30px;height:30px;background:${parseBorderColor(s.border)}">
            <input type="color" value="${parseBorderColor(s.border)}" oninput="applyBorder('color',this.value)">
          </div>
        </div>
        <div style="font-size:10px;font-weight:700;color:var(--xanda-text3);text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 6px">Border Radius</div>
        <div class="border-corners">
          <div class="border-corner"><label>↖ TL</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius, 'tl')}" onchange="applyRadius('tl',this.value)"></div>
          <div class="border-corner"><label>↗ TR</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius, 'tr')}" onchange="applyRadius('tr',this.value)"></div>
          <div class="border-corner"><label>↙ BL</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius, 'bl')}" onchange="applyRadius('bl',this.value)"></div>
          <div class="border-corner"><label>↘ BR</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius, 'br')}" onchange="applyRadius('br',this.value)"></div>
        </div>
      </div>

      <!-- LAYOUT / FLEXBOX -->
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-table-columns"></i>Layout / Flexbox</div>
        <div class="prop-row"><span class="prop-label">Display</span>
          <select class="prop-select" onchange="applyStyle('display',this.value)">
            <option value="block"        ${s.display === 'block'        ? 'selected' : ''}>Block</option>
            <option value="flex"         ${s.display === 'flex'         ? 'selected' : ''}>Flex</option>
            <option value="grid"         ${s.display === 'grid'         ? 'selected' : ''}>Grid</option>
            <option value="inline"       ${s.display === 'inline'       ? 'selected' : ''}>Inline</option>
            <option value="inline-block" ${s.display === 'inline-block' ? 'selected' : ''}>Inline-block</option>
            <option value="none"         ${s.display === 'none'         ? 'selected' : ''}>None</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Dirección</span>
          <div class="flex-row">
            <button onclick="applyStyle('flexDirection','row')"    class="${s.flexDirection === 'row'    ? 'active' : ''}">→ Row</button>
            <button onclick="applyStyle('flexDirection','column')" class="${s.flexDirection === 'column' ? 'active' : ''}">↓ Col</button>
          </div>
        </div>
        <div class="prop-row"><span class="prop-label">Alineación X</span>
          <select class="prop-select" onchange="applyStyle('justifyContent',this.value)">
            <option value="">—</option>
            <option value="flex-start"    ${s.justifyContent === 'flex-start'    ? 'selected' : ''}>Inicio</option>
            <option value="center"        ${s.justifyContent === 'center'        ? 'selected' : ''}>Centro</option>
            <option value="flex-end"      ${s.justifyContent === 'flex-end'      ? 'selected' : ''}>Fin</option>
            <option value="space-between" ${s.justifyContent === 'space-between' ? 'selected' : ''}>Space between</option>
            <option value="space-around"  ${s.justifyContent === 'space-around'  ? 'selected' : ''}>Space around</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Alineación Y</span>
          <select class="prop-select" onchange="applyStyle('alignItems',this.value)">
            <option value="">—</option>
            <option value="flex-start" ${s.alignItems === 'flex-start' ? 'selected' : ''}>Inicio</option>
            <option value="center"     ${s.alignItems === 'center'     ? 'selected' : ''}>Centro</option>
            <option value="flex-end"   ${s.alignItems === 'flex-end'   ? 'selected' : ''}>Fin</option>
            <option value="stretch"    ${s.alignItems === 'stretch'    ? 'selected' : ''}>Stretch</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Gap</span>
          <input class="prop-input" type="text" placeholder="0px" value="${s.gap || ''}" onchange="applyStyle('gap',this.value)">
        </div>
      </div>
      ` : ''}

      <!-- EFECTOS -->
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-circle-half-stroke"></i>Efectos</div>
        <div class="prop-row"><span class="prop-label">Opacidad</span>
          <input class="prop-input" type="range" min="0" max="1" step="0.01" value="${s.opacity || 1}"
            oninput="applyStyle('opacity',this.value);this.title=Math.round(this.value*100)+'%'">
        </div>
        <div class="prop-row"><span class="prop-label">Box shadow</span>
          <input class="prop-input" type="text" placeholder="0 4px 20px rgba(0,0,0,0.1)"
            value="${s.boxShadow || ''}" onchange="applyStyle('boxShadow',this.value)">
        </div>
        <div class="prop-row"><span class="prop-label">Overflow</span>
          <select class="prop-select" onchange="applyStyle('overflow',this.value)">
            <option value=""        ${!s.overflow                ? 'selected' : ''}>Auto</option>
            <option value="hidden"  ${s.overflow === 'hidden'  ? 'selected' : ''}>Hidden</option>
            <option value="scroll"  ${s.overflow === 'scroll'  ? 'selected' : ''}>Scroll</option>
            <option value="visible" ${s.overflow === 'visible' ? 'selected' : ''}>Visible</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Cursor</span>
          <select class="prop-select" onchange="applyStyle('cursor',this.value)">
            <option value=""            ${!s.cursor                    ? 'selected' : ''}>Default</option>
            <option value="pointer"     ${s.cursor === 'pointer'     ? 'selected' : ''}>Pointer</option>
            <option value="text"        ${s.cursor === 'text'        ? 'selected' : ''}>Text</option>
            <option value="not-allowed" ${s.cursor === 'not-allowed' ? 'selected' : ''}>Not-allowed</option>
          </select>
        </div>
      </div>
    </div>
  `;

  if (!isMedia) {
    updateColorInfos('bg', toHex(s.background || s.backgroundColor || '#ffffff'));
    updateColorInfos('tc', toHex(s.color || '#1A1633'));
  }
}

// ── Tab: Tipografía ──────────────────────────────────────────

function renderTypoTab(el, s, scroll) {
  const fonts = ['Inter','Roboto','Open Sans','Montserrat','Lato','Poppins','Raleway',
                 'Playfair Display','Georgia','Arial','Helvetica Neue','Times New Roman','Courier New'];
  scroll.innerHTML = `
    <div class="rtab-panel active">
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-font"></i>Tipografía</div>
        <div class="font-preview" id="fontPreview">AaBbCcDd 123</div>
        <div class="prop-row"><span class="prop-label">Fuente</span>
          <select class="prop-select" onchange="applyStyle('fontFamily',this.value);updateFontPreview()">
            ${fonts.map(f => `<option value="${f}" ${(s.fontFamily || '').includes(f) ? 'selected' : ''}>${f}</option>`).join('')}
          </select>
        </div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--xanda-text2);margin-bottom:4px">Tamaño (clamp responsivo)</div>
          <div class="clamp-labels"><span>Min</span><span>vw</span><span>Max</span></div>
          <div class="clamp-group">
            <input type="text" id="fs-min" placeholder="14px" value="${parseClamp(s.fontSize, 'min')}" onchange="applyClamp('fontSize')">
            <input type="text" id="fs-vw"  placeholder="2vw"  value="${parseClamp(s.fontSize, 'mid')}" onchange="applyClamp('fontSize')">
            <input type="text" id="fs-max" placeholder="20px" value="${parseClamp(s.fontSize, 'max')}" onchange="applyClamp('fontSize')">
          </div>
        </div>
        <div class="prop-row"><span class="prop-label">Peso</span>
          <select class="prop-select" onchange="applyStyle('fontWeight',this.value)">
            ${['300','400','500','600','700','800','900'].map(w =>
              `<option value="${w}" ${s.fontWeight === w ? 'selected' : ''}>${w}</option>`).join('')}
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Estilo</span>
          <div class="flex-row">
            <button onclick="applyStyle('fontStyle','normal')" class="${s.fontStyle !== 'italic' ? 'active' : ''}">Normal</button>
            <button onclick="applyStyle('fontStyle','italic')" class="${s.fontStyle === 'italic' ? 'active' : ''}"><i>Cursiva</i></button>
          </div>
        </div>
        <div class="prop-row"><span class="prop-label">Decoración</span>
          <div class="flex-row">
            <button onclick="applyStyle('textDecoration','none')"         class="${!s.textDecoration || s.textDecoration === 'none' ? 'active' : ''}">Ninguna</button>
            <button onclick="applyStyle('textDecoration','underline')"    class="${s.textDecoration === 'underline'    ? 'active' : ''}"><u>Sub.</u></button>
            <button onclick="applyStyle('textDecoration','line-through')" class="${s.textDecoration === 'line-through' ? 'active' : ''}"><s>Tach.</s></button>
          </div>
        </div>
        <div class="prop-row"><span class="prop-label">Alineación</span>
          <div class="flex-row">
            <button onclick="applyStyle('textAlign','left')"    class="${s.textAlign === 'left'    || !s.textAlign ? 'active' : ''}"><i class="fa-solid fa-align-left"></i></button>
            <button onclick="applyStyle('textAlign','center')"  class="${s.textAlign === 'center'  ? 'active' : ''}"><i class="fa-solid fa-align-center"></i></button>
            <button onclick="applyStyle('textAlign','right')"   class="${s.textAlign === 'right'   ? 'active' : ''}"><i class="fa-solid fa-align-right"></i></button>
            <button onclick="applyStyle('textAlign','justify')" class="${s.textAlign === 'justify' ? 'active' : ''}"><i class="fa-solid fa-align-justify"></i></button>
          </div>
        </div>
        <div class="prop-row"><span class="prop-label">Line height</span>
          <input class="prop-input" type="number" step="0.1" placeholder="1.5" value="${s.lineHeight || 1.5}" onchange="applyStyle('lineHeight',this.value)">
        </div>
        <div class="prop-row"><span class="prop-label">Espaciado</span>
          <input class="prop-input" type="text" placeholder="0px" value="${s.letterSpacing || ''}" onchange="applyStyle('letterSpacing',this.value)">
        </div>
        <div class="prop-row"><span class="prop-label">Transform</span>
          <select class="prop-select" onchange="applyStyle('textTransform',this.value)">
            <option value="">Normal</option>
            <option value="uppercase"  ${s.textTransform === 'uppercase'  ? 'selected' : ''}>MAYÚSCULAS</option>
            <option value="lowercase"  ${s.textTransform === 'lowercase'  ? 'selected' : ''}>minúsculas</option>
            <option value="capitalize" ${s.textTransform === 'capitalize' ? 'selected' : ''}>Capitalizar</option>
          </select>
        </div>
      </div>
    </div>`;

  const fp = document.getElementById('fontPreview');
  if (fp) {
    fp.style.fontFamily = s.fontFamily || 'Inter';
    fp.style.fontSize   = '22px';
    fp.style.fontWeight = s.fontWeight || '600';
    fp.style.fontStyle  = s.fontStyle  || 'normal';
  }
}

// ── Tab: Espaciado ───────────────────────────────────────────

function renderSpacingTab(el, s, scroll) {
  scroll.innerHTML = `
    <div class="rtab-panel active">
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-expand"></i>Espaciado</div>
        <div class="spacing-viz">
          <div style="font-size:9px;color:var(--xanda-purple);text-align:center;margin-bottom:6px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">MARGIN</div>
          <div class="spacing-outer">
            <div style="font-size:9px;color:var(--xanda-text3);text-align:center;margin-bottom:6px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">PADDING</div>
            <div class="spacing-inner">${el.tagName.toLowerCase()}</div>
          </div>
        </div>
        <div class="spacing-inputs">
          <div><label>Margin Top</label>   <input type="text" placeholder="0px" value="${s.marginTop    || s.margin || ''}" onchange="applyStyle('marginTop',this.value)"></div>
          <div><label>Margin Right</label> <input type="text" placeholder="0px" value="${s.marginRight  || ''}"             onchange="applyStyle('marginRight',this.value)"></div>
          <div><label>Margin Bottom</label><input type="text" placeholder="0px" value="${s.marginBottom || ''}"             onchange="applyStyle('marginBottom',this.value)"></div>
          <div><label>Margin Left</label>  <input type="text" placeholder="0px" value="${s.marginLeft   || ''}"             onchange="applyStyle('marginLeft',this.value)"></div>
          <div><label>Padding Top</label>  <input type="text" placeholder="0px" value="${s.paddingTop   || ''}"             onchange="applyStyle('paddingTop',this.value)"></div>
          <div><label>Padding Right</label><input type="text" placeholder="0px" value="${s.paddingRight || ''}"             onchange="applyStyle('paddingRight',this.value)"></div>
          <div><label>Padding Bottom</label><input type="text" placeholder="0px" value="${s.paddingBottom || ''}"           onchange="applyStyle('paddingBottom',this.value)"></div>
          <div><label>Padding Left</label> <input type="text" placeholder="0px" value="${s.paddingLeft  || ''}"             onchange="applyStyle('paddingLeft',this.value)"></div>
        </div>
      </div>
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-up-right-and-down-left-from-center"></i>Posicionamiento</div>
        <div class="prop-row"><span class="prop-label">Position</span>
          <select class="prop-select" onchange="applyStyle('position',this.value)">
            <option value=""         ${!s.position                  ? 'selected' : ''}>Static</option>
            <option value="relative" ${s.position === 'relative' ? 'selected' : ''}>Relative</option>
            <option value="absolute" ${s.position === 'absolute' ? 'selected' : ''}>Absolute</option>
            <option value="sticky"   ${s.position === 'sticky'   ? 'selected' : ''}>Sticky</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Top</span>   <input class="prop-input" type="text" placeholder="auto" value="${s.top    || ''}" onchange="applyStyle('top',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Right</span> <input class="prop-input" type="text" placeholder="auto" value="${s.right  || ''}" onchange="applyStyle('right',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Bottom</span><input class="prop-input" type="text" placeholder="auto" value="${s.bottom || ''}" onchange="applyStyle('bottom',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Left</span>  <input class="prop-input" type="text" placeholder="auto" value="${s.left   || ''}" onchange="applyStyle('left',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Z-index</span><input class="prop-input" type="number" placeholder="0" value="${s.zIndex || ''}" onchange="applyStyle('zIndex',this.value)"></div>
      </div>
    </div>`;
}

// ── Tab izquierdo ────────────────────────────────────────────

export function switchPanelTab(idx) {
  State.setActivePTab(idx);
  ['elements', 'layers', 'styles'].forEach((p, i) => {
    const el  = document.getElementById('panel-' + p);
    const tab = document.getElementById('ptab-' + i);
    if (el)  el.style.display = i === idx ? 'block' : 'none';
    if (tab) tab.classList.toggle('active', i === idx);
  });
}
