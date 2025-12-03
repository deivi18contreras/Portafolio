<template>
  <div class="podio-container">
    <h1 class="titulo">🏆 Podio de Ganadores</h1>

    <div v-if="podio.length === 0" class="mensaje">
      No hay puntajes aún 🤷‍♂️
    </div>

    <!-- TOP 3 -->
    <div v-else class="podio">
      <div class="podio-puestos">
        <div class="puesto puesto-2" v-if="podio[1]">
          <div class="medalla">🥈</div>
          <h2>{{ podio[1].jugador }}</h2>
          <p>Categoría: {{ podio[1].categoria }}</p>
          <p>Nivel: {{ podio[1].nivel }}</p>
          <p>Tiempo: {{ podio[1].tiempo }} s</p>
          <p>Resultado: {{ podio[1].gano ? "Ganó" : "Perdió" }}</p>
        </div>
      </div>
      
      <div class="podio-puestos">
        <div class="puesto puesto-1" v-if="podio[0]">
          <div class="medalla">🥇</div>
          <h2>{{ podio[0].jugador }}</h2>
          <p>Categoría: {{ podio[0].categoria }}</p>
          <p>Nivel: {{ podio[0].nivel }}</p>
          <p>Tiempo: {{ podio[0].tiempo }} s</p>
          <p>Resultado: {{ podio[0].gano ? "Ganó" : "Perdió" }}</p>
        </div>
      </div>
      
      <div class="podio-puestos">
        <div class="puesto puesto-3" v-if="podio[2]">
          <div class="medalla">🥉</div>
          <h2>{{ podio[2].jugador }}</h2>
          <p>Categoría: {{ podio[2].categoria }}</p>
          <p>Nivel: {{ podio[2].nivel }}</p>
          <p>Tiempo: {{ podio[2].tiempo }} s</p>
          <p>Resultado: {{ podio[2].gano ? "Ganó" : "Perdió" }}</p>
        </div>
      </div>
    </div>

    <!-- Botón para mostrar más jugadores -->
    <div v-if="otrosJugadores.length > 0" class="ver-mas-container">
      <Button label="Ver más puestos" color="#333" textColor="#fff" @accionBoton="mostrarMas = !mostrarMas" />
    </div>

    <!-- Lista del resto de jugadores -->
    <div v-if="mostrarMas" class="otros-container">
      <h2>Otros participantes</h2>
      <div class="lista-jugadores">
        <div v-for="(item, index) in otrosJugadores" :key="index" class="puesto-extra">
          <div class="puesto-numero">#{{ index + 4 }}</div>
          <div class="puesto-info">
            <h3>{{ item.jugador }}</h3>
            <p>Categoría: {{ item.categoria }}</p>
            <p>Nivel: {{ item.nivel }}</p>
            <p>Tiempo: {{ item.tiempo }} s</p>
            <p>Resultado: {{ item.gano ? "Ganó" : "Perdió" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones finales -->
    <div class="botones-container">
      <Button label="Reiniciar Podio" color="#ff4466" textColor="#fff" @accionBoton="resetPodio" />
      <Button label="Volver al inicio" color="#00ffcc" textColor="#000" @accionBoton="irInicio" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import Button from "../components/Button.vue"

const mostrarMas = ref(false)
const router = useRouter()

// Nombre del jugador actual
const jugador = localStorage.getItem("jugador") || "Jugador"

// Computed que obtiene el podio completo y lo ordena por tiempo
const podio = computed(() => {
  const datos = JSON.parse(localStorage.getItem("podioAhorcado") || "[]")
  return datos.sort((a, b) => a.tiempo - b.tiempo)
})

// Los demás jugadores (del 4 en adelante)
const otrosJugadores = computed(() => podio.value.slice(3))

// Reiniciar podio
const resetPodio = () => {
  if (confirm("¿Estás seguro de que quieres borrar todos los puntajes?")) {
    localStorage.removeItem("podioAhorcado")
    window.location.reload()
  }
}

// Volver al inicio usando router
const irInicio = () => {
  router.push("/categoria")
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

/* --- ESTILOS BASE MEJORADOS --- */

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

.podio-container::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(to bottom,
      transparent 50%,
      rgba(0, 255, 204, 0.03) 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}

.titulo {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 40px;
  color: #00ffcc;
  text-shadow: 0 0 15px #00ffcc;
  text-transform: uppercase;
  position: relative;
  z-index: 2;
}

.mensaje {
  margin-top: 40px;
  color: #aaa;
  font-size: 1.5rem;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  max-width: 500px;
}

.podio {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.podio-puestos {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 350px;
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
  width: 100%;
  position: relative;
  overflow: hidden;
}

.puesto::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.puesto:hover::before {
  left: 100%;
}

.puesto:hover {
  transform: translateY(-10px);
}

.puesto-1 {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: scale(1.1);
  margin-top: -30px;
  z-index: 3;
}

.puesto-2 {
  border-color: #c0c0c0;
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
  margin-top: -15px;
  z-index: 2;
}

.puesto-3 {
  border-color: #cd7f32;
  box-shadow: 0 0 20px rgba(205, 127, 50, 0.5);
  z-index: 1;
}

.medalla {
  font-size: 3rem;
  margin-bottom: 10px;
  text-align: center;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.puesto h2 {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.puesto p {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #f0f0f0;
}

.ver-mas-container {
  margin: 20px 0;
  z-index: 2;
}

.otros-container {
  width: 100%;
  max-width: 800px;
  margin-top: 30px;
  z-index: 2;
}

.otros-container h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #00ffcc;
}

.lista-jugadores {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.puesto-extra {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  padding: 15px 20px;
  border-radius: 10px;
  border-left: 4px solid #00ffcc;
  transition: transform 0.3s ease, background 0.3s ease;
}

.puesto-extra:hover {
  transform: translateX(10px);
  background: rgba(0, 0, 0, 0.6);
}

.puesto-numero {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00ffcc;
  margin-right: 20px;
  min-width: 40px;
}

.puesto-info {
  text-align: left;
  flex: 1;
}

.puesto-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
}

.puesto-info p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #ccc;
}

.botones-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  z-index: 2;
}

/* --- RESPONSIVIDAD ORIGINAL --- */

@media (max-width: 768px) {
  .podio {
    flex-direction: column;
    align-items: center;
  }

  .puesto {
    transform: none !important;
    width: 90%;
    max-width: 400px;
    margin-top: 0 !important;
  }

  .puesto:hover {
    transform: none !important;
  }
}

@media (max-width: 500px) {
  .podio-container {
    padding: 15px;
  }

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

/* --- ANIMACIÓN GLITCH PARA MÓVIL (ORIGINAL) --- */
@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }

  14% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }

  15% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  49% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  50% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  99% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  100% {
    text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}
</style>