
  document.getElementById("config-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const menuConfig = document.querySelector(".menu_config");
    menuConfig.classList.toggle("active");
  });

  const campana = document.querySelector(".card_garage");

campana.addEventListener("click", () => {
  window.location.href = "./garage.html";
});

const pista = document.querySelector(".card_car");

pista.addEventListener("click", () => {
  window.location.href = "./pistas.html";
});


const modosDeJuegos = document.querySelector(".card_play");

modosDeJuegos.addEventListener("click", () => {
  window.location.href = "./modos.html";
});