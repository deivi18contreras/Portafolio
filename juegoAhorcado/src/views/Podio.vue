<template>
  <q-page class="q-pa-xl podio-bg">

    <h1 class="titulo-neon text-center q-mb-xl">
      🏆 Podio de Ganadores
    </h1>

    <!-- FILTROS -->
    <div class="filtros">
      <q-select
        v-model="filtroCategoria"
        :options="categorias"
        label="Filtrar por categoría"
        clearable
        emit-value map-options
      />

      <q-select
        v-model="filtroNivel"
        :options="niveles"
        label="Filtrar por nivel"
        clearable
        emit-value map-options
      />
    </div>

    <!-- TOP 3 -->
    <div v-if="top3.length > 0" class="podio-container q-mt-xl">
      <div
        v-for="(jugador, i) in top3"
        :key="i"
        class="podio-card"
        :class="'puesto-' + (i + 1)"
      >
        <div class="puesto-numero">#{{ i + 1 }}</div>

        <q-avatar size="80px" class="avatar-neon">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>

        <h3 class="nombre-neon">{{ jugador.nombre }}</h3>

        <p class="tiempo-neon">⏱ {{ jugador.tiempo }} segundos</p>

        <p class="categoria-neon">
          🎯 {{ jugador.categoria }} — {{ jugador.nivel }}
        </p>
      </div>
    </div>

    <h2 class="text-white text-center q-mt-xl">📋 Tabla completa</h2>

    <q-table
      v-if="resultadosFiltrados.length > 0"
      :rows="resultadosFiltrados"
      :columns="columnas"
      row-key="fecha"
      flat
      dark
      class="q-mt-lg tabla-neon"
    />

    <div
      v-else
      class="text-center text-white text-h6 q-mt-xl"
    >
      No hay resultados para estos filtros.
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const podio = ref([]);

const filtroCategoria = ref(null);
const filtroNivel = ref(null);

const categorias = [
  "animales", "paises", "aviones", "carros"
];

const niveles = [
  "facil", "medio", "dificil"
];

const columnas = [
  { name: "nombre", label: "Jugador", field: "nombre" },
  { name: "categoria", label: "Categoría", field: "categoria" },
  { name: "nivel", label: "Nivel", field: "nivel" },
  { name: "tiempo", label: "Tiempo (s)", field: "tiempo", sortable: true },
  { name: "fecha", label: "Fecha", field: "fecha" }
];

onMounted(() => {
  podio.value = JSON.parse(localStorage.getItem("podio") || "[]");
});

// 👑 Top 3 ordenado
const top3 = computed(() =>
  [...podio.value]
    .filter(filtrar)
    .sort((a, b) => a.tiempo - b.tiempo)
    .slice(0, 3)
);

// 📋 Tabla completa con filtros
const resultadosFiltrados = computed(() =>
  podio.value.filter(filtrar)
);

// Función de filtrado
function filtrar(item) {
  const cat = filtroCategoria.value ? item.categoria === filtroCategoria.value : true;
  const niv = filtroNivel.value ? item.nivel === filtroNivel.value : true;
  return cat && niv;
}
</script>

<style scoped>
.podio-bg {
  background: linear-gradient(145deg, #000, #0c0c0c);
  min-height: 100vh;
  color: white;
}

.titulo-neon {
  color: #00ffc8;
  text-shadow: 0 0 10px #00ffc8;
  font-size: 2.8rem;
}

.filtros {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.podio-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.podio-card {
  width: 230px;
  padding: 25px;
  border-radius: 18px;
  text-align: center;
  background: #0d0d0d;
  border: 2px solid #00ffc8;
  box-shadow: 0 0 12px #00ffc8;
}

.puesto-1 {
  border-color: #ffd700;
  box-shadow: 0 0 18px #ffd700;
}
.puesto-2 {
  border-color: #c0c0c0;
  box-shadow: 0 0 18px #c0c0c0;
}
.puesto-3 {
  border-color: #cd7f32;
  box-shadow: 0 0 18px #cd7f32;
}

.tabla-neon {
  border: 1px solid #00ffc8;
  box-shadow: 0 0 12px #00ffc8;
}
</style>
