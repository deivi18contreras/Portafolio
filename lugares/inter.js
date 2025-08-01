document.addEventListener("DOMContentLoaded", async () => {
  let info = await axios.get("./lugares.json");
  let data = info.data;

  data.forEach((lugar) => {
    let items = document.createElement("div");
    items.classList.add("item");

    let fotos = document.createElement("img");
    fotos.src = lugar.url_imagen;
    fotos.alt = lugar.nombre;

    let nombre = document.createElement("h1");
    nombre.textContent = lugar.nombre;

    let categoria = document.createElement("p");
    categoria.textContent = lugar.categoria.nombre;

    let boton = document.createElement("button");
    boton.textContent = "Ver más";
    boton.addEventListener("click", () => {
     
      window.location.href = `lugHis.html?id=${lugar.id}`;
    });

    items.appendChild(nombre);
    items.appendChild(fotos);
    items.appendChild(categoria);
    items.appendChild(boton);

    document.querySelector(".principal").appendChild(items);
  });
});


