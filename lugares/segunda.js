const params = new URLSearchParams(window.location.search);
const id = params.get("id");

axios.get("./lugares.json").then((res) => {
  const data = res.data;
  const lugar = data.find((item) => item.id == id);

  const visita = document.getElementById("historico");

  document.body.style.background = `radial-gradient(${lugar.categoria.colorPrimario}, ${lugar.categoria.colorSecundario})`;

  let contImagen = document.createElement("div");
  contImagen.classList.add("columna-izquierda");

  let fotos = document.createElement("img");
  fotos.src = lugar.url_imagen;
  fotos.alt = lugar.nombre;
  contImagen.appendChild(fotos);

  let contenido = document.createElement("div");
  contenido.classList.add("columna-derecha");

  let nombre = document.createElement("h1");
  nombre.textContent = lugar.nombre;

  let categoria = document.createElement("p");
  categoria.textContent = `${lugar.categoria.nombre}`;

  let coordenadas = document.createElement("p");
  coordenadas.innerHTML = `<strong>Coordenadas</strong><br> Lat: ${lugar.coordenadas.latitud}, Lng: ${lugar.coordenadas.longitud}`;

  let tituloAct = document.createElement("h2");
  tituloAct.textContent = "Actividades recomendadas";
  let listaAct = document.createElement("ul");
  lugar.actividadesRecomendadas.forEach((act) => {
    let li = document.createElement("li");
    li.textContent = act;
    listaAct.appendChild(li);
  });

  let tituloDatos = document.createElement("h2");
  tituloDatos.textContent = "Datos interesantes";
  let listaDatos = document.createElement("ul");
  lugar.datosInteresantes.forEach((info) => {
    let li = document.createElement("li");
    li.textContent = `${info.titulo}: ${info.valor}`;
    listaDatos.appendChild(li);
  });

  let ciudad = document.createElement("p");
  ciudad.textContent = `Ciudad: ${lugar.ciudad}`;

  let pais = document.createElement("p");
  pais.innerHTML = `País ${lugar.pais}`;

  let descripcion = document.createElement("p");
  descripcion.innerHTML = `<strong>Por qué deberías visitar este lugar</strong><br><br> ${lugar.descripcion}`;

  contenido.appendChild(nombre);
  contenido.appendChild(descripcion);
  contenido.appendChild(categoria);
  contenido.appendChild(coordenadas);
  contenido.appendChild(tituloAct);
  contenido.appendChild(listaAct);
  contenido.appendChild(tituloDatos);
  contenido.appendChild(listaDatos);
  contenido.appendChild(ciudad);
  contenido.appendChild(pais);

  visita.appendChild(contImagen);
  visita.appendChild(contenido);
});
