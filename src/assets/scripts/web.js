// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let selectedElId = null;
let dragType = null;
let dropTarget = null;
let sections = { header: true, main: true, footer: true };
let viewport = 'desktop';
let zoom = 100;
let history = [];
let historyIndex = -1;
let elCounter = 100;
let activeRTab = 0;
let activePTab = 0;
let addPopoverTargetSection = null;

// ═══════════════════════════════════════
// PAGES SYSTEM
// ═══════════════════════════════════════
let pages = [
  { id: 'page-1', name: 'index', content: null }   // null = use current canvas HTML
];
let currentPageId = 'page-1';
let pageCounter = 1;

function initPages() {
  // Guardar el contenido inicial en la primera página
  pages[0].content = document.getElementById('canvasFrame').innerHTML;
  renderPageBar();
}

function renderPageBar() {
  const bar = document.getElementById('pageBar');
  if (!bar) return;
  bar.innerHTML = '';
  pages.forEach(page => {
    const btn = document.createElement('button');
    btn.className = 'page-tab' + (page.id === currentPageId ? ' active' : '');
    btn.dataset.pageId = page.id;
    btn.innerHTML = `
      <i class="fa-solid fa-file-code"></i>
      <span class="page-tab-name" ondblclick="startRenamePageInline(event,'${page.id}')">${page.name}.html</span>
      <span class="page-tab-actions">
        <button class="page-tab-btn" onclick="renamePage(event,'${page.id}')" title="Renombrar"><i class="fa-solid fa-pen"></i></button>
        ${pages.length > 1 ? `<button class="page-tab-btn danger" onclick="deletePage(event,'${page.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>` : ''}
      </span>
    `;
    btn.addEventListener('click', function(e) {
      if (e.target.closest('.page-tab-btn') || e.target.closest('.page-tab-name')) return;
      switchPage(page.id);
    });
    bar.appendChild(btn);
  });

  // Botón añadir página
  const addBtn = document.createElement('button');
  addBtn.className = 'page-add-btn';
  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i><span>Nueva página</span>';
  addBtn.onclick = addPage;
  bar.appendChild(addBtn);
}

function switchPage(pageId) {
  if (pageId === currentPageId) return;
  // Guardar contenido actual
  const cur = pages.find(p => p.id === currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;
  // Cargar nueva página
  currentPageId = pageId;
  const target = pages.find(p => p.id === pageId);
  if (target && target.content) {
    document.getElementById('canvasFrame').innerHTML = target.content;
    reattachCanvasEvents();
  }
  selectedElId = null;
  renderRightPanel(null, null);
  renderTree();
  saveHistory();
  renderPageBar();
  showToast('Página: ' + target.name + '.html');
}

function addPage() {
  pageCounter++;
  // Guardar página actual
  const cur = pages.find(p => p.id === currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;
  // Crear nueva con canvas vacío
  const newId = 'page-' + pageCounter;
  const newName = 'pagina-' + pageCounter;
  pages.push({ id: newId, name: newName, content: getEmptyCanvas() });
  currentPageId = newId;
  document.getElementById('canvasFrame').innerHTML = pages[pages.length-1].content;
  reattachCanvasEvents();
  selectedElId = null;
  renderRightPanel(null, null);
  renderTree();
  saveHistory();
  renderPageBar();
  showToast('Nueva página: ' + newName + '.html', 'success');
}

function getEmptyCanvas() {
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

function deletePage(e, pageId) {
  e.stopPropagation();
  if (pages.length <= 1) { showToast('No puedes eliminar la única página', 'error'); return; }
  if (!confirm('¿Eliminar esta página? Esta acción no se puede deshacer.')) return;
  const idx = pages.findIndex(p => p.id === pageId);
  pages.splice(idx, 1);
  if (currentPageId === pageId) {
    const newCur = pages[Math.max(0, idx - 1)];
    currentPageId = newCur.id;
    document.getElementById('canvasFrame').innerHTML = newCur.content;
    reattachCanvasEvents();
    selectedElId = null;
    renderRightPanel(null, null);
    renderTree();
    saveHistory();
  }
  renderPageBar();
  showToast('Página eliminada');
}

function renamePage(e, pageId) {
  e.stopPropagation();
  const page = pages.find(p => p.id === pageId);
  if (!page) return;
  showRenameModal(page);
}

function startRenamePageInline(e, pageId) {
  e.stopPropagation();
  const page = pages.find(p => p.id === pageId);
  if (!page) return;
  showRenameModal(page);
}

function showRenameModal(page) {
  // Mostrar modal de renombrar
  const overlay = document.getElementById('renameModal');
  const input = document.getElementById('renameInput');
  input.value = page.name;
  overlay.classList.add('show');
  input.focus();
  input.select();
  document.getElementById('renameConfirmBtn').onclick = function() {
    const newName = input.value.trim().replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    if (!newName) return;
    page.name = newName;
    overlay.classList.remove('show');
    renderPageBar();
    showToast('Página renombrada: ' + newName + '.html', 'success');
  };
}

function closeRenameModal() {
  document.getElementById('renameModal').classList.remove('show');
}

function reattachCanvasEvents() {
  const frame = document.getElementById('canvasFrame');
  frame.querySelectorAll('.xanda-el').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    el.onclick = function(ev) { selectEl(ev, id); };
    if (['H1','H2','H3','P','SPAN','STRONG','A'].includes(el.tagName)) {
      el.ondblclick = function(ev) { startInlineEdit(ev, id); };
    }
  });
  ['header','main','footer'].forEach(sec => {
    const wrap = document.getElementById('sec-' + sec);
    if (wrap) {
      wrap.ondragover = function(e) { sectionDragOver(e, sec); };
      wrap.ondrop = function(e) { sectionDrop(e, sec); };
      wrap.ondragleave = function(e) { sectionDragLeave(e); };
    }
  });
}

// ═══════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════
function goToBuilder() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('builder').style.display = 'flex';
  saveHistory();
  renderTree();
  showToast('¡Bienvenido al constructor XandA!', 'success');
}

function goToLanding() {
  if(confirm('¿Volver al inicio? Perderás los cambios no guardados.')) {
    window.location.href = 'constructor.html';
  }
}

// ═══════════════════════════════════════
// VIEWPORT
// ═══════════════════════════════════════
function setViewport(vp) {
  viewport = vp;
  ['desktop','tablet','mobile'].forEach(v => {
    document.getElementById('vp-'+v).classList.toggle('active', v === vp);
  });
  const frame = document.getElementById('canvasFrame');
  frame.className = 'canvas-frame ' + vp;
}

function changeZoom(delta) {
  zoom = Math.max(25, Math.min(200, zoom + delta));
  document.getElementById('zoomVal').textContent = zoom + '%';
  document.getElementById('canvasFrame').style.transform = `scale(${zoom/100})`;
  document.getElementById('canvasFrame').style.transformOrigin = 'top center';
}

// ═══════════════════════════════════════
// SECTION TOGGLE
// ═══════════════════════════════════════
function toggleSection(name) {
  sections[name] = !sections[name];
  const btn = document.getElementById('toggle-' + name);
  btn.classList.toggle('active', sections[name]);
  const sec = document.getElementById('sec-' + name);
  sec.classList.toggle('disabled-section', !sections[name]);
  showToast(name.charAt(0).toUpperCase() + name.slice(1) + (sections[name] ? ' activado' : ' desactivado'));
}

// ═══════════════════════════════════════
// ELEMENT DRAG & DROP
// ═══════════════════════════════════════
function elDragStart(e, type) {
  dragType = type;
  e.dataTransfer.setData('text/plain', type);
  e.dataTransfer.effectAllowed = 'copy';
}

function sectionDragOver(e, section) {
  e.preventDefault(); e.stopPropagation();
  dropTarget = section;
  e.currentTarget.classList.add('drag-over');
}
function sectionDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
  dropTarget = null;
}
function sectionDrop(e, section) {
  e.preventDefault(); e.stopPropagation();
  e.currentTarget.classList.remove('drag-over');
  if (!dragType) return;
  const target = document.getElementById('xanda-' + section);
  if (!target) return;
  addElement(dragType, target);
  dragType = null;
  renderTree();
  saveHistory();
}
function canvasDragOver(e) { e.preventDefault(); }
function canvasDrop(e) { e.preventDefault(); }
function canvasDragLeave(e) {}

// ═══════════════════════════════════════
// ADD ELEMENT
// ═══════════════════════════════════════
function addElement(type, parent) {
  elCounter++;
  const id = 'el-' + elCounter;
  let el;
  const defaults = getElementDefaults(type, id);
  el = document.createElement(type === 'input' || type === 'img' || type === 'hr' || type === 'iframe' ? type : type);
  el.className = 'xanda-el';
  el.dataset.id = id;
  el.onclick = function(ev) { selectEl(ev, id); };
  // Apply styles
  Object.assign(el.style, defaults.style || {});
  // Add toolbar
  const toolbar = createToolbar(id, type, ['edit','duplicate','delete']);
  el.appendChild(toolbar);
  // Set content
  if (defaults.content !== undefined && type !== 'input' && type !== 'img' && type !== 'hr' && type !== 'iframe') {
    el.appendChild(document.createTextNode(defaults.content));
  }
  if (type === 'img') {
    el.src = 'https://via.placeholder.com/400x250/6B5CE7/FFFFFF?text=Imagen';
    el.alt = 'imagen';
    el.style.maxWidth = '100%'; el.style.display = 'block';
  }
  if (type === 'input') {
    el.placeholder = 'Escribe aquí...';
    el.style.width = '100%'; el.style.padding = '10px 14px';
    el.style.border = '1.5px solid #E2DEFF'; el.style.borderRadius = '8px';
    el.style.fontFamily = 'inherit'; el.style.fontSize = '14px';
    el.onclick = function(ev) { ev.stopPropagation(); selectEl(ev, id); };
  }
  if (type === 'hr') {
    el.style.border = 'none'; el.style.borderTop = '1.5px solid #E2DEFF';
    el.style.margin = '20px 0';
  }
  if (type === 'ul') {
    const li1 = document.createElement('li');
    li1.textContent = 'Elemento 1';
    const li2 = document.createElement('li');
    li2.textContent = 'Elemento 2';
    el.appendChild(li1); el.appendChild(li2);
    el.style.paddingLeft = '20px';
  }
  if (type === 'h1' || type === 'h2' || type === 'h3' || type === 'p' || type === 'span' || type === 'strong' || type === 'a') {
    el.ondblclick = function(ev) { startInlineEdit(ev, id); };
    const tBtn = toolbar.querySelector('.el-tool-btn');
    if (tBtn) tBtn.onclick = function(ev) { startInlineEdit(ev, id); };
  }
  if (type === 'button') {
    el.type = 'button';
    el.addEventListener('click', function(ev) { if (!ev.shiftKey) selectEl(ev, id); });
  }
  if (type === 'iframe') {
    el.src = 'https://www.google.com/maps/embed';
    el.style.width = '100%'; el.style.height = '200px'; el.style.border = 'none';
    el.style.borderRadius = '8px';
  }
  parent.appendChild(el);
  selectEl({ stopPropagation: ()=>{} }, id);
  showToast('<' + type + '> agregado');
}

function getElementDefaults(type, id) {
  const map = {
    div:     { content: '', style: { padding: '20px', border: '1px dashed #C9C3F5', borderRadius: '8px', minHeight: '60px' } },
    section: { content: '', style: { padding: '40px 32px', background: '#F8F7FF', minHeight: '80px' } },
    article: { content: '', style: { padding: '24px', background: '#fff', border: '1px solid #E2DEFF', borderRadius: '10px' } },
    nav:     { content: '', style: { display: 'flex', gap: '20px', padding: '12px 0' } },
    aside:   { content: '', style: { width: '240px', padding: '20px', background: '#F4F2FF', borderRadius: '8px' } },
    ul:      { content: '', style: { marginBottom: '16px' } },
    h1:      { content: 'Título Principal', style: { fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', marginBottom: '16px', color: '#1A1633' } },
    h2:      { content: 'Subtítulo', style: { fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: '700', marginBottom: '12px', color: '#1A1633' } },
    h3:      { content: 'Encabezado 3', style: { fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: '700', marginBottom: '10px', color: '#1A1633' } },
    p:       { content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.', style: { fontSize: 'clamp(14px, 1.5vw, 16px)', lineHeight: '1.7', color: '#5B5379', marginBottom: '16px' } },
    span:    { content: 'Texto en línea', style: { fontSize: '14px', color: '#5B5379' } },
    strong:  { content: 'Texto importante', style: { fontWeight: '700', color: '#1A1633' } },
    a:       { content: 'Enlace aquí', style: { color: '#6B5CE7', fontWeight: '600', textDecoration: 'none', fontSize: '14px' } },
    button:  { content: 'Botón', style: { background: '#6B5CE7', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '50px', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer' } },
    input:   { style: {} },
    textarea:{ content: '', style: { width: '100%', padding: '12px 14px', border: '1.5px solid #E2DEFF', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', minHeight: '80px', resize: 'vertical' } },
    img:     { style: {} },
    video:   { content: '', style: { width: '100%', background: '#1A1633', borderRadius: '8px', minHeight: '160px', display: 'block' } },
    hr:      { style: {} },
    iframe:  { style: {} },
  };
  return map[type] || { content: '', style: {} };
}

// Tags que no permiten block-level children: el toolbar debe ser span
const INLINE_TAGS = new Set(['p','h1','h2','h3','h4','h5','h6','button','a','span','strong','em','label','li','td','th','dt','dd']);

function createToolbar(id, type, actions) {
  const tb = document.createElement(INLINE_TAGS.has(type) ? 'span' : 'div');
  tb.className = 'el-toolbar';
  const lbl = document.createElement('span');
  lbl.className = 'el-tool-label';
  lbl.textContent = type;
  tb.appendChild(lbl);
  if (actions.includes('edit')) {
    const btn = document.createElement('button');
    btn.className = 'el-tool-btn';
    btn.title = 'Editar texto';
    btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    btn.onclick = function(ev) { startInlineEdit(ev, id); };
    tb.appendChild(btn);
  }
  if (actions.includes('duplicate')) {
    const btn = document.createElement('button');
    btn.className = 'el-tool-btn';
    btn.title = 'Duplicar';
    btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
    btn.onclick = function(ev) { duplicateEl(ev, id); };
    tb.appendChild(btn);
  }
  if (actions.includes('delete')) {
    const btn = document.createElement('button');
    btn.className = 'el-tool-btn danger';
    btn.title = 'Eliminar';
    btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    btn.onclick = function(ev) { deleteEl(ev, id); };
    tb.appendChild(btn);
  }
  return tb;
}

// ═══════════════════════════════════════
// ELEMENT SELECTION
// ═══════════════════════════════════════
function selectEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  // Deselect previous
  if (selectedElId) {
    const prev = document.querySelector('[data-id="'+selectedElId+'"]');
    if (prev) prev.classList.remove('selected');
  }
  selectedElId = id;
  const el = document.querySelector('[data-id="'+id+'"]');
  if (el) el.classList.add('selected');
  renderRightPanel(id, el);
}

// Deselect on canvas click
document.addEventListener('click', function(e) {
  if (!e.target.closest('.xanda-el') && !e.target.closest('.panel-right') && !e.target.closest('.add-popover')) {
    if (selectedElId) {
      const prev = document.querySelector('[data-id="'+selectedElId+'"]');
      if (prev) prev.classList.remove('selected');
      selectedElId = null;
      renderRightPanel(null, null);
    }
    document.getElementById('addPopover').classList.remove('show');
  }
});

// ═══════════════════════════════════════
// INLINE EDITING (Photoshop-style dblclick)
// ═══════════════════════════════════════
function startInlineEdit(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (e && e.preventDefault) e.preventDefault();
  const el = document.querySelector('[data-id="'+id+'"]');
  if (!el) return;
  const tag = el.tagName.toLowerCase();
  if (['input','img','hr','iframe','video'].includes(tag)) return;
  el.contentEditable = 'true';
  el.focus();
  // Move cursor to end
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  el.addEventListener('blur', function finishEdit() {
    el.contentEditable = 'false';
    saveHistory();
    el.removeEventListener('blur', finishEdit);
  }, { once: true });
  el.addEventListener('keydown', function keyEdit(ev) {
    if (ev.key === 'Escape') { el.contentEditable = 'false'; el.removeEventListener('keydown', keyEdit); }
  });
}

function dblEditEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  startInlineEdit(e, id);
}

// ═══════════════════════════════════════
// DUPLICATE & DELETE
// ═══════════════════════════════════════
function duplicateEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  const el = document.querySelector('[data-id="'+id+'"]');
  if (!el || !el.parentNode) return;
  const clone = el.cloneNode(true);
  elCounter++;
  const newId = 'el-' + elCounter;
  clone.dataset.id = newId;
  clone.classList.remove('selected');
  clone.onclick = function(ev) { selectEl(ev, newId); };
  el.parentNode.insertBefore(clone, el.nextSibling);
  renderTree();
  saveHistory();
  showToast('Elemento duplicado');
}

function deleteEl(e, id) {
  if (e && e.stopPropagation) e.stopPropagation();
  const el = document.querySelector('[data-id="'+id+'"]');
  if (!el) return;
  el.remove();
  if (selectedElId === id) {
    selectedElId = null;
    renderRightPanel(null, null);
  }
  renderTree();
  saveHistory();
  showToast('Elemento eliminado');
}

function addChildEl(e, parentId) {
  if (e && e.stopPropagation) e.stopPropagation();
  const parent = document.querySelector('[data-id="'+parentId+'"]');
  if (!parent) return;
  showAddPopover(e, parent);
}

// ═══════════════════════════════════════
// ADD POPOVER
// ═══════════════════════════════════════
const addTypes = [
  { type: 'div', label: 'Contenedor (div)', icon: 'fa-regular fa-square' },
  { type: 'h1', label: 'Título H1', icon: 'fa-solid fa-heading' },
  { type: 'h2', label: 'Título H2', icon: 'fa-solid fa-h' },
  { type: 'h3', label: 'Título H3', icon: 'fa-solid fa-text-height' },
  { type: 'p', label: 'Párrafo', icon: 'fa-solid fa-paragraph' },
  { type: 'button', label: 'Botón', icon: 'fa-solid fa-computer-mouse' },
  { type: 'a', label: 'Enlace', icon: 'fa-solid fa-link' },
  { type: 'img', label: 'Imagen', icon: 'fa-solid fa-image' },
  { type: 'input', label: 'Input', icon: 'fa-solid fa-input-text' },
  { type: 'span', label: 'Span', icon: 'fa-solid fa-font' },
];

function showAddPopover(e, parent) {
  const pop = document.getElementById('addPopover');
  const list = document.getElementById('addPopoverList');
  list.innerHTML = '';
  addTypes.forEach(({ type, label, icon }) => {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>${label}`;
    btn.onclick = function() {
      addElement(type, parent);
      pop.classList.remove('show');
      renderTree();
      saveHistory();
    };
    list.appendChild(btn);
  });
  const rect = e.target.getBoundingClientRect();
  const frame = document.getElementById('canvasWrap').getBoundingClientRect();
  pop.style.left = (rect.left - frame.left + 16) + 'px';
  pop.style.top = (rect.top - frame.top + 24) + 'px';
  pop.classList.add('show');
}

// ═══════════════════════════════════════
// RIGHT PANEL - PROPERTIES
// ═══════════════════════════════════════
function switchRTab(idx) {
  activeRTab = idx;
  document.querySelectorAll('.rtab').forEach((t,i) => t.classList.toggle('active', i === idx));
  if (selectedElId) {
    const el = document.querySelector('[data-id="'+selectedElId+'"]');
    renderRightPanel(selectedElId, el);
  }
}

function renderRightPanel(id, el) {
  const title = document.getElementById('rightTitle');
  const subtitle = document.getElementById('rightSubtitle');
  const scroll = document.getElementById('rightScroll');
  const rtabs = document.getElementById('rtabs');
  if (!id || !el) {
    title.textContent = 'Propiedades';
    subtitle.textContent = 'Selecciona un elemento para editar';
    rtabs.style.display = 'none';
    scroll.innerHTML = `<div class="no-selection"><i class="fa-solid fa-arrow-pointer"></i><p>Haz clic en cualquier elemento del canvas para editar sus propiedades de estilo.</p></div>`;
    return;
  }
  const tag = el.tagName.toLowerCase();
  title.textContent = '<' + tag + '>';
  subtitle.textContent = id;
  rtabs.style.display = 'flex';
  const s = el.style;
  if (activeRTab === 0) renderStyleTab(el, s, scroll);
  else if (activeRTab === 1) renderTypoTab(el, s, scroll);
  else if (activeRTab === 2) renderSpacingTab(el, s, scroll);
}

function renderStyleTab(el, s, scroll) {
  const tag = el.tagName.toLowerCase();
  const isImg = tag === 'img';
  const isVideo = tag === 'video';
  const isAnchor = tag === 'a';
  const isMedia = isImg || isVideo;

  const mediaSection = isImg ? `
    <div class="prop-section">
      <div class="prop-title"><i class="fa-solid fa-image"></i>Imagen</div>
      <div class="prop-row">
        <span class="prop-label">URL / src</span>
        <input class="prop-input" type="text" placeholder="https://…/imagen.jpg" value="${el.getAttribute('src')||''}" onchange="applyAttr('src',this.value)">
      </div>
      <div class="prop-row">
        <span class="prop-label">Alt text</span>
        <input class="prop-input" type="text" placeholder="Descripción…" value="${el.getAttribute('alt')||''}" onchange="applyAttr('alt',this.value)">
      </div>
      <div class="prop-row">
        <span class="prop-label">Object fit</span>
        <select class="prop-select" onchange="applyStyle('objectFit',this.value)">
          <option value="" ${!s.objectFit?'selected':''}>—</option>
          <option value="cover" ${s.objectFit==='cover'?'selected':''}>Cover</option>
          <option value="contain" ${s.objectFit==='contain'?'selected':''}>Contain</option>
          <option value="fill" ${s.objectFit==='fill'?'selected':''}>Fill</option>
        </select>
      </div>
    </div>` : isVideo ? `
    <div class="prop-section">
      <div class="prop-title"><i class="fa-solid fa-film"></i>Video</div>
      <div class="prop-row">
        <span class="prop-label">URL / src</span>
        <input class="prop-input" type="text" placeholder="https://…/video.mp4" value="${el.getAttribute('src')||''}" onchange="applyAttr('src',this.value)">
      </div>
      <div class="prop-row" style="flex-wrap:wrap;gap:8px">
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer"><input type="checkbox" ${el.hasAttribute('controls')?'checked':''} onchange="applyToggleAttr('controls',this.checked)"> Controles</label>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer"><input type="checkbox" ${el.hasAttribute('autoplay')?'checked':''} onchange="applyToggleAttr('autoplay',this.checked)"> Autoplay</label>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer"><input type="checkbox" ${el.hasAttribute('loop')?'checked':''} onchange="applyToggleAttr('loop',this.checked)"> Loop</label>
        <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--xanda-text2);cursor:pointer"><input type="checkbox" ${el.hasAttribute('muted')?'checked':''} onchange="applyToggleAttr('muted',this.checked)"> Muted</label>
      </div>
    </div>` : '';

  const anchorSection = isAnchor ? `
    <div class="prop-section">
      <div class="prop-title"><i class="fa-solid fa-link"></i>Enlace</div>
      <div class="prop-row">
        <span class="prop-label">URL (href)</span>
        <input class="prop-input" type="text" placeholder="https://…" value="${el.getAttribute('href')||''}" onchange="applyAttr('href',this.value)">
      </div>
      <div class="prop-row">
        <span class="prop-label">Target</span>
        <select class="prop-select" onchange="applyAttr('target',this.value)">
          <option value="" ${!el.getAttribute('target')?'selected':''}>Misma pestaña</option>
          <option value="_blank" ${el.getAttribute('target')==='_blank'?'selected':''}>Nueva pestaña</option>
        </select>
      </div>
    </div>` : '';

  scroll.innerHTML = `
    <div class="rtab-panel active">
      ${mediaSection}
      ${anchorSection}
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-ruler-combined"></i>Dimensiones (clamp)</div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--xanda-text2);margin-bottom:4px">Ancho</div>
          <div class="clamp-labels"><span>Min</span><span>vw</span><span>Max</span></div>
          <div class="clamp-group">
            <input type="text" id="w-min" placeholder="200px" value="${parseClamp(s.width,'min')}" onchange="applyClamp('width')">
            <input type="text" id="w-vw" placeholder="50vw" value="${parseClamp(s.width,'mid')}" onchange="applyClamp('width')">
            <input type="text" id="w-max" placeholder="800px" value="${parseClamp(s.width,'max')}" onchange="applyClamp('width')">
          </div>
        </div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--xanda-text2);margin-bottom:4px">Alto</div>
          <div class="clamp-labels"><span>Min</span><span>vh</span><span>Max</span></div>
          <div class="clamp-group">
            <input type="text" id="h-min" placeholder="auto" value="${parseClamp(s.height,'min')}" onchange="applyClamp('height')">
            <input type="text" id="h-vw" placeholder="30vh" value="${parseClamp(s.height,'mid')}" onchange="applyClamp('height')">
            <input type="text" id="h-max" placeholder="600px" value="${parseClamp(s.height,'max')}" onchange="applyClamp('height')">
          </div>
        </div>
      </div>
      ${!isMedia ? `
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-fill-drip"></i>Fondo</div>
        <div class="color-preview-row">
          <div class="color-swatch" id="bg-swatch" style="background:${s.background||s.backgroundColor||'#ffffff'}">
            <input type="color" value="${toHex(s.background||s.backgroundColor||'#ffffff')}" oninput="applyBgColor(this.value,'bg-swatch','bg-hex','bg-rgb','bg-cmyk')">
          </div>
          <input class="color-hex" type="text" id="bg-hex" placeholder="#FFFFFF" value="${toHex(s.background||s.backgroundColor||'#ffffff')}" oninput="applyBgColorHex(this.value,'bg-swatch')">
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
          <div class="prop-row"><span class="prop-label">Color 1</span><div class="color-swatch" style="background:#6B5CE7;width:24px;height:24px"><input type="color" value="#6B5CE7" oninput="applyGradient()"></div></div>
          <div class="prop-row"><span class="prop-label">Color 2</span><div class="color-swatch" style="background:#4F8EF7;width:24px;height:24px"><input type="color" value="#4F8EF7" oninput="applyGradient()"></div></div>
          <div class="prop-row"><span class="prop-label">Ángulo</span><input class="prop-input" type="number" value="135" id="gradAngle" onchange="applyGradient()"></div>
        </div>
      </div>
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-palette"></i>Color de texto</div>
        <div class="color-preview-row">
          <div class="color-swatch" id="tc-swatch" style="background:${s.color||'#1A1633'}">
            <input type="color" value="${toHex(s.color||'#1A1633')}" oninput="applyTextColor(this.value,'tc-swatch','tc-hex')">
          </div>
          <input class="color-hex" type="text" id="tc-hex" placeholder="#1A1633" value="${toHex(s.color||'#1A1633')}" oninput="applyTextColorHex(this.value,'tc-swatch')">
        </div>
        <div class="color-type-tabs">
          <button class="color-type-tab active" onclick="showColorMode('tc','hex',this)">HEX</button>
          <button class="color-type-tab" onclick="showColorMode('tc','rgb',this)">RGB</button>
          <button class="color-type-tab" onclick="showColorMode('tc','cmyk',this)">CMYK</button>
        </div>
        <div class="color-info" id="tc-rgb"></div>
        <div class="color-info" id="tc-cmyk"></div>
      </div>
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-border-all"></i>Borde</div>
        <div class="prop-row"><span class="prop-label">Grosor</span><input class="prop-input" type="text" placeholder="1px" value="${parseBorderWidth(s.border)}" onchange="applyBorder('width',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Estilo</span>
          <select class="prop-select" onchange="applyBorder('style',this.value)">
            <option value="none" ${parseBorderStyle(s.border)==='none'?'selected':''}>Ninguno</option>
            <option value="solid" ${parseBorderStyle(s.border)==='solid'?'selected':''}>Sólido</option>
            <option value="dashed" ${parseBorderStyle(s.border)==='dashed'?'selected':''}>Discontinuo</option>
            <option value="dotted" ${parseBorderStyle(s.border)==='dotted'?'selected':''}>Punteado</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Color</span><div class="color-swatch" style="width:30px;height:30px;background:${parseBorderColor(s.border)}"><input type="color" value="${parseBorderColor(s.border)}" oninput="applyBorder('color',this.value)"></div></div>
        <div style="font-size:10px;font-weight:700;color:var(--xanda-text3);text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 6px">Border Radius</div>
        <div class="border-corners">
          <div class="border-corner"><label>↖ TL</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius,'tl')}" onchange="applyRadius('tl',this.value)"></div>
          <div class="border-corner"><label>↗ TR</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius,'tr')}" onchange="applyRadius('tr',this.value)"></div>
          <div class="border-corner"><label>↙ BL</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius,'bl')}" onchange="applyRadius('bl',this.value)"></div>
          <div class="border-corner"><label>↘ BR</label><input type="text" placeholder="0px" value="${parseRadiusCorner(s.borderRadius,'br')}" onchange="applyRadius('br',this.value)"></div>
        </div>
      </div>
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-table-columns"></i>Layout / Flexbox</div>
        <div class="prop-row"><span class="prop-label">Display</span>
          <select class="prop-select" onchange="applyStyle('display',this.value)">
            <option value="block" ${s.display==='block'?'selected':''}>Block</option>
            <option value="flex" ${s.display==='flex'?'selected':''}>Flex</option>
            <option value="grid" ${s.display==='grid'?'selected':''}>Grid</option>
            <option value="inline" ${s.display==='inline'?'selected':''}>Inline</option>
            <option value="inline-block" ${s.display==='inline-block'?'selected':''}>Inline-block</option>
            <option value="none" ${s.display==='none'?'selected':''}>None</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Dirección</span>
          <div class="flex-row">
            <button onclick="applyStyle('flexDirection','row')" class="${s.flexDirection==='row'?'active':''}">→ Row</button>
            <button onclick="applyStyle('flexDirection','column')" class="${s.flexDirection==='column'?'active':''}">↓ Col</button>
          </div>
        </div>
        <div class="prop-row"><span class="prop-label">Alineación X</span>
          <select class="prop-select" onchange="applyStyle('justifyContent',this.value)">
            <option value="">—</option>
            <option value="flex-start" ${s.justifyContent==='flex-start'?'selected':''}>Inicio</option>
            <option value="center" ${s.justifyContent==='center'?'selected':''}>Centro</option>
            <option value="flex-end" ${s.justifyContent==='flex-end'?'selected':''}>Fin</option>
            <option value="space-between" ${s.justifyContent==='space-between'?'selected':''}>Space between</option>
            <option value="space-around" ${s.justifyContent==='space-around'?'selected':''}>Space around</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Alineación Y</span>
          <select class="prop-select" onchange="applyStyle('alignItems',this.value)">
            <option value="">—</option>
            <option value="flex-start" ${s.alignItems==='flex-start'?'selected':''}>Inicio</option>
            <option value="center" ${s.alignItems==='center'?'selected':''}>Centro</option>
            <option value="flex-end" ${s.alignItems==='flex-end'?'selected':''}>Fin</option>
            <option value="stretch" ${s.alignItems==='stretch'?'selected':''}>Stretch</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Gap</span><input class="prop-input" type="text" placeholder="0px" value="${s.gap||''}" onchange="applyStyle('gap',this.value)"></div>
      </div>
      ` : ''}
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-circle-half-stroke"></i>Efectos</div>
        <div class="prop-row"><span class="prop-label">Opacidad</span><input class="prop-input" type="range" min="0" max="1" step="0.01" value="${s.opacity||1}" oninput="applyStyle('opacity',this.value);this.title=Math.round(this.value*100)+'%'"></div>
        <div class="prop-row"><span class="prop-label">Box shadow</span><input class="prop-input" type="text" placeholder="0 4px 20px rgba(0,0,0,0.1)" value="${s.boxShadow||''}" onchange="applyStyle('boxShadow',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Overflow</span>
          <select class="prop-select" onchange="applyStyle('overflow',this.value)">
            <option value="" ${!s.overflow?'selected':''}>Auto</option>
            <option value="hidden" ${s.overflow==='hidden'?'selected':''}>Hidden</option>
            <option value="scroll" ${s.overflow==='scroll'?'selected':''}>Scroll</option>
            <option value="visible" ${s.overflow==='visible'?'selected':''}>Visible</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Cursor</span>
          <select class="prop-select" onchange="applyStyle('cursor',this.value)">
            <option value="" ${!s.cursor?'selected':''}>Default</option>
            <option value="pointer" ${s.cursor==='pointer'?'selected':''}>Pointer</option>
            <option value="text" ${s.cursor==='text'?'selected':''}>Text</option>
            <option value="not-allowed" ${s.cursor==='not-allowed'?'selected':''}>Not-allowed</option>
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

function renderTypoTab(el, s, scroll) {
  scroll.innerHTML = `
    <div class="rtab-panel active">
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-font"></i>Tipografía</div>
        <div class="font-preview" id="fontPreview">${el.tagName}</div>
        <div class="prop-row">
          <span class="prop-label">Fuente</span>
          <select class="prop-select" onchange="applyStyle('fontFamily',this.value);updateFontPreview()">
            ${['Inter','Roboto','Open Sans','Montserrat','Lato','Poppins','Raleway','Playfair Display','Georgia','Arial','Helvetica Neue','Times New Roman','Courier New'].map(f=>`<option value="${f}" ${(s.fontFamily||'').includes(f)?'selected':''}>${f}</option>`).join('')}
          </select>
        </div>
        <div style="margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;color:var(--xanda-text2);margin-bottom:4px">Tamaño (clamp responsivo)</div>
          <div class="clamp-labels"><span>Min</span><span>vw</span><span>Max</span></div>
          <div class="clamp-group">
            <input type="text" id="fs-min" placeholder="14px" value="${parseClamp(s.fontSize,'min')}" onchange="applyClamp('fontSize')">
            <input type="text" id="fs-vw" placeholder="2vw" value="${parseClamp(s.fontSize,'mid')}" onchange="applyClamp('fontSize')">
            <input type="text" id="fs-max" placeholder="20px" value="${parseClamp(s.fontSize,'max')}" onchange="applyClamp('fontSize')">
          </div>
        </div>
        <div class="prop-row">
          <span class="prop-label">Peso</span>
          <select class="prop-select" onchange="applyStyle('fontWeight',this.value)">
            ${['300','400','500','600','700','800','900'].map(w=>`<option value="${w}" ${s.fontWeight===w?'selected':''}>${w}</option>`).join('')}
          </select>
        </div>
        <div class="prop-row">
          <span class="prop-label">Estilo</span>
          <div class="flex-row">
            <button onclick="applyStyle('fontStyle','normal')" class="${s.fontStyle!=='italic'?'active':''}">Normal</button>
            <button onclick="applyStyle('fontStyle','italic')" class="${s.fontStyle==='italic'?'active':''}"><i>Cursiva</i></button>
          </div>
        </div>
        <div class="prop-row">
          <span class="prop-label">Decoración</span>
          <div class="flex-row">
            <button onclick="applyStyle('textDecoration','none')" class="${!s.textDecoration||s.textDecoration==='none'?'active':''}">Ninguna</button>
            <button onclick="applyStyle('textDecoration','underline')" class="${s.textDecoration==='underline'?'active':''}"><u>Sub.</u></button>
            <button onclick="applyStyle('textDecoration','line-through')" class="${s.textDecoration==='line-through'?'active':''}"><s>Tach.</s></button>
          </div>
        </div>
        <div class="prop-row">
          <span class="prop-label">Alineación</span>
          <div class="flex-row">
            <button onclick="applyStyle('textAlign','left')" class="${s.textAlign==='left'||!s.textAlign?'active':''}"><i class="fa-solid fa-align-left"></i></button>
            <button onclick="applyStyle('textAlign','center')" class="${s.textAlign==='center'?'active':''}"><i class="fa-solid fa-align-center"></i></button>
            <button onclick="applyStyle('textAlign','right')" class="${s.textAlign==='right'?'active':''}"><i class="fa-solid fa-align-right"></i></button>
            <button onclick="applyStyle('textAlign','justify')" class="${s.textAlign==='justify'?'active':''}"><i class="fa-solid fa-align-justify"></i></button>
          </div>
        </div>
        <div class="prop-row">
          <span class="prop-label">Line height</span>
          <input class="prop-input" type="number" step="0.1" placeholder="1.5" value="${s.lineHeight||1.5}" onchange="applyStyle('lineHeight',this.value)">
        </div>
        <div class="prop-row">
          <span class="prop-label">Espaciado</span>
          <input class="prop-input" type="text" placeholder="0px" value="${s.letterSpacing||''}" onchange="applyStyle('letterSpacing',this.value)">
        </div>
        <div class="prop-row">
          <span class="prop-label">Transform</span>
          <select class="prop-select" onchange="applyStyle('textTransform',this.value)">
            <option value="">Normal</option>
            <option value="uppercase" ${s.textTransform==='uppercase'?'selected':''}>MAYÚSCULAS</option>
            <option value="lowercase" ${s.textTransform==='lowercase'?'selected':''}>minúsculas</option>
            <option value="capitalize" ${s.textTransform==='capitalize'?'selected':''}>Capitalizar</option>
          </select>
        </div>
      </div>
    </div>
  `;
  // Set font preview
  const fp = document.getElementById('fontPreview');
  if (fp) {
    fp.style.fontFamily = s.fontFamily || 'Inter';
    fp.style.fontSize = '22px';
    fp.style.fontWeight = s.fontWeight || '600';
    fp.style.fontStyle = s.fontStyle || 'normal';
    fp.textContent = 'AaBbCcDd 123';
  }
}

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
          <div><label>Margin Top</label><input type="text" placeholder="0px" value="${s.marginTop||s.margin||''}" onchange="applyStyle('marginTop',this.value)"></div>
          <div><label>Margin Right</label><input type="text" placeholder="0px" value="${s.marginRight||''}" onchange="applyStyle('marginRight',this.value)"></div>
          <div><label>Margin Bottom</label><input type="text" placeholder="0px" value="${s.marginBottom||''}" onchange="applyStyle('marginBottom',this.value)"></div>
          <div><label>Margin Left</label><input type="text" placeholder="0px" value="${s.marginLeft||''}" onchange="applyStyle('marginLeft',this.value)"></div>
          <div><label>Padding Top</label><input type="text" placeholder="0px" value="${s.paddingTop||''}" onchange="applyStyle('paddingTop',this.value)"></div>
          <div><label>Padding Right</label><input type="text" placeholder="0px" value="${s.paddingRight||''}" onchange="applyStyle('paddingRight',this.value)"></div>
          <div><label>Padding Bottom</label><input type="text" placeholder="0px" value="${s.paddingBottom||''}" onchange="applyStyle('paddingBottom',this.value)"></div>
          <div><label>Padding Left</label><input type="text" placeholder="0px" value="${s.paddingLeft||''}" onchange="applyStyle('paddingLeft',this.value)"></div>
        </div>
      </div>
      <div class="prop-section">
        <div class="prop-title"><i class="fa-solid fa-up-right-and-down-left-from-center"></i>Posicionamiento</div>
        <div class="prop-row">
          <span class="prop-label">Position</span>
          <select class="prop-select" onchange="applyStyle('position',this.value)">
            <option value="" ${!s.position?'selected':''}>Static</option>
            <option value="relative" ${s.position==='relative'?'selected':''}>Relative</option>
            <option value="absolute" ${s.position==='absolute'?'selected':''}>Absolute</option>
            <option value="sticky" ${s.position==='sticky'?'selected':''}>Sticky</option>
          </select>
        </div>
        <div class="prop-row"><span class="prop-label">Top</span><input class="prop-input" type="text" placeholder="auto" value="${s.top||''}" onchange="applyStyle('top',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Right</span><input class="prop-input" type="text" placeholder="auto" value="${s.right||''}" onchange="applyStyle('right',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Bottom</span><input class="prop-input" type="text" placeholder="auto" value="${s.bottom||''}" onchange="applyStyle('bottom',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Left</span><input class="prop-input" type="text" placeholder="auto" value="${s.left||''}" onchange="applyStyle('left',this.value)"></div>
        <div class="prop-row"><span class="prop-label">Z-index</span><input class="prop-input" type="number" placeholder="0" value="${s.zIndex||''}" onchange="applyStyle('zIndex',this.value)"></div>
      </div>
    </div>
  `;
}

function updateFontPreview() {
  const fp = document.getElementById('fontPreview');
  if (!fp || !selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  fp.style.fontFamily = el.style.fontFamily;
  fp.style.fontWeight = el.style.fontWeight;
  fp.style.fontStyle = el.style.fontStyle;
}

// ═══════════════════════════════════════
// STYLE APPLICATORS
// ═══════════════════════════════════════
function applyStyle(prop, val) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  el.style[prop] = val;
  saveHistory();
}

function applyAttr(attr, val) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  el.setAttribute(attr, val);
  saveHistory();
}

function applyToggleAttr(attr, on) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  if (on) el.setAttribute(attr, ''); else el.removeAttribute(attr);
  saveHistory();
}

function applyClamp(prop) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  let prefix = '';
  if (prop === 'width') prefix = 'w';
  else if (prop === 'height') prefix = 'h';
  else if (prop === 'fontSize') prefix = 'fs';
  const minEl = document.getElementById(prefix + '-min');
  const vwEl = document.getElementById(prefix + '-vw');
  const maxEl = document.getElementById(prefix + '-max');
  if (!minEl || !vwEl || !maxEl) return;
  const min = minEl.value.trim();
  const mid = vwEl.value.trim();
  const max = maxEl.value.trim();
  if (min && mid && max) {
    el.style[prop] = `clamp(${min}, ${mid}, ${max})`;
  } else if (min) {
    el.style[prop] = min;
  }
  saveHistory();
}

function parseClamp(val, part) {
  if (!val) return '';
  const m = val.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
  if (m) {
    if (part === 'min') return m[1].trim();
    if (part === 'mid') return m[2].trim();
    if (part === 'max') return m[3].trim();
  }
  if (part === 'min') return val;
  return '';
}

// Color helpers
function toHex(color) {
  if (!color) return '#ffffff';
  if (color.startsWith('#')) return color.length === 7 ? color : '#ffffff';
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    return '#' + [m[1],m[2],m[3]].map(x => parseInt(x).toString(16).padStart(2,'0')).join('');
  }
  return '#ffffff';
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function rgbToCmyk(r,g,b) {
  const rr = r/255; const gg = g/255; const bb = b/255;
  const k = 1 - Math.max(rr,gg,bb);
  if (k === 1) return { c:0,m:0,y:0,k:100 };
  const c = Math.round((1-rr-k)/(1-k)*100);
  const m = Math.round((1-gg-k)/(1-k)*100);
  const y = Math.round((1-bb-k)/(1-k)*100);
  return { c,m,y, k: Math.round(k*100) };
}

function hexToHsl(hex) {
  let {r,g,b} = hexToRgb(hex);
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0}else{
    const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}
    h/=6;
  }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}

function updateColorInfos(prefix, hex) {
  const rgbEl = document.getElementById(prefix+'-rgb');
  const cmykEl = document.getElementById(prefix+'-cmyk');
  const hslEl = document.getElementById(prefix+'-hsl');
  if (!hex || hex.length < 7) return;
  const {r,g,b} = hexToRgb(hex);
  const {c,m,y,k} = rgbToCmyk(r,g,b);
  const {h,s,l} = hexToHsl(hex);
  if(rgbEl) rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
  if(cmykEl) cmykEl.textContent = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
  if(hslEl) hslEl.textContent = `hsl(${h}°, ${s}%, ${l}%)`;
}

function showColorMode(prefix, mode, btn) {
  btn.parentElement.querySelectorAll('.color-type-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['rgb','cmyk','hsl'].forEach(m => {
    const el = document.getElementById(prefix+'-'+m);
    if (el) el.style.display = m === mode ? 'block' : 'none';
  });
}

function applyBgColor(val, swatchId, hexId, rgbId, cmykId) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  el.style.background = val;
  el.style.backgroundColor = val;
  const sw = document.getElementById(swatchId);
  if (sw) sw.style.background = val;
  const hx = document.getElementById(hexId);
  if (hx) hx.value = val;
  updateColorInfos(prefix, val);
  saveHistory();
}

function applyBgColorHex(val, swatchId) {
  if (!selectedElId) return;
  if (!/^#[0-9A-Fa-f]{6}$/.test(val)) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  el.style.background = val;
  const sw = document.getElementById(swatchId);
  if (sw) sw.style.background = val;
  updateColorInfos('bg', val);
  saveHistory();
}

function applyTextColor(val, swatchId, hexId) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  el.style.color = val;
  const sw = document.getElementById(swatchId);
  if (sw) sw.style.background = val;
  const hx = document.getElementById(hexId);
  if (hx) hx.value = val;
  updateColorInfos('tc', val);
  saveHistory();
}

function applyTextColorHex(val, swatchId) {
  if (!selectedElId) return;
  if (!/^#[0-9A-Fa-f]{6}$/.test(val)) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  el.style.color = val;
  const sw = document.getElementById(swatchId);
  if (sw) sw.style.background = val;
  updateColorInfos('tc', val);
  saveHistory();
}

function toggleGradient(on) {
  const ctrl = document.getElementById('gradientControls');
  if (ctrl) ctrl.style.display = on ? 'flex' : 'none';
  if (!on && selectedElId) {
    const el = document.querySelector('[data-id="'+selectedElId+'"]');
    if (el) {
      const bgHex = document.getElementById('bg-hex');
      if (bgHex) { el.style.background = bgHex.value; }
    }
  }
}

function applyGradient() {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  const c1 = document.querySelector('#gradientControls input[type=color]:first-of-type');
  const c2 = document.querySelectorAll('#gradientControls input[type=color]')[1];
  const angle = document.getElementById('gradAngle');
  if (c1 && c2 && angle) {
    el.style.background = `linear-gradient(${angle.value}deg, ${c1.value}, ${c2.value})`;
  }
}

function applyBorder(aspect, val) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  const cur = el.style.border || '1px solid #E2DEFF';
  const parts = parseBorderParts(cur);
  if (aspect === 'width') parts.width = val;
  if (aspect === 'style') parts.style = val;
  if (aspect === 'color') parts.color = val;
  if (parts.style === 'none') { el.style.border = 'none'; }
  else { el.style.border = `${parts.width||'1px'} ${parts.style||'solid'} ${parts.color||'#E2DEFF'}`; }
  saveHistory();
}

function parseBorderParts(border) {
  if (!border || border === 'none') return { width:'1px', style:'solid', color:'#E2DEFF' };
  const parts = border.split(' ');
  return { width: parts[0]||'1px', style: parts[1]||'solid', color: parts.slice(2).join(' ')||'#E2DEFF' };
}
function parseBorderWidth(border) { return parseBorderParts(border).width; }
function parseBorderStyle(border) { return parseBorderParts(border).style; }
function parseBorderColor(border) { const c = parseBorderParts(border).color; return toHex(c); }

function applyRadius(corner, val) {
  if (!selectedElId) return;
  const el = document.querySelector('[data-id="'+selectedElId+'"]');
  if (!el) return;
  const map = { tl:'borderTopLeftRadius', tr:'borderTopRightRadius', bl:'borderBottomLeftRadius', br:'borderBottomRightRadius' };
  el.style[map[corner]] = val;
  saveHistory();
}

function parseRadiusCorner(radius, corner) {
  if (!radius) return '';
  const parts = radius.split(' ');
  const map = { tl:0, tr:1, br:2, bl:3 };
  return parts[map[corner]] || parts[0] || '';
}

// ═══════════════════════════════════════
// TREE / LAYERS
// ═══════════════════════════════════════
function renderTree() {
  const tree = document.getElementById('treeList');
  if (!tree) return;
  tree.innerHTML = '';
  ['header','main','footer'].forEach(sec => {
    const container = document.getElementById('xanda-' + sec);
    if (!container) return;
    const secItem = createTreeItem('fa-solid fa-cube', sec.toUpperCase(), null, false);
    secItem.style.fontWeight = '700';
    secItem.style.color = 'var(--xanda-purple)';
    tree.appendChild(secItem);
    const children = document.createElement('div');
    children.className = 'tree-children';
    renderTreeChildren(container, children);
    tree.appendChild(children);
  });
}

function renderTreeChildren(parent, container) {
  parent.querySelectorAll(':scope > .xanda-el').forEach(el => {
    const tag = el.tagName.toLowerCase();
    const id = el.dataset.id;
    const icon = getTagIcon(tag);
    const item = createTreeItem(icon, '<' + tag + '> ' + (id||''), id, true);
    container.appendChild(item);
    const hasChildren = el.querySelectorAll(':scope > .xanda-el').length > 0;
    if (hasChildren) {
      const ch = document.createElement('div');
      ch.className = 'tree-children';
      renderTreeChildren(el, ch);
      container.appendChild(ch);
    }
  });
}

function createTreeItem(icon, label, id, selectable) {
  const item = document.createElement('div');
  item.className = 'tree-item' + (id && id === selectedElId ? ' selected' : '');
  item.innerHTML = `<i class="${icon}"></i><span class="tree-label">${label}</span>`;
  if (selectable && id) {
    item.onclick = function() {
      const el = document.querySelector('[data-id="'+id+'"]');
      if (el) selectEl({ stopPropagation: ()=>{} }, id);
      el && el.scrollIntoView({ behavior:'smooth', block:'center' });
    };
  }
  return item;
}

function getTagIcon(tag) {
  const icons = {
    div:'fa-regular fa-square', section:'fa-solid fa-table-cells-large',
    article:'fa-solid fa-file-lines', nav:'fa-solid fa-bars',
    aside:'fa-solid fa-sidebar', ul:'fa-solid fa-list',
    h1:'fa-solid fa-heading', h2:'fa-solid fa-h', h3:'fa-solid fa-text-height',
    p:'fa-solid fa-paragraph', span:'fa-solid fa-font', strong:'fa-solid fa-bold',
    a:'fa-solid fa-link', button:'fa-solid fa-computer-mouse',
    input:'fa-solid fa-input-text', textarea:'fa-solid fa-text-slash',
    img:'fa-solid fa-image', video:'fa-solid fa-film',
    hr:'fa-solid fa-grip-lines', iframe:'fa-solid fa-window-restore',
  };
  return icons[tag] || 'fa-solid fa-circle-dot';
}

// ═══════════════════════════════════════
// PANEL TAB SWITCH
// ═══════════════════════════════════════
function switchPanelTab(idx) {
  activePTab = idx;
  ['elements','layers','styles'].forEach((p,i) => {
    const el = document.getElementById('panel-' + p);
    if (el) el.style.display = i === idx ? 'block' : 'none';
    const tab = document.getElementById('ptab-' + i);
    if (tab) tab.classList.toggle('active', i === idx);
  });
  if (idx === 1) renderTree();
}

// ═══════════════════════════════════════
// HISTORY (UNDO/REDO)
// ═══════════════════════════════════════
function saveHistory() {
  const state = document.getElementById('canvasFrame').innerHTML;
  history = history.slice(0, historyIndex + 1);
  history.push(state);
  historyIndex++;
  if (history.length > 50) { history.shift(); historyIndex--; }
  document.getElementById('undoBtn').disabled = historyIndex <= 0;
  document.getElementById('redoBtn').disabled = historyIndex >= history.length - 1;
}

function undo() {
  if (historyIndex <= 0) return;
  historyIndex--;
  restoreHistory();
}

function redo() {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  restoreHistory();
}

function restoreHistory() {
  const frame = document.getElementById('canvasFrame');
  frame.innerHTML = history[historyIndex];
  // Re-attach events
  frame.querySelectorAll('.xanda-el').forEach(el => {
    const id = el.dataset.id;
    if (!id) return;
    el.onclick = function(ev) { selectEl(ev, id); };
    if (['H1','H2','H3','P','SPAN','STRONG','A'].includes(el.tagName)) {
      el.ondblclick = function(ev) { startInlineEdit(ev, id); };
    }
  });
  // Re-attach section drag/drop
  ['header','main','footer'].forEach(sec => {
    const wrap = document.getElementById('sec-' + sec);
    if (wrap) {
      wrap.ondragover = function(e) { sectionDragOver(e, sec); };
      wrap.ondrop = function(e) { sectionDrop(e, sec); };
      wrap.ondragleave = function(e) { sectionDragLeave(e); };
    }
  });
  selectedElId = null;
  renderRightPanel(null, null);
  renderTree();
  document.getElementById('undoBtn').disabled = historyIndex <= 0;
  document.getElementById('redoBtn').disabled = historyIndex >= history.length - 1;
  showToast(historyIndex < history.length - 1 ? 'Acción deshecha' : 'Acción rehecha');
}

// ═══════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════
function showExport() {
  // Guardar página actual antes de exportar
  const cur = pages.find(p => p.id === currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;

  const mainCSS = generateMainCSS();
  // Mostrar preview del main.css en el modal
  document.getElementById('exportPreview').textContent =
    `/* main.css */\n${mainCSS}\n\n/* ${getCurrentPageName()}.css — estilos inline extraídos del canvas */\n/* (generado al descargar ZIP) */`;
  document.getElementById('exportModal').classList.add('show');
}

function closeExport() {
  document.getElementById('exportModal').classList.remove('show');
}

function getCurrentPageName() {
  const cur = pages.find(p => p.id === currentPageId);
  return cur ? cur.name : 'index';
}

/** Limpia un clon del canvas de todo el markup del builder */
function cleanCanvas(rawHTML) {
  const wrap = document.createElement('div');
  wrap.innerHTML = rawHTML;
  wrap.querySelectorAll('.el-toolbar, .section-label, .empty-drop').forEach(e => e.remove());
  wrap.querySelectorAll('.xanda-el').forEach(e => {
    e.classList.remove('xanda-el', 'selected');
    if (e.classList.length === 0) e.removeAttribute('class');
    e.removeAttribute('data-id');
    e.removeAttribute('contenteditable');
    e.removeAttribute('onclick');
    e.removeAttribute('ondblclick');
  });
  wrap.querySelectorAll('.xanda-section-wrap').forEach(e => {
    ['class','data-section','ondragover','ondrop','ondragleave','id'].forEach(a => {
      // Mantener id solo si es xanda-header/main/footer (lo necesitan los links internos)
      if (a === 'id' && /^sec-/.test(e.id)) e.removeAttribute(a);
      else if (a !== 'id') e.removeAttribute(a);
    });
  });
  return wrap.innerHTML.trim();
}

/** Genera el HTML de una página apuntando a main.css y [name].css */
function buildPageHTML(pageName, bodyHTML) {
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
function generateMainCSS() {
  return `/* ═══════════════════════════════════════════
   main.css — Base compartida · Generado por XandA
   ═══════════════════════════════════════════ */
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

img, video {
  max-width: 100%;
  display: block;
}

a {
  text-decoration: none;
}`;
}

/** CSS específico de una página: extrae los estilos inline y los convierte a clases */
function generatePageCSS(pageName, bodyHTML) {
  const wrap = document.createElement('div');
  wrap.innerHTML = bodyHTML;
  const rules = [];
  rules.push(`/* ${pageName}.css — Estilos de página · Generado por XandA */\n`);
  let classCounter = 1;
  wrap.querySelectorAll('[style]').forEach(el => {
    const cls = `x-${pageName}-${classCounter++}`;
    rules.push(`.${cls} {\n  ${el.getAttribute('style').replace(/;\s*/g, ';\n  ').trim()}\n}`);
    el.removeAttribute('style');
    el.classList.add(cls);
  });
  return rules.join('\n');
}

async function downloadZip() {
  // Guardar página actual
  const cur = pages.find(p => p.id === currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;

  closeExport();
  showToast('Generando ZIP…', 'success');

  // Cargar JSZip dinámicamente
  if (!window.JSZip) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
  }

  const zip = new JSZip();
  const mainCSS = generateMainCSS();
  zip.file('main.css', mainCSS);

  pages.forEach(page => {
    const rawHTML = page.id === currentPageId
      ? document.getElementById('canvasFrame').innerHTML
      : (page.content || '');
    const cleanedBody = cleanCanvas(rawHTML);
    const pageCSS = generatePageCSS(page.name, cleanedBody);
    const pageHTML = buildPageHTML(page.name, cleanedBody);
    zip.file(page.name + '.html', pageHTML);
    zip.file(page.name + '.css', pageCSS);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'xanda-proyecto.zip';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('ZIP descargado ✓', 'success');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ═══════════════════════════════════════
// PREVIEW
// ═══════════════════════════════════════
function previewPage() {
  const cur = pages.find(p => p.id === currentPageId);
  if (cur) cur.content = document.getElementById('canvasFrame').innerHTML;
  const pageName = getCurrentPageName();
  const rawHTML = document.getElementById('canvasFrame').innerHTML;
  const cleanedBody = cleanCanvas(rawHTML);
  const mainCSS = generateMainCSS();
  const pageCSS = generatePageCSS(pageName, cleanedBody);
  // Para preview inline los CSS, ya que no podemos servir archivos locales
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageName} — Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>${mainCSS}\n${pageCSS}</style>
</head>
<body>
${cleanedBody}
</body>
</html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  showToast('Abriendo preview de ' + pageName + '…', 'success');
}

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════
function showToast(msg, type) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.innerHTML = `<i class="fa-solid ${type==='success'?'fa-circle-check':type==='error'?'fa-circle-xmark':'fa-circle-info'}"></i>${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(() => t.remove(), 300); }, 2400);
}

// ═══════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════
document.addEventListener('keydown', function(e) {
  if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedElId) { deleteEl(null, selectedElId); }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    if (selectedElId) duplicateEl(null, selectedElId);
  }
  if (e.key === 'Escape') {
    if (selectedElId) {
      const prev = document.querySelector('[data-id="'+selectedElId+'"]');
      if (prev) prev.classList.remove('selected');
      selectedElId = null;
      renderRightPanel(null, null);
    }
  }
});

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
// Coloring for landing cards hover effect
document.querySelectorAll('.land-card:not(.disabled)').forEach(card => {
  card.addEventListener('mouseenter', () => card.classList.add('active-card'));
  card.addEventListener('mouseleave', () => card.classList.remove('active-card'));
});

window.onload = function() {
  initPages();
  saveHistory();
  renderTree();
  showToast('¡Bienvenido al constructor XandA!', 'success');
};