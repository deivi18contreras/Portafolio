 document.addEventListener('DOMContentLoaded', function() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Posición aleatoria
            const posX = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 15 + Math.random() * 15;
            
            particle.style.left = `${posX}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            // Tamaño aleatorio
            const size = 2 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Color aleatorio entre cian y púrpura
            const colors = [
                'rgba(0, 255, 204, 0.7)',
                'rgba(162, 0, 255, 0.7)',
                'rgba(0, 255, 255, 0.7)'
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = color;
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            particlesContainer.appendChild(particle);
        }
    });