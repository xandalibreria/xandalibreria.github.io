/* ============================================================
   XandA — Librería — script.js
   ============================================================ */

const state = {
  query: "",
  activeCat: "estructuras"
};

/* ---------- helpers ---------- */
function icon(name){ return ICONS[name] || ""; }

function matches(item, q){
  if(!q) return true;
  const hay = (item.name + " " + item.desc + " " + item.tags.join(" ")).toLowerCase();
  return hay.includes(q.toLowerCase());
}

function totalCount(cat){ return cat.data.length; }

/* ---------- render: tab bar ---------- */
function renderTabs(){
  const bar = document.getElementById("tabBar");
  bar.innerHTML = CATEGORIES.map(cat => `
    <button class="tab-btn ${cat.id===state.activeCat ? "is-active":""}" data-cat="${cat.id}">
      ${icon(cat.icon)}
      <span>${cat.label}</span>
      <span class="count">${totalCount(cat)}</span>
    </button>
  `).join("");
  bar.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.activeCat = btn.dataset.cat;
      document.getElementById(btn.dataset.cat).scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
}

/* ---------- render: card ---------- */
function cardHTML(item, cat){
  const isTemplate = cat.id === "plantillas";
  const isAnim = cat.id === "animaciones";

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

  return `
    <article class="card" data-id="${item.id}" data-cat="${cat.id}" tabindex="0">
      ${visual}
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
      <div class="tag-row">${item.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      <div class="card-foot">
        <span class="card-meta">${icon("folder")}${item.meta}</span>
        <button class="btn-download" data-action="download" data-id="${item.id}" data-cat="${cat.id}">
          ${icon("download")} Descargar
        </button>
      </div>
    </article>
  `;
}

/* ---------- render: sections ---------- */
function renderSections(){
  const root = document.getElementById("sections");
  root.innerHTML = CATEGORIES.map(cat => `
    <section class="section" id="${cat.id}">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="section-tag">${icon(cat.icon)} ${cat.label}</div>
            <h2>${cat.title}</h2>
            <p class="sub">${cat.sub}</p>
          </div>
        </div>
        <div class="grid" id="grid-${cat.id}">
          ${cat.data.map(item => cardHTML(item, cat)).join("")}
        </div>
        <div class="empty-state" id="empty-${cat.id}">
          ${icon("search")}
          <strong>Sin resultados en ${cat.label}</strong>
          <span>Prueba con otra palabra clave.</span>
        </div>
      </div>
    </section>
  `).join("");

  root.querySelectorAll(".card").forEach(el=>{
    el.addEventListener("click", (e)=>{
      if(e.target.closest("[data-action='download']")) return;
      openModal(el.dataset.id, el.dataset.cat);
    });
    el.addEventListener("keydown", (e)=>{
      if(e.key==="Enter") openModal(el.dataset.id, el.dataset.cat);
    });
  });
  root.querySelectorAll("[data-action='download']").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      triggerDownload(btn.dataset.id, btn.dataset.cat);
    });
  });
}

/* ---------- search / filter ---------- */
function applyFilter(){
  const q = state.query.trim();
  CATEGORIES.forEach(cat=>{
    const grid = document.getElementById(`grid-${cat.id}`);
    const empty = document.getElementById(`empty-${cat.id}`);
    let visibleCount = 0;
    grid.querySelectorAll(".card").forEach(card=>{
      const item = cat.data.find(d=>d.id===card.dataset.id);
      const show = matches(item, q);
      card.style.display = show ? "" : "none";
      if(show) visibleCount++;
    });
    empty.classList.toggle("is-visible", visibleCount===0);
    document.getElementById(cat.id).style.display = (q && visibleCount===0) ? "none" : "";
  });
}

/* ---------- scroll spy ---------- */
function initScrollSpy(){
  const sections = CATEGORIES.map(c=>document.getElementById(c.id));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        state.activeCat = entry.target.id;
        document.querySelectorAll(".tab-btn").forEach(b=>{
          b.classList.toggle("is-active", b.dataset.cat===entry.target.id);
        });
      }
    });
  }, { rootMargin: "-160px 0px -60% 0px", threshold: 0 });
  sections.forEach(s=> s && io.observe(s));
}

/* ---------- modal ---------- */
function findItem(id, catId){
  const cat = CATEGORIES.find(c=>c.id===catId);
  const item = cat.data.find(d=>d.id===id);
  return { cat, item };
}

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
  const lines = raw.split("\n").slice(0, 8).join("\n");
  return lines;
}

function openModal(id, catId){
  const { cat, item } = findItem(id, catId);
  const overlay = document.getElementById("modalOverlay");
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

function closeModal(){
  document.getElementById("modalOverlay").classList.remove("is-open");
  document.body.style.overflow = "";
}

/* ---------- downloads ---------- */
function slug(str){
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}

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

/* ---------- toast ---------- */
let toastTimer;
function showToast(msg, isError=false){
  const t = document.getElementById("toast");
  t.querySelector("span").textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove("is-visible"), 2600);
}

/* ---------- init ---------- */
function init(){
  renderTabs();
  renderSections();
  initScrollSpy();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e)=>{
    state.query = e.target.value;
    applyFilter();
  });

  document.addEventListener("keydown", (e)=>{
    if((e.key === "/" ) && document.activeElement !== searchInput){
      e.preventDefault();
      searchInput.focus();
    }
    if(e.key === "Escape") closeModal();
  });

  document.getElementById("modalOverlay").addEventListener("click", (e)=>{
    if(e.target.id === "modalOverlay") closeModal();
  });
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
}

document.addEventListener("DOMContentLoaded", init);
