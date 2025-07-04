document.getElementById("boton-inspector").addEventListener("click", function () {
    const contenedor = document.getElementById("contenedor-trabajo");
    contenedor.innerHTML = `
        <div class="contenedor-rutas">
            <p class="p-contenedor-rutas">ARCHIVOS</p>
            <div class="rutas" id="id-rutas"></div>
        </div>
        <div class="contenedor-inspector" id="contenedor-inspector-vista">
            <div class="contenedor-datos-codigo">
                <div class="contenedor-datos-codigo-nombre" id="datos-codigo-nombre">
                    <!-- ícono y nombre del archivo -->
                </div>
                <div class="contenedor-datos-codigo-peso" id="datos-codigo-peso">
                    <!-- peso del archivo -->
                </div>
            </div>
            <div id="visor-archivo"></div>
        </div>
    `;

    fetch('../assets/json/interfaces.json')
        .then(res => res.json())
        .then(data => {
            const rutas = document.getElementById("id-rutas");

            const selector = document.createElement("select");
            selector.id = "selector-proyectos";
            selector.style.marginBottom = "10px";

            data.interfaces.forEach((proyecto, i) => {
                const option = document.createElement("option");
                option.value = proyecto.archivo;
                option.textContent = proyecto.nombre;
                if (i === 0) option.selected = true;
                selector.appendChild(option);
            });

            rutas.appendChild(selector);

            const estructuraContenedor = document.createElement('div');
            estructuraContenedor.id = 'estructura-proyecto';
            rutas.appendChild(estructuraContenedor);

            selector.addEventListener("change", () => {
                cargarYMostrarZip(selector.value, estructuraContenedor);
            });

            // Carga inicial
            cargarYMostrarZip(selector.value, estructuraContenedor);
        });
});

function cargarYMostrarZip(rutaZip, contenedor) {
    contenedor.innerHTML = 'Cargando estructura...';

    fetch(rutaZip)
        .then(res => res.blob())
        .then(JSZip.loadAsync)
        .then(zip => {
            contenedor.innerHTML = '';
            mostrarEstructuraZip(zip, contenedor);
        })
        .catch(err => {
            contenedor.innerHTML = `<p style="color:red;">Error al cargar el ZIP: ${err}</p>`;
        });
}

function mostrarEstructuraZip(zip, contenedor) {
    const archivos = Object.keys(zip.files);
    const tree = {};

    archivos.forEach(path => {
        // Evita archivos del sistema y ocultos
        if (
            path.startsWith('__MACOSX') ||
            path.endsWith('.DS_Store') ||
            path.split('/').some(part => part === '.DS_Store')
        ) {
            return;
        }

        const parts = path.split('/').filter(Boolean);
        let current = tree;

        parts.forEach((part, i) => {
            const isFile = i === parts.length - 1 && !zip.files[path].dir;

            if (!current[part]) {
                current[part] = isFile ? { __file: path } : {};
            }

            current = current[part];
        });
    });

    contenedor.appendChild(renderTree(tree, zip));
}

function obtenerIconoArchivo(nombreArchivo) {
    const nombre = nombreArchivo.toLowerCase();

    if (nombre === 'robots.txt') {
        return '<i class="fa-solid fa-robot" style="color: #f43939; margin-right:6px;"></i>';
    }

    if (nombre === 'licence.txt' || nombre === 'license.txt') {
        return '<i class="fa-solid fa-certificate" style="color: #f4bc39; margin-right:6px;"></i>';
    }
    if (nombre === '.htaccess') {
        return '<i class="fa-solid fa-gear" style="color:#716e66; margin-right:6px;"></i>';
    }

    const ext = nombreArchivo.split('.').pop().toLowerCase();

    switch (ext) {
        case 'html': return '<i class="fa-brands fa-html5" style="color:#e34c26; margin-right:6px;"></i>';
        case 'php': return '<i class="fa-brands fa-php" style="color:#777bb3; margin-right:6px;"></i>';
        case 'js': return '<i class="fa-brands fa-js" style="color:#f0db4f; margin-right:6px;"></i>';
        case 'json': return '<i class="fa-solid fa-cube" style="color:#777; margin-right:6px;"></i>';
        case 'xml': return '<i class="fa-solid fa-code" style="color:#04a021; margin-right:6px;"></i>';
        case 'txt': return '<i class="fa-solid fa-file-lines" style="color:#555; margin-right:6px;"></i>';
        case 'css': return '<i class="fa-brands fa-css3-alt" style="color:#264de4; margin-right:6px;"></i>';
        case 'md': return '<i class="fa-brands fa-markdown" style="color:#4d4d4d; margin-right:6px;"></i>';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif': return '<i class="fa-solid fa-image" style="color:#6a6; margin-right:6px;"></i>';
        case 'zip': return '<i class="fa-solid fa-file-zipper" style="color:#999; margin-right:6px;"></i>';
        default: return '<i class="fa-solid fa-file" style="color:#999; margin-right:6px;"></i>';
    }
}

function renderTree(obj, zip, rutaActual = "") {
    const ul = document.createElement("ul");

    const carpetas = [];
    const archivos = [];

    for (const key in obj) {
        if (obj[key].__file) {
            archivos.push(key);
        } else {
            carpetas.push(key);
        }
    }

    carpetas.sort((a, b) => a.localeCompare(b));
    archivos.sort((a, b) => a.localeCompare(b));

    carpetas.forEach(key => {
        const li = document.createElement("li");

        const spanTitulo = document.createElement("span");
        spanTitulo.innerHTML = `<i class="fa-solid fa-folder" style="color:#ffa500; margin-right:6px;"></i> ${key}`;
        spanTitulo.style.cursor = "pointer";

        const nested = renderTree(obj[key], zip, rutaActual + key + "/");
        nested.style.display = "none";

        spanTitulo.addEventListener("click", (e) => {
            e.stopPropagation();
            const abierto = nested.style.display === "block";
            nested.style.display = abierto ? "none" : "block";

            // Cambiar ícono según estado
            spanTitulo.innerHTML = `
                <i class="fa-solid ${abierto ? "fa-folder" : "fa-folder-open"}" style="color:#ffa500; margin-right:6px;"></i> ${key}
            `;
        });

        li.appendChild(spanTitulo);
        li.appendChild(nested);
        ul.appendChild(li);
    });

    archivos.forEach(key => {
        const li = document.createElement("li");

        const icono = obtenerIconoArchivo(key);
        li.innerHTML = `${icono} ${key}`;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
            mostrarVistaArchivo(zip, obj[key].__file);
        });

        ul.appendChild(li);
    });

    return ul;
}

function mostrarVistaArchivo(zip, archivoPath) {
    zip.files[archivoPath].async("text").then(contenido => {
        const vista = document.getElementById("visor-archivo");
        const nombreDiv = document.getElementById("datos-codigo-nombre");
        const pesoDiv = document.getElementById("datos-codigo-peso");
        const resaltado = resaltarHTML(escapeHtml(contenido));

        // Obtener icono y nombre archivo
        const nombreArchivo = archivoPath.split('/').pop();
        const icono = obtenerIconoArchivo(nombreArchivo);

        // Obtener peso en KB con 2 decimales
        const pesoBytes = zip.files[archivoPath]._data.uncompressedSize || 0;
        const pesoKB = (pesoBytes / 1024).toFixed(2);

        nombreDiv.innerHTML = `${icono} ${nombreArchivo}`;
        pesoDiv.innerHTML = `<p>${pesoKB} KB</p>`;

        vista.innerHTML = `
            <div class="visor-archivo" style="display:flex; font-family: monospace; font-size: 14px; border: 1px solid #ddd; border-radius: 4px; overflow: auto; max-height: 500px;">
                <pre class="line-numbers" style="background: #f0f0f0; padding: 10px 8px; color: #888; text-align: right; user-select: none; border-right: 1px solid #ddd; margin: 0;">
${generarNumerosLineas(contenido)}</pre>
                <pre style="margin: 0; padding: 10px; overflow: auto; white-space: pre-wrap; flex: 1;"><code>${resaltado}</code></pre>
            </div>
        `;
    });
}

function resaltarHTML(texto) {
    texto = texto.replace(/(&lt;!DOCTYPE html&gt;)/gi, '<span style="color: #007acc;">$1</span>');
    texto = texto.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color: #999;">$1</span>');
    texto = texto.replace(
        /(&lt;\/?[\w\-]+(?:\s+[^&]*?)?\/?&gt;)/g,
        '<span style="color: #f46539;">$1</span>'
    );
    return texto;
}

function generarNumerosLineas(texto) {
    const lineas = texto.split('\n').length;
    let numeros = '';
    for (let i = 1; i <= lineas; i++) {
        numeros += i + '\n';
    }
    return numeros;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
