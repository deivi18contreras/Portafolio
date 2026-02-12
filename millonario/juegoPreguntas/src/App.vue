<template>
        <boton label="Jugar" color="primary" textColor="white" :disabled="!botonActivo" @accionBoton="jugar"></boton>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import intro from './assets/intro.mp3'
import { useRouter } from 'vue-router';
import boton from './components/boton.vue';

const router = useRouter();

 const botonActivo = ref(false);
let audio = 

onMounted(() => {
    audio = new Audio(intro);
    audio.play();

    setTimeout(() => {
        botonActivo.value = true;
    }, );
});

const jugar = () => {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    console.log("Empieza el juego"); 

}
</script>

<style></style>