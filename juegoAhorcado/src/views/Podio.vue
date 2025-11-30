<template>
  <div class="podio-container">
    <h1 class="titulo">🏆 Podio de Ganadores</h1>

    <div v-if="podio.length === 0" class="mensaje">
      No hay puntajes aún 🤷‍♂️
    </div>
    <div v-else class="podio">
      
      <div class="puesto puesto-1" v-if="podio[0]">
        <h2>🥇 {{ podio[0].nombre }}</h2>
        <p>Puntaje: {{ podio[0].puntaje }}</p>
        <p>Categoría: {{ podio[0].categoria }}</p>
        <p>Nivel: {{ podio[0].nivel }}</p>
        <p>Tiempo: {{ podio[0].tiempo }} s</p>
        <p>Fecha: {{ podio[0].fecha }}</p>
      </div>
      <div class="puesto puesto-2" v-if="podio[1]">
        <h2>🥈 {{ podio[1].nombre }}</h2>
        <p>Puntaje: {{ podio[1].puntaje }}</p>
        <p>Categoría: {{ podio[1].categoria }}</p>
        <p>Nivel: {{ podio[1].nivel }}</p>
        <p>Tiempo: {{ podio[1].tiempo }} s</p>
        <p>Fecha: {{ podio[1].fecha }}</p>
      </div>
      <div class="puesto puesto-3" v-if="podio[2]">
        <h2>🥉 {{ podio[2].nombre }}</h2>
        <p>Puntaje: {{ podio[2].puntaje }}</p>
        <p>Categoría: {{ podio[2].categoria }}</p>
        <p>Nivel: {{ podio[2].nivel }}</p>
        <p>Tiempo: {{ podio[2].tiempo }} s</p>
        <p>Fecha: {{ podio[2].fecha }}</p>
      </div>
    </div>

   
    <div class="botones-container">
      <Button label="Reiniciar Podio" color="#ff4466" textColor="#fff" @accionBoton="resetPodio"></Button>
      <Button label="Volver al inicio" color="#00ffcc" textColor="#000" @accionBoton="irInicio"></Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import Button from "../components/Button.vue"

const podio = ref([])
const router = useRouter();

onMounted(() => {
  const datos = JSON.parse(localStorage.getItem("podio")) || []

  podio.value = datos.sort((a, b) => b.puntaje - a.puntaje).slice(0, 3)
})

const resetPodio = () => {
  if (confirm("¿Estás seguro de que quieres borrar todos los puntajes?")) {
    localStorage.removeItem("podio")
    podio.value = []
  }
}

const irInicio = () => {
  router.push("/categoria")
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');


.podio-container {
  text-align: center;
  padding: 30px;
  color: white;
  min-height: 100vh;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; 
  position: relative;
  overflow: hidden;
}


.titulo {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 40px;
  color: #00ffcc;
  text-shadow: 0 0 15px #00ffcc;
  text-transform: uppercase;
}


.mensaje {
  margin-top: 40px;
  color: #aaa;
  font-size: 1.5rem;
}


.podio {
  display: flex;
  justify-content: center;
  align-items: flex-end; 
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
}


.puesto {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 15px;
  border: 2px solid;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-width: 220px;
}

.puesto:hover {
  transform: translateY(-10px);
}


.puesto-1 {
  border-color: #ffd700; 
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: scale(1.1); 
}

.puesto-2 {
  border-color: #c0c0c0; 
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}

.puesto-3 {
  border-color: #cd7f32; 
  box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
}

.puesto h2 {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.puesto p {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #f0f0f0;
}


.botones-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.podio-container::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 255, 204, 0.03) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}


@media (max-width: 768px) {
  .podio {
    flex-direction: column;
    align-items: center;
  }
  .puesto {
    transform: none !important; 
    width: 90%;
    max-width: 400px;
  }
  .puesto:hover {
    transform: none !important;
  }
}

@media (max-width: 500px) {
  .podio-container { padding: 15px; }

  .titulo {
    font-size: 2.2rem;
    margin-bottom: 25px;
    animation: glitch 2s infinite;
  }

  .puesto {
    padding: 20px;
  }

  .puesto h2 {
    font-size: 1.3rem;
  }
  
  .botones-container {
    flex-direction: column;
    width: 100%;
  }
}


@keyframes glitch {
  0% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
  14% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
  15% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
  49% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
  50% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75); }
  99% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75); }
  100% { text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75); }
}
</style>