<template>
    <div class="principal">
        <div class="titulo">
            <h1>REGISTRO DE USUARIOS</h1>
        </div>

        <!--Botones Principales-->
        <div class="botones">
            <buttonPrincipal label="Iniciar Sesión" color="black" textColor="white" @accionBoton="mostrarLogin" />
            <buttonPrincipal label="Registrarse" color="black" textColor="white" @accionBoton="mostrarRegistro" />
            <buttonPrincipal label="Consultar" color="black" textColor="white" @accionBoton="mostrarConsulta" />
        </div>

        <div class="formularios">

            <!-- Sección de inicio-->
            <div v-if="seccion === 'login'" class="formulario">
                <h2>Iniciar Sesión</h2>

                <form @submit.prevent="login">
                    <!-- CAMBIO: Nombre → Documento -->
                    <q-input filled v-model="documento" type="text" label="Documento"
                        :rules="[val => !!val || 'El documento es obligatorio']" />

                    <q-input filled v-model="password" label="Contraseña" type="password" :rules="[
                        val => !!val || 'La contraseña es obligatoria',
                        val => val.length >= 8 || 'Debe tener mínimo 8 caracteres'
                    ]" />

                    <buttonPrincipal label="Entrar" color="black" textColor="white" @accionBoton="login" />
                    <buttonPrincipal label="Iniciar con Face ID" color="secondary" class="q-mt-md full-width"
                        @click="iniciarFaceIDLogin" />

                </form>
            </div>

            <!--sesion con face id-->
            <q-dialog v-model="mostrarDialogoFaceLogin" persistent>
                <q-card style="width: 360px; padding: 20px;">
                    <h4 class="text-center">Validar Rostro</h4>

                    <video ref="videoLoginRef" autoplay playsinline width="300" height="220"
                        style="border-radius: 10px; border: 2px solid #000; margin: 10px auto;"></video>

                    <buttonPrincipal label="Validar Rostro" color="green" class="full-width q-mt-md"
                        @click="validarRostroLogin" />

                    <buttonPrincipal label="Cancelar" flat class="full-width q-mt-sm" @click="cerrarModalFaceLogin" />
                </q-card>
            </q-dialog>


            <!-- Sección de registro -->
            <div v-if="seccion === 'registro'" class="formulario">
                <h2>Registrarse</h2>

                <form @submit.prevent="registrar">
                    <q-input filled v-model="nombre" type="text" label="Nombres"
                        :rules="[val => !!val || 'El nombre es obligatorio']" />

                    <q-input filled v-model="apellido" type="text" label="Apellidos"
                        :rules="[val => !!val || 'El apellido es obligatorio']" />

                    <!-- NUEVO: Documento -->
                    <q-input filled v-model="documento" type="text" label="Documento"
                        :rules="[val => !!val || 'El documento es obligatorio']" />

                    <q-input filled v-model="email" type="email" label="Correo de la institución"
                        :rules="[val => !!val || 'El correo es obligatorio']" />

                    <q-input filled v-model="password" type="password" label="Contraseña" :rules="[
                        val => !!val || 'La contraseña es obligatoria',
                        val => val.length >= 8 || 'Debe tener mínimo 8 caracteres'
                    ]" />

                    <buttonPrincipal label="Crear Cuenta" color="black" textColor="white" @accionBoton="registrar" />

                    <buttonPrincipal label="Registrar Face ID" color="primary" class="q-mt-md" @click="abrirFaceID" />

                </form>
            </div>

            <!--registro con face id-->
            <q-dialog v-model="mostrarDialogoFaceId" persistent>
                <q-card style="width: 350px; padding: 20px;">
                    <h4 class="text-center">Registrar Rostro</h4>

                    <video ref="videoRef" autoplay playsinline width="300" height="220"
                        style="border-radius: 10px; border: 2px solid #000;"></video>

                    <buttonPrincipal label="Guardar Rostro" color="green" class="full-width q-mt-md"
                        @click="capturarRostro" />

                    <buttonPrincipal label="Cancelar" flat class="full-width q-mt-sm"
                        @click="mostrarDialogoFaceId = false" />
                </q-card>
            </q-dialog>

            <!--Sección de consulta-->
            <div v-if="seccion === 'consultar'" class="formulario">
                <h2>Consultar Usuario</h2>

                <form @submit.prevent="consultar">
                    <!-- CAMBIO: Nombre → Documento -->
                    <q-input filled v-model="documento" type="text" label="Documento"
                        :rules="[val => !!val || 'El documento es obligatorio']" />

                    <buttonPrincipal label="Consultar con face Id" color="primary" class="q-mt-md"
                        @click="abrirConsulta" />
                </form>

                <video ref="videoConsultaRef" autoplay playsinline width="300" height="220"
                    style="display:none; margin-top: 15px;"></video>
            </div>

        </div>
    </div>

</template>



<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import buttonPrincipal from "./buttonPrincipal.vue"
import * as faceapi from "face-api.js";
import { Notify } from "quasar";

const router = useRouter();
const seccion = ref("login")

const nombre = ref("")
const apellido = ref("")
const email = ref("")
const password = ref("")
const documento = ref("")

/*  Obtener lista de usuarios desde localStorage */
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

/* Guardar lista de usuarios en localStorage */
function guardarUsuarios(lista) {
    localStorage.setItem("usuarios", JSON.stringify(lista));
}


function registrar() {
    if (!nombre.value || !apellido.value || !email.value || !documento.value || password.value.length < 8) {
        Notify.create({
            message: "Completa todos los campos",
            color: "red",
            icon: "error"
        });
        return;
    }

    let usuarios = obtenerUsuarios();


    const existeDoc = usuarios.some(u => u.documento === documento.value);  // <-- CAMBIO
    if (existeDoc) {
        Notify.create({
            message: "Este documento ya está registrado",
            color: "red",
            icon: "warning"
        });
        return;
    }


    const existeCorreo = usuarios.some(u => u.email === email.value);
    if (existeCorreo) {
        Notify.create({
            message: "Este correo ya está registrado",
            color: "red",
            icon: "warning"
        });
        return;
    }

    const nuevoUsuario = {
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        documento: documento.value,
        password: password.value,
        faceId: JSON.parse(localStorage.getItem("faceTemp")) || null
    };

    localStorage.removeItem("faceTemp");

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    Notify.create({
        message: "Usuario creado correctamente",
        color: "green",
        icon: "check"
    });

    nombre.value = "";
    apellido.value = "";
    email.value = "";
    documento.value = "";
    password.value = "";

    seccion.value = "login";
}

function login() {
    const usuarios = obtenerUsuarios();

    const usuarioEncontrado = usuarios.find(
        u => u.documento === documento.value && u.password === password.value
    );

    if (usuarioEncontrado) {
        Notify.create({
            message: `Bienvenido, ${usuarioEncontrado.nombre}`,
            color: "green",
            icon: "check"
        });

        localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
        router.push("/asistencia");
    } else {
        Notify.create({
            message: "Documento o contraseña incorrectos",
            color: "red",
            icon: "error"
        });
    }
}

function consultar() { }


function mostrarLogin() {
    seccion.value = "login"
}
function mostrarRegistro() {
    seccion.value = "registro"
}
function mostrarConsulta() {
    seccion.value = "consultar"
}

/* Registro con face id */
const mostrarDialogoFaceId = ref(false);
const videoRef = ref(null);

async function abrirFaceID() {
    mostrarDialogoFaceId.value = true;
    await cargarModelos();
    iniciarCamara();
}

async function cargarModelos() {
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
}

async function iniciarCamara() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.value.srcObject = stream;
}

async function capturarRostro() {
    const deteccion = await faceapi
        .detectSingleFace(videoRef.value)
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!deteccion) {
        Notify.create({
            message: "No se detectó un rostro",
            color: "red",
            icon: "error",
        });
        return;
    }

    localStorage.setItem("faceTemp", JSON.stringify(Array.from(deteccion.descriptor)));

    Notify.create({
        message: "Rostro registrado correctamente",
        color: "green",
        icon: "check"
    });

    mostrarDialogoFaceId.value = false;
}

/* Iniciar sesión con face id*/
const mostrarDialogoFaceLogin = ref(false);
const videoLoginRef = ref(null);
let streamLogin = null;

async function iniciarFaceIDLogin() {
    mostrarDialogoFaceLogin.value = true;
    await cargarModelos();
    iniciarCamaraLogin();
}

async function iniciarCamaraLogin() {
    streamLogin = await navigator.mediaDevices.getUserMedia({ video: true });
    videoLoginRef.value.srcObject = streamLogin;
}

function cerrarModalFaceLogin() {
    mostrarDialogoFaceLogin.value = false;
    if (streamLogin) streamLogin.getTracks().forEach(t => t.stop());
}

async function validarRostroLogin() {
    const usuarios = obtenerUsuarios();

    const deteccion = await faceapi
        .detectSingleFace(videoLoginRef.value)
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!deteccion) {
        Notify.create({ message: "No se detectó rostro", color: "red" });
        return;
    }

    const descriptorActual = deteccion.descriptor;

    for (const usuario of usuarios) {
        if (!usuario.faceId) continue;

        const distancia = faceapi.euclideanDistance(
            new Float32Array(usuario.faceId),
            descriptorActual
        );

        if (distancia < 0.45) {
            Notify.create({
                message: `Bienvenido, ${usuario.nombre}`,
                color: "green",
                icon: "check",
            });

            localStorage.setItem("usuarioActual", JSON.stringify(usuario));
            cerrarModalFaceLogin();
            router.push("/asistencia");
            return;
        }
    }

    Notify.create({ message: "Rostro no coincide", color: "red" });
}

/* Consultar con face id */
const documentoConsulta = ref("");  
const videoConsultaRef = ref(null);
let streamConsulta = null;

async function abrirConsulta() {
    await cargarModelos();
    await iniciarCamaraConsulta();

    setTimeout(() => validarConsultaFaceID(), 800);
}

async function iniciarCamaraConsulta() {
    try {
        streamConsulta = await navigator.mediaDevices.getUserMedia({ video: true });
        videoConsultaRef.value.srcObject = streamConsulta;
        videoConsultaRef.value.style.display = "block";

        await videoConsultaRef.value.play();
    } catch (error) {
        Notify.create({
            message: "No se pudo acceder a la cámara",
            color: "red"
        });
    }
}

async function validarConsultaFaceID() {
    const usuarios = obtenerUsuarios();

    const deteccion = await faceapi
        .detectSingleFace(videoConsultaRef.value)
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!deteccion) {
        Notify.create({ message: "No se detectó rostro", color: "red" });
        detenerCamaraConsulta();
        return;
    }

    const usuario = usuarios.find(
        u => u.documento === documentoConsulta.value 
    );

    if (!usuario) {
        Notify.create({ message: "No existe usuario con ese documento", color: "red" });
        detenerCamaraConsulta();
        return;
    }

    if (!usuario.faceId) {
        Notify.create({ message: "Ese usuario no tiene Face ID registrado", color: "red" });
        detenerCamaraConsulta();
        return;
    }

    const distancia = faceapi.euclideanDistance(
        new Float32Array(usuario.faceId),
        deteccion.descriptor
    );

    if (distancia < 0.45) {
        Notify.create({
            message: `Usuario encontrado: ${usuario.nombre} ${usuario.apellido}`,
            color: "green",
            icon: "check"
        });
    } else {
        Notify.create({
            message: "El rostro NO coincide con el documento ingresado",
            color: "red"
        });
    }

    detenerCamaraConsulta();
}

function detenerCamaraConsulta() {
    if (streamConsulta) streamConsulta.getTracks().forEach(t => t.stop());
    if (videoConsultaRef.value) videoConsultaRef.value.style.display = "none";
}

</script>




<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

:root {
    --color-primario: #212529;
    --color-fondo: #f8f9fa;
    --color-sombra: rgba(0, 0, 0, 0.1);
    --color-borde-input: #ced4da;
    --color-foco: #0d6efd;
    --color-acento: #343a40;
    --color-fondo-form: #ffffff;
    --color-fondo-dialog: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Oswald", sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    min-height: 100vh;
}

.principal {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.titulo h1 {
    font-size: 2.5rem;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    text-align: center;
    color: var(--color-primario);
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    padding-bottom: 15px;
}

.titulo h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background-color: var(--color-foco);
    border-radius: 2px;
}

.botones {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 2rem;
    width: 100%;
}

.button-principal-style {
    padding: 12px 20px;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    background-color: var(--color-primario);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    align-self: center;
    width: 100%;
    max-width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button-principal-style:hover {
    background-color: var(--color-acento);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.button-principal-style:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.formularios {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}

.formulario {
    background-color: var(--color-fondo-form);
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 16px var(--color-sombra);
    transition: all 0.3s ease;
    border-top: 5px solid var(--color-foco);
}

.formulario:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.formulario h2 {
    font-size: 1.75rem;
    font-family: "Oswald", sans-serif;
    font-weight: 500;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-primario);
}

.q-field {
    margin-bottom: 1.5rem;
}

.q-field__control {
    border-radius: 8px !important;
}

.q-field--filled .q-field__control {
    background-color: rgba(0, 0, 0, 0.03);
}

.q-field--filled .q-field__control:before {
    border-bottom: 1px solid var(--color-borde-input);
}

.q-field--filled .q-field__control:hover:before {
    border-bottom: 2px solid var(--color-primario);
}

.q-field--filled.q-field--focused .q-field__control:before {
    border-bottom: 2px solid var(--color-foco);
}

.face-dialog {
    width: 360px;
    padding: 20px;
    border-radius: 12px;
    background-color: var(--color-fondo-dialog);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.face-dialog h4 {
    margin-top: 0;
    color: var(--color-primario);
    font-weight: 600;
}

.video-face {
    border-radius: 10px;
    border: 2px solid var(--color-primario);
    margin: 10px auto;
    display: block;
    width: 100%;
    max-width: 300px;
    height: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.q-btn {
    border-radius: 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.q-btn--flat {
    color: var(--color-primario);
}

.q-btn--flat:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.q-notification {
    border-radius: 8px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .principal {
        padding: 15px;
    }

    .titulo h1 {
        font-size: 2rem;
    }

    .formularios {
        max-width: 100%;
    }

    .formulario {
        padding: 1.5rem;
    }

    .face-dialog {
        width: 90%;
        max-width: 360px;
    }
}
</style>