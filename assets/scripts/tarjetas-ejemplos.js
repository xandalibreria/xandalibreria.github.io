const contenedor = document.querySelector(".contenedor-tarjeta-ejemplos");

// Define las 5 tarjetas únicas, cada una con su SVG y texto específico
const tarjetasInfo = [
  {
    texto: "Estructuras",
    svg: `<i class="fa-solid fa-sitemap"></i>`
  },
  {
    texto: "Animaciones",
    svg: `<i class="fa-solid fa-person-running"></i>`
  },
  {
    texto: "Carruseles",
    svg: `<i class="fa-solid fa-pager"></i>`
  },
  {
    texto: "Formularios",
    svg: `<i class="fa-solid fa-pager"></i>`
  },
  {
    texto: "Alerts",
    svg: `<i class="fa-solid fa-window-maximize"></i>`
  }
];

function crearTarjeta(index) {
  const info = tarjetasInfo[index];

  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-ejemplos");

  // Posición y tamaño aleatorio
  const size = Math.floor(Math.random() * 80) + 50;
  const posX = Math.floor(Math.random() * (520 - size));
  const posY = Math.floor(Math.random() * (520 - size));
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
    contenedor.removeChild(tarjeta);
  }, 4000);
}

function loopAnimaciones() {
  for (let i = 0; i < tarjetasInfo.length; i++) {
    setTimeout(() => crearTarjeta(i), i * 500);
  }
}

setInterval(loopAnimaciones, 2500);
loopAnimaciones();