window.addEventListener("scroll", () => {
  const header = document.getElementById("id-header");
  if(scrollY > 0){
    header.style.position = "fixed";
  }else{
    header.style.position = "absolute";
  }
})

const state = { query: "" };

function getCatFromURL(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("cat");
  return CATEGORIES.find(c=>c.id===id) || CATEGORIES[0];
}

const cat = getCatFromURL();

function renderHero(){
  document.getElementById("contTag").innerHTML = `${icon(cat.icon)} ${cat.label}`;
  document.getElementById("contTitle").textContent = cat.title;
  document.getElementById("contSub").textContent = cat.sub;
  document.title = `${cat.label} — XandA`;
}

function renderGrid(){
  const grid = document.getElementById("contGrid");
  grid.innerHTML = cat.data.map(item => cardHTML(item, cat)).join("");
  attachCardEvents(grid);
}

function renderEmptyState(){
  document.getElementById("contEmpty").innerHTML = `
    ${icon("search")}
    <strong>Sin resultados en ${cat.label}</strong>
    <span>Prueba con otra palabra clave.</span>
  `;
}

function applyFilter(){
  const q = state.query.trim();
  const grid = document.getElementById("contGrid");
  const empty = document.getElementById("contEmpty");
  let visibleCount = 0;
  grid.querySelectorAll(".card").forEach(card=>{
    const item = cat.data.find(d=>d.id===card.dataset.id);
    const show = matches(item, q);
    card.style.display = show ? "" : "none";
    if(show) visibleCount++;
  });
  empty.classList.toggle("is-visible", visibleCount===0);
}

function init(){
  renderHero();
  renderGrid();
  renderEmptyState();

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e)=>{
    state.query = e.target.value;
    applyFilter();
  });

  document.addEventListener("keydown", (e)=>{
    if((e.key === "/") && document.activeElement !== searchInput){
      e.preventDefault();
      searchInput.focus();
    }
  });

  initModalEvents();
}

document.addEventListener("DOMContentLoaded", init);