<template>
<div class="comodines">
    <div class="primerComodin"></div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useGame } from '../stores/game';
import {preguntas} from '../data/preguntas.js'
import { useRouter } from 'vue-router';
import boton from '../components/boton.vue';

import correctaAudio from '../assets/correcta.mp3';
import incorrectoAudio from '../assets/incorrecto.mp3';
import tiempoAudio from '../assets/tiempo.mp3';
import gameOverAudio from '../assets/game over.mp3';

const game = useGame();
const router = useRouter();

const estado = ref('')
const opcionesOcultas = ref([]);
const pistaLlamada = ref('');
const porcetanjePublico = ref([]);
const mostrarGrafica = ref(false);
const dineroSeguro = ref(0);


const comodines = ref({
    mitadUsada: false,
    llamadaUsada: false,
    publicoUsado: false
});



</script>


<style>

</style>