// ═══════════════════════════════════════════════════════
    // ESTADO GLOBAL
    // ═══════════════════════════════════════════════════════
    let jsonData = null;
    let currentPath = [];
    let addingToPath = null;
    let allExpanded = false;
    let treeSearchQuery = '';

    // Historial (deshacer / rehacer)
    const MAX_HISTORY = 50;
    let historyStack = [];
    let redoStack = [];

    // Autoguardado
    const STORAGE_KEY = 'jsonStudioAutosave_v1';
    let autosaveTimer = null;

    const ICONS = {
        delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
        duplicate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
        up: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`,
        down: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`
    };

    const examples = {
    usuario: {
        id: 1,
        nombre: "María García",
        email: "maria@ejemplo.com",
        activo: true,
        edad: 28,
        rol: null,
        direccion: {
        calle: "Av. Insurgentes 123",
        ciudad: "Ciudad de México",
        cp: "06600"
        },
        habilidades: ["JavaScript", "Python", "Diseño UX"],
        preferencias: {
        tema: "oscuro",
        notificaciones: true,
        idioma: "es"
        },
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
    }
    };

    function showToast(msg, duration = 2200) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.style.display = 'none', duration);
    }

    function openModal(id) { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }

    function switchView(view, el) {
    document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    if (view === 'visual') {
        document.getElementById('panelVisual').classList.add('active');
        renderVisual();
    } else {
        document.getElementById('panelRaw').classList.add('active');
        syncRaw();
    }
    }

    // ═══════════════════════════════════════════════════════
    // CARGA / CREACIÓN DE DOCUMENTOS
    // ═══════════════════════════════════════════════════════
    function hasUnsavedWork() {
    if (jsonData === null) return false;
    if (Array.isArray(jsonData)) return jsonData.length > 0;
    return Object.keys(jsonData).length > 0;
    }

    function confirmDiscard() {
    if (!hasUnsavedWork()) return true;
    return confirm('Esto reemplazará el JSON actual y no podrás deshacerlo. ¿Deseas continuar?');
    }

    function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
        const parsed = JSON.parse(ev.target.result);
        if (!confirmDiscard()) { e.target.value = ''; return; }
        jsonData = parsed;
        historyStack = []; redoStack = [];
        showEditor();
        showToast('✓ Archivo cargado: ' + file.name);
        } catch(err) {
        showToast('Error al parsear JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
    e.target.value = '';
    }

    function newJson(type = 'object') {
    if (!confirmDiscard()) return;
    jsonData = type === 'array' ? [] : {};
    historyStack = []; redoStack = [];
    showEditor();
    showToast('Nuevo JSON creado');
    }

    function loadExample() {
    if (!confirmDiscard()) return;
    jsonData = JSON.parse(JSON.stringify(examples.usuario));
    historyStack = []; redoStack = [];
    showEditor();
    showToast('✓ Ejemplo cargado');
    }

    function showEditor() {
    document.getElementById('welcomeScreen').style.display = 'none';
    const ew = document.getElementById('editorWrapper');
    ew.style.display = 'flex';
    renderVisual();
    renderTree();
    updateStatus();
    updateHistoryButtons();
    scheduleAutosave();
    }

    // ═══════════════════════════════════════════════════════
    // AUTOGUARDADO (localStorage)
    // ═══════════════════════════════════════════════════════
    function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveToLocalStorage, 350);
    }

    function saveToLocalStorage() {
    try {
        if (jsonData === null) { localStorage.removeItem(STORAGE_KEY); return; }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData));
        flashAutosaveIndicator();
    } catch (e) {
        // almacenamiento lleno o no disponible: no interrumpir la edición
        console.warn('No se pudo autoguardar:', e);
    }
    }

    function flashAutosaveIndicator() {
    const el = document.getElementById('autosaveBadge');
    if (!el) return;
    el.textContent = 'Guardado ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    el.classList.add('flash');
    clearTimeout(el._t);
    el._t = setTimeout(() => {
        el.classList.remove('flash');
        el.textContent = 'Autoguardado activo';
    }, 1400);
    }

    function restoreFromLocalStorage() {
    let raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return false; }
    if (!raw) return false;
    try {
        const parsed = JSON.parse(raw);
        jsonData = parsed;
        historyStack = []; redoStack = [];
        showEditor();
        showToast('✓ Se restauró tu trabajo guardado automáticamente');
        return true;
    } catch (e) {
        return false;
    }
    }

    // ═══════════════════════════════════════════════════════
    // HISTORIAL (deshacer / rehacer)
    // ═══════════════════════════════════════════════════════
    function pushHistory() {
    if (jsonData === null) return;
    const snap = JSON.stringify(jsonData);
    if (historyStack.length && historyStack[historyStack.length - 1] === snap) return;
    historyStack.push(snap);
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    redoStack = [];
    updateHistoryButtons();
    }

    function undo() {
    if (!historyStack.length) return;
    redoStack.push(JSON.stringify(jsonData));
    const prev = historyStack.pop();
    jsonData = JSON.parse(prev);
    afterChange();
    showToast('↶ Cambio deshecho');
    }

    function redo() {
    if (!redoStack.length) return;
    historyStack.push(JSON.stringify(jsonData));
    const next = redoStack.pop();
    jsonData = JSON.parse(next);
    afterChange();
    showToast('↷ Cambio rehecho');
    }

    function updateHistoryButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = historyStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
    }

    // Refresca todo tras un cambio estructural (seguro para usarse fuera de un input de texto en vivo)
    function afterChange() {
    renderVisual();
    renderTree();
    updateStatus();
    syncRaw();
    updateHistoryButtons();
    scheduleAutosave();
    }

    // Refresco ligero mientras el usuario escribe en un campo — NUNCA reconstruye el editor visual,
    // para no perder el foco/cursor del input activo.
    function afterLiveEdit() {
    updateStatus();
    renderTree();
    syncRaw();
    scheduleAutosave();
    }

    // ═══════════════════════════════════════════════════════
    // VISUAL RENDER
    // ═══════════════════════════════════════════════════════
    function renderVisual() {
    if (!jsonData) return;
    const container = document.getElementById('visualEditor');
    container.innerHTML = '';
    renderVisualNode(container, jsonData, []);
    }

    function renderVisualNode(container, data, path) {
    if (Array.isArray(data)) {
        renderArrayItems(container, data, path);
    } else if (typeof data === 'object' && data !== null) {
        renderObjectFields(container, data, path);
    }
    }

    function renderObjectFields(container, obj, path) {
    const keys = Object.keys(obj);
    keys.forEach(key => {
        const val = obj[key];
        const fieldPath = [...path, key];
        const isComplex = typeof val === 'object' && val !== null;

        if (isComplex) {
        const card = createCard(key, val, fieldPath, obj);
        container.appendChild(card);
        } else {
        container.appendChild(createFieldRow(key, val, fieldPath, obj));
        }
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-field-btn';
    addBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Agregar campo${path.length ? ' a ' + path[path.length-1] : ''}`;
    addBtn.onclick = () => openAddFieldModal(path);
    container.appendChild(addBtn);
    }

    function renderArrayItems(container, arr, path) {
    arr.forEach((val, i) => {
        const fieldPath = [...path, i];
        const isComplex = typeof val === 'object' && val !== null;
        if (isComplex) {
        const card = createCard('[' + i + ']', val, fieldPath, arr, i);
        container.appendChild(card);
        } else {
        container.appendChild(createFieldRow(i, val, fieldPath, arr));
        }
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-field-btn';
    addBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg> Agregar elemento (cualquier tipo, incluido array u objeto)`;
    addBtn.onclick = () => openAddFieldModal(path);
    container.appendChild(addBtn);
    }

    function makeActionBtn(iconSvg, title, onClick, extraClass) {
    const btn = document.createElement('button');
    btn.className = 'field-action-btn' + (extraClass ? ' ' + extraClass : '');
    btn.type = 'button';
    btn.title = title;
    btn.innerHTML = iconSvg;
    btn.onclick = onClick;
    return btn;
    }

    function createCard(label, val, path, parent, idx) {
    const card = document.createElement('div');
    card.className = 'node-card';
    const typeStr = Array.isArray(val) ? 'array' : 'object';
    const count = Array.isArray(val) ? val.length + ' items' : Object.keys(val).length + ' campos';
    const isArrayParent = Array.isArray(parent);

    const header = document.createElement('div');
    header.className = 'node-card-header';

    let keyEl;
    if (isArrayParent) {
        keyEl = document.createElement('span');
        keyEl.className = 'node-card-key';
        keyEl.textContent = String(label);
    } else {
        keyEl = document.createElement('input');
        keyEl.type = 'text';
        keyEl.className = 'node-card-key node-card-key-input';
        keyEl.value = String(label);
        keyEl.title = 'Clic para renombrar esta clave';
        keyEl.onfocus = () => pushHistory();
        keyEl.onkeydown = (e) => { if (e.key === 'Enter') keyEl.blur(); };
        keyEl.onchange = () => renameKey(path, keyEl.value, keyEl);
    }

    const badge = document.createElement('span');
    badge.className = 'tree-type-badge type-' + typeStr;
    badge.textContent = typeStr;

    const countEl = document.createElement('span');
    countEl.style.cssText = 'font-size:11px;color:var(--text-muted)';
    countEl.textContent = count;

    header.appendChild(keyEl);
    header.appendChild(badge);
    header.appendChild(countEl);

    if (isArrayParent) {
        const upBtn = makeActionBtn(ICONS.up, 'Mover arriba', () => moveItem(path, -1), 'move-btn');
        const downBtn = makeActionBtn(ICONS.down, 'Mover abajo', () => moveItem(path, 1), 'move-btn');
        if (idx === 0) upBtn.disabled = true;
        if (idx === parent.length - 1) downBtn.disabled = true;
        header.appendChild(upBtn);
        header.appendChild(downBtn);
    }

    const dupBtn = makeActionBtn(ICONS.duplicate, 'Duplicar', () => duplicateField(path), 'duplicate-btn');
    header.appendChild(dupBtn);

    const delBtn = makeActionBtn(ICONS.delete, 'Eliminar', () => deleteField(path));
    delBtn.style.marginLeft = '4px';
    header.appendChild(delBtn);

    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'node-card-body';
    body.id = 'card-body-' + path.join('-');
    card.appendChild(body);

    renderVisualNode(body, val, path);
    return card;
    }

    function isImageValue(val) {
    if (typeof val !== 'string') return false;
    const v = val.trim();
    if (!v) return false;
    if (/^data:image\//i.test(v)) return true;
    if (/^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?\S*)?$/i.test(v)) return true;
    if (/^[.\w][\w\-./]*\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(v)) return true;
    return false;
    }

    function applyPreview(imgEl, val) {
    if (isImageValue(val)) {
        imgEl.onerror = () => { imgEl.style.display = 'none'; };
        imgEl.src = val;
        imgEl.style.display = 'inline-block';
    } else {
        imgEl.style.display = 'none';
        imgEl.removeAttribute('src');
    }
    }

    function openImagePreview(src) {
    if (!src) return;
    document.getElementById('imagePreviewImg').src = src;
    openModal('imagePreviewModal');
    }

    function createFieldRow(key, val, path, parent) {
    const type = getType(val);
    const row = document.createElement('div');
    row.className = 'field-row';
    row.dataset.path = path.join('.');
    const isArrayParent = Array.isArray(parent);
    const idx = path[path.length - 1];

    let keyEl;
    if (isArrayParent) {
        keyEl = document.createElement('div');
        keyEl.className = 'field-label';
        keyEl.title = 'Índice ' + key;
        keyEl.textContent = '[' + key + ']';
    } else {
        keyEl = document.createElement('input');
        keyEl.type = 'text';
        keyEl.className = 'field-label field-key-input';
        keyEl.value = String(key);
        keyEl.title = 'Clic para renombrar esta clave';
        keyEl.onfocus = () => pushHistory();
        keyEl.onkeydown = (e) => { if (e.key === 'Enter') keyEl.blur(); };
        keyEl.onchange = () => renameKey(path, keyEl.value, keyEl);
    }

    let previewEl = null;
    if (type === 'string') {
        previewEl = document.createElement('img');
        previewEl.className = 'field-preview';
        previewEl.alt = '';
        applyPreview(previewEl, val);
        previewEl.onclick = () => { if (previewEl.style.display !== 'none') openImagePreview(previewEl.src); };
    }

    const inputEl = document.createElement('input');
    inputEl.className = 'field-input type-' + type;
    inputEl.type = type === 'number' ? 'number' : 'text';
    inputEl.value = val === null ? 'null' : String(val);
    if (type === 'null') inputEl.disabled = true;
    inputEl.onfocus = () => pushHistory();
    inputEl.oninput = () => {
        const newVal = parseValue(inputEl.value, type);
        setNestedValue(jsonData, path, newVal);
        if (previewEl) applyPreview(previewEl, inputEl.value);
        afterLiveEdit();
    };

    const typeSelect = document.createElement('select');
    typeSelect.className = 'field-type-select';
    ['string','number','boolean','null'].forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        if (t === type) opt.selected = true;
        typeSelect.appendChild(opt);
    });
    typeSelect.onchange = () => {
        pushHistory();
        const newType = typeSelect.value;
        const defaultVals = { string: '', number: 0, boolean: false, null: null };
        setNestedValue(jsonData, path, defaultVals[newType]);
        afterChange();
    };

    row.appendChild(keyEl);
    if (previewEl) row.appendChild(previewEl);
    row.appendChild(inputEl);
    row.appendChild(typeSelect);

    if (isArrayParent) {
        const upBtn = makeActionBtn(ICONS.up, 'Mover arriba', () => moveItem(path, -1), 'move-btn');
        const downBtn = makeActionBtn(ICONS.down, 'Mover abajo', () => moveItem(path, 1), 'move-btn');
        if (idx === 0) upBtn.disabled = true;
        if (idx === parent.length - 1) downBtn.disabled = true;
        row.appendChild(upBtn);
        row.appendChild(downBtn);
    }

    const dupBtn = makeActionBtn(ICONS.duplicate, 'Duplicar', () => duplicateField(path), 'duplicate-btn');
    row.appendChild(dupBtn);

    const delBtn = makeActionBtn(ICONS.delete, 'Eliminar campo', () => deleteField(path));
    row.appendChild(delBtn);

    return row;
    }

    function getType(val) {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
    }

    function parseValue(str, type) {
    if (type === 'number') return parseFloat(str) || 0;
    if (type === 'boolean') return str === 'true' || str === '1';
    if (type === 'null') return null;
    return str;
    }

    function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function setNestedValue(obj, path, val) {
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
    cur[path[path.length - 1]] = val;
    }

    function getNestedParent(obj, path) {
    let cur = obj;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
    return cur;
    }

    function getNestedRef(obj, path) {
    let cur = obj;
    for (const k of path) cur = cur[k];
    return cur;
    }

    // ═══════════════════════════════════════════════════════
    // MUTACIONES (todas empujan al historial antes de cambiar)
    // ═══════════════════════════════════════════════════════
    function deleteField(path) {
    if (path.length === 0) return;
    const parent = getNestedParent(jsonData, path);
    const key = path[path.length - 1];
    pushHistory();
    if (Array.isArray(parent)) parent.splice(key, 1);
    else delete parent[key];
    afterChange();
    showToast('Campo eliminado');
    }

    function duplicateField(path) {
    if (path.length === 0) return;
    const parent = getNestedParent(jsonData, path);
    const key = path[path.length - 1];
    const clone = JSON.parse(JSON.stringify(parent[key]));
    pushHistory();
    if (Array.isArray(parent)) {
        parent.splice(Number(key) + 1, 0, clone);
    } else {
        let newKey = key + '_copia';
        let n = 2;
        while (Object.prototype.hasOwnProperty.call(parent, newKey)) { newKey = key + '_copia' + n; n++; }
        const rebuilt = {};
        Object.keys(parent).forEach(k => {
        rebuilt[k] = parent[k];
        if (k === key) rebuilt[newKey] = clone;
        });
        Object.keys(parent).forEach(k => delete parent[k]);
        Object.keys(rebuilt).forEach(k => { parent[k] = rebuilt[k]; });
    }
    afterChange();
    showToast('Campo duplicado');
    }

    function moveItem(path, dir) {
    const arr = getNestedParent(jsonData, path);
    if (!Array.isArray(arr)) return;
    const idx = path[path.length - 1];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    pushHistory();
    const tmp = arr[idx];
    arr[idx] = arr[newIdx];
    arr[newIdx] = tmp;
    afterChange();
    }

    function renameKey(path, newKeyRaw, inputEl) {
    const newKey = newKeyRaw.trim();
    const parent = getNestedParent(jsonData, path);
    const oldKey = path[path.length - 1];

    if (!newKey) { if (inputEl) inputEl.value = oldKey; return; }
    if (newKey === oldKey) return;
    if (Object.prototype.hasOwnProperty.call(parent, newKey)) {
        showToast('Ya existe una clave llamada "' + newKey + '"');
        if (inputEl) inputEl.value = oldKey;
        return;
    }

    pushHistory();
    const rebuilt = {};
    Object.keys(parent).forEach(k => {
        rebuilt[k === oldKey ? newKey : k] = parent[k];
    });
    Object.keys(parent).forEach(k => delete parent[k]);
    Object.keys(rebuilt).forEach(k => { parent[k] = rebuilt[k]; });

    afterChange();
    showToast('Clave renombrada');
    }

    function addTopLevelField() {
    openAddFieldModal([]);
    }

    function openAddFieldModal(path) {
    addingToPath = path;
    const target = path.length === 0 ? jsonData : getNestedRef(jsonData, path);
    const isArr = Array.isArray(target);
    document.getElementById('keyFieldGroup').style.display = isArr ? 'none' : 'block';
    document.getElementById('modalArrayHint').style.display = isArr ? 'block' : 'none';
    openModal('addFieldModal');
    if (!isArr) setTimeout(() => document.getElementById('newFieldKey').focus(), 50);
    }

    function confirmAddField() {
    const keyInput = document.getElementById('newFieldKey');
    const type = document.getElementById('newFieldType').value;
    const key = keyInput.value.trim();

    const path = addingToPath;
    const target = path.length === 0 ? jsonData : getNestedRef(jsonData, path);
    const defaults = { string: '', number: 0, boolean: false, null: null, object: {}, array: [] };

    if (Array.isArray(target)) {
        pushHistory();
        target.push(defaults[type]);
    } else {
        if (!key) { keyInput.style.borderColor = 'var(--danger)'; return; }
        if (Object.prototype.hasOwnProperty.call(target, key)) {
        keyInput.style.borderColor = 'var(--danger)';
        showToast('Ya existe un campo llamado "' + key + '"');
        return;
        }
        pushHistory();
        target[key] = defaults[type];
    }

    closeModal('addFieldModal');
    keyInput.value = '';
    keyInput.style.borderColor = '';
    afterChange();
    showToast('Campo agregado');
    }

    // ── TREE ──
    function renderTree() {
    const container = document.getElementById('treeContainer');
    const empty = document.getElementById('treeEmpty');
    if (!jsonData) { empty.style.display = 'block'; container.innerHTML = ''; container.appendChild(empty); return; }
    empty.style.display = 'none';
    container.innerHTML = '';
    container.appendChild(renderTreeNode('root', jsonData, [], true));
    }

    function renderTreeNode(label, val, path, defaultOpen = false) {
    const type = getType(val);
    const isComplex = type === 'object' || type === 'array';
    const nodeEl = document.createElement('div');
    nodeEl.className = 'tree-node';

    const header = document.createElement('div');
    header.className = 'tree-node-header';

    const expandBtn = document.createElement('button');
    expandBtn.className = 'tree-expand-btn' + (defaultOpen ? ' open' : '');

    if (isComplex) {
        expandBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>`;
    } else {
        expandBtn.style.visibility = 'hidden';
    }

    const keyEl = document.createElement('span');
    keyEl.className = 'tree-key';
    keyEl.textContent = String(label);

    const badge = document.createElement('span');
    badge.className = 'tree-type-badge type-' + type;
    if (isComplex) {
        const count = Array.isArray(val) ? val.length : Object.keys(val).length;
        badge.textContent = Array.isArray(val) ? `[${count}]` : `{${count}}`;
    } else {
        badge.textContent = type;
    }

    header.appendChild(expandBtn);
    header.appendChild(keyEl);
    header.appendChild(badge);
    nodeEl.appendChild(header);

    let children = null;
    if (isComplex) {
        children = document.createElement('div');
        children.className = 'tree-children';
        children.style.display = defaultOpen ? 'block' : 'none';

        const entries = Array.isArray(val) ? val.map((v,i)=>[i,v]) : Object.entries(val);
        entries.forEach(([k,v]) => {
        children.appendChild(renderTreeNode(k, v, [...path, k]));
        });

        nodeEl.appendChild(children);

        expandBtn.onclick = (e) => {
        e.stopPropagation();
        const open = children.style.display !== 'none';
        children.style.display = open ? 'none' : 'block';
        expandBtn.classList.toggle('open', !open);
        };

        header.onclick = () => expandBtn.click();
    }

    // Filtrado por búsqueda
    if (treeSearchQuery) {
        const selfMatch = String(label).toLowerCase().includes(treeSearchQuery) ||
        (!isComplex && String(val).toLowerCase().includes(treeSearchQuery));
        let childMatch = false;
        if (isComplex && children) {
        childMatch = Array.from(children.children).some(c => c.dataset.searchVisible === '1');
        }
        const visible = selfMatch || childMatch;
        nodeEl.style.display = visible ? '' : 'none';
        nodeEl.dataset.searchVisible = visible ? '1' : '0';
        if (selfMatch) keyEl.classList.add('search-hit');
        if (childMatch && isComplex) {
        children.style.display = 'block';
        expandBtn.classList.add('open');
        }
    } else {
        nodeEl.style.display = '';
        nodeEl.dataset.searchVisible = '1';
    }

    return nodeEl;
    }

    function onTreeSearch(q) {
    treeSearchQuery = q.trim().toLowerCase();
    renderTree();
    }

    function toggleAllNodes() {
    allExpanded = !allExpanded;
    document.querySelectorAll('.tree-children').forEach(c => c.style.display = allExpanded ? 'block' : 'none');
    document.querySelectorAll('.tree-expand-btn').forEach(b => b.classList.toggle('open', allExpanded));
    document.querySelector('.expand-collapse-all').textContent = allExpanded ? 'Colapsar todo' : 'Expandir todo';
    }

    // ── RAW ──
    function syncRaw() {
    if (!jsonData) return;
    const ta = document.getElementById('rawTextarea');
    ta.value = JSON.stringify(jsonData, null, 2);
    ta.classList.remove('error');
    document.getElementById('rawErrorMsg').classList.remove('visible');
    }

    function onRawChange() {
    const ta = document.getElementById('rawTextarea');
    const err = document.getElementById('rawErrorMsg');
    try {
        JSON.parse(ta.value);
        ta.classList.remove('error');
        err.classList.remove('visible');
    } catch(e) {
        ta.classList.add('error');
        err.textContent = '⚠ ' + e.message;
        err.classList.add('visible');
    }
    }

    function applyRaw() {
    const ta = document.getElementById('rawTextarea');
    try {
        const parsed = JSON.parse(ta.value);
        pushHistory();
        jsonData = parsed;
        afterChange();
        ta.classList.remove('error');
        document.getElementById('rawErrorMsg').classList.remove('visible');
        showToast('✓ Cambios aplicados');
    } catch(e) {
        ta.classList.add('error');
        showToast('JSON inválido: ' + e.message);
    }
    }

    function formatRaw() {
    const ta = document.getElementById('rawTextarea');
    try {
        ta.value = JSON.stringify(JSON.parse(ta.value), null, 2);
        ta.classList.remove('error');
        showToast('JSON formateado');
    } catch(e) {
        showToast('No se puede formatear: JSON inválido');
    }
    }

    function formatJson() {
    renderVisual();
    showToast('✓ Estructura formateada');
    }

    // ── STATUS ──
    function updateStatus() {
    if (!jsonData) return;
    const json = JSON.stringify(jsonData);
    const bytes = new TextEncoder().encode(json).length;
    const fields = countFields(jsonData);
    document.getElementById('statusDot').className = 'status-dot ok';
    document.getElementById('statusText').textContent = 'JSON válido';
    document.getElementById('statusSize').textContent = formatBytes(bytes);
    document.getElementById('statusFields').textContent = fields + ' campos';

    const stats = document.getElementById('statsRow');
    stats.innerHTML = '';
    const types = countTypes(jsonData);
    Object.entries(types).forEach(([t,c]) => {
        const pill = document.createElement('span');
        pill.className = 'stat-pill';
        pill.textContent = `${t}: ${c}`;
        stats.appendChild(pill);
    });
    }

    function countFields(obj, count = 0) {
    if (typeof obj !== 'object' || obj === null) return count;
    const entries = Object.values(obj);
    entries.forEach(v => {
        count++;
        if (typeof v === 'object' && v !== null) count = countFields(v, count) - 1 + 1;
    });
    return count + entries.length;
    }

    function countTypes(obj, acc = {}) {
    if (typeof obj !== 'object' || obj === null) return acc;
    Object.values(obj).forEach(v => {
        const t = getType(v);
        acc[t] = (acc[t] || 0) + 1;
        if (t === 'object' || t === 'array') countTypes(v, acc);
    });
    return acc;
    }

    function formatBytes(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
    return (b/1024/1024).toFixed(2) + ' MB';
    }

    // ── EXPORT ──
    function exportJson() {
    if (!jsonData) { showToast('Nada que exportar'); return; }
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ JSON exportado');
    }

    // ── CLEAR ──
    function confirmClear() { openModal('clearModal'); }
    function clearAll() {
    pushHistory();
    jsonData = Array.isArray(jsonData) ? [] : {};
    closeModal('clearModal');
    afterChange();
    showToast('JSON limpiado');
    }

    // ── DRAG AND DROP ──
    function onDragOver(e) {
    e.preventDefault();
    document.getElementById('dropZone').classList.add('drag-over');
    }
    function onDragLeave(e) {
    document.getElementById('dropZone').classList.remove('drag-over');
    }
    function onDrop(e) {
    e.preventDefault();
    document.getElementById('dropZone').classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
        const parsed = JSON.parse(ev.target.result);
        if (!confirmDiscard()) return;
        jsonData = parsed;
        historyStack = []; redoStack = [];
        showEditor();
        showToast('✓ Archivo cargado: ' + file.name);
        } catch(err) {
        showToast('Error al parsear JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
    }

    // close modals on bg click
    document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('open'); });
    });

    // ── ATAJOS DE TECLADO ──
    document.addEventListener('keydown', (e) => {
    const isRawTextarea = e.target && e.target.id === 'rawTextarea';
    if (!(e.ctrlKey || e.metaKey) || isRawTextarea) return;

    if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
    else if (e.key === 's') { e.preventDefault(); exportJson(); }
    });

    // Guarda de inmediato (sin esperar el debounce) justo antes de que la
    // pestaña se recargue, cierre o pierda visibilidad — evita perder los
    // últimos cambios si el usuario recarga antes de que pasen los 350ms.
    function flushAutosave() {
    clearTimeout(autosaveTimer);
    saveToLocalStorage();
    }
    window.addEventListener('beforeunload', flushAutosave);
    window.addEventListener('pagehide', flushAutosave);
    document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAutosave();
    });

    // ═══════════════════════════════════════════════════════
    // INICIO — restaura el trabajo autoguardado si existe
    // ═══════════════════════════════════════════════════════
    (function init() {
    restoreFromLocalStorage();
    updateHistoryButtons();
    })();