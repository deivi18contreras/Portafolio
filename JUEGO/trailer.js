document.addEventListener("DOMContentLoaded", () => {
  const eslogan = document.getElementById("eslogan");
  const sonido = document.getElementById("introSound");

  const frases = [
    "¿Tienes lo necesario para dominar el Hyper Drive?",
    "La velocidad no espera a nadie.",
    "El futuro se gana a toda marcha.",
    "Rompe los límites de la gravedad."
  ];

  let index = 0;
  eslogan.textContent = frases[index];
  eslogan.style.opacity = 1;
  index++;


  sonido.volume = 0.5;
  sonido.play().catch(() => {
   
  });

  const intervalo = setInterval(() => {
    eslogan.style.opacity = 0;

    setTimeout(() => {
      eslogan.textContent = frases[index];
      eslogan.style.opacity = 1;
      index++;

      if (index === frases.length) {
        clearInterval(intervalo);
        setTimeout(() => {
          window.location.href = "./principal.html"; 
        }, 2000);
      }
    }, 600);
  }, 3000);
});
