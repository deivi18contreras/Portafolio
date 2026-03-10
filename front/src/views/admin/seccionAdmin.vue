<template>
  <q-layout view="lHh Lpr lFf">
    <!-- COMPONENTES DE APOYO -->
    <Perfil ref="perfilRef" />
    <notificaciones ref="notifRef" />
    <Configuracion ref="configRef" />

    <q-page-container>
      <q-page class="admin-page">
        <div class="top-header">
          <div class="header-row">
            <div class="title row items-center">
              <q-icon name="shield" color="primary" size="28px" class="q-mr-sm" />
              <span>ADMIN PORTAL</span>
            </div>

            <div class="actions">
              <q-btn 
                round flat 
                :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" 
                @click="$q.dark.toggle()" 
              />
              <!-- NOTIFICACIONES CON BADGE -->
              <q-btn round flat icon="notifications" @click="notifRef.openDrawer()">
                <q-badge floating color="red" rounded v-if="authStore.unreadCount > 0">
                  {{ authStore.unreadCount }}
                </q-badge>
              </q-btn>

              <q-btn round flat icon="settings" @click="configRef.openDrawer()" />

              <q-avatar size="38px" class="cursor-pointer shadow-5 profile-ring" @click="perfilRef.openDrawer()">
                <img :src="authStore.usuario?.avatar || 'https://i.pravatar.cc/150?img=12'" />
              </q-avatar>
            </div>
          </div>
          <!-- ... (resto de la cabecera) -->
          <div class="row q-col-gutter-sm items-center">
            <div class="col">
              <q-input
                filled
                dark
                dense
                v-model="busquedaGlobal"
                placeholder="Buscar usuarios, pagos o registros..."
                @keyup.enter="ejecutarBusqueda"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn round flat icon="refresh" color="amber" @click="recargarDatos">
                <q-tooltip>Sincronizar Datos</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="nav-tabs">
            <q-btn 
              flat 
              icon="auto_awesome" 
              label="Dashboard" 
              :class="{ 'active-tab': currentRoute === '/admin' }"
              @click="irDashboard" 
            />
            <q-btn 
              flat 
              icon="people" 
              label="Usuarios" 
              :class="{ 'active-tab': currentRoute === '/admin/usuarios' }"
              @click="irUsuarios" 
            />
            <q-btn 
              flat 
              icon="payments" 
              label="Pagos" 
              :class="{ 'active-tab': currentRoute === '/admin/pagos' }"
              @click="irPagos" 
            />
          </div>
        </div>

        <div class="content">
          <router-view />
        </div>

        <div class="bottom-bar">
          <div class="status-indicator row items-center">
            <div class="dot q-mr-xs"></div>
            Sistema en Línea • {{ fechaActual }}
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed } from "vue";
import { useAuthStore } from "../../store/Auth.js";
import { useQuasar } from "quasar";
import Perfil from "../../components/perfil.vue";
import Notificaciones from "../../components/notificaciones.vue";
import Configuracion from "../../components/configuracion.vue";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const $q = useQuasar()

const perfilRef = ref(null)
const notifRef = ref(null)
const configRef = ref(null)
const busquedaGlobal = ref("")

const currentRoute = computed(() => route.path)
const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

function irDashboard() {
  router.push("/admin")
}

function irUsuarios() {
  router.push("/admin/usuarios")
}

function irPagos() {
  router.push("/admin/pagos")
}

function recargarDatos() {
  $q.notify({
    message: 'Sincronizando con el servidor...',
    color: 'amber-9',
    icon: 'sync',
    timeout: 1000
  })
  window.location.reload()
}

function ejecutarBusqueda() {
  if (!busquedaGlobal.value) return
  $q.notify({
    message: `Buscando: ${busquedaGlobal.value}`,
    color: 'secondary'
  })
}
</script>

<style scoped>
.admin-page {
  background: radial-gradient(circle at top right, #1a0633, #0f172a);
  min-height: 100vh;
  color: white;
}

/* HEADER */
.top-header {
  position: sticky;
  top: 0;
  backdrop-filter: blur(18px);
  background: rgba(15, 23, 42, 0.7);
  padding: 15px 20px;
  z-index: 10;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  color: #fbbf24;
  font-weight: bold;
  letter-spacing: 2px;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.profile-ring {
  border: 2px solid #fbbf24;
  padding: 2px;
  transition: transform 0.3s;
}

.profile-ring:hover {
  transform: scale(1.1);
}

.nav-tabs {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.active-tab {
  color: #fbbf24 !important;
  border-bottom: 2px solid #fbbf24;
  border-radius: 0;
}

/* CONTENT */
.content {
  padding: 20px;
  padding-bottom: 60px;
  min-height: calc(100vh - 180px);
}

/* BOTTOM BAR */
.bottom-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35px;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  color: #94a3b8;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.status-indicator {
  letter-spacing: 1px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 5px #10b981;
}

.q-btn {
  transition: all 0.3s ease;
}
</style>