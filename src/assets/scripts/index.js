/* ============================================================
   index.js — exclusivo de index.html
   Solo se carga en el index: hero, workbench, grafo, carrusel,
   demos de la librería, terminal CTA, reveal y registro de
   órdenes de la command palette.
   Depende de main.js (cargado antes): usa XandA.toast() y
   XandA.registerCmdkCommands(). El motor del palette, el
   newsletter del footer y la lógica del nav viven en main.js.
============================================================ */
(function () {
  'use strict';

  const $  = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Rail de secciones (navegación lateral) ---------- */
  const SECTIONS = ['hero','herramientas','ecosistema','libreria','opiniones','empezar'];
  const rail = $('#rail');
  if (rail) {
    SECTIONS.forEach(id => {
      const b = document.createElement('button');
      b.innerHTML = '<i>' + ({hero:'Inicio',herramientas:'Herramientas',ecosistema:'Ecosistema',libreria:'Librería',opiniones:'Opiniones',empezar:'Empezar'})[id] + '</i>';
      b.addEventListener('click', () => document.getElementById(id).scrollIntoView({behavior:'smooth'}));
      rail.appendChild(b);
    });
    const railBtns = [...rail.children];
    addEventListener('scroll', () => {
      const probe = scrollY + innerHeight * .42;
      let cur = 0;
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) cur = i;
      });
      railBtns.forEach((b, i) => b.classList.toggle('on', i === cur));
    }, {passive:true});
  }

  /* ---------- Canvas de puntos reactivo (hero) ---------- */
  (() => {
    const cv = $('#dots'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const hero = $('#hero');
    let pts = [], W, H, mx = -9e3, my = -9e3, t = 0, run = false, raf;
    const dpr = Math.min(devicePixelRatio || 1, 2), GAP = 27, R = 150;
    function build(){
      W = hero.offsetWidth; H = hero.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = GAP; y < H; y += GAP)
        for (let x = GAP; x < W; x += GAP)
          pts.push({x, y, dx: x, dy: y});
    }
    function draw(){
      ctx.clearRect(0, 0, W, H);
      t += .016;
      for (const p of pts){
        const wx = p.x + Math.sin(t * .9 + p.y * .018) * 1.4;
        const wy = p.y + Math.cos(t * .7 + p.x * .015) * 1.4;
        const ddx = wx - mx, ddy = wy - my;
        const d = Math.hypot(ddx, ddy);
        const f = Math.max(0, 1 - d / R);
        const ox = d > 0 ? (ddx / d) * f * 16 : 0;
        const oy = d > 0 ? (ddy / d) * f * 16 : 0;
        p.dx += (wx + ox - p.dx) * .14;
        p.dy += (wy + oy - p.dy) * .14;
        ctx.beginPath();
        ctx.arc(p.dx, p.dy, 1.1 + f * 1.9, 0, 7);
        ctx.fillStyle = 'rgba(139,124,247,' + (.15 + f * .65) + ')';
        ctx.fill();
      }
      if (run) raf = requestAnimationFrame(draw);
    }
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mx = my = -9e3; });
    new IntersectionObserver(([en]) => {
      run = en.isIntersecting && !reduceMotion;
      cancelAnimationFrame(raf);
      if (run) draw(); else if (reduceMotion){ mx = my = -9e3; draw(); }
    }).observe(hero);
    addEventListener('resize', build);
    build(); draw();
  })();

  /* ---------- Workbench: auto-ciclado de vistas ---------- */
  (() => {
    const con = $('#console'); if (!con) return;
    const tabs = $$('.wb-tab'), views = $$('.wb-view');
    if (!tabs.length || !views.length) return;
    let i = 0, timer = null, visible = true;
    function go(n){
      i = n;
      tabs.forEach((tb, k) => tb.classList.toggle('active', k === n));
      views.forEach((v, k) => v.classList.toggle('active', k === n));
      const pr = tabs[n].querySelector('.wb-prog');
      pr.style.animation = 'none'; void pr.offsetWidth; pr.style.animation = '';
    }
    function start(){ stop(); timer = setInterval(() => go((i + 1) % views.length), 6000); }
    function stop(){ clearInterval(timer); timer = null; }
    tabs.forEach(tb => tb.addEventListener('click', () => { go(+tb.dataset.i); start(); }));
    con.addEventListener('mouseenter', stop);
    con.addEventListener('mouseleave', () => { if (visible){ go(i); start(); } });
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      con.classList.toggle('off', !visible);
      visible ? (go(i), start()) : stop();
    }, {threshold:.2}).observe(con);
  })();

  /* ---------- Grafo de ecosistema (conectores calculados) ---------- */
  (() => {
    const g = $('#graph'), core = $('#gCore');
    function build(){
      if (!g) return;
      const mobile = innerWidth < 860;
      g.classList.toggle('is-mobile', mobile);
      $$('.g-link').forEach(e => e.remove());
      if (mobile) return;
      const gr = g.getBoundingClientRect(), cr = core.getBoundingClientRect();
      const cx = cr.left - gr.left + cr.width / 2, cy = cr.top - gr.top + cr.height / 2;
      g.querySelectorAll('.g-node').forEach((n, idx) => {
        const r = n.getBoundingClientRect();
        const nx = r.left - gr.left + r.width / 2, ny = r.top - gr.top + r.height / 2;
        const dx = nx - cx, dy = ny - cy, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
        const x1 = cx + ux * 58, y1 = cy + uy * 58;
        const x2 = nx - ux * 42, y2 = ny - uy * 42;
        const len = Math.hypot(x2 - x1, y2 - y1);
        const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        const l = document.createElement('div');
        l.className = 'g-link';
        l.style.cssText = 'left:' + x1 + 'px;top:' + (y1 - 1) + 'px;width:' + len + 'px;transform:rotate(' + ang + 'deg);--d:' + (idx * .4) + 's';
        l.innerHTML = '<span></span>';
        g.appendChild(l);
      });
    }
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(build, 150); });
    addEventListener('load', build);
    build();
  })();

  /* ---------- Carrusel librería: drag + controles ---------- */
  (() => {
    const track = $('#carTrack'); if (!track) return;
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => {
      down = true; moved = false; sx = e.clientX; sl = track.scrollLeft;
      track.classList.add('dragging'); track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      track.scrollLeft = sl - dx;
    });
    const up = () => { down = false; track.classList.remove('dragging'); };
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);
    track.addEventListener('click', e => { if (moved){ e.preventDefault(); e.stopPropagation(); } }, true);
    const STEP = 323;
    $('#libNext').addEventListener('click', () => track.scrollBy({left: STEP, behavior:'smooth'}));
    $('#libPrev').addEventListener('click', () => track.scrollBy({left: -STEP, behavior:'smooth'}));
    function upd(){
      const max = track.scrollWidth - track.clientWidth || 1;
      $('#libBar').style.width = Math.max(8, (track.scrollLeft / max) * 100) + '%';
      const n = Math.min(8, Math.round(track.scrollLeft / STEP) + 1);
      $('#libIdx').textContent = String(n).padStart(2, '0');
    }
    track.addEventListener('scroll', upd, {passive:true});
    upd();
  })();

  /* ---------- Demo 1 · Text Scramble ---------- */
  (() => {
    const el = $('#scrEl'); if (!el) return;
    const CH = '!<>-_[]{}=+*^?#—';
    const words = JSON.parse(el.dataset.words);
    let wi = 0, raf;
    function run(){
      const to = words[wi = (wi + 1) % words.length];
      const from = el.textContent, len = Math.max(from.length, to.length), q = [];
      for (let k = 0; k < len; k++){
        const s = Math.floor(Math.random() * 20), e = s + 8 + Math.floor(Math.random() * 20);
        q.push({f: from[k] || '', t: to[k] || '', s, e, ch: ''});
      }
      let fr = 0; cancelAnimationFrame(raf);
      (function step(){
        let out = '', done = 0;
        for (const c of q){
          if (fr >= c.e){ done++; out += c.t; }
          else if (fr >= c.s){
            if (!c.ch || Math.random() < .28) c.ch = CH[Math.floor(Math.random() * CH.length)];
            out += '<span class="scr-c">' + c.ch + '</span>';
          } else out += c.f;
        }
        el.innerHTML = out;
        if (done < q.length){ fr++; raf = requestAnimationFrame(step); }
      })();
    }
    if (!reduceMotion){ setTimeout(run, 500); setInterval(run, 2800); }
  })();

  /* ---------- Demo 2 · Magnetic ---------- */
  (() => {
    const st = $('#magStage'); if (!st) return;
    const btn = $('#magBtn'), txt = btn.querySelector('span');
    st.addEventListener('mousemove', e => {
      const r = st.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      btn.style.transition = 'transform .12s ease-out';
      btn.style.transform = 'translate(' + x * .28 + 'px,' + y * .28 + 'px)';
      txt.style.transform = 'translate(' + x * .12 + 'px,' + y * .12 + 'px)';
    });
    st.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .5s cubic-bezier(.2,1.6,.4,1)';
      btn.style.transform = ''; txt.style.transform = '';
    });
  })();

  /* ---------- Demo 3 · Ripple ---------- */
  (() => {
    const ripBtn = $('#ripBtn'); if (!ripBtn) return;
    ripBtn.addEventListener('pointerdown', function(e){
      const r = this.getBoundingClientRect(), d = Math.max(r.width, r.height) * 1.2;
      const s = document.createElement('span');
      s.className = 'rip-ripple';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      this.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });
  })();

  /* ---------- Demo 4 · Progress Ring ---------- */
  (() => {
    const arc = $('#ringArc'), txt = $('#ringTxt'); if (!arc) return;
    const C = 2 * Math.PI * 34;
    arc.style.strokeDasharray = C; arc.style.strokeDashoffset = C;
    let on = false;
    function loop(ts){
      if (!on) return;
      const v = Math.round(24 + (Math.sin(ts / 950) * .5 + .5) * 71);
      arc.style.strokeDashoffset = C * (1 - v / 100);
      txt.textContent = v + '%';
      requestAnimationFrame(loop);
    }
    new IntersectionObserver(([en]) => {
      on = en.isIntersecting && !reduceMotion;
      if (on) requestAnimationFrame(loop);
      if (reduceMotion){ arc.style.strokeDashoffset = C * .3; txt.textContent = '70%'; }
    }).observe(arc);
  })();

  /* ---------- Demo 5 · Confetti ---------- */
  (() => {
    const confBtn = $('#confBtn'); if (!confBtn) return;
    confBtn.addEventListener('click', function(){
      const st = $('#confStage'), r = this.getBoundingClientRect(), sr = st.getBoundingClientRect();
      const cx = r.left - sr.left + r.width / 2, cy = r.top - sr.top + r.height / 2;
      const cols = ['#8B7CF7', '#6C5CE7', '#A99DFF', '#E9E6FC', '#3ECF8E'];
      for (let k = 0; k < 30; k++){
        const p = document.createElement('span');
        p.className = 'cfp';
        const sz = 5 + Math.random() * 5;
        p.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;width:' + sz + 'px;height:' + (Math.random() < .4 ? sz : sz * .5) + 'px;background:' + cols[k % cols.length] + ';border-radius:' + (Math.random() < .5 ? '50%' : '2px');
        st.appendChild(p);
        const a = -Math.PI * Math.random(), v = 60 + Math.random() * 90;
        const dx = Math.cos(a) * v, dy = Math.sin(a) * v;
        p.animate([
          {transform:'translate(0,0) rotate(0deg) scale(1)', opacity:1},
          {transform:'translate(' + dx * .7 + 'px,' + (dy * .7 - 20) + 'px) rotate(' + 180 + 'deg) scale(1)', opacity:1, offset:.55},
          {transform:'translate(' + dx + 'px,' + (dy + 80) + 'px) rotate(' + (320 + Math.random() * 200) + 'deg) scale(.5)', opacity:0}
        ], {duration: 750 + Math.random() * 550, easing:'cubic-bezier(.15,.6,.4,1)'}).onfinish = () => p.remove();
      }
    });
  })();

  /* ---------- Demo 6 · Smart tooltip ---------- */
  (() => {
    const wrap = $('#tipWrap'); if (!wrap) return;
    const btn = $('#tipBtn'), tip = $('#tipEl');
    function place(){
      const wr = wrap.getBoundingClientRect(), sr = wrap.closest('.demo-stage').getBoundingClientRect();
      const below = wr.top - sr.top < 74;
      tip.classList.toggle('below', below);
      tip.classList.toggle('above', !below);
    }
    btn.addEventListener('mouseenter', place);
    btn.addEventListener('focus', place);
  })();

  /* ---------- Snippets reales para copiar ---------- */
  const SNIPPETS = {
  scr:`const CH='!<>-_[]{}=+*^?#—';
  function scramble(el, to){
    const from = el.textContent, q = [];
    for (let i = 0; i < Math.max(from.length, to.length); i++){
      const s = Math.random()*20|0, e = s + 8 + (Math.random()*20|0);
      q.push({f: from[i]||'', t: to[i]||'', s, e, ch:''});
    }
    let fr = 0;
    (function step(){
      let out = '', done = 0;
      for (const c of q){
        if (fr >= c.e){ done++; out += c.t; }
        else if (fr >= c.s){
          if (!c.ch || Math.random() < .28)
            c.ch = CH[Math.random()*CH.length|0];
          out += c.ch;
        } else out += c.f;
      }
      el.textContent = out;
      if (done < q.length){ fr++; requestAnimationFrame(step); }
    })();
  }`,
  mag:`stage.addEventListener('mousemove', e => {
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top  - r.height/2;
    btn.style.transform =
      'translate(' + x*.28 + 'px,' + y*.28 + 'px)';
  });
  stage.addEventListener('mouseleave', () =>
    btn.style.transform = '');  // con transition de rebote`,
  rip:`btn.addEventListener('pointerdown', e => {
    const r = btn.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 1.2;
    const s = document.createElement('span');
    s.style.cssText =
      'position:absolute;border-radius:50%;' +
      'width:'+d+'px;height:'+d+'px;' +
      'left:'+(e.clientX-r.left-d/2)+'px;' +
      'top:'+(e.clientY-r.top-d/2)+'px';
    btn.appendChild(s);
    s.animate([{transform:'scale(0)'},{transform:'scale(3)',opacity:0}],
      {duration:650, easing:'ease-out'}).onfinish = () => s.remove();
  });`,
  ring:`<svg viewBox="0 0 96 96" style="transform:rotate(-90deg)">
    <circle cx="48" cy="48" r="34" fill="none"
      stroke="#241E4A" stroke-width="8"/>
    <circle id="arc" cx="48" cy="48" r="34" fill="none"
      stroke="#8B7CF7" stroke-width="8" stroke-linecap="round"/>
  </svg>
  const C = 2*Math.PI*34;
  arc.style.strokeDasharray = C;
  arc.style.strokeDashoffset = C * (1 - valor/100);`,
  conf:`function burst(x, y, parent){
    for (let i = 0; i < 30; i++){
      const p = document.createElement('span');
      p.style.cssText = 'position:absolute;left:'+x+'px;top:'+y+'px;' +
        'width:6px;height:6px;border-radius:50%;' +
        'background:#8B7CF7';
      parent.appendChild(p);
      const a = -Math.PI * Math.random(), v = 60 + Math.random()*90;
      p.animate([
        {transform:'translate(0,0)', opacity:1},
        {transform:'translate('+(Math.cos(a)*v)+'px,'+
          (Math.sin(a)*v+80)+'px) rotate(360deg)', opacity:0}
      ], {duration: 800 + Math.random()*500,
          easing:'cubic-bezier(.15,.6,.4,1)'}).onfinish = () => p.remove();
    }
  }`,
  tip:`btn.addEventListener('mouseenter', () => {
    const br = btn.getBoundingClientRect();
    const sr = btn.closest('.stage').getBoundingClientRect();
    // ¿hay espacio arriba? sino, voltear abajo
    const below = (br.top - sr.top) < 74;
    tip.classList.toggle('below', below);
    tip.classList.toggle('above', !below);
  });`,
  tw:`.tw-line{
    display:inline-block; overflow:hidden; white-space:nowrap;
    border-right:2px solid #8B7CF7; width:0;
    animation: tw 6.5s infinite;
  }
  @keyframes tw{
    0%  {width:0; animation-timing-function:steps(27,end)}
    44% {width:27ch}
    54% {width:27ch; animation-timing-function:steps(27,end)}
    92% {width:0}
    100%{width:0}
  }`,
  gt:`.gtext{
    background:linear-gradient(90deg,
      #E9E6FC,#8B7CF7,#5646C8,#8B7CF7,#E9E6FC);
    background-size:300% 100%;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:gflow 4s linear infinite;
  }
  @keyframes gflow{ to{ background-position-x:-300% } }`
  };
  $$('.copy-btn').forEach(b => b.addEventListener('click', async () => {
    const code = SNIPPETS[b.dataset.snip] || '';
    try { await navigator.clipboard.writeText(code); }
    catch (e){
      const ta = document.createElement('textarea');
      ta.value = code; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); ta.remove();
    }
    window.XandA.toast('Snippet copiado al portapapeles ✦');
  }));

  /* ---------- Terminal CTA con typing ---------- */
  (() => {
    const body = $('#termBody'); if (!body) return;
    const LINES = [
      {h:'<b>$</b> npx xanda create <b>mi-sitio</b>', cmd:'npx xanda create mi-sitio', cls:'cmd'},
      {h:'<span style="color:var(--ok)">✓</span> Plantilla elegida: <b>starter-aurora</b>', cls:'ok', d:650},
      {h:'<span style="color:var(--ok)">✓</span> 42 componentes de la librería instalados', cls:'ok', d:520},
      {h:'<b>➜</b> corre "xanda dev" y ábrelo en tu navegador', cls:'out', d:640}
    ];
    async function play(){
      body.innerHTML = '';
      const first = LINES[0];
      const row = document.createElement('div');
      row.className = 'tl-c cmd'; body.appendChild(row);
      const caret = document.createElement('span');
      caret.className = 'tcursor'; row.appendChild(caret);
      if (reduceMotion){
        row.innerHTML = first.h;
      } else {
        const pre = document.createElement('span'); pre.innerHTML = '<b>$</b> ';
        row.insertBefore(pre, caret);
        for (const ch of first.cmd){
          caret.insertAdjacentText('beforebegin', ch);
          await new Promise(r => setTimeout(r, 26 + Math.random() * 30));
        }
      }
      for (let k = 1; k < LINES.length; k++){
        await new Promise(r => setTimeout(r, LINES[k].d));
        const l = document.createElement('div');
        l.className = 'tl-c ' + LINES[k].cls; l.innerHTML = LINES[k].h;
        body.appendChild(l);
      }
      const end = document.createElement('div');
      end.className = 'tl-c out';
      end.innerHTML = 'Listo en <b style="color:var(--acc)">1.2s</b> <span class="tcursor"></span>';
      body.appendChild(end);
    }
    new IntersectionObserver(([en], obs) => {
      if (en.isIntersecting){ obs.disconnect(); play(); }
    }, {threshold:.4}).observe(body);
    $('#termCopy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('npx xanda create mi-sitio'); } catch(e){}
      window.XandA.toast('Comando copiado ✦');
    });
  })();

  /* ---------- Reveal on scroll ---------- */
  const revObs = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting){ en.target.classList.add('visible'); revObs.unobserve(en.target); }
  }), {threshold:.12});
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * .07 + 's';
    revObs.observe(el);
  });

  /* ---------- Command Palette: órdenes exclusivas del index ----------
     El motor vive en main.js (se inyecta solo si falta el markup,
     atiende ⌘K/Ctrl K, el botón del nav y el del hero).
     Aquí solo registramos los saltos a secciones que solo
     existen en esta página. */
  window.XandA.registerCmdkCommands([
    {g:'Navegación', t:'Ir al inicio', kw:'inicio home hero arriba', run:() => document.getElementById('hero').scrollIntoView({behavior:'smooth'})},
    {g:'Navegación', t:'Ir a Herramientas', kw:'tools herramientas', run:() => document.getElementById('herramientas').scrollIntoView({behavior:'smooth'})},
    {g:'Navegación', t:'Ir al Ecosistema', kw:'ecosistema core nodos', run:() => document.getElementById('ecosistema').scrollIntoView({behavior:'smooth'})},
    {g:'Navegación', t:'Ir a la Librería', kw:'libreria library demos', run:() => document.getElementById('libreria').scrollIntoView({behavior:'smooth'})},
    {g:'Navegación', t:'Ir a Opiniones', kw:'testimonios opiniones', run:() => document.getElementById('opiniones').scrollIntoView({behavior:'smooth'})},
    {g:'Navegación', t:'Ir a Empezar', kw:'empezar cta comenzar', run:() => document.getElementById('empezar').scrollIntoView({behavior:'smooth'})},
    {g:'Secciones', t:'Constructor (sección)', kw:'constructor builder drag', run:() => document.getElementById('row-constructor').scrollIntoView({behavior:'smooth'})},
    {g:'Secciones', t:'Nébula (sección)', kw:'ide nebula editor codigo', run:() => document.getElementById('row-ide').scrollIntoView({behavior:'smooth'})},
    {g:'Secciones', t:'Lúmina (sección)', kw:'convertidor lumina imagenes webp', run:() => document.getElementById('row-convertidor').scrollIntoView({behavior:'smooth'})},
    {g:'Secciones', t:'Visor (sección)', kw:'visor dispositivos responsive', run:() => document.getElementById('row-visor').scrollIntoView({behavior:'smooth'})},
    {g:'Secciones', t:'JSON Builder (sección)', kw:'json builder arbol', run:() => document.getElementById('row-json').scrollIntoView({behavior:'smooth'})}
  ]);
})();