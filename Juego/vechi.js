

document.addEventListener("DOMContentLoaded", () => {
 
  const botones = document.querySelectorAll(".seleccionar");
  botones.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        window.location.href = "circuito.html"; 
     
    });
  });
  const inicio = document.getElementById("inicio");
  inicio.addEventListener("click", () => {
    window.location.href = "index.html"; 
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const tarjetas = document.querySelectorAll('.tarjeta');
  
  tarjetas.forEach((tarjeta, index) => {
    setTimeout(() => {
      tarjeta.style.opacity = '0';
      tarjeta.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        tarjeta.style.opacity = '1';
        tarjeta.style.transform = 'translateY(0)';
      }, 100);
    }, index * 150);
  });
  
  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', function() {
      console.log('Tarjeta seleccionada:', this.querySelector('.nombre').textContent);
    });
  });
});