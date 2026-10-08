/* ============================================================
   libreria-iconos.js — Base de datos de íconos XandA (fase 1)
   ------------------------------------------------------------
   · Cada ícono:
       n = clase (se usa como <i class="xa-nombre"></i>)
       t = título visible (con acentos)
       c = categoría (id de la lista de abajo)
       d = trazo(s) SVG en viewBox 24×24 (estilo línea)
   · El prefijo de las clases vive aquí: XANDA_ICONOS.prefijo.
   · Cuando publiques la hoja del CDN (xa-iconos.css) solo
     cambia MODO_FUENTE = true en libreria.js: los nombres de
     clase ya coinciden con esta base de datos.
   ============================================================ */

window.XANDA_ICONOS = {
  prefijo: 'xa-',
  version: '1.0.0',

  categorias: [
    { id: 'todas',        nombre: 'Todas' },
    { id: 'tecnologia',   nombre: 'Tecnología' },
    { id: 'comunicacion', nombre: 'Comunicación' },
    { id: 'medios',       nombre: 'Medios' },
    { id: 'diseno',       nombre: 'Diseño' },
    { id: 'negocios',     nombre: 'Negocios' },
    { id: 'naturaleza',   nombre: 'Naturaleza' },
    { id: 'interfaz',     nombre: 'Interfaz' }
  ],

  iconos: [
    /* ---------- Tecnología ---------- */
    { n: 'computadora', t: 'Computadora', c: 'tecnologia', d: ['M3 4h18v12H3z', 'M12 16v4', 'M8 20h8'] },
    { n: 'portatil',    t: 'Portátil',    c: 'tecnologia', d: ['M5.5 5.5h13a1 1 0 0 1 1 1V16H4.5V6.5a1 1 0 0 1 1-1z', 'M3 19.5h18L19 16H5z'] },
    { n: 'movil',       t: 'Móvil',       c: 'tecnologia', d: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M11 18h2'] },
    { n: 'teclado',     t: 'Teclado',     c: 'tecnologia', d: ['M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', 'M7 10h.01M12 10h.01M17 10h.01', 'M8 14h8'] },
    { n: 'raton',       t: 'Ratón',       c: 'tecnologia', d: ['M12 2a7 7 0 0 1 7 7v6a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7z', 'M12 6v4'] },
    { n: 'servidor',    t: 'Servidor',    c: 'tecnologia', d: ['M4 2.5h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z', 'M4 14.5h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z', 'M6 6h.01M6 18h.01'] },
    { n: 'chip',        t: 'Chip',        c: 'tecnologia', d: ['M6 6h12v12H6z', 'M9.5 9.5h5v5h-5z', 'M9 2.5V6M15 2.5V6M9 21.5V18M15 21.5V18M2.5 9H6M2.5 15H6M21.5 9H18M21.5 15H18'] },
    { n: 'camara-web',  t: 'Cámara web',  c: 'tecnologia', d: ['M12 2.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14z', 'M10.5 9.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0', 'M12 16.5v5', 'M8.5 21.5h7'] },
    { n: 'disco',       t: 'Disco duro',  c: 'tecnologia', d: ['M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z', 'M2 12h20', 'M6 16h.01M10 16h.01'] },
    { n: 'memoria',     t: 'Memoria USB', c: 'tecnologia', d: ['M9.5 7.5h5V20a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 20z', 'M10 7.5v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3', 'M12 11.5v4.5'] },
    { n: 'impresora',   t: 'Impresora',   c: 'tecnologia', d: ['M6 9V3h12v6', 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 14h12v7H6z'] },

    /* ---------- Comunicación ---------- */
    { n: 'correo',        t: 'Correo',        c: 'comunicacion', d: ['M3.5 5h17A1.5 1.5 0 0 1 22 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5z', 'm3.5 7.5 8.5 6 8.5-6'] },
    { n: 'telefono',      t: 'Teléfono',      c: 'comunicacion', d: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'] },
    { n: 'mensaje',       t: 'Mensaje',       c: 'comunicacion', d: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] },
    { n: 'conversacion',  t: 'Conversación',  c: 'comunicacion', d: ['M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'] },
    { n: 'enviar',        t: 'Enviar',        c: 'comunicacion', d: ['M22 2 11 13', 'M22 2 15 22l-4-9-9-4z'] },
    { n: 'microfono',     t: 'Micrófono',     c: 'comunicacion', d: ['M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10v1a7 7 0 0 1-14 0v-1', 'M12 18v4', 'M8 22h8'] },
    { n: 'altavoz',       t: 'Altavoz',       c: 'comunicacion', d: ['M11 5 6 9H2v6h4l5 4z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M18.5 5.5a9.5 9.5 0 0 1 0 13'] },
    { n: 'auriculares',   t: 'Auriculares',   c: 'comunicacion', d: ['M3 18v-6a9 9 0 0 1 18 0v6', 'M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z'] },
    { n: 'campana',       t: 'Campana',       c: 'comunicacion', d: ['M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.7 21a2 2 0 0 1-3.4 0'] },
    { n: 'globo',         t: 'Globo',         c: 'comunicacion', d: ['M2.5 12a9.5 9.5 0 1 0 19 0 9.5 9.5 0 1 0-19 0', 'M2.5 12h19', 'M12 2.5c2.5 2.4 4 5.7 4 9.5s-1.5 7.1-4 9.5c-2.5-2.4-4-5.7-4-9.5s1.5-7.1 4-9.5z'] },

    /* ---------- Medios ---------- */
    { n: 'camara',     t: 'Cámara',     c: 'medios', d: ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z', 'M8 13a4 4 0 1 0 8 0 4 4 0 1 0-8 0'] },
    { n: 'imagen',     t: 'Imagen',     c: 'medios', d: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M7 8.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0', 'm21 15-5-5L5 21'] },
    { n: 'video',      t: 'Video',      c: 'medios', d: ['M23 7l-7 5 7 5z', 'M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z'] },
    { n: 'musica',     t: 'Música',     c: 'medios', d: ['M9 18V5l12-2v13', 'M3 18a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'M15 16a3 3 0 1 0 6 0 3 3 0 1 0-6 0'] },
    { n: 'pelicula',   t: 'Película',   c: 'medios', d: ['M4.18 3h15.64A2.18 2.18 0 0 1 22 5.18v13.64A2.18 2.18 0 0 1 19.82 21H4.18A2.18 2.18 0 0 1 2 18.82V5.18A2.18 2.18 0 0 1 4.18 3z', 'M7 3v18M17 3v18M2 12h20', 'M2 7h5M2 17h5M17 7h5M17 17h5'] },
    { n: 'reproducir', t: 'Reproducir', c: 'medios', d: ['M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0', 'm10 8.5 5 3.5-5 3.5z'] },
    { n: 'television', t: 'Televisión', c: 'medios', d: ['M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z', 'm17 2-5 5-5-5'] },

    /* ---------- Diseño ---------- */
    { n: 'paleta',    t: 'Paleta',    c: 'diseno', d: ['M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3a1.8 1.8 0 0 1 1.8-1.8H17a5 5 0 0 0 5-5C22 6.3 17.5 2 12 2z', 'M7.5 10.5h.01M12 7h.01M16.5 10.5h.01M7.5 15h.01'] },
    { n: 'pincel',    t: 'Pincel',    c: 'diseno', d: ['m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08', 'M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z'] },
    { n: 'pluma',     t: 'Pluma',     c: 'diseno', d: ['M12 19l7-7 3 3-7 7-3-3z', 'M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z', 'M2 2l7.6 7.6', 'M9 11a2 2 0 1 0 4 0 2 2 0 1 0-4 0'] },
    { n: 'regla',     t: 'Regla',     c: 'diseno', d: ['m3 17.5 14.5-14.5 4 4L7.5 21.5z', 'm6.5 14 1.5 1.5M9.5 11l1.5 1.5M12.5 8l1.5 1.5M15.5 5l1.5 1.5'] },
    { n: 'capas',     t: 'Capas',     c: 'diseno', d: ['M12 2 2 7l10 5 10-5z', 'M2 12l10 5 10-5', 'M2 17l10 5 10-5'] },
    { n: 'cuadricula',t: 'Cuadrícula',c: 'diseno', d: ['M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M9 3v18M15 3v18M3 9h18M3 15h18'] },
    { n: 'gota',      t: 'Gota',      c: 'diseno', d: ['M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z'] },
    { n: 'varita',    t: 'Varita',    c: 'diseno', d: ['M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8 19 13M17.8 6.2 19 5M12.2 6.2 11 5M12.2 11.8 11 13M15 9h.01', 'm3 21 9-9'] },
    { n: 'tijeras',   t: 'Tijeras',   c: 'diseno', d: ['M3 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'M3 18a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'M20 4 8.12 15.88', 'M14.47 14.48 20 20', 'M8.12 8.12 12 12'] },
    { n: 'recortar',  t: 'Recortar',  c: 'diseno', d: ['M6.13 1 6 16a2 2 0 0 0 2 2h15', 'M1 6.13 16 6a2 2 0 0 1 2 2v15'] },
    { n: 'borrador',  t: 'Borrador',  c: 'diseno', d: ['m7 21-4.3-4.3a2.4 2.4 0 0 1 0-3.4l9.6-9.6a2.4 2.4 0 0 1 3.4 0l5.6 5.6a2.4 2.4 0 0 1 0 3.4L13 21', 'M22 21H7', 'm5 11 9 9'] },

    /* ---------- Negocios ---------- */
    { n: 'maletin',   t: 'Maletín',   c: 'negocios', d: ['M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'] },
    { n: 'tendencia', t: 'Tendencia', c: 'negocios', d: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'] },
    { n: 'grafica',   t: 'Gráfica',   c: 'negocios', d: ['M18 20V10M12 20V4M6 20v-6'] },
    { n: 'dinero',    t: 'Dinero',    c: 'negocios', d: ['M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z', 'M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'M6 9h.01M18 15h.01'] },
    { n: 'tarjeta',   t: 'Tarjeta',   c: 'negocios', d: ['M3 4.5h18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z', 'M1 10h22', 'M6 15h4'] },
    { n: 'archivo',   t: 'Archivo',   c: 'negocios', d: ['M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5z', 'M14 2.5v6h6', 'M16 13H8M16 17H8'] },
    { n: 'carpeta',   t: 'Carpeta',   c: 'negocios', d: ['M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'] },
    { n: 'carrito',   t: 'Carrito',   c: 'negocios', d: ['M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z', 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'] },
    { n: 'etiqueta',  t: 'Etiqueta',  c: 'negocios', d: ['M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z', 'M7 7h.01'] },
    { n: 'calendario',t: 'Calendario',c: 'negocios', d: ['M5 4.5h14A1.5 1.5 0 0 1 20.5 6v14a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 20V6A1.5 1.5 0 0 1 5 4.5z', 'M16 2.5v4M8 2.5v4M3.5 10h17'] },
    { n: 'reloj',     t: 'Reloj',     c: 'negocios', d: ['M2.5 12a9.5 9.5 0 1 0 19 0 9.5 9.5 0 1 0-19 0', 'M12 7v5l3.5 2'] },
    { n: 'objetivo',  t: 'Objetivo',  c: 'negocios', d: ['M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0', 'M6 12a6 6 0 1 0 12 0 6 6 0 1 0-12 0', 'M10 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0'] },

    /* ---------- Naturaleza ---------- */
    { n: 'hoja',    t: 'Hoja',    c: 'naturaleza', d: ['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z', 'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12'] },
    { n: 'sol',     t: 'Sol',     c: 'naturaleza', d: ['M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0', 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'] },
    { n: 'luna',    t: 'Luna',    c: 'naturaleza', d: ['M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'] },
    { n: 'nube',    t: 'Nube',    c: 'naturaleza', d: ['M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'] },
    { n: 'rayo',    t: 'Rayo',    c: 'naturaleza', d: ['M13 2 3 14h9l-1 8 10-12h-9l1-8z'] },
    { n: 'lluvia',  t: 'Lluvia',  c: 'naturaleza', d: ['M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25', 'M16 13v8M8 13v8M12 15v8'] },
    { n: 'copo',    t: 'Copo de nieve', c: 'naturaleza', d: ['M12 2v20M2 12h20', 'M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1'] },
    { n: 'montana', t: 'Montaña', c: 'naturaleza', d: ['m8 3 4 8 5-5 5 15H2z'] },
    { n: 'arbol',   t: 'Árbol',   c: 'naturaleza', d: ['M12 2 6.5 10h11z', 'M9 10l-3.5 7h13L15 10', 'M12 17v4.5', 'M8.5 21.5h7'] },
    { n: 'fuego',   t: 'Fuego',   c: 'naturaleza', d: ['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z'] },
    { n: 'olas',    t: 'Olas',    c: 'naturaleza', d: ['M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1', 'M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1'] },
    { n: 'viento',  t: 'Viento',  c: 'naturaleza', d: ['M9.6 4.6A2 2 0 1 1 11 8H2', 'M12.6 19.4A2 2 0 1 0 14 16H2', 'M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2'] },

    /* ---------- Interfaz ---------- */
    { n: 'usuario',    t: 'Usuario',    c: 'interfaz', d: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0'] },
    { n: 'usuarios',   t: 'Usuarios',   c: 'interfaz', d: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M5 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'] },
    { n: 'casa',       t: 'Casa',       c: 'interfaz', d: ['M3 9.5 12 2l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20z', 'M9 21.5v-8h6v8'] },
    { n: 'ajustes',    t: 'Ajustes',    c: 'interfaz', d: ['M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3', 'M1 14h6M9 8h6M17 16h6'] },
    { n: 'lupa',       t: 'Lupa',       c: 'interfaz', d: ['M3 11a8 8 0 1 0 16 0 8 8 0 1 0-16 0', 'm21 21-4.3-4.3'] },
    { n: 'corazon',    t: 'Corazón',    c: 'interfaz', d: ['M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'] },
    { n: 'estrella',   t: 'Estrella',   c: 'interfaz', d: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z'] },
    { n: 'candado',    t: 'Candado',    c: 'interfaz', d: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7.5 11V7a4.5 4.5 0 0 1 9 0v4'] },
    { n: 'llave',      t: 'Llave',      c: 'interfaz', d: ['m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4'] },
    { n: 'ojo',        t: 'Ojo',        c: 'interfaz', d: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0'] },
    { n: 'flecha',     t: 'Flecha',     c: 'interfaz', d: ['M5 12h14', 'm12 5 7 7-7 7'] },
    { n: 'mas',        t: 'Más',        c: 'interfaz', d: ['M12 5v14M5 12h14'] },
    { n: 'palomita',   t: 'Palomita',   c: 'interfaz', d: ['M20 6 9 17l-5-5'] },
    { n: 'cruz',       t: 'Cruz',       c: 'interfaz', d: ['M18 6 6 18M6 6l12 12'] },
    { n: 'papelera',   t: 'Papelera',   c: 'interfaz', d: ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M10 11v6M14 11v6'] },
    { n: 'descargar',  t: 'Descargar',  c: 'interfaz', d: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3'] },
    { n: 'subir',      t: 'Subir',      c: 'interfaz', d: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 8 5-5 5 5', 'M12 3v12'] },
    { n: 'copiar',     t: 'Copiar',     c: 'interfaz', d: ['M9 9h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'] },
    { n: 'compartir',  t: 'Compartir',  c: 'interfaz', d: ['M15 5a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'M3 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'M15 19a3 3 0 1 0 6 0 3 3 0 1 0-6 0', 'm8.6 13.5 6.8 4M15.4 6.5l-6.8 4'] },
    { n: 'editar',     t: 'Editar',     c: 'interfaz', d: ['M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z'] },
    { n: 'enlace',     t: 'Enlace',     c: 'interfaz', d: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'] },
    { n: 'menu',       t: 'Menú',       c: 'interfaz', d: ['M4 6h16M4 12h16M4 18h16'] },
    { n: 'filtro',     t: 'Filtro',     c: 'interfaz', d: ['M22 3H2l8 9.46V19l4 2v-8.54z'] },
    { n: 'lista',      t: 'Lista',      c: 'interfaz', d: ['M8 6h13M8 12h13M8 18h13', 'M3.5 6h.01M3.5 12h.01M3.5 18h.01'] },
    { n: 'info',       t: 'Información',c: 'interfaz', d: ['M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19z', 'M12 16v-4', 'M12 8h.01'] },
    { n: 'alerta',     t: 'Alerta',     c: 'interfaz', d: ['M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'] },
    { n: 'historial',  t: 'Historial',  c: 'interfaz', d: ['M1 4v6h6', 'M3.51 15a9 9 0 1 0 2.13-9.36L1 10', 'M12 7v5l4 2'] }
  ]
};