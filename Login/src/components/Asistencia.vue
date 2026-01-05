<template>
    <q-page-container>
        <q-page padding class="flex flex-center column">

            <h2 class="text-center q-mb-lg">Registro de Asistencia</h2>
            <q-btn label="Marcar Asistencia" color="primary" class="q-mb-lg" @click="iniciarFaceID" />

            <video ref="videoRef" autoplay playsinline width="300" height="220"
                style="display:none; border-radius: 12px; border: 2px solid #000;"></video>

            <div v-if="error" class="text-negative q-mt-md">
                {{ error }}
            </div>
            <div v-if="mensaje" class="text-positive q-mt-md">
                {{ mensaje }}
            </div>

            <h3 class="q-mt-xl text-center">Historial de Asistencias</h3>

            <div v-if="asistencias.length === 0" class="text-grey q-mt-md">
                No hay asistencias registradas.
            </div>

            <div v-for="(item, index) in asistencias" :key="index" class="q-mt-md">
                <q-card class="q-pa-md">
                    <h5>Asistencia #{{ index + 1 }}</h5>
                    <p>📅Fecha: {{ item.fecha }}</p>
                    <p>⏰ Hora: {{ item.hora }}</p>
                </q-card>
            </div>

        </q-page>
    </q-page-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as faceapi from "face-api.js";
import { Notify } from "quasar";

const router = useRouter();

const videoRef = ref(null);
const mensaje = ref("");
const error = ref("");
const asistencias = ref([]);

let stream = null;


onMounted(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) return;

    const clave = "asistencias_" + usuario.email;
    asistencias.value = JSON.parse(localStorage.getItem(clave)) || [];

    cargarModelos();
});


async function cargarModelos() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
}


async function iniciarFaceID() {
    mensaje.value = "";
    error.value = "";

    await iniciarCamara();

    setTimeout(() => validarFaceID(), 2500);
}


async function iniciarCamara() {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.value.srcObject = stream;
    videoRef.value.style.display = "block";
}


function detenerCamara() {
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
    }
    videoRef.value.style.display = "none";
}


async function validarFaceID() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

    if (!usuario || !usuario.faceId) {
        error.value = "No tienes registrado Face ID";
        detenerCamara();
        return;
    }

    // Detectar rostro
    const detectado = await faceapi
        .detectSingleFace(videoRef.value)
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detectado) {
        error.value = "No se detectó tu rostro";
        detenerCamara();
        return;
    }

    const descriptorGuardado = new Float32Array(usuario.faceId);

    const distancia = faceapi.euclideanDistance(
        descriptorGuardado,
        detectado.descriptor
    );

    if (distancia < 0.45) {
        marcarAsistencia();
    } else {
        error.value = "Reconocimiento facial incorrecto ❌";
    }

    detenerCamara();
}


function marcarAsistencia() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const clave = "asistencias_" + usuario.email;

    let lista = JSON.parse(localStorage.getItem(clave)) || [];

    const registro = {
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
    };

    lista.push(registro);

    localStorage.setItem(clave, JSON.stringify(lista));

    mensaje.value = "Asistencia marcada ✔️";

    Notify.create({
        message: "Asistencia marcada correctamente",
        color: "green",
        icon: "check",
    });

   
    localStorage.removeItem("usuarioActual");

    setTimeout(() => {
        router.push("/");
    }, 1500);
}
</script>

<style>
h2,
h3,
h5 {
    text-align: center;
}

.attendance-page {
    background-color: #f5f7fa;
    min-height: 100vh;
}

.page-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 2rem;
}

.attendance-btn {
    width: 250px;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.attendance-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.camera-feed {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    margin: 20px 0;
    background-color: #000;
    transform: scaleX(-1);
}

.message-box {
    padding: 12px 20px;
    border-radius: 8px;
    margin: 15px 0;
    width: 100%;
    max-width: 500px;
    text-align: center;
    font-weight: 500;
}

.error-message {
    background-color: #fee;
    border-left: 4px solid #f44336;
}

.success-message {
    background-color: #e8f5e9;
    border-left: 4px solid #4caf50;
}

.history-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    color: #2c3e50;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
}

.no-records {
    font-style: italic;
    opacity: 0.7;
    margin-top: 10px;
}

.attendance-record {
    width: 100%;
    max-width: 500px;
}

.attendance-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    margin-bottom: 15px;
}

.attendance-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.attendance-card h5 {
    margin: 0 0 10px 0;
    color: #1976d2;
    font-weight: 600;
}

.attendance-card p {
    margin: 5px 0;
    display: flex;
    align-items: center;
}
</style>
