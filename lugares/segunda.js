document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    axios.get("./lugares.json").then((res) => {
        const data = res.data;
        const lugar = data.find((item) => item.id == id);

        document.body.style.background = `linear-gradient(135deg, ${lugar.categoria.colorPrimario}, ${lugar.categoria.colorSecundario})`;
        
     
        const contenedor = document.createElement('div');
        contenedor.className = 'contenedor-detalle';
        
        
        const titulo = document.createElement('div');
        titulo.className = 'titulo-detalle';
        const h1 = document.createElement('h1');
        h1.textContent = lugar.nombre;
        titulo.appendChild(h1);
        
      
        const colImagen = document.createElement('div');
        colImagen.className = 'columna-imagen';
        const img = document.createElement('img');
        img.src = lugar.url_imagen;
        img.alt = lugar.nombre;
        img.loading = 'lazy';
        colImagen.appendChild(img);
        
      
        const colContenido = document.createElement('div');
        colContenido.className = 'columna-contenido';
        
  
        const descripcion = document.createElement('p');
        descripcion.textContent = lugar.descripcion;
        
   
        const ubicacion = document.createElement('p');
        ubicacion.innerHTML = `<strong>Ubicación:</strong> ${lugar.ciudad}, ${lugar.pais}`;
        
      
        const categoria = document.createElement('p');
        categoria.innerHTML = `<strong>Categoría:</strong> ${lugar.categoria.nombre}`;
        
     
        const coordenadas = document.createElement('p');
        coordenadas.innerHTML = `<strong>Coordenadas:</strong> Lat: ${lugar.coordenadas.latitud}, Lng: ${lugar.coordenadas.longitud}`;
        
        const tituloAct = document.createElement('h2');
        tituloAct.textContent = 'Actividades recomendadas';
        const listaAct = document.createElement('ul');
        lugar.actividadesRecomendadas.forEach((act) => {
            const li = document.createElement('li');
            li.textContent = act;
            listaAct.appendChild(li);
        });
        
        
        const tituloDatos = document.createElement('h2');
        tituloDatos.textContent = 'Datos interesantes';
        const listaDatos = document.createElement('ul');
        lugar.datosInteresantes.forEach((info) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${info.titulo}:</strong> ${info.valor}`;
            listaDatos.appendChild(li);
        });
        
        
        const botonVolver = document.createElement('a');
        botonVolver.href = 'javascript:history.back()';
        botonVolver.className = 'boton-volver';
        botonVolver.textContent = 'Volver';
        
        
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

