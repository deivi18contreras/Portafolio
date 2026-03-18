<template>
  <q-layout view="lHh Lpr lFf" class="user-layout-bg" @mousemove="handleMouseMove">
    <!-- EFECTO DE PARTÍCULAS (MAGIA VIVA) -->
    <div class="magic-particles" v-for="p in particles" :key="p.id" :style="{ left: p.x + 'px', top: p.y + 'px', opacity: p.opacity }"></div>

    <q-drawer v-model="drawer" show-if-above :width="280" class="sidebar-glass">
      <div class="full-height column no-wrap">
        <div class="q-pa-xl text-center">
          <div class="logo-container animate-float">
            <q-icon name="auto_awesome" size="40px" class="text-amber-5 text-glow-amber" />
            <div class="text-h5 cinzel-font text-white q-mt-sm">ASTRA AI</div>
          </div>
        </div>

        <!-- RANGO ASTRAL (Gamificación) -->
        <div class="q-px-lg q-mb-md">
           <div class="rank-box q-pa-md">
              <div class="row items-center justify-between q-mb-xs">
                 <span class="text-caption text-amber-5 text-weight-bolder">RANGO: {{ currentRank }}</span>
                 <q-icon name="stars" color="amber-5" />
              </div>
              <q-linear-progress :value="0.6" color="amber-5" rounded />
              <div class="text-right text-grey-6" style="font-size: 9px">SIGUIENTE NIVEL: {{ nextRank }}</div>
           </div>
        </div>

        <q-list class="q-px-md q-gutter-y-sm">
          <q-item clickable v-ripple to="/user/dashboard" active-class="nav-active" class="nav-item">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section class="text-weight-bold">COSMOS</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/oracle" active-class="nav-active" class="nav-item">
            <q-item-section avatar><q-icon name="psychic" /></q-item-section>
            <q-item-section class="text-weight-bold">SANTUARIO</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/vault" active-class="nav-active" class="nav-item">
            <q-item-section avatar><q-icon name="auto_stories" /></q-item-section>
            <q-item-section class="text-weight-bold">ARCHIVO</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/seals" active-class="nav-active" class="nav-item">
            <q-item-section avatar><q-icon name="military_tech" /></q-item-section>
            <q-item-section class="text-weight-bold">GRIMORIO</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/payments" active-class="nav-active" class="nav-item">
            <q-item-section avatar><q-icon name="payments" /></q-item-section>
            <q-item-section class="text-weight-bold">CRÓNICAS DE ORO</q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="q-pa-md row items-center justify-between border-top-glass sidebar-footer">
           <q-avatar size="45px" class="cursor-pointer avatar-glow" @click="perfilRef.openDrawer()">
              <img :src="userAvatar">
           </q-avatar>
           <div class="column">
              <span class="text-white text-caption text-weight-bolder">{{ userName }}</span>
              <span class="text-grey-6" style="font-size: 10px">{{ authStore.usuario?.estado === 1 ? 'ILUMINADO' : 'INICIADO' }}</span>
           </div>
           <q-btn flat round icon="notifications" color="amber-5" @click="notifRef.openDrawer()">
              <q-badge floating color="amber-10" rounded v-if="authStore.unreadCount > 0">{{ authStore.unreadCount }}</q-badge>
           </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="nebula-travel" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <Perfil ref="perfilRef" />
    <notificaciones ref="notifRef" />
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/Auth.js'
import Perfil from '../components/perfil.vue'
import Notificaciones from '../components/notificaciones.vue'

const authStore = useAuthStore()
const drawer = ref(false)
const perfilRef = ref(null)
const notifRef = ref(null)

const userName = computed(() => authStore.usuario?.nombre || 'Buscador')
const userAvatar = computed(() => authStore.usuario?.avatar || 'https://i.pravatar.cc/150?img=33')

const currentRank = computed(() => authStore.usuario?.estado === 1 ? 'ILUMINADO' : 'INICIADO')
const nextRank = computed(() => authStore.usuario?.estado === 1 ? 'MAESTRO' : 'BUSCADOR')

// LÓGICA DE PARTÍCULAS MÁGICAS
const particles = ref([])
let pId = 0
const handleMouseMove = (e) => {
   const id = pId++
   particles.value.push({ id, x: e.clientX, y: e.clientY, opacity: 1 })
   if (particles.value.length > 20) particles.value.shift()
   setTimeout(() => {
      const idx = particles.value.findIndex(p => p.id === id)
      if (idx !== -1) particles.value[idx].opacity = 0
   }, 300)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

.user-layout-bg {
  background: #020617;
  background-image: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%);
  min-height: 100vh;
  overflow: hidden;
}

.sidebar-glass {
  background: rgba(15, 23, 42, 0.8) !important;
  backdrop-filter: blur(25px);
  border-right: 1px solid rgba(251, 191, 36, 0.1);
}

.rank-box {
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 16px;
}

.nav-item {
  color: #94a3b8; border-radius: 12px; margin-bottom: 4px; transition: all 0.3s;
}
.nav-active {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), transparent);
  color: #fbbf24 !important; border-left: 3px solid #fbbf24;
}

.avatar-glow { border: 2px solid #fbbf24; box-shadow: 0 0 15px rgba(251, 191, 36, 0.3); }

/* PARTÍCULAS */
.magic-particles {
  position: fixed; width: 4px; height: 4px; background: #fbbf24;
  border-radius: 50%; pointer-events: none; z-index: 9999;
  box-shadow: 0 0 10px #fbbf24; transition: opacity 0.3s ease;
}

/* TRANSICIÓN NEBULOSA */
.nebula-travel-enter-active, .nebula-travel-leave-active { transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.nebula-travel-enter-from { opacity: 0; transform: scale(1.1) blur(10px); }
.nebula-travel-leave-to { opacity: 0; transform: scale(0.9) blur(10px); }

.animate-float { animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
</style>