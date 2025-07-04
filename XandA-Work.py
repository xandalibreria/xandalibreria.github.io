import os

# Lista de las carpetas principales
carpetas_principales = ["assets", "pages", "docs", "config"]

# Lista de subcarpetas dentro de 'assets'
subcarpetas_assets = ["images", "json", "styles", "scripts", "fonts"]

# Archivos en la raíz
archivos_raiz = [
    ("index.html", """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>index</title>
  <meta name="date" content="2024-09-05">
  <link rel="canonical" href="URL">
  <meta name="theme-color" content="#ffffff">
  <link rel="alternate" hreflang="es" href="URL">
  <meta name="mobile-web-app-capable" content="yes">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="Referrer-Policy" content="no-referrer-when-downgrade">-->
  
  <!-- SEO -->
  <meta name="description" content="Descripcion">
  <meta name="keywords" content="Palabras clave">
  <meta name="author" content="Autor">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="subject" content="Subject">
  <meta name="rating" content="General">
  
  <!-- Open Graph para Redes Sociales -->
  <meta property="og:title" content="Titulo">
  <meta property="og:type" content="website">
  <meta property="og:url" content="URL">
  <meta property="og:description" content="Descripcion">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="Mundo Ejecutivo Suscripciones">
  <meta property="og:image" content="assets/images/">

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Titulo">
  <meta name="twitter:description" content="Descripcion">
  <meta name="twitter:site" content="@Mundo Ejecutivo Suscripciones">
  <meta name="twitter:image" content="assets/images/">
  <meta property="og:image:alt" content="Titulo">

  <!-- Favicon -->
  <link rel="icon" href="assets/images/favicon.ico">
  <link rel="icon" href="assets/images/favicon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="assets/images/favicon.ico" type="image/x-icon">

  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon-180x180.png">
  <link rel="apple-touch-icon" sizes="152x152" href="assets/images/apple-touch-icon-152x152.png">
  <link rel="apple-touch-icon" sizes="120x120" href="assets/images/apple-touch-icon-120x120.png">
  <link rel="apple-touch-icon" sizes="76x76" href="assets/images/apple-touch-icon-76x76.png">

  <!-- Iconos para Android -->
  <link rel="icon" sizes="192x192" href="assets/images/android-chrome-192x192.png">
  <link rel="icon" sizes="512x512" href="assets/images/android-chrome-512x512.png">

  <!-- Otros formatos -->
  <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon-16x16.png">

  <!-- AWESOME  -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

  <!-- AOS -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

  <!-- CSS -->
  <link rel="stylesheet" href="assets/styles/main.css">

  <!-- Datos Estructurados JSON-LD -->
  <script type="application/ld+json">
      {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      "name": "Nombre",
      "url": "URL",
      "logo": "assets/images/logo.png",
      "sameAs": [
          "URL Redes Sociales",
          "URL Redes Sociales"
      ],
      "description": "Descripcion",
      "founder": "Nombre del fundador",
      "foundingDate": "Año",
      "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "email": "correo electrónico",
          "url": "URL contacto"
      }
      }
  </script>


  <!-- Fuentes -->

</head>
<body>
    <!-- Header -->
    <header>

    </header>

    <!-- Main -->
    <main>

    </main>

    <!-- Footer -->
    <footer>

    </footer>
     
    <!-- Scripts -->
    <script src="assets/scripts/main.js"></script>
</body>
</html>
"""),
    ("styles.css", """
p, h2, h2, h3, a, img{
  margin: 0px;
  padding: 0px;
}
"""),
    ("manifest.json", """{
  "name": "Proyecto Web",
  "short_name": "Proyecto",
  "description": "Descripción del proyecto",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}"""),
    ("licence.txt", """

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License

Mundo Ejecutivo

Este trabajo está bajo una licencia Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional. Puedes compartir y adaptar el material siempre que des crédito al autor, no lo utilices para fines comerciales y distribuyas tus contribuciones bajo la misma licencia.

Para ver una copia de esta licencia, visita:
http://creativecommons.org/licenses/by-nc-sa/4.0/

Atribución:
Este sitio web ha sido diseñado, maquetado y desarrollado en su totalidad por Asiel Jiménez. Las imágenes y recursos gráficos utilizados han sido obtenidos de Freepik y FlatIcon, con los respectivos créditos incluidos.

Fecha: 2024
"""),
    ("robots.txt", """User-agent: *
Disallow: /admin/
Allow: /"""),
    ("sitemap.xml", """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>index.html</loc>
    <lastmod>2025-01-17</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>""")
]

# Crear las carpetas principales
for carpeta in carpetas_principales:
    if not os.path.exists(carpeta):
        os.makedirs(carpeta)
        print(f"Carpeta '{carpeta}' creada.")
    else:
        print(f"La carpeta '{carpeta}' ya existe.")

# Crear las subcarpetas dentro de 'assets' y los archivos necesarios
for subcarpeta in subcarpetas_assets:
    ruta_subcarpeta = os.path.join("assets", subcarpeta)
    
    if not os.path.exists(ruta_subcarpeta):
        os.makedirs(ruta_subcarpeta)
        print(f"Subcarpeta '{ruta_subcarpeta}' creada.")
    
    # Crear los archivos correspondientes en 'styles', 'scripts' y 'json'
    if subcarpeta == "styles":
        archivo_css = os.path.join(ruta_subcarpeta, "main.css")
        if not os.path.exists(archivo_css):
            with open(archivo_css, 'w') as f:
                f.write("""/* Estilos básicos para el proyecto */

body {
  font-family: Arial, sans-serif;
}""")
            print(f"Archivo '{archivo_css}' creado con contenido.")
    elif subcarpeta == "scripts":
        archivo_js = os.path.join(ruta_subcarpeta, "main.js")
        if not os.path.exists(archivo_js):
            with open(archivo_js, 'w') as f:
                f.write("""
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
""")
            print(f"Archivo '{archivo_js}' creado con contenido.")
    elif subcarpeta == "json":
        archivo_json = os.path.join(ruta_subcarpeta, "package.json")
        if not os.path.exists(archivo_json):
            with open(archivo_json, 'w') as f:
                f.write("""{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "description": "Descripción del proyecto",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}""")
            print(f"Archivo '{archivo_json}' creado con contenido.")

# Crear el archivo 'README.md' dentro de la carpeta 'docs'
archivo_readme = os.path.join("docs", "README.md")
if not os.path.exists(archivo_readme):
    with open(archivo_readme, 'w') as f:
        f.write("""
# Framework de Creación Rápida de Sitios Web

Este documento describe el marco de trabajo **"SitioWebGen"**, creado por **Asiel Jiménez**, que facilita la creación de un sitio web básico. Este framework automatiza la creación de la estructura de carpetas, subcarpetas y archivos necesarios para comenzar un proyecto web, ahorrando tiempo en la configuración inicial del mismo. 

## ¿Qué es "SitioWebGen"?

"SitioWebGen" es un framework de Python diseñado para facilitar la creación de sitios web. Al ejecutar el archivo `framework.py`, el sistema automáticamente genera las siguientes carpetas y archivos:

- **Carpetas principales**: `assets`, `pages`, `docs`, `config`.
- **Subcarpetas dentro de `assets`**: `images`, `json`, `styles`, `scripts`.
- **Archivos de configuración y de contenido**: como `index.html`, `styles.css`, `manifest.json`, `robots.txt`, `sitemap.xml`, entre otros.

Este marco de trabajo está orientado a desarrolladores, diseñadores o cualquier persona que necesite crear un sitio web de manera rápida y estructurada. **El uso de este framework es libre, pero es obligatorio mencionar a Asiel Jiménez como autor y dar los créditos correspondientes si decides utilizarlo.**

## Estructura de Carpetas y Archivos Generados

### 1. **Carpetas Principales**

Al ejecutar el archivo `framework.py`, se generan las siguientes carpetas principales en la raíz del proyecto:

- **assets**: Carpeta destinada a los recursos estáticos del sitio web (imágenes, estilos, scripts, archivos JSON).
- **pages**: Carpeta para alojar las páginas HTML del sitio web.
- **docs**: Carpeta para documentación del proyecto, como el archivo `README.md` y otros documentos técnicos.
- **config**: Carpeta para la configuración y el código auxiliar (en este caso, contiene el archivo `pages.py`).

### 2. **Subcarpetas dentro de `assets`**

Dentro de la carpeta `assets`, se crean las siguientes subcarpetas:

- **images**: Destinada a contener las imágenes del sitio web.
- **json**: Para archivos JSON, como un posible archivo `package.json` o configuraciones adicionales.
- **styles**: Carpeta para los archivos de estilo CSS. El archivo `main.css` es creado con estilos básicos.
- **scripts**: Carpeta para los archivos JavaScript. El archivo `main.js` es creado con un script básico que imprime un mensaje en la consola.

### 3. **Archivos Generados**

A continuación se detalla el contenido de los archivos generados:

#### **index.html**
Este archivo es la página principal del sitio web. Contiene la estructura básica de una página HTML con un título y un encabezado.

```html
<html>
<head>
  <title>Inicio del Proyecto</title>
</head>
<body>
  <h1>Bienvenido a mi proyecto</h1>
</body>
</html>
```

#### **styles.css**
Este archivo contiene estilos básicos para la página web, como la definición de la fuente para el cuerpo de la página.

```css
/* Estilos generales para la página */
body {
  font-family: Arial, sans-serif;
}
```

#### **manifest.json**
Este archivo JSON contiene los metadatos del proyecto, lo que lo hace adecuado para aplicaciones web progresivas (PWA). Define el nombre del proyecto, la URL de inicio, el color de fondo, entre otras configuraciones.

```json
{
  "name": "Proyecto Web",
  "short_name": "Proyecto",
  "description": "Descripción del proyecto",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

#### **licence.txt**
El archivo de licencia en formato de texto. El proyecto está bajo la Licencia MIT, que permite usar, modificar y distribuir el código, siempre que se mencione a Asiel Jiménez como autor.

```txt
Licencia MIT

Este proyecto está bajo la Licencia MIT. Puedes utilizarlo, modificarlo y distribuirlo bajo los términos de dicha licencia.
```

#### **sitemap.xml**
Este archivo XML es utilizado por los motores de búsqueda para saber cuáles son las URLs más importantes del sitio. Contiene información sobre las URLs del sitio web y su prioridad de indexación.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.tusitio.com/</loc>
    <lastmod>2025-01-17</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.tusitio.com/about</loc>
    <lastmod>2025-01-17</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

#### **README.md**
Este archivo contiene una breve descripción de tu proyecto y cómo configurarlo. Este es el archivo donde puedes documentar los detalles sobre tu sitio web, tecnologías usadas y cualquier otra información relevante.

#### **framework.md**
Este archivo es crucial para entender el funcionamiento del framework y cómo personalizarlo para tus necesidades. Aquí es donde explico cómo ejecutar el script framework.py, qué carpetas y archivos se generarán y cómo puedes empezar a trabajar con el proyecto.

#### **404.html**
Este es el archivo HTML que se muestra cuando un usuario accede a una página que no existe. Contiene una estructura básica de una página 404 con enlaces a otras partes del sitio.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404</title>
  <link rel="stylesheet" href="../assets/styles/main.css">
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section>
      <h2>SUBTITULO</h2>
    </section>
    <section>
      <h2>SUBTITULO</h2>
    </section>
    <section>
      <h2>SUBTITULO</h2>
    </section>
  </main>
  <footer></footer>
  <script src="../assets/scripts/main.js"></script>
</body>
</html>
```
""")
    print(f"Archivo '{archivo_readme}' creado con contenido.")

# Crear el archivo 'framework.md' dentro de la carpeta 'docs'
archivo_framework = os.path.join("docs", "framework.md")
if not os.path.exists(archivo_framework):
    with open(archivo_framework, 'w') as f:
        f.write("""# Framework del Proyecto

Este documento describe el marco de trabajo y las tecnologías utilizadas en el proyecto.

## Tecnologías

- Python
- HTML/CSS
- JavaScript""")
    print(f"Archivo '{archivo_framework}' creado con contenido.")

# Crear el archivo '404.html' dentro de la carpeta 'pages'
archivo_404 = os.path.join("pages", "404.html")
if not os.path.exists(archivo_404):
    with open(archivo_404, 'w') as f:
        f.write("""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404</title>

  <!-- Styles -->
  <link rel="stylesheet" href="../assets/styles/main.css">
</head>
<body>
  <!-- Header -->
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <!-- Main -->
  <main>
    <!-- Section X -->
    <section>
      <h2>SUBTITULO</h2>
    </section>

    <!-- Section X -->
    <section>
      <h2>SUBTITULO</h2>
    </section>

    <!-- Section X -->
    <section>
      <h2>SUBTITULO</h2>
    </section>
  </main>

  <!-- Footer -->
  <footer>
  </footer>

  <!-- Scripts -->
  <script src="../assets/scripts/main.js"></script>
</body>
</html>""")
    print(f"Archivo '{archivo_404}' creado con contenido.")

# Crear el archivo 'pages.py' dentro de la carpeta 'config'
archivo_pages_py = os.path.join("config", "pages.py")
if not os.path.exists(archivo_pages_py):
    with open(archivo_pages_py, 'w') as f:
        f.write("""# pages.py""")
    print(f"Archivo '{archivo_pages_py}' creado con contenido.")

# Crear los archivos en la raíz
for nombre_archivo, contenido in archivos_raiz:
    ruta_archivo = os.path.join(".", nombre_archivo)
    if not os.path.exists(ruta_archivo):
        with open(ruta_archivo, 'w') as f:
            f.write(contenido)
        print(f"Archivo '{ruta_archivo}' creado con contenido.")