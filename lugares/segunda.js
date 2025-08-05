document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    axios.get("./lugares.json").then((res) => {
        const data = res.data;
        const lugar = data.find((item) => item.id == id);

        // Configurar el fondo dinámico
        document.body.style.background = `linear-gradient(135deg, ${lugar.categoria.colorPrimario}, ${lugar.categoria.colorSecundario})`;
        
        // Crear estructura de la página
        const contenedor = document.createElement('div');
        contenedor.className = 'contenedor-detalle';
        
        // Crear título
        const titulo = document.createElement('div');
        titulo.className = 'titulo-detalle';
        const h1 = document.createElement('h1');
        h1.textContent = lugar.nombre;
        titulo.appendChild(h1);
        
        // Columna de imagen
        const colImagen = document.createElement('div');
        colImagen.className = 'columna-imagen';
        const img = document.createElement('img');
        img.src = lugar.url_imagen;
        img.alt = lugar.nombre;
        img.loading = 'lazy';
        colImagen.appendChild(img);
        
        // Columna de contenido
        const colContenido = document.createElement('div');
        colContenido.className = 'columna-contenido';
        
        // Descripción
        const descripcion = document.createElement('p');
        descripcion.textContent = lugar.descripcion;
        
        // Ciudad y país
        const ubicacion = document.createElement('p');
        ubicacion.innerHTML = `<strong>Ubicación:</strong> ${lugar.ciudad}, ${lugar.pais}`;
        
        // Categoría
        const categoria = document.createElement('p');
        categoria.innerHTML = `<strong>Categoría:</strong> ${lugar.categoria.nombre}`;
        
        // Coordenadas
        const coordenadas = document.createElement('p');
        coordenadas.innerHTML = `<strong>Coordenadas:</strong> Lat: ${lugar.coordenadas.latitud}, Lng: ${lugar.coordenadas.longitud}`;
        
        // Actividades
        const tituloAct = document.createElement('h2');
        tituloAct.textContent = 'Actividades recomendadas';
        const listaAct = document.createElement('ul');
        lugar.actividadesRecomendadas.forEach((act) => {
            const li = document.createElement('li');
            li.textContent = act;
            listaAct.appendChild(li);
        });
        
        // Datos interesantes
        const tituloDatos = document.createElement('h2');
        tituloDatos.textContent = 'Datos interesantes';
        const listaDatos = document.createElement('ul');
        lugar.datosInteresantes.forEach((info) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${info.titulo}:</strong> ${info.valor}`;
            listaDatos.appendChild(li);
        });
        
        // Botón de volver
        const botonVolver = document.createElement('a');
        botonVolver.href = 'javascript:history.back()';
        botonVolver.className = 'boton-volver';
        botonVolver.textContent = 'Volver a la lista';
        
        // Ensamblar todo
        colContenido.appendChild(descripcion);
        colContenido.appendChild(ubicacion);
        colContenido.appendChild(categoria);
        colContenido.appendChild(coordenadas);
        colContenido.appendChild(tituloAct);
        colContenido.appendChild(listaAct);
        colContenido.appendChild(tituloDatos);
        colContenido.appendChild(listaDatos);
        
        contenedor.appendChild(colImagen);
        contenedor.appendChild(colContenido);
        
        document.body.appendChild(titulo);
        document.body.appendChild(contenedor);
        document.body.appendChild(botonVolver);
    });
});

