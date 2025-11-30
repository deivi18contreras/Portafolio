<template>
  <q-page class="categorias-page">

    <div class="categorias-title">
      <h1>Elije una categoria</h1>
    </div>

    <div class="categorias-grid">

      <CardCategoria title="Animales" :image="leon" @select="ir('animales')" />
      <CardCategoria title="Países" :image="pais" @select="ir('paises')" />
      <CardCategoria title="Transporte" :image="barco" @select="ir('transporte')" />
      <CardCategoria title="Carros" :image="carro" @select="ir('carros')" />

    </div>

    <div class="categorias-grid">

      <CardCategoria title="Deportes" :image="deporte" @select="ir('deportes')" />
      <CardCategoria title="Geografía" :image="geografia" @select="ir('geografia')" />
      <CardCategoria title="Comida" :image="comida" @select="ir('comida')" />
      <CardCategoria title="Literatura" :image="libro" @select="ir('literatura')" />

    </div>

  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import CardCategoria from "../components/CardCategoria.vue";

import leon from "../assets/leon.png";
import pais from "../assets/pais.png";
import barco from "../assets/barco.png";
import carro from "../assets/carro.png";
import deporte from "../assets/deporte.png";
import geografia from "../assets/geografia.png";
import comida from "../assets/comida.png";
import libro from "../assets/libro.png";

const router = useRouter();

function ir(categoria) {

  localStorage.setItem("categoria", categoria.toLowerCase());
  router.push("/niveles");
}
</script>



<style>
.categorias-page {
  min-height: 100vh;
  padding: 40px 20px;

  background: linear-gradient(135deg,
      #0a0f1f,
      #101b30,
      #0c1a2e,
      #142743);
  background-size: 300% 300%;
  animation: gradientMove 12s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
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


.categorias-title h1 {
  font-size: 2.6rem;
  color: #00ffe1;
  text-shadow: 0 0 25px #00ffe1, 0 0 40px #00ffe1;
  margin-bottom: 35px;
  letter-spacing: 3px;
  font-weight: bold;
  animation: glowPulse 2.5s ease-in-out infinite;
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


.categorias-grid {
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 50px;
  margin-top: 20px;
}


.categorias-grid>* {
  transition: transform 0.25s ease, filter 0.25s ease;
}

.categorias-grid>*:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px #00ffe1);
}
</style>
