<template>
    <div class="login-container">
        <div class="login-card">
            <h1 class="titulo">AHORCADO</h1>
            <p class="subtitulo">SISTEMA DE ACCESO</p>

            <q-input filled v-model="nombre" label="IDENTIFICACIÓN" class="q-mt-lg input-field" dark color="cyan"
                @keyup.enter="intentarEntrar" />

            <q-btn v-if="nombre.length > 0" class="q-mt-lg full-width btn-play" label="INICIAR SESIÓN"
                @click="intentarEntrar" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const nombre = ref("");
const router = useRouter();

function intentarEntrar() {
    if (!nombre.value.trim()) return;

    localStorage.setItem("jugador", nombre.value);
    router.push("/categoria");
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.login-container {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Orbitron', sans-serif;
    background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
    position: relative;
    overflow: hidden;
}


.login-card {
    width: 50%;
    max-width: 450px;
    padding: 40px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 204, 0.3);
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
    text-align: center;
}


.titulo {
    font-size: 10px;
    font-weight: 900;
    margin: 0;
    color: #00ffcc;
    text-shadow: 0 0 15px #00ffcc;
    text-transform: uppercase;
}

.subtitulo {
    margin-top: 5px;
    margin-bottom: 20px;
    color: #ff00ff;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 2px;
}


.input-field .q-field__control {
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 10px !important;
}

.input-field .q-field__control:before {
    border-color: rgba(0, 255, 204, 0.5) !important;
}

.input-field .q-field__control:hover:before {
    border-color: rgba(0, 255, 204, 0.8) !important;
}

.input-field .q-field__label {
    color: rgba(255, 255, 255, 0.7) !important;
    font-weight: 700;
}

.input-field .q-field__native {
    color: white !important;
}


.btn-play {
    background: #00ffcc !important;
    color: #000 !important;
    font-weight: 900 !important;
    font-size: 1.1rem !important;
    border-radius: 10px !important;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

.btn-play:hover {
    background: #00e6b8 !important;
    box-shadow: 0 0 15px rgba(0, 255, 204, 0.7);
    transform: translateY(-2px);
}


.login-container::before {
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

@media (max-width: 500px) {
    .login-card {
        padding: 30px 20px;
    }

    .titulo {
        font-size: 15px;
        animation: glitch 2s infinite;
    }

    .subtitulo {
        font-size: 0.8rem;
    }
}

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