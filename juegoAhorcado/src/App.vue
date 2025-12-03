<template>
  <q-layout view="hHh Lpr lff">

    <template v-if="route.path !== '/'">

      <q-header elevated class="header-glow">
        <q-toolbar>

          <q-btn flat @click="drawer = !drawer" round dense icon="menu" class="btn-neon" />

          <q-toolbar-title class="text-neon">
            Ahorcado
          </q-toolbar-title>

        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" :width="240" bordered class="drawer-neon">

        <div class="drawer-title q-pa-md text-center">
          <q-avatar size="70px" class="avatar-glow">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>

          <div class="q-mt-sm text-neon-sm">
            {{ jugador }}
          </div>
        </div>

        <q-scroll-area class="fit q-pa-sm">

          <q-btn class="menu-btn" label="Inicio" to="/" />
          <q-btn class="menu-btn" label="Categoría" to="/categoria" />
          <q-btn class="menu-btn" label="Niveles" to="/niveles" />
          <q-btn class="menu-btn" label="Juego" to="/juego" />
          <q-btn class="menu-btn" label="Podio" to="/podio" />

   
          <q-btn class="menu-btn logout-btn" label="Cerrar Sesión" @click="cerrarSesion" />

        </q-scroll-area>

      </q-drawer>
    </template>

    <q-page-container class="main-bg">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const route = useRoute()


const jugador = localStorage.getItem("jugador") || "Jugador"


function cerrarSesion() {
  localStorage.removeItem("jugador")
  window.location.href = "/"   
}
</script>

<style scoped>
.main-bg {
  background: linear-gradient(145deg, #0a0a0a, #111);
  min-height: 100vh;
}

.header-glow {
  background: #000;
  border-bottom: 1px solid #00ffc8;
  box-shadow: 0 0 12px #00ffc8;
  text-align: center;
}

.text-neon {
  color: #00ffc8;
  text-shadow: 0 0 6px #00ffc8;
}

.btn-neon {
  color: #00ffc8 !important;
  transition: 0.2s;
}

.btn-neon:hover {
  text-shadow: 0 0 8px #00ffc8;
}

.drawer-neon {
  background: #0e0e0e;
  border-right: 1px solid #00ffc8;
  box-shadow: 0 0 12px #00ffc8;
}

.avatar-glow img {
  border: 2px solid #00ffc8;
  box-shadow: 0 0 12px #00ffc8;
  border-radius: 50%;
}

.text-neon-sm {
  color: #00ffc8;
  text-shadow: 0 0 4px #00ffc8;
}

.menu-btn {
  background: transparent;
  color: #00ffc8;
  border: 1px solid #00ffc8;
  width: 100%;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-weight: bold;
  transition: 0.25s;
  box-shadow: 0 0 6px #00ffc8;
}

.menu-btn:hover {
  background: #00ffc8;
  color: #000;
  box-shadow: 0 0 14px #00ffc8;
}

.logout-btn {
  border-color: #ff4444;
  color: #ff4444 !important;
  box-shadow: 0 0 6px #ff4444;
}

.logout-btn:hover {
  background: #ff4444;
  color: #000 !important;
  box-shadow: 0 0 14px #ff4444;
}
</style>
