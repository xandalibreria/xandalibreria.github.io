window.addEventListener("scroll", () => {
  const header = document.getElementById("id-header");
  if(scrollY > 0){
    header.style.position = "fixed";
  }else{
    header.style.position = "absolute";
  }
})


const state = {
  query: "",
  activeCat: "estructuras"
};

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

/* ---------- render: sections ---------- */
function renderSections(){
  const root = document.getElementById("sections");
  root.innerHTML = CATEGORIES.map(cat => `
    <section class="section" id="${cat.id}">
      <div class="container">
        <div class="section-head">
          <div class="section-head-text">
            <div class="section-tag">${icon(cat.icon)} ${cat.label}</div>
            <h2>${cat.title}</h2>
            <p class="sub">${cat.sub}</p>
          </div>
          <a class="btn-more" href="contenido.html?cat=${cat.id}">
            Más contenido ${icon("arrowRight")}
          </a>
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

  attachCardEvents(root);
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
  });

  initModalEvents();
}

document.addEventListener("DOMContentLoaded", init);