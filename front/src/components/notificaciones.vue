<template>
  <q-drawer v-model="drawer" side="right" overlay :width="420" class="glass-panel text-white">
    <!-- HEADER -->
    <div class="notif-header">
      <div class="row items-center q-gutter-sm">
        <q-icon name="notifications_active" color="primary" size="28px" />
        <div class="text-h6 text-weight-bold">
          Alertas Cósmicas
        </div>
      </div>

      <q-btn flat round dense icon="close" color="grey-5" @click="drawer = false" />
    </div>

    <!-- FILTROS -->
    <div class="notif-filters">
      <q-btn 
        :unelevated="filtro === 'ALL'" 
        :flat="filtro !== 'ALL'" 
        label="TODAS" 
        color="primary" 
        size="sm" 
        rounded 
        @click="filtro = 'ALL'" 
      />
      <q-btn 
        :unelevated="filtro === 'UNREAD'" 
        :flat="filtro !== 'UNREAD'" 
        label="NO LEÍDAS" 
        color="primary" 
        size="sm" 
        rounded 
        @click="filtro = 'UNREAD'" 
      />
    </div>

    <!-- LISTA -->
    <div class="notif-content">

      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="notificacionesFiltradas.length === 0" class="text-center q-pa-xl text-grey-5">
        <q-icon name="bedtime" size="60px" class="q-mb-md opacity-20" />
        <div>Las estrellas están silenciosas por ahora...</div>
      </div>

      <!-- CARDS DINÁMICAS -->
      <div v-for="notif in notificacionesFiltradas" :key="notif._id" 
           class="notif-card" :class="{ 'opacity-80': notif.leida }">
        <div class="row justify-between items-start">

          <div class="row items-center q-gutter-sm">
            <div class="icon-box" :class="{
              'blue': notif.tipo === 'lectura', 
              'primary': notif.tipo === 'password', 
              'amber': notif.tipo === 'registro',
              'green': notif.tipo === 'pago',
              'grey': !['lectura', 'password', 'registro', 'pago'].includes(notif.tipo)
            }">
              <q-icon :name="
                notif.tipo === 'lectura' ? 'auto_stories' : 
                notif.tipo === 'password' ? 'lock' : 
                notif.tipo === 'registro' ? 'person_add' :
                notif.tipo === 'pago' ? 'monetization_on' :
                'system_update'" 
              />
            </div>

            <div>
              <div class="notif-tag" :class="{
                'text-blue': notif.tipo === 'lectura', 
                'text-primary': notif.tipo === 'password', 
                'text-amber': notif.tipo === 'registro',
                'text-positive': notif.tipo === 'pago',
                'text-grey-5': !['lectura', 'password', 'registro', 'pago'].includes(notif.tipo)
              }">
                {{ notif.tipo }}
              </div>
              <div class="notif-title">
                {{ notif.titulo }}
              </div>
            </div>
          </div>

          <div class="row items-center q-gutter-xs">
            <div class="text-caption text-grey-5">
              {{ formatTime(notif.fecha) }}
            </div>
            <div v-if="!notif.leida" class="glow-dot"></div>
          </div>
        </div>

        <div class="notif-text">
          {{ notif.mensaje }}
        </div>

        <div v-if="!notif.leida" class="row q-gutter-sm q-mt-sm">
          <q-btn size="sm" color="primary" label="Marcar como leída" unelevated @click="marcarLeida(notif._id)" />
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="notif-footer">
      <q-btn outline color="primary" icon="settings" label="Preferencias de Notificación" class="full-width" @click="abrirPreferencias" />
    </div>

  </q-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getData, putData } from '../services/services.js'
import { useAuthStore } from '../store/Auth.js'
import { useQuasar } from 'quasar'

const drawer = ref(false)
const notificaciones = ref([])
const loading = ref(false)
const filtro = ref('ALL')
const authStore = useAuthStore()
const $q = useQuasar()

const notificacionesFiltradas = computed(() => {
  if (filtro.value === 'ALL') return notificaciones.value
  return notificaciones.value.filter(n => !n.leida)
})

const fetchNotificaciones = async () => {
  loading.value = true
  try {
    const res = await getData('notificaciones')
    if (res.ok) {
      notificaciones.value = res.notificaciones
      actualizarContador()
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
  } finally {
    loading.value = false
  }
}

const actualizarContador = () => {
  const noLeidas = notificaciones.value.filter(n => !n.leida).length
  authStore.unreadCount = noLeidas
}

const marcarLeida = async (id) => {
  try {
    await putData(`notificaciones/${id}`)
    const index = notificaciones.value.findIndex(n => n._id === id)
    if (index !== -1) {
      notificaciones.value[index].leida = true
      actualizarContador()
    }
  } catch (error) {
    console.error('Error al marcar como leída:', error)
  }
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 1000 / 60)
  if (minutes < 1) return 'Recién'
  if (minutes < 60) return `Hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours}h`
  return new Date(date).toLocaleDateString()
}

const abrirPreferencias = () => {
  if (!authStore.usuario.prefsNotif) {
    authStore.usuario.prefsNotif = { lectura: true, password: true, sistema: true }
  }

  $q.dialog({
    title: 'Preferencias de Notificación',
    message: 'Elige qué alertas deseas recibir del cosmos:',
    dark: true,
    options: {
      type: 'checkbox',
      model: [],
      items: [
        { label: 'Lecturas Diarias', value: 'lectura' },
        { label: 'Seguridad (Contraseñas)', value: 'password' },
        { label: 'Actualizaciones del Sistema', value: 'sistema' }
      ]
    },
    cancel: true,
    persistent: true
  }).onOk(async (selected) => {
    const newPrefs = {
      lectura: selected.includes('lectura'),
      password: selected.includes('password'),
      sistema: selected.includes('sistema')
    }

    try {
      await putData(`usuario/${authStore.usuario._id}`, { prefsNotif: newPrefs })
      authStore.usuario.prefsNotif = newPrefs
      $q.notify({ color: 'positive', message: 'Preferencias actualizadas', icon: 'check' })
    } catch (error) {
      $q.notify({ color: 'negative', message: 'Error al actualizar preferencias' })
    }
  })
}

onMounted(() => {
    fetchNotificaciones() 
})

defineExpose({
  openDrawer: () => {
    drawer.value = true
    fetchNotificaciones()
  }
})
</script>

<style scoped>
.glass-panel {
  background: rgba(25, 16, 34, 0.92);
  backdrop-filter: blur(14px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.notif-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.notif-filters {
  padding: 15px;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.notif-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.notif-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 15px;
  border-radius: 14px;
  margin-bottom: 15px;
  transition: 0.3s;
}

.notif-card:hover {
  box-shadow: 0 0 20px rgba(140, 43, 238, 0.15);
}

.notif-title {
  font-weight: 600;
}

.notif-tag {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.notif-text {
  font-size: 13px;
  color: #cfcfcf;
  margin-top: 8px;
}

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.blue {
  background: rgba(76, 201, 240, 0.1);
  border: 1px solid rgba(76, 201, 240, 0.2);
  color: #4cc9f0;
}

.icon-box.primary {
  background: rgba(140, 43, 238, 0.1);
  border: 1px solid rgba(140, 43, 238, 0.2);
  color: #8c2bee;
}

.icon-box.amber {
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.icon-box.green {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.icon-box.grey {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ccc;
}

.glow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4cc9f0;
  box-shadow: 0 0 8px #4cc9f0;
}

.notif-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.03);
}
</style>
