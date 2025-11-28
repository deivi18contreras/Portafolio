<template>
  <div>
    <h1>Juego</h1>
  </div>
</template>
<script setup>
function guardarEnPodio() {
  const jugador = sessionStorage.getItem("jugador")
  const inicio = parseInt(sessionStorage.getItem("tiempoInicio"))
  const tiempo = Math.floor((Date.now() - inicio) / 1000)

  const entrada = { jugador, tiempo }

  const podio = JSON.parse(localStorage.getItem("podioAhorcado") || "[]")
  podio.push(entrada)

  localStorage.setItem("podioAhorcado", JSON.stringify(podio))
}
guardarEnPodio()
router.push("/podio")

</script>