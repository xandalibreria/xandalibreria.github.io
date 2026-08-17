/* ============================================================
   XandA — Librería — core.js
   Lógica compartida entre inicio.html y contenido.html:
   tarjetas, descargas, modal simple (info) e inspector con pestañas.
   ============================================================ */

/* Categorías cuyas tarjetas conservan el botón "Descargar" tal cual. */
const DOWNLOAD_ONLY_CATS = ["estructuras", "constructor"];

function icon(name){ return ICONS[name] || ""; }

function matches(item, q){
  if(!q) return true;
  const hay = (item.name + " " + item.desc + " " + item.tags.join(" ")).toLowerCase();
  return hay.includes(q.toLowerCase());
}

function slug(str){
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

function findItem(id, catId){
  const cat = CATEGORIES.find(c=>c.id===catId);
  const item = cat.data.find(d=>d.id===id);
  return { cat, item };
}

/* ---------------- tarjetas ---------------- */
function cardHTML(item, cat){
  const isTemplate = cat.id === "plantillas";
  const isAnim = cat.id === "animaciones";
  const isDownloadOnly = DOWNLOAD_ONLY_CATS.includes(cat.id);

  let visual = `
    <div class="card-top">
      <div class="card-icon">${icon(item.icon)}</div>
    </div>`;

  if(isTemplate){
    visual = `
    <div class="thumb" style="background:${item.swatch[1]}">
      <div class="thumb-bar"><span></span><span></span><span></span></div>
      <div class="thumb-body" style="background:linear-gradient(135deg, ${item.swatch[0]}22, ${item.swatch[0]}55)"></div>
    </div>`;
  }
  if(isAnim){
    visual = `
    <div class="card-top">
      <div class="card-icon">${icon(item.icon)}</div>
    </div>
    <div class="preview-strip"><div class="demo-box ${item.demoClass}"></div></div>`;
  }

  let footActions;
  if(isDownloadOnly){
    footActions = `
      <button class="btn-download" data-action="download" data-id="${item.id}" data-cat="${cat.id}">
        ${icon("download")} Descargar
      </button>`;
  } else if(isTemplate){
    footActions = `
      <div class="card-actions">
        <button class="btn-icon-ghost" data-action="inspect" data-id="${item.id}" data-cat="${cat.id}" title="Inspeccionar" aria-label="Inspeccionar">
          ${icon("search")}
        </button>
        <button class="btn-download" data-action="download" data-id="${item.id}" data-cat="${cat.id}">
          ${icon("download")} Descargar
        </button>
      </div>`;
  } else {
    footActions = `
      <button class="btn-download" data-action="inspect" data-id="${item.id}" data-cat="${cat.id}">
        ${icon("search")} Inspeccionar
      </button>`;
  }

  return `
    <article class="card" data-id="${item.id}" data-cat="${cat.id}" tabindex="0">
      ${visual}
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
      <div class="tag-row">${item.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <div class="card-foot">
        <span class="card-meta">${icon("folder")}${item.meta}</span>
        ${footActions}
      </div>
    </article>
  `;
}

function openForCard(id, catId){
  if(DOWNLOAD_ONLY_CATS.includes(catId)){
    openSimpleModal(id, catId);
  } else {
    openInspector(id, catId);
  }
}

function attachCardEvents(root){
  root.querySelectorAll(".card").forEach(el=>{
    el.addEventListener("click", (e)=>{
      if(e.target.closest("[data-action]")) return;
      openForCard(el.dataset.id, el.dataset.cat);
    });
    el.addEventListener("keydown", (e)=>{
      if(e.key==="Enter") openForCard(el.dataset.id, el.dataset.cat);
    });
  });
  root.querySelectorAll("[data-action='download']").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      triggerDownload(btn.dataset.id, btn.dataset.cat);
    });
  });
  root.querySelectorAll("[data-action='inspect']").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      openInspector(btn.dataset.id, btn.dataset.cat);
    });
  });
}

/* ---------------- descargas ---------------- */
function downloadBlob(content, filename, type){
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function triggerDownload(id, catId){
  const { cat, item } = findItem(id, catId);
  try{
    if(cat.kind === "zip"){
      const zip = new JSZip();
      Object.entries(item.files).forEach(([path, content])=>{
        zip.file(path, content);
      });
      const blob = await zip.generateAsync({ type:"blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `xanda-${slug(item.name)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      downloadBlob(item.content, `xanda-${slug(item.name)}.html`, "text/html");
    }
    showToast(`${item.name} descargado`);
  } catch(err){
    console.error(err);
    showToast("No se pudo generar la descarga", true);
  }
}

/* ---------------- toast ---------------- */
let toastTimer;
function showToast(msg, isError=false){
  const t = document.getElementById("toast");
  if(!t) return;
  t.querySelector("span").textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove("is-visible"), 2600);
}

async function copyText(text, okMsg="Copiado al portapapeles"){
  try{
    await navigator.clipboard.writeText(text);
    showToast(okMsg);
  }catch(err){
    console.error(err);
    showToast("No se pudo copiar", true);
  }
}

/* ---------------- modal simple (estructuras / constructor) ---------------- */
function fileListOf(item, cat){
  if(cat.kind === "zip"){
    return Object.keys(item.files);
  }
  return [item.file];
}

function codePreviewOf(item, cat){
  let raw;
  if(cat.kind === "zip"){
    const firstKey = Object.keys(item.files)[0];
    raw = item.files[firstKey];
  } else {
    raw = item.content;
  }
  return raw.split("\n").slice(0, 8).join("\n");
}

function openSimpleModal(id, catId){
  const { cat, item } = findItem(id, catId);
  const overlay = document.getElementById("modalOverlay");
  if(!overlay) return;
  const files = fileListOf(item, cat);

  document.getElementById("modalIcon").innerHTML = icon(item.icon);
  document.getElementById("modalCatLabel").textContent = cat.label;
  document.getElementById("modalName").textContent = item.name;
  document.getElementById("modalDesc").textContent = item.desc;
  document.getElementById("modalMeta").textContent = item.meta;
  document.getElementById("modalCode").textContent = codePreviewOf(item, cat);

  document.getElementById("modalFileList").innerHTML = files.map(f=>`
    <div class="file-row">${icon("file")}${f}</div>
  `).join("");

  const dlBtn = document.getElementById("modalDownload");
  dlBtn.onclick = ()=> triggerDownload(item.id, cat.id);

  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeSimpleModal(){
  const overlay = document.getElementById("modalOverlay");
  if(!overlay) return;
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

/* ---------------- inspector (componentes / animaciones / plantillas) ---------------- */
function splitSingleFile(raw){
  const cssMatch = raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const jsMatch = raw.match(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/i);
  return {
    html: raw,
    css: cssMatch ? cssMatch[1].trim() : null,
    js: jsMatch ? jsMatch[1].trim() : null
  };
}

function escapeForRegex(str){
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTemplatePreviewHTML(item){
  const entries = Object.entries(item.files);
  const htmlEntry = entries.find(([p])=>p.toLowerCase().endsWith("index.html")) || entries.find(([p])=>p.toLowerCase().endsWith(".html"));
  let out = htmlEntry ? htmlEntry[1] : "";

  entries.forEach(([path, content])=>{
    const filename = path.split("/").pop();
    const safeName = escapeForRegex(filename);

    if(path.toLowerCase().endsWith(".css")){
      const linkRe = new RegExp(`<link[^>]*href=["']${safeName}["'][^>]*>`, "i");
      if(linkRe.test(out)) out = out.replace(linkRe, `<style>\n${content}\n</style>`);
    }
    if(path.toLowerCase().endsWith(".js")){
      const srcRe = new RegExp(`<script[^>]*src=["']${safeName}["'][^>]*>\\s*<\\/script>`, "i");
      if(srcRe.test(out)) out = out.replace(srcRe, `<script>\n${content}\n</script>`);
    }
  });

  return out;
}

let inspectorState = { tabs: [], activeIndex: 0, fullCode: "", item: null, cat: null, mode: "file" };

function openInspector(id, catId){
  const { cat, item } = findItem(id, catId);
  const overlay = document.getElementById("inspectorOverlay");
  if(!overlay) return;
  const modalEl = overlay.querySelector(".inspector-modal");

  const isTemplate = cat.id === "plantillas";
  modalEl.classList.toggle("mode-template", isTemplate);

  document.getElementById("inspIcon").innerHTML = icon(item.icon);
  document.getElementById("inspCatLabel").textContent = cat.label;
  document.getElementById("inspName").textContent = item.name;
  document.getElementById("inspDesc").textContent = item.desc;
  document.getElementById("inspFileCount").innerHTML = `${icon("folder")} ${item.meta}`;
  document.getElementById("inspTags").innerHTML = item.tags.map(t=>`<span class="tag">${t}</span>`).join("");

  document.getElementById("inspDownloadBtn").onclick = ()=> triggerDownload(item.id, cat.id);

  const copyAllBtn = document.getElementById("inspCopyAllBtn");
  const tabsWrap = document.getElementById("inspectorTabs");
  const codePane = document.getElementById("inspectorCodePane");
  const previewPane = document.getElementById("inspectorPreviewPane");
  const iframe = document.getElementById("inspectorIframe");

  if(isTemplate){
    /* Plantillas: solo vista previa, sin pestañas ni copiar por archivo */
    tabsWrap.innerHTML = "";
    tabsWrap.style.display = "none";
    codePane.style.display = "none";
    previewPane.style.display = "block";
    copyAllBtn.style.display = "none";

    const previewHTML = buildTemplatePreviewHTML(item);
    iframe.srcdoc = previewHTML;
    inspectorState = { tabs: [], activeIndex: 0, fullCode: previewHTML, item, cat, mode: "template" };
  } else {
    /* Componentes / animaciones: un solo archivo con HTML + CSS + JS embebidos */
    copyAllBtn.style.display = "";
    tabsWrap.style.display = "flex";

    const parts = splitSingleFile(item.content);
    const tabs = [{ id:"html", label:"HTML", code: parts.html }];
    if(parts.css) tabs.push({ id:"css", label:"CSS", code: parts.css });
    if(parts.js) tabs.push({ id:"js", label:"JS", code: parts.js });
    tabs.push({ id:"preview", label:"Vista previa", code: parts.html, isPreview:true });

    inspectorState = { tabs, activeIndex: 0, fullCode: item.content, item, cat, mode: "file" };

    tabsWrap.innerHTML = tabs.map((t,i)=>`
      <button class="insp-tab ${i===0?'is-active':''}" data-idx="${i}">${t.label}</button>
    `).join("");

    tabsWrap.querySelectorAll(".insp-tab").forEach(btn=>{
      btn.addEventListener("click", ()=> setInspectorTab(parseInt(btn.dataset.idx, 10)));
    });

    setInspectorTab(0);
  }

  copyAllBtn.onclick = ()=> copyText(inspectorState.fullCode, `${item.name}: código completo copiado`);

  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function setInspectorTab(idx){
  const { tabs, item } = inspectorState;
  const tab = tabs[idx];
  if(!tab) return;
  inspectorState.activeIndex = idx;

  document.querySelectorAll("#inspectorTabs .insp-tab").forEach((b,i)=>{
    b.classList.toggle("is-active", i===idx);
  });

  const codePane = document.getElementById("inspectorCodePane");
  const previewPane = document.getElementById("inspectorPreviewPane");
  const iframe = document.getElementById("inspectorIframe");
  const label = document.getElementById("inspPaneLabel");
  const codeEl = document.getElementById("inspectorCode");
  const copyPaneBtn = document.getElementById("inspCopyPaneBtn");

  if(tab.isPreview){
    codePane.style.display = "none";
    previewPane.style.display = "block";
    iframe.srcdoc = tab.code;
    copyPaneBtn.onclick = ()=> copyText(inspectorState.fullCode, `${item.name}: código completo copiado`);
  } else {
    previewPane.style.display = "none";
    codePane.style.display = "flex";
    label.textContent = tab.label;
    codeEl.textContent = tab.code;
    copyPaneBtn.onclick = ()=> copyText(tab.code, `${tab.label} copiado`);
  }
}

function closeInspector(){
  const overlay = document.getElementById("inspectorOverlay");
  if(!overlay) return;
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
  const iframe = document.getElementById("inspectorIframe");
  if(iframe) iframe.srcdoc = "";
}

/* ---------------- eventos comunes de los modales (una vez por página) ---------------- */
function initModalEvents(){
  const modalOverlay = document.getElementById("modalOverlay");
  if(modalOverlay){
    modalOverlay.addEventListener("click", (e)=>{ if(e.target.id === "modalOverlay") closeSimpleModal(); });
    document.getElementById("modalCloseBtn")?.addEventListener("click", closeSimpleModal);
  }

  const inspectorOverlay = document.getElementById("inspectorOverlay");
  if(inspectorOverlay){
    inspectorOverlay.addEventListener("click", (e)=>{ if(e.target.id === "inspectorOverlay") closeInspector(); });
    document.getElementById("inspectorCloseBtn")?.addEventListener("click", closeInspector);
  }

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){ closeSimpleModal(); closeInspector(); }
  });
}