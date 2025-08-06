document.addEventListener("DOMContentLoaded", async () => {
  
  const header = document.createElement('header');
  header.className = 'titulo';

  const h1 = document.createElement('h1');
  h1.textContent = 'Lugares Históricos Destacados';

  const p = document.createElement('p');
  p.textContent = 'Descubre los sitios más fascinantes alrededor del mundo';

  header.appendChild(h1);
  header.appendChild(p);
  document.body.insertBefore(header, document.querySelector('.principal'));


  const info = await axios.get("./lugares.json");
  const data = info.data;

  data.forEach((lugar, index) => {
    setTimeout(() => {
      const item = document.createElement("div");
      item.className = "item";
      item.style.opacity = "0";
      item.style.animation = `fadeIn 0.8s forwards ${index * 0.1}s`;

      const img = document.createElement("img");
      img.src = lugar.url_imagen;
      img.alt = lugar.nombre;
      img.loading = "lazy";

      const nombre = document.createElement("h1");
      nombre.textContent = lugar.nombre;

      const categoria = document.createElement("p");
      categoria.textContent = lugar.categoria.nombre;

      const pais = document.createElement("p");
      pais.textContent = lugar.pais;

      const boton = document.createElement("button");
      boton.textContent = "Ver más";
      boton.addEventListener("click", () => {
        window.location.href = `lugHis.html?id=${lugar.id}`;
      });
      item.appendChild(nombre);
      item.appendChild(img);
      item.appendChild(categoria);
      item.appendChild(pais);
      item.appendChild(boton);


      document.querySelector(".principal").appendChild(item);
    }, index * 100);
  });
});





