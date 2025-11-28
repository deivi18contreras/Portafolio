<template>
    <div class="login-container">
        <div class="login-card q-pa-lg">
            <h2 class="text-center text-white">Ahorcado</h2>

            <q-input filled v-model="nombre" label="Escribe tu nombre" class="q-mt-md" dark color="white"
                @keyup.enter="intentarEntrar" />

            <q-btn v-if="nombre.length > 0" class="q-mt-lg full-width" color="primary" label="Jugar ahora"
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

<style >
.login-container {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;


    background:
        linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 80, 0.6)),
        url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=2070') center/cover;
    backdrop-filter: blur(4px);
}

.login-card {
    width: 350px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
</style>
