document.getElementById("boton-interfaz").addEventListener("click", function () {
    const contenedor = document.getElementById("contenedor-trabajo");

    // Reemplaza el contenido principal
    contenedor.innerHTML = `
        <div class="contenedor-universal">
            <h2><i class="fa-solid fa-laptop-code"></i> Interfaces</h2>
        </div>
        <div class="contenedor-interfaz" id="contenedor-interfaz-tarjetas"></div>
    `;

    // Cargar el JSON con las interfaces
    fetch('../assets/json/interfaces.json')
        .then(res => res.json())
        .then(data => {
            const tarjetasContenedor = document.getElementById('contenedor-interfaz-tarjetas');

            data.interfaces.forEach(interfaz => {
                // Crear tarjeta de interfaz
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta-interfaz';

                const tarjetaImagen = document.createElement('div');
                tarjetaImagen.className = 'tarjeta-interfaz-parte-1';

                const imagen = document.createElement('img');
                imagen.className = 'imagen-tarjeta-interfaz-parte-1';
                imagen.src = interfaz.imagen;
                imagen.alt = interfaz.nombre;
                imagen.title = interfaz.nombre;

                const tarjetaInfo = document.createElement('div');
                tarjetaInfo.className = 'tarjeta-interfaz-parte-2';

                const nombre = document.createElement('p');
                nombre.textContent = interfaz.nombre;

                const boton = document.createElement('button');
                boton.className = 'boton-4';
                boton.textContent = 'Descargar';

                // Acción del botón: descargar archivo .zip directamente
                boton.addEventListener('click', () => {
                    const enlace = document.createElement('a');
                    enlace.href = interfaz.archivo;
                    enlace.download = interfaz.archivo.split('/').pop(); // Nombre del archivo desde la ruta
                    document.body.appendChild(enlace);
                    enlace.click();
                    document.body.removeChild(enlace);

                    // (Opcional) mostrar una notificación visual
                    const overlay = document.createElement('div');
                    overlay.className = 'contenedor-ventana-emergente';
                    overlay.innerHTML = `
                        <div class="ventana-emergente">
                            <i class="fa-solid fa-xmark cerrar-emergente"></i>
                            <p>Descarga iniciada para <strong>${interfaz.nombre}</strong>.</p>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    document.querySelector('.cerrar-emergente').addEventListener('click', () => {
                        overlay.remove();
                    });
                });

                // Ensamblar tarjeta
                tarjetaInfo.appendChild(nombre);
                tarjetaInfo.appendChild(boton);
                tarjetaImagen.appendChild(imagen);
                tarjeta.appendChild(tarjetaImagen);
                tarjeta.appendChild(tarjetaInfo);
                tarjetasContenedor.appendChild(tarjeta);
            });
        })
        .catch(error => {
            console.error('Error al cargar interfaces.json:', error);
            contenedor.innerHTML += `<p style="color:red;">Error al cargar las interfaces. Intenta nuevamente más tarde.</p>`;
        });
});