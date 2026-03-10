<template>
  <q-page padding class="mystic-bg text-white">
    <div class="q-pb-lg text-center">
      <h1 class="text-h3 text-amber-5 mystic-title q-ma-none">Gestión de Almas</h1>
      <p class="text-deep-purple-3 q-mt-sm">Control total sobre los buscadores del destino 🌌</p>
    </div>

    <!-- BARRA DE ACCIONES -->
    <div class="row q-mb-lg justify-center items-center q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="emailBuscar"
          dark outlined dense
          color="amber"
          label="Buscar por Email"
          @keyup.enter="listUsers"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      
      <div class="col-auto">
        <q-btn-dropdown 
          v-if="selected.length > 0"
          color="amber-9" 
          label="Acciones en Masa" 
          text-color="black"
          unelevated 
          rounded
        >
          <q-list dark>
            <q-item clickable v-close-popup @click="bulkStatus(1)">
              <q-item-section avatar><q-icon name="check_circle" color="positive"/></q-item-section>
              <q-item-section>Activar Seleccionados ({{selected.length}})</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="bulkStatus(0)">
              <q-item-section avatar><q-icon name="block" color="negative"/></q-item-section>
              <q-item-section>Inactivar Seleccionados ({{selected.length}})</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <q-table
          :rows="usuarios"
          :columns="columns"
          row-key="_id"
          selection="multiple"
          v-model:selected="selected"
          dark flat bordered
          class="mystic-table"
        >
          <!-- ESTADO -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip 
                :color="props.row.estado === 1 ? 'positive' : 'grey-8'" 
                text-color="white" 
                size="sm"
                dense
              >
                {{ props.row.estado === 1 ? 'ACTIVO' : 'INACTIVO' }}
              </q-chip>
            </q-td>
          </template>

          <!-- ACCIONES -->
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn flat round icon="visibility" color="amber" size="sm" @click="verExpediente(props.row)">
                <q-tooltip>Ver Expediente</q-tooltip>
              </q-btn>
              <q-btn 
                flat round 
                :icon="props.row.estado === 1 ? 'block' : 'check_circle'" 
                :color="props.row.estado === 1 ? 'negative' : 'positive'" 
                size="sm"
                @click="cambiarEstado(props.row._id, props.row.estado === 1 ? 0 : 1)"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- DIÁLOGO: EXPEDIENTE DE ALMA -->
    <q-dialog v-model="showExpediente" backdrop-filter="blur(10px)">
      <q-card class="expediente-card text-white" style="width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center bg-amber-9 text-black">
          <div class="text-h6 mystic-title">Expediente Soul ID: {{ selectedSoul?._id.slice(-6).toUpperCase() }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-xl row q-col-gutter-lg">
          <div class="col-12 col-md-4 text-center border-right">
            <q-avatar size="100px" class="q-mb-md shadow-10 profile-ring">
              <img :src="selectedSoul?.avatar || 'https://i.pravatar.cc/150?img=12'" />
            </q-avatar>
            <div class="text-h6 text-weight-bold">{{ selectedSoul?.nombre }}</div>
            <div class="text-caption text-grey-5">{{ selectedSoul?.email }}</div>
            <q-chip 
              :color="selectedSoul?.estado === 1 ? 'positive' : 'grey-8'" 
              size="sm" 
              class="q-mt-sm"
            >
              {{ selectedSoul?.estado === 1 ? 'Activo' : 'Inactivo' }}
            </q-chip>
          </div>

          <div class="col-12 col-md-8">
            <div class="text-subtitle2 text-amber-5 q-mb-sm">INFORMACIÓN DEL DESTINO</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-grey-5">Nacimiento</div>
                <div class="text-body2">{{ selectedSoul?.fechanacimiento || 'No registrada' }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-5">Rol en el Cosmos</div>
                <div class="text-body2 text-uppercase">{{ selectedSoul?.rol }}</div>
              </div>
              <div class="col-12 q-mt-md">
                <div class="text-caption text-grey-5">Registrado el</div>
                <div class="text-body2">{{ formatDate(selectedSoul?.createdAt) }}</div>
              </div>
            </div>

            <q-separator dark class="q-my-md opacity-20" />
            
            <div class="text-subtitle2 text-amber-5 q-mb-sm">ESTADO DE CONEXIÓN</div>
            <div class="text-body2">
              Suscripción: <span :class="selectedSoul?.estado === 1 ? 'text-positive' : 'text-grey'">
                {{ selectedSoul?.estado === 1 ? 'Premium Activa' : 'Nivel Gratuito' }}
              </span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getData, putData } from '../../services/services'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const usuarios = ref([])
const selected = ref([])
const emailBuscar = ref('')
const showExpediente = ref(false)
const selectedSoul = ref(null)

const columns = [
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

async function listUsers() {
  $q.loading.show({ message: 'Sincronizando con el cosmos...' })
  try {
    let url = "usuario"
    if (emailBuscar.value) url = `usuario/email?email=${emailBuscar.value}`
    
    let res = await getData(url)
    // El backend puede devolver un objeto o un array dependiendo de si es búsqueda por email o lista
    usuarios.value = Array.isArray(res) ? res : [res]
  } catch (error) {
    console.log(error)
  } finally {
    $q.loading.hide()
  }
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    // Usamos el endpoint de activación/inactivación del backend
    const endpoint = nuevoEstado === 1 ? `usuario/${id}` : `usuario/${id}`
    await putData(endpoint, { estado: nuevoEstado })
    $q.notify({
      message: nuevoEstado === 1 ? 'Alma Activada' : 'Alma Inactivada',
      color: nuevoEstado === 1 ? 'positive' : 'orange',
      icon: 'sync'
    })
    listUsers()
  } catch (error) {
    $q.notify({ message: 'Error al cambiar estado', color: 'negative' })
  }
}

async function bulkStatus(nuevoEstado) {
  $q.loading.show({ message: `Procesando ${selected.value.length} almas...` })
  try {
    // El backend no tiene bulk update, así que lo hacemos secuencialmente
    for (const user of selected.value) {
      await putData(`usuario/${user._id}`, { estado: nuevoEstado })
    }
    $q.notify({
      message: `${selected.value.length} usuarios actualizados`,
      color: 'positive'
    })
    selected.value = []
    listUsers()
  } catch (error) {
    $q.notify({ message: 'Error en procesamiento masivo', color: 'negative' })
  } finally {
    $q.loading.hide()
  }
}

function verExpediente(user) {
  selectedSoul.value = user
  showExpediente.value = true
}

function formatDate(date) {
  if (!date) return 'Desconocida'
  return new Date(date).toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  })
}

onMounted(() => {
  listUsers()
})
</script>

<style scoped>
.mystic-bg {
  background: radial-gradient(circle at top center, #2e1065 0%, #0f172a 100%);
  min-height: 100vh;
}

.mystic-title {
  font-family: 'Cinzel', serif;
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}

.mystic-table {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
}

.expediente-card {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  overflow: hidden;
}

.profile-ring {
  border: 3px solid #fbbf24;
  padding: 2px;
}

.border-right {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.q-table th) {
  font-weight: bold;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>