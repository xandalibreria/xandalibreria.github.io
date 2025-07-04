
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
