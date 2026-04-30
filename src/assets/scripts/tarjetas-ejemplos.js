const contenedor = document.querySelector(".contenedor-tarjeta-ejemplos");

const tarjetasInfo = [
  { texto: "Estructuras", svg: `<i class="fa-solid fa-sitemap"></i>` },
  { texto: "Animaciones", svg: `<i class="fa-solid fa-person-running"></i>` },
  { texto: "Carruseles", svg: `<i class="fa-solid fa-pager"></i>` },
  { texto: "Formularios", svg: `<i class="fa-solid fa-keyboard"></i>` },
  { texto: "Alerts", svg: `<i class="fa-regular fa-bell"></i>` }
];

function getResponsiveSize() {
  const width = window.innerWidth;

  const maxDesktop = 130; // tamaño máximo normal
  const maxMobile = 80;   // tamaño máximo en móvil

  if (width >= 800) return maxDesktop;

  // 🔥 interpolación proporcional (esto es lo importante)
  const ratio = width / 800; // de 0 a 1
  return maxMobile + (maxDesktop - maxMobile) * ratio;
}

function crearTarjeta(index) {
  const info = tarjetasInfo[index];

  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-ejemplos");

  const contenedorWidth = contenedor.clientWidth;
  const contenedorHeight = contenedor.clientHeight;

  // 🎯 Tamaño dinámico
  const maxSize = getResponsiveSize();
  const minSize = maxSize * 0.5;

  const size = Math.random() * (maxSize - minSize) + minSize;

  // 📍 Posición
  const posX = Math.random() * (contenedorWidth - size);
  const posY = Math.random() * (contenedorHeight - size);

  tarjeta.style.width = size + "px";
  tarjeta.style.height = size + "px";
  tarjeta.style.left = posX + "px";
  tarjeta.style.top = posY + "px";

  tarjeta.innerHTML = `
    ${info.svg}
    <p class="tarjeta-ejemplos-parrafo">${info.texto}</p>
  `;

  contenedor.appendChild(tarjeta);

  setTimeout(() => {
    if (contenedor.contains(tarjeta)) {
      contenedor.removeChild(tarjeta);
    }
  }, 4000);
}

function loopAnimaciones() {
  for (let i = 0; i < tarjetasInfo.length; i++) {
    setTimeout(() => crearTarjeta(i), i * 500);
  }
}

setInterval(loopAnimaciones, 2500);
loopAnimaciones();