// ═══════════════════════════════════════════════════════════════
// state.js — Estado global compartido por todos los módulos
// Importar con: import * as State from './state.js'
// ═══════════════════════════════════════════════════════════════

// ── Elemento seleccionado ────────────────────────────────────
export let selectedElId   = null;
export let dragType       = null;
export let dropTarget     = null;

// ── Secciones visibles ───────────────────────────────────────
export let sections = { header: true, main: true, footer: true };

// ── Viewport & zoom ──────────────────────────────────────────
export let viewport = 'desktop';
export let zoom     = 100;

// ── Historial ────────────────────────────────────────────────
export let history      = [];
export let historyIndex = -1;

// ── Contadores ───────────────────────────────────────────────
export let elCounter = 100;

// ── Tabs activos ─────────────────────────────────────────────
export let activeRTab  = 0;   // Tab del panel derecho (Estilo / Tipografía / Espaciado)
export let activePTab  = 0;   // Tab del panel izquierdo (Elementos / Capas / Estilos)

// ── Páginas ──────────────────────────────────────────────────
export let pages         = [{ id: 'page-1', name: 'index', content: null }];
export let currentPageId = 'page-1';
export let pageCounter   = 1;

// ── Popover ──────────────────────────────────────────────────
export let addPopoverTargetSection = null;

// ─────────────────────────────────────────────────────────────
// Setters — los módulos usan estas funciones para mutar estado
// (evita reasignación directa de exports en otros módulos)
// ─────────────────────────────────────────────────────────────
export function setSelectedElId(v)           { selectedElId = v; }
export function setDragType(v)               { dragType = v; }
export function setDropTarget(v)             { dropTarget = v; }
export function setSections(v)               { sections = v; }
export function setViewport(v)               { viewport = v; }
export function setZoom(v)                   { zoom = v; }
export function setHistory(v)                { history = v; }
export function setHistoryIndex(v)           { historyIndex = v; }
export function incrementElCounter()         { elCounter++; return elCounter; }
export function setActiveRTab(v)             { activeRTab = v; }
export function setActivePTab(v)             { activePTab = v; }
export function setPages(v)                  { pages = v; }
export function setCurrentPageId(v)          { currentPageId = v; }
export function incrementPageCounter()       { pageCounter++; return pageCounter; }
export function setAddPopoverTargetSection(v){ addPopoverTargetSection = v; }
