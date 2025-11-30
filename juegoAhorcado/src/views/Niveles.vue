<template>
  <q-page class="niveles-page">

    <div class="niveles-title">
      <h1>Elige un nivel</h1>
    </div>

    <div class="niveles-grid">

      <div class="nivel-card facil" @click="seleccionar('facil')">
        <h2>Fácil</h2>
        <p>Ideal para comenzar</p>
      </div>

      <div class="nivel-card medio" @click="seleccionar('medio')">
        <h2>Medio</h2>
        <p>Dificultad balanceada</p>
      </div>

      <div class="nivel-card dificil" @click="seleccionar('dificil')">
        <h2>Difícil</h2>
        <p>Palabras largas y raras</p>
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function seleccionar(nivel) {
  localStorage.setItem("nivel", nivel);
  router.push("/juego");
}
</script>


<style>
.niveles-page {
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background: linear-gradient(135deg,
      #020617,
      #041229,
      #071b3c,
      #0a234f);
  background-size: 300% 300%;
  animation: gradientMove 12s ease infinite;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}


.niveles-title h1 {
  font-size: 2.6rem;
  color: #00ffe1;
  text-shadow: 0 0 25px #00ffe1, 0 0 40px #00ffe1;
  margin-bottom: 35px;
  font-weight: bold;
  letter-spacing: 3px;
  animation: glowPulse 2.5s infinite;
}

@keyframes glowPulse {
  0% {
    text-shadow: 0 0 15px #00ffe1;
  }

  50% {
    text-shadow: 0 0 35px #00ffe1;
  }

  100% {
    text-shadow: 0 0 15px #00ffe1;
  }
}


.niveles-grid {
  width: 100%;
  max-width: 850px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
}


.nivel-card {
  padding: 25px;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;

  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);

  transition: 0.25s ease;
}

.nivel-card:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 0 25px rgba(0, 255, 225, 0.7);
}


.nivel-card h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #00ffe1;
  text-shadow: 0 0 12px #00ffe1;
}

.nivel-card p {
  margin-top: 8px;
  color: #d6eaff;
  opacity: 0.8;
}


.facil {
  border-left: 6px solid #00ff88;
}

.facil:hover {
  box-shadow: 0 0 25px #00ff88;
}

.medio {
  border-left: 6px solid #ffd700;
}

.medio:hover {
  box-shadow: 0 0 25px #ffd700;
}

.dificil {
  border-left: 6px solid #ff1b4a;
}

.dificil:hover {
  box-shadow: 0 0 25px #ff1b4a;
}
</style>
