
const menuItems = document.querySelectorAll('.nav-ul .nav-ul-li a');
const contenedorMenu = document.querySelector('.contenedor-menu-celular-main');
const sections = document.querySelectorAll('.section'); // Selecciona todas las secciones
const menuLinks = document.querySelectorAll('.nav-ul .nav-ul-li a'); // Supongo que los links están en el menú

contenedorMenu.innerHTML = ''; // Limpia el contenedor antes de agregar los nuevos elementos

menuItems.forEach(item => {
    // Crea el div contenedor de la opción
    const div = document.createElement('div');
    div.classList.add('menu-celular-opciones');

    // Crea el enlace <a> que tendrá el mismo texto y href que el original
    const a = document.createElement('a');
    a.textContent = item.textContent;  // Establece el texto del enlace
    a.href = item.href;  // Asigna el mismo href que el enlace original

    // Añade un evento para cerrar el menú cuando se haga clic en el enlace
    a.addEventListener('click', () => {
        cerrar_menu(); // Cierra el menú
    });

    // Añade el enlace <a> al div
    div.appendChild(a);

    // Añade el div al contenedor
    contenedorMenu.appendChild(div);
});

// Función para abrir el menú del celular
function abrir_menu() {
    document.getElementById('menu_celular').style.display = 'flex';
}

// Función para cerrar el menú del celular
function cerrar_menu() {
    document.getElementById('menu_celular').style.display = 'none';
}

// Función para manejar la visibilidad del menú en función del tamaño de la ventana
function ajustarMenu() {
    const menuCelular = document.getElementById('menu_celular');
    
    if (window.innerWidth > 800) {
        // Si la ventana es más grande que 800px, ocultamos el menú
        menuCelular.style.display = 'none';
    } else {
        // Si la ventana es menor o igual a 800px, dejamos el menú según el estado de la variable
        if (menuCelular.style.display === 'flex') {
            // Si el menú está visible, lo mantenemos visible
            menuCelular.style.display = 'flex';
        } else {
            // Si no está visible, lo dejamos oculto
            menuCelular.style.display = 'none';
        }
    }
}

ajustarMenu();
window.addEventListener('resize', ajustarMenu);

window.addEventListener("scroll", function() {
    const header = document.querySelector(".header");

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    // Aquí es donde ya puedes usar "sections"
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 50;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            if (menuLinks[index]) {
                menuLinks[index].classList.add("active");
            }
        } else {
            if (menuLinks[index]) {
                menuLinks[index].classList.remove("active");
            }
        }
    });
});
