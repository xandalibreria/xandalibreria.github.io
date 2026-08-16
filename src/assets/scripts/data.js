/* ============================================================
   XandA — Librería — data.js
   Contenido real de cada recurso (se genera y descarga en el navegador,
   no requiere backend).
   ============================================================ */

const ICONS = {
  layers:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  template:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,
  puzzle:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-3.408 0l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568a2.404 2.404 0 0 1 0-3.408l1.61-1.61a.98.98 0 0 1 .838-.276c.47.07.801.48.967.925a2.5 2.5 0 1 0 3.215-3.215c-.446-.166-.855-.497-.925-.967a.98.98 0 0 1 .276-.838l1.61-1.61a2.404 2.404 0 0 1 3.409 0l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z"></path></svg>`,
  sparkles:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>`,
  search:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  download:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  file:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
  folder:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>`,
  check:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  close:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  code:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  cart:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  atom:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"></path><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"></path></svg>`,
  leaf:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>`,
  server:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"></rect><rect x="2" y="14" width="20" height="8" rx="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
  user:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  megaphone:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>`,
  grid:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  pen:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`,
  gauge:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>`,
  chef:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-8a5 5 0 0 0-10 0v8"></path><path d="M4 21h16"></path><circle cx="12" cy="6" r="4"></circle></svg>`,
  bell:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>`,
  window:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg>`,
  info:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  cookie:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><line x1="8.5" y1="8.5" x2="8.51" y2="8.5"></line><line x1="15" y1="12" x2="15.01" y2="12"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>`,
  chevron:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  wind:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2"></path><path d="M17.59 19.41A2 2 0 1 0 19 16H2"></path><path d="M12.59 11.59A2 2 0 1 1 14 15H2"></path></svg>`,
  move:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>`,
  zoom:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  loader:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
  eye:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  bounce:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"></circle><path d="M12 8v13"></path><path d="M8 21h8"></path></svg>`,
  constructor:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
  <rect x="14" y="3" width="7" height="7" rx="1"></rect>
  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  <path d="M17.5 14v2.5H15v4h4v-2.5h2.5v-4H17.5z"></path>
</svg>`
};

const README = (title, extra="") => `# ${title}

Estructura generada por la Librería de XandA.

## Cómo usarla
1. Descomprime este archivo.
2. Copia el contenido dentro de la carpeta de tu proyecto.
3. Sigue las instrucciones específicas del stack (abajo) si aplica.

${extra}
---
Generado gratuitamente desde XandA — https://xanda.dev
`;

/* ---------------------------------------------------------
ESTRUCTURAS — esqueletos base de proyecto (multi-archivo → zip)
---------------------------------------------------------- */
const ESTRUCTURAS = [
    {
    id:"est-html",
    name:"Estructura HTML",
    desc:"Esqueleto base para un sitio estático: HTML semántico, hoja de estilos organizada y script de entrada listo para escalar.",
    tags:["HTML","CSS","JS"],
    icon:"code",
    meta:"4 archivos · 3 KB",
    files:{"index.html":`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index</title>
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
    <meta property="og:site_name" content="nombre">
    <meta property="og:image" content="assets/images/">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Titulo">
    <meta name="twitter:description" content="Descripcion">
    <meta name="twitter:site" content="nombre">
    <meta name="twitter:image" content="assets/images/">
    <meta property="og:image:alt" content="Titulo">

    <!-- Favicon -->
    <link rel="icon" href="favicon.ico">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="src/assets/images/icons/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="152x152" href="src/assets/images/icons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="120x120" href="src/assets/images/icons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="76x76" href="src/assets/images/icons/apple-touch-icon-76x76.png">

    <!-- Iconos para Android -->
    <link rel="icon" sizes="192x192" href="src/assets/images/icons/android-chrome-192x192.png">
    <link rel="icon" sizes="512x512" href="src/assets/images/icons/android-chrome-512x512.png">

    <!-- Otros formatos -->
    <link rel="icon" type="image/png" sizes="32x32" href="src/assets/images/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="src/assets/images/icons/favicon-16x16.png">

    <!-- AWESOME  -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <!-- AOS -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" href="src/assets/styles/main.css">

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
<body class="body">
    <!-- Header -->
    <header class="header">
    </header>

    <!-- Main -->
    <main class="main">
    </main>

    <!-- Footer -->
    <footer class="footer">
    </footer>

    <!-- Scripts -->
    <script src="src/assets/scripts/main.js"></script>
</body>
</html>`,
    "sitemap.xml": `
<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- URLs del sitio -->
</urlset>
`,
    "manifest.json": `
{
    "name": "Proyecto",
    "shorts_name": "Proyecto",
    "start_url": "/",
    "display": "standalone"
}`,
    "robots.txt": `
{
User-agent: *
Disallow:
}`,
    "LICENSE.txt": `

    `,
    ".htaccess": `
# Aquí puedes poner reglas para Apache
    `,
    ".gitignore": `
# Aquí pon tus excepciones
    `,
    "src/assets/styles/main.css": `
*{
    margin: 0px;
    padding: 0px;
}
    "`,
    "src/assets/scripts/main.js": `
// Aquí va el contenido JS principal
console.log('Hola mundo');
    "`,
    "src/assets/images/icons/.gitkeep": `

    "`,
    "src/assets/images/svg/.gitkeep": `

    "`,
    "src/assets/fonts/.gitkeep": `

    "`,
    "src/components/.gitkeep": `

    "`,
    "src/utils/.gitkeep": `

    "`,
    "src/config/.gitkeep": `

    "`,
    "src/pages/404.html": `

    "`,
    "test/.gitkeep": `

    "`,
    "docs/README.md": `

    "`
    }
    },





    {
    id:"est-wordpress",
    name:"Estructura WordPress",
    desc:"Base para un tema propio de WordPress: encabezado de tema, plantilla principal y funciones esenciales.",
    tags:["PHP","WordPress"],
    icon:"leaf",
    meta:"4 archivos · 4 KB",
    files:{
      "style.css":`/*
Theme Name: Mi Tema XandA
Theme URI: https://xanda.dev
Author: Tu nombre
Description: Tema base generado por la Librería de XandA.
Version: 1.0
*/`,
      "index.php":`<?php get_header(); ?>

<main class="site-main">
  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <article <?php post_class(); ?>>
      <h1><?php the_title(); ?></h1>
      <div class="entry-content"><?php the_content(); ?></div>
    </article>
  <?php endwhile; endif; ?>
</main>

<?php get_footer(); ?>`,
      "functions.php":`<?php
function xanda_theme_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  register_nav_menus(['main-menu' => __('Menú principal')]);
}
add_action('after_setup_theme', 'xanda_theme_setup');

function xanda_enqueue_assets() {
  wp_enqueue_style('xanda-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'xanda_enqueue_assets');`,
      "README.md": README("Estructura WordPress", "## Instalación\n1. Copia la carpeta a `wp-content/themes/`.\n2. Activa el tema desde el panel de WordPress.\n3. Agrega `header.php` y `footer.php` según tu diseño.")
    }
  },
  {
    id:"est-shopify",
    name:"Estructura Shopify",
    desc:"Andamiaje inicial de un tema de Shopify: layout, sección de encabezado y configuración global del tema.",
    tags:["Liquid","Shopify"],
    icon:"cart",
    meta:"3 archivos · 3 KB",
    files:{
      "layout/theme.liquid":`<!DOCTYPE html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ page_title }}</title>
  {{ content_for_header }}
</head>
<body>
  {% section 'header' %}
  <main role="main">
    {{ content_for_layout }}
  </main>
  {% section 'footer' %}
</body>
</html>`,
      "sections/header.liquid":`<header class="shop-header">
  <a href="/" class="shop-logo">{{ shop.name }}</a>
  <nav>
    {% for link in linklists.main-menu.links %}
      <a href="{{ link.url }}">{{ link.title }}</a>
    {% endfor %}
  </nav>
</header>

{% schema %}
{
  "name": "Header",
  "settings": []
}
{% endschema %}`,
      "config/settings_schema.json":`[
  {
    "name": "theme_info",
    "theme_name": "Mi Tema XandA",
    "theme_version": "1.0.0",
    "theme_author": "XandA"
  }
]`,
      "README.md": README("Estructura Shopify", "## Instalación\n1. Sube los archivos con Shopify CLI: `shopify theme push`.\n2. O arrástralos dentro del editor de temas online.")
    }
  },
  {
    id:"est-react",
    name:"Estructura React",
    desc:"Proyecto React inicial (Vite) con componente raíz, punto de montaje y configuración mínima de paquete.",
    tags:["React","Vite","JS"],
    icon:"atom",
    meta:"4 archivos · 2 KB",
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>App React</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,
      "src/main.jsx":`import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      "src/App.jsx":`export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 40 }}>
      <h1>Mi App React</h1>
      <p>Estructura generada por la Librería de XandA.</p>
    </div>
  );
}`,
      "package.json":`{
  "name": "mi-app-react",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}`,
      "README.md": README("Estructura React", "## Instalación\n```\nnpm install\nnpm run dev\n```")
    }
  },
  {
    id:"est-vue",
    name:"Estructura Vue",
    desc:"Proyecto Vue 3 inicial (Vite) con componente raíz de un solo archivo y configuración de paquete lista.",
    tags:["Vue","Vite","JS"],
    icon:"layers",
    meta:"4 archivos · 2 KB",
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>App Vue</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`,
      "src/main.js":`import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");`,
      "src/App.vue":`<template>
  <div style="font-family: sans-serif; padding: 40px;">
    <h1>Mi App Vue</h1>
    <p>Estructura generada por la Librería de XandA.</p>
  </div>
</template>

<script setup>
</script>`,
      "package.json":`{
  "name": "mi-app-vue",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
}`,
      "README.md": README("Estructura Vue", "## Instalación\n```\nnpm install\nnpm run dev\n```")
    }
  },
  {
    id:"est-laravel",
    name:"Estructura Laravel",
    desc:"Andamiaje de rutas y vista principal para un proyecto Laravel, listo para conectar tu lógica de backend.",
    tags:["PHP","Laravel"],
    icon:"server",
    meta:"3 archivos · 2 KB",
    files:{
      "routes/web.php":`<?php

use Illuminate\\Support\\Facades\\Route;

Route::get('/', function () {
    return view('welcome');
});`,
      "resources/views/welcome.blade.php":`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi Proyecto Laravel</title>
</head>
<body>
  <h1>Bienvenido a tu proyecto Laravel</h1>
  <p>Estructura generada por la Librería de XandA.</p>
</body>
</html>`,
      ".env.example":`APP_NAME=MiProyecto
APP_ENV=local
APP_KEY=
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=mi_proyecto`,
      "README.md": README("Estructura Laravel", "## Instalación\n1. Copia las rutas y vistas dentro de un proyecto Laravel existente (`laravel new mi-proyecto`).\n2. Renombra `.env.example` a `.env` y configura tu base de datos.")
    }
  }
];

/* ---------------------------------------------------------
   PLANTILLAS — proyectos con diseño ya incluido (multi-archivo → zip)
---------------------------------------------------------- */
const PLANTILLAS = [
  {
    id:"tpl-portafolio",
    name:"Portafolio",
    desc:"Plantilla de una sola página para mostrar proyectos, experiencia y datos de contacto con estilo minimalista.",
    tags:["HTML","CSS"],
    icon:"user",
    meta:"2 archivos · 6 KB",
    swatch:["#7C3AED","#EFE9FE"],
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Portafolio</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="hero">
    <h1>Hola, soy <span>Tu Nombre</span></h1>
    <p>Diseñador &amp; desarrollador web</p>
  </header>

  <section class="projects">
    <h2>Proyectos</h2>
    <div class="grid">
      <div class="project-card"><h3>Proyecto 1</h3><p>Breve descripción del proyecto.</p></div>
      <div class="project-card"><h3>Proyecto 2</h3><p>Breve descripción del proyecto.</p></div>
      <div class="project-card"><h3>Proyecto 3</h3><p>Breve descripción del proyecto.</p></div>
    </div>
  </section>

  <footer>
    <p>Contacto: hola@tudominio.com</p>
  </footer>
</body>
</html>`,
      "style.css":`:root{--purple:#7C3AED;--ink:#14101F;}
*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}
body{color:var(--ink);}
.hero{padding:100px 40px;text-align:center;background:linear-gradient(135deg,#7C3AED,#C026D3);color:#fff;}
.hero span{color:#FDE68A;}
.projects{padding:80px 40px;max-width:1000px;margin:0 auto;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:30px;}
.project-card{border:1px solid #eee;border-radius:16px;padding:24px;}
footer{padding:40px;text-align:center;color:#888;}`
    }
  },
  {
    id:"tpl-landing",
    name:"Landing Page",
    desc:"Página de aterrizaje enfocada en conversión: hero con llamado a la acción, beneficios y sección de precios.",
    tags:["HTML","CSS"],
    icon:"megaphone",
    meta:"2 archivos · 7 KB",
    swatch:["#C026D3","#EFE9FE"],
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Landing Page</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <section class="hero">
    <h1>Lanza tu producto más rápido</h1>
    <p>La landing perfecta para presentar tu idea al mundo.</p>
    <a href="#" class="btn">Empezar ahora</a>
  </section>

  <section class="benefits">
    <div><h3>Rápido</h3><p>Optimizada para carga instantánea.</p></div>
    <div><h3>Responsiva</h3><p>Se adapta a cualquier dispositivo.</p></div>
    <div><h3>Lista para usar</h3><p>Solo edita el contenido y publica.</p></div>
  </section>
</body>
</html>`,
      "style.css":`*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}
.hero{padding:120px 40px;text-align:center;background:#14101F;color:#fff;}
.hero p{margin:16px 0 28px;color:#c9c2e0;}
.btn{background:linear-gradient(135deg,#7C3AED,#C026D3);color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;}
.benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;padding:80px 40px;max-width:1000px;margin:0 auto;text-align:center;}`
    }
  },
  {
    id:"tpl-tienda",
    name:"Tienda Online",
    desc:"Vitrina de productos en cuadrícula con tarjetas de precio, lista para conectar a tu catálogo real.",
    tags:["HTML","CSS"],
    icon:"cart",
    meta:"2 archivos · 6 KB",
    swatch:["#8B5CF6","#EFE9FE"],
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tienda Online</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <header><h1>Mi Tienda</h1></header>
  <main class="products">
    <div class="product"><div class="img"></div><h3>Producto 1</h3><p>$299 MXN</p><button>Agregar</button></div>
    <div class="product"><div class="img"></div><h3>Producto 2</h3><p>$450 MXN</p><button>Agregar</button></div>
    <div class="product"><div class="img"></div><h3>Producto 3</h3><p>$199 MXN</p><button>Agregar</button></div>
    <div class="product"><div class="img"></div><h3>Producto 4</h3><p>$599 MXN</p><button>Agregar</button></div>
  </main>
</body>
</html>`,
      "style.css":`*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}
header{padding:30px 40px;border-bottom:1px solid #eee;}
.products{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:40px;}
.product{border:1px solid #eee;border-radius:14px;padding:16px;text-align:center;}
.img{height:120px;border-radius:10px;background:linear-gradient(135deg,#7C3AED,#C026D3);margin-bottom:12px;}
button{margin-top:10px;background:#14101F;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;}`
    }
  },
  {
    id:"tpl-blog",
    name:"Blog",
    desc:"Listado de artículos con imagen destacada, extracto y metadatos, ideal para publicar contenido con frecuencia.",
    tags:["HTML","CSS"],
    icon:"pen",
    meta:"2 archivos · 5 KB",
    swatch:["#6D28D9","#EFE9FE"],
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <header><h1>Mi Blog</h1></header>
  <main class="posts">
    <article><div class="cover"></div><h2>Título del artículo</h2><p>Un breve extracto que invita a seguir leyendo...</p><span>12 jul 2026</span></article>
    <article><div class="cover"></div><h2>Otro artículo interesante</h2><p>Un breve extracto que invita a seguir leyendo...</p><span>5 jul 2026</span></article>
  </main>
</body>
</html>`,
      "style.css":`*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}
header{padding:30px 40px;border-bottom:1px solid #eee;}
.posts{max-width:700px;margin:0 auto;padding:40px 20px;display:flex;flex-direction:column;gap:36px;}
.cover{height:180px;border-radius:14px;background:linear-gradient(135deg,#7C3AED,#C026D3);}
article h2{margin-top:14px;}
article span{color:#999;font-size:13px;}`
    }
  },
  {
    id:"tpl-dashboard",
    name:"Dashboard",
    desc:"Panel administrativo con barra lateral, tarjetas de métricas y estructura lista para conectar tus datos.",
    tags:["HTML","CSS"],
    icon:"gauge",
    meta:"2 archivos · 6 KB",
    swatch:["#5B21B6","#EFE9FE"],
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <h2>Panel</h2>
      <nav><a href="#">Inicio</a><a href="#">Reportes</a><a href="#">Ajustes</a></nav>
    </aside>
    <main>
      <h1>Resumen</h1>
      <div class="cards">
        <div class="card"><span>Ventas</span><strong>$12,400</strong></div>
        <div class="card"><span>Usuarios</span><strong>1,204</strong></div>
        <div class="card"><span>Pedidos</span><strong>328</strong></div>
      </div>
    </main>
  </div>
</body>
</html>`,
      "style.css":`*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}
.layout{display:flex;min-height:100vh;}
.sidebar{width:220px;background:#14101F;color:#fff;padding:24px;}
.sidebar nav{display:flex;flex-direction:column;gap:14px;margin-top:20px;}
.sidebar a{color:#c9c2e0;text-decoration:none;}
main{flex:1;padding:40px;}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:24px;}
.card{border:1px solid #eee;border-radius:14px;padding:20px;}
.card strong{display:block;font-size:24px;margin-top:6px;}`
    }
  },
  {
    id:"tpl-restaurante",
    name:"Restaurante",
    desc:"Página de menú con secciones por categoría, precios y llamado a la acción para reservar mesa.",
    tags:["HTML","CSS"],
    icon:"chef",
    meta:"2 archivos · 5 KB",
    swatch:["#A855F7","#EFE9FE"],
    files:{
      "index.html":`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Restaurante</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="hero"><h1>Restaurante XandA</h1><a href="#" class="btn">Reservar mesa</a></header>
  <section class="menu">
    <h2>Menú</h2>
    <div class="item"><span>Plato principal</span><span>$180</span></div>
    <div class="item"><span>Entrada</span><span>$90</span></div>
    <div class="item"><span>Postre</span><span>$70</span></div>
  </section>
</body>
</html>`,
      "style.css":`*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif;}
.hero{padding:100px 40px;text-align:center;background:linear-gradient(135deg,#14101F,#3F3A52);color:#fff;}
.btn{display:inline-block;margin-top:20px;background:linear-gradient(135deg,#7C3AED,#C026D3);color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;}
.menu{max-width:600px;margin:0 auto;padding:60px 20px;}
.item{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #eee;}`
    }
  }
];

/* ---------------------------------------------------------
   COMPONENTES — un solo archivo HTML autocontenido cada uno
---------------------------------------------------------- */
const COMPONENTES = [
  {
    id:"cmp-alert",
    name:"Alert",
    desc:"Mensaje de aviso en línea con variantes de éxito, advertencia y error. Solo HTML y CSS, sin dependencias.",
    tags:["HTML","CSS"],
    icon:"info",
    meta:"1 archivo · 1 KB",
    file:"alert.html",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Alert — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:40px;background:#F6F3FF;}
.xanda-alert{display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:12px;font-size:14px;margin-bottom:12px;border:1px solid transparent;}
.xanda-alert.success{background:#ECFDF5;color:#065F46;border-color:#A7F3D0;}
.xanda-alert.warning{background:#FFFBEB;color:#92400E;border-color:#FDE68A;}
.xanda-alert.error{background:#FEF2F2;color:#991B1B;border-color:#FECACA;}
</style></head>
<body>
  <div class="xanda-alert success">✔ Cambios guardados correctamente.</div>
  <div class="xanda-alert warning">⚠ Revisa los campos antes de continuar.</div>
  <div class="xanda-alert error">✕ Ocurrió un error al procesar tu solicitud.</div>
</body></html>`
  },
  {
    id:"cmp-modal",
    name:"Ventana emergente",
    desc:"Modal centrado con overlay, cierre por botón o clic afuera, y transición suave de entrada.",
    tags:["HTML","CSS","JS"],
    icon:"window",
    meta:"1 archivo · 2 KB",
    file:"modal.html",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Modal — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:40px;background:#F6F3FF;}
button.open{background:#7C3AED;color:#fff;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;}
.xanda-overlay{position:fixed;inset:0;background:rgba(20,16,31,.55);display:none;align-items:center;justify-content:center;}
.xanda-overlay.open{display:flex;}
.xanda-modal{background:#fff;padding:28px;border-radius:16px;max-width:360px;width:100%;}
.xanda-modal h2{margin:0 0 10px;}
.xanda-modal button.close{margin-top:16px;background:#14101F;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;}
</style></head>
<body>
  <button class="open" onclick="document.getElementById('m').classList.add('open')">Abrir modal</button>
  <div class="xanda-overlay" id="m" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="xanda-modal">
      <h2>Título del modal</h2>
      <p>Este es el contenido de tu ventana emergente.</p>
      <button class="close" onclick="document.getElementById('m').classList.remove('open')">Cerrar</button>
    </div>
  </div>
</body></html>`
  },
  {
    id:"cmp-tooltip",
    name:"Tooltip",
    desc:"Texto de ayuda que aparece al pasar el cursor sobre un elemento, con flecha y animación de aparición.",
    tags:["HTML","CSS"],
    icon:"info",
    meta:"1 archivo · 1 KB",
    file:"tooltip.html",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Tooltip — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:80px;background:#F6F3FF;text-align:center;}
.xanda-tooltip{position:relative;display:inline-block;cursor:pointer;border-bottom:1px dashed #7C3AED;}
.xanda-tooltip .bubble{position:absolute;bottom:135%;left:50%;transform:translateX(-50%) scale(.9);background:#14101F;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;white-space:nowrap;opacity:0;transition:.15s;pointer-events:none;}
.xanda-tooltip:hover .bubble{opacity:1;transform:translateX(-50%) scale(1);}
</style></head>
<body>
  <span class="xanda-tooltip">Pasa el cursor aquí
    <span class="bubble">Este es un tooltip</span>
  </span>
</body></html>`
  },
  {
    id:"cmp-toast",
    name:"Notificación Toast",
    desc:"Notificación flotante temporal en la esquina de la pantalla, se oculta automáticamente tras unos segundos.",
    tags:["HTML","CSS","JS"],
    icon:"bell",
    meta:"1 archivo · 2 KB",
    file:"toast.html",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Toast — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:40px;background:#F6F3FF;}
button{background:#7C3AED;color:#fff;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;}
.xanda-toast{position:fixed;bottom:24px;right:24px;background:#14101F;color:#fff;padding:14px 20px;border-radius:12px;font-size:14px;opacity:0;transform:translateY(10px);transition:.25s;}
.xanda-toast.show{opacity:1;transform:translateY(0);}
</style></head>
<body>
  <button onclick="showToast()">Mostrar notificación</button>
  <div class="xanda-toast" id="t">Acción completada con éxito</div>
  <script>
    function showToast(){
      const t = document.getElementById('t');
      t.classList.add('show');
      setTimeout(()=> t.classList.remove('show'), 3000);
    }
  </script>
</body></html>`
  },
  {
    id:"cmp-cookie",
    name:"Aviso de cookies",
    desc:"Banner inferior para consentimiento de cookies, con botón de aceptar y guardado en el navegador.",
    tags:["HTML","CSS","JS"],
    icon:"cookie",
    meta:"1 archivo · 2 KB",
    file:"cookie-banner.html",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Aviso de cookies — XandA</title>
<style>
body{font-family:system-ui,sans-serif;background:#F6F3FF;}
.xanda-cookie{position:fixed;left:20px;right:20px;bottom:20px;max-width:520px;margin:0 auto;background:#14101F;color:#fff;padding:18px 22px;border-radius:14px;display:flex;align-items:center;justify-content:space-between;gap:16px;}
.xanda-cookie p{margin:0;font-size:13.5px;color:#c9c2e0;}
.xanda-cookie button{background:linear-gradient(135deg,#7C3AED,#C026D3);color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700;}
</style></head>
<body>
  <div class="xanda-cookie" id="c">
    <p>Usamos cookies para mejorar tu experiencia.</p>
    <button onclick="document.getElementById('c').remove()">Aceptar</button>
  </div>
</body></html>`
  },
  {
    id:"cmp-dropdown",
    name:"Menú desplegable",
    desc:"Dropdown accesible que se abre al hacer clic, con cierre automático al seleccionar una opción.",
    tags:["HTML","CSS","JS"],
    icon:"chevron",
    meta:"1 archivo · 2 KB",
    file:"dropdown.html",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Dropdown — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:80px;background:#F6F3FF;}
.xanda-dropdown{position:relative;display:inline-block;}
.xanda-dropdown > button{background:#fff;border:1.5px solid #E9E3FB;padding:12px 18px;border-radius:10px;cursor:pointer;}
.xanda-dropdown .menu{position:absolute;top:110%;left:0;background:#fff;border:1px solid #E9E3FB;border-radius:10px;min-width:160px;box-shadow:0 10px 30px rgba(0,0,0,.08);display:none;overflow:hidden;}
.xanda-dropdown .menu.open{display:block;}
.xanda-dropdown .menu a{display:block;padding:10px 16px;color:#14101F;text-decoration:none;font-size:14px;}
.xanda-dropdown .menu a:hover{background:#F6F3FF;}
</style></head>
<body>
  <div class="xanda-dropdown">
    <button onclick="document.getElementById('menu').classList.toggle('open')">Opciones ▾</button>
    <div class="menu" id="menu">
      <a href="#">Perfil</a>
      <a href="#">Configuración</a>
      <a href="#">Cerrar sesión</a>
    </div>
  </div>
</body></html>`
  }
];

/* ---------------------------------------------------------
   ANIMACIONES — un solo archivo HTML autocontenido con demo
---------------------------------------------------------- */
const ANIMACIONES = [
  {
    id:"anim-fade",
    name:"Fade In",
    desc:"Aparición suave por opacidad al cargar la página, ideal para encabezados y secciones destacadas.",
    tags:["CSS"],
    icon:"wind",
    meta:"1 archivo · 1 KB",
    file:"fade-in.html",
    demoClass:"demo-fade",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Fade In — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:60px;background:#F6F3FF;text-align:center;}
.fade-in{animation:xandaFadeIn 0.8s ease forwards;}
@keyframes xandaFadeIn{from{opacity:0;} to{opacity:1;}}
.box{width:120px;height:120px;margin:0 auto;border-radius:16px;background:linear-gradient(135deg,#7C3AED,#C026D3);}
</style></head>
<body>
  <div class="box fade-in"></div>
</body></html>`
  },
  {
    id:"anim-slide",
    name:"Slide In",
    desc:"Entrada deslizante desde la izquierda con desvanecimiento, útil para tarjetas y elementos de lista.",
    tags:["CSS"],
    icon:"move",
    meta:"1 archivo · 1 KB",
    file:"slide-in.html",
    demoClass:"demo-slide",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Slide In — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:60px;background:#F6F3FF;text-align:center;}
.slide-in{animation:xandaSlideIn 0.6s cubic-bezier(.22,1,.36,1) forwards;}
@keyframes xandaSlideIn{from{opacity:0;transform:translateX(-40px);} to{opacity:1;transform:translateX(0);}}
.box{width:120px;height:120px;margin:0 auto;border-radius:16px;background:linear-gradient(135deg,#7C3AED,#C026D3);}
</style></head>
<body>
  <div class="box slide-in"></div>
</body></html>`
  },
  {
    id:"anim-hover",
    name:"Hover Zoom",
    desc:"Efecto de acercamiento suave al pasar el cursor sobre tarjetas o imágenes, con sombra dinámica.",
    tags:["CSS"],
    icon:"zoom",
    meta:"1 archivo · 1 KB",
    file:"hover-zoom.html",
    demoClass:"demo-hover",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Hover Zoom — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:60px;background:#F6F3FF;text-align:center;}
.hover-zoom{width:120px;height:120px;margin:0 auto;border-radius:16px;background:linear-gradient(135deg,#7C3AED,#C026D3);transition:transform .25s ease, box-shadow .25s ease;}
.hover-zoom:hover{transform:scale(1.08);box-shadow:0 20px 40px -14px rgba(124,58,237,.45);}
</style></head>
<body>
  <div class="hover-zoom"></div>
</body></html>`
  },
  {
    id:"anim-loader",
    name:"Loader Spinner",
    desc:"Indicador de carga circular con rotación continua, útil mientras se espera contenido asíncrono.",
    tags:["CSS"],
    icon:"loader",
    meta:"1 archivo · 1 KB",
    file:"loader-spinner.html",
    demoClass:"demo-loader",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Loader — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:60px;background:#F6F3FF;text-align:center;}
.spinner{width:48px;height:48px;margin:0 auto;border:5px solid #E9E3FB;border-top-color:#7C3AED;border-radius:50%;animation:xandaSpin 0.8s linear infinite;}
@keyframes xandaSpin{to{transform:rotate(360deg);}}
</style></head>
<body>
  <div class="spinner"></div>
</body></html>`
  },
  {
    id:"anim-scroll",
    name:"Scroll Reveal",
    desc:"Revela elementos con desvanecimiento y desplazamiento cuando entran en la ventana visible, usando IntersectionObserver.",
    tags:["CSS","JS"],
    icon:"eye",
    meta:"1 archivo · 2 KB",
    file:"scroll-reveal.html",
    demoClass:"demo-scroll",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Scroll Reveal — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:0;background:#F6F3FF;}
.spacer{height:70vh;display:flex;align-items:center;justify-content:center;color:#9C93B8;}
.reveal{opacity:0;transform:translateY(30px);transition:opacity .6s ease, transform .6s ease;width:200px;height:120px;margin:40px auto;border-radius:16px;background:linear-gradient(135deg,#7C3AED,#C026D3);}
.reveal.visible{opacity:1;transform:translateY(0);}
</style></head>
<body>
  <div class="spacer">Desplázate hacia abajo ↓</div>
  <div class="reveal"></div>
  <div class="spacer"></div>
  <script>
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.3 });
    els.forEach(el => io.observe(el));
  </script>
</body></html>`
  },
  {
    id:"anim-bounce",
    name:"Bounce",
    desc:"Rebote vertical llamativo para botones o íconos, pensado para atraer la atención sin ser invasivo.",
    tags:["CSS"],
    icon:"bounce",
    meta:"1 archivo · 1 KB",
    file:"bounce.html",
    demoClass:"demo-bounce",
    content:`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Bounce — XandA</title>
<style>
body{font-family:system-ui,sans-serif;padding:60px;background:#F6F3FF;text-align:center;}
.bounce{width:80px;height:80px;margin:0 auto;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#C026D3);animation:xandaBounce 1s ease infinite;}
@keyframes xandaBounce{0%,100%{transform:translateY(0);} 50%{transform:translateY(-22px);}}
</style></head>
<body>
  <div class="bounce"></div>
</body></html>`
  }
];

const CATEGORIES = [
    { id:"estructuras", label:"Estructuras", icon:"layers", data:ESTRUCTURAS, kind:"zip",
        title:"Estructuras de proyecto", sub:"El esqueleto base para arrancar tu proyecto en el stack que necesites. Descarga y coloca los archivos dentro de tu carpeta de trabajo." },
    { id:"plantillas", label:"Plantillas", icon:"template", data:PLANTILLAS, kind:"zip",
        title:"Plantillas listas para usar", sub:"Proyectos completos con diseño ya incluido. Descárgalas, ábrelas y personaliza el contenido a tu gusto." },
    { id:"componentes", label:"Componentes", icon:"puzzle", data:COMPONENTES, kind:"file",
        title:"Componentes de interfaz", sub:"Alerts, ventanas emergentes, tooltips y más. Copia el código o descarga el archivo y ajústalo a tu proyecto." },
    { id:"animaciones", label:"Animaciones", icon:"sparkles", data:ANIMACIONES, kind:"file",
        title:"Animaciones y efectos", sub:"Transiciones y micro-interacciones listas para aplicar con solo una clase CSS." },
    { id:"constructor", label:"Constructor", icon:"constructor", data:ANIMACIONES, kind:"file",
        title:"Construye tu propio componente", sub:"Componentes personalizados, listos para ejecutarse en tu proyecto web." }
];
