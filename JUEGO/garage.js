document.addEventListener('DOMContentLoaded', function() {
  // === PARTÍCULAS ===
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 2;
    const posX = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff00aa'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    particlesContainer.appendChild(particle);
  }

  // === CARRUSEL ===
  const track = document.querySelector('.carrusel-track');
  const slides = document.querySelectorAll('.car-slide');
  const prevButton = document.querySelector('.carrusel-btn.prev');
  const nextButton = document.querySelector('.carrusel-btn.next');
  const indicatorsContainer = document.querySelector('.carrusel-indicators');
  const notification = document.getElementById('notification');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
      currentSlide = i;
      updateCarousel();
    });
    indicatorsContainer.appendChild(indicator);
  }
  
  const indicators = document.querySelectorAll('.indicator');
  
  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
    
    const statBars = document.querySelectorAll('.stat-bar');
    statBars.forEach(bar => {
      const width = bar.style.getPropertyValue('--width');
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    });
  }

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });
  
  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  });

  // === EFECTO HOVER PARTES ===
  const partItems = document.querySelectorAll('.part-item');
  partItems.forEach(part => {
    part.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.05)';
      this.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.8)';
      this.style.background = 'rgba(0, 50, 50, 0.8)';
    });
    
    part.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      this.style.background = '';
    });
  });

// === BOTONES SELECT ===
const selectBtns = document.querySelectorAll('.select-btn');
selectBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const vehicleName = this.parentElement.parentElement.querySelector('.car-title').textContent;
    
    notification.textContent = `¡Has seleccionado: ${vehicleName}!`;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
    
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 200);

  
    window.location.href = './modos.html';
  });
});


  // === TECLAS DE DIRECCIÓN ===
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarousel();
    } else if (e.key === 'ArrowRight') {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }
  });
});
