<template>
    <div>
        <video ref="videoRef" autoplay playsinline width="320" height="240"></video>

        <q-btn color="primary" label="Registrar Rostro" @click="capturarRostro" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as faceapi from 'face-api.js'

const videoRef = ref(null)

async function iniciarCamara() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    videoRef.value.srcObject = stream
}

async function cargarModelos() {
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ])
}

async function capturarRostro() {
    const detections = await faceapi
        .detectSingleFace(videoRef.value)
        .withFaceLandmarks()
        .withFaceDescriptor()

    if (!detections) {
        alert("No se detectó ningún rostro")
        return
    }

    // Guardar descriptor en localStorage
    localStorage.setItem("faceData", JSON.stringify(Array.from(detections.descriptor)))

    alert("Rostro guardado correctamente ✔️")
}

onMounted(async () => {
    await cargarModelos()
    await iniciarCamara()
})
</script>

<style scoped>
video {
    border: 2px solid #00ffcc;
    border-radius: 10px;
}
</style>
