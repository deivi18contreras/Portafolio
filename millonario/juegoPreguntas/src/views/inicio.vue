<template>
       <div>
          <img :src="millonario" alt="">    
       </div>
<boton :disable="botonBloqueado || !nombre" @seleccionar="empezarJuego" :label="botonBloqueado && nombre ?`Espera .(${conteoBoton})`:'¡jugar'" class="" :color="botonBloqueado ? 'grey': 'primary'"></boton>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'
import { useGame } from '../stores/game.js'
import boton from '../components/boton.vue'
import introAudio from '../assets/intro.mp3'
import millonario from '../assets/millonario.png'

const router = useRouter();
const game = useGame();
const nombre = ref('');
const botonBloqueado = ref(true);
const conteoBoton = ref(10)
const intro = new Audio(introAudio)

let comienzoIntro = false

const gestionIntro = () => {
       if (comienzoIntro && nombre.value.length > 0) {
              comienzoIntro = true

              intro.play().catch(e => console.log("Para escuchar el sonido interactue"))

              const intervalo = setInterval(() => {
                     conteoBoton.value--
                     if (conteoBoton.value <= 0) {
                            botonBloqueado.value = false
                            clearInterval(intervalo)
                     }
              }, 1000)
       }
}

const empezarJuego  = () =>{
       intro.pause ()
       intro.push('/juego')
}

onUnmounted(() =>{
       intro.pause()
})

</script>