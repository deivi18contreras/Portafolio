<template>
  <q-page padding class="mystic-bg text-white">
    <div class="q-pb-lg text-center">
      <h1 class="text-h3 text-amber-5 mystic-title q-ma-none">Registro de Pagos</h1>
      <p class="text-deep-purple-3 q-mt-sm">Control financiero y energía monetaria 💸</p>
    </div>

    <!-- KPIs DE PAGOS -->
    <div class="row q-col-gutter-md q-mb-lg justify-center">
      <div class="col-12 col-sm-4">
        <q-card dark bordered class="mystic-card text-center">
          <q-card-section>
            <div class="text-overline text-amber-5">Ingresos Totales</div>
            <div class="text-h4 text-weight-bold">${{ totalIngresos }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card dark bordered class="mystic-card text-center" :class="{ 'alert-glow': suscripcionesVenciendo > 0 }">
          <q-card-section>
            <div class="text-overline text-amber-5">Vencen en 3 días</div>
            <div class="text-h4 text-weight-bold">{{ suscripcionesVenciendo }} Almas</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-btn 
          class="full-width full-height export-btn" 
          outline 
          icon="description" 
          label="Exportar a CSV" 
          @click="exportarPagos"
        />
      </div>
    </div>

    <div class="row q-mb-lg justify-center">
      <div class="col-12 col-md-6">
        <q-input
          v-model="emailBuscar"
          dark outlined color="amber"
          label="Buscar por Email"
          class="mystic-input"
          @keyup.enter="listPagos"
        >
          <template v-slot:append>
            <q-btn round dense flat icon="search" color="amber" @click="listPagos" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <q-table
          :rows="pagos"
          :columns="columns"
          row-key="_id"
          dark flat bordered
          class="mystic-table"
        >
          <template v-slot:body="props">
            <q-tr :props="props" :class="getRowClass(props.row.fecha)">
              <q-td key="usuarioId" :props="props">
                {{ props.row.usuarioId?.email || 'N/A' }}
              </q-td>
              <q-td key="monto" :props="props" class="text-amber text-weight-bold">
                ${{ props.row.monto }}
              </q-td>
              <q-td key="fecha" :props="props">
                {{ formatDate(props.row.fecha) }}
              </q-td>
              <q-td key="cancelacion" :props="props">
                {{ calcularVencimiento(props.row.fecha) }}
                <q-badge v-if="estaVenciendo(props.row.fecha)" color="orange" floating rounded />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getData } from '../../services/services'
import { useQuasar, exportFile } from 'quasar'

const $q = useQuasar()
const pagos = ref([])
const emailBuscar = ref("")

const columns = [
  { name: 'usuarioId', label: 'Buscador (Email)', align: 'left', field: row => row.usuarioId?.email },
  { name: 'monto', label: 'Monto', align: 'center', field: 'monto' },
  { name: 'fecha', label: 'Fecha de Pago', align: 'center', field: 'fecha' },
  { name: 'cancelacion', label: 'Vencimiento', align: 'center' }
]

// Cálculos de KPIs
const totalIngresos = computed(() => {
  return pagos.value.reduce((acc, p) => acc + (Number(p.monto) || 0), 0)
})

const suscripcionesVenciendo = computed(() => {
  return pagos.value.filter(p => estaVenciendo(p.fecha)).length
})

async function listPagos() {
  try {
    let url = "pagos"
    if (emailBuscar.value) url = `pagos?email=${emailBuscar.value}`
    let res = await getData(url)
    pagos.value = res
  } catch (error) {
    console.log(error)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function calcularVencimiento(fecha) {
  const d = new Date(fecha)
  d.setMonth(d.getMonth() + 1)
  return d.toLocaleDateString()
}

function estaVenciendo(fecha) {
  const v = new Date(fecha)
  v.setMonth(v.getMonth() + 1)
  const hoy = new Date()
  const diff = (v - hoy) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 3
}

function getRowClass(fecha) {
  const v = new Date(fecha)
  v.setMonth(v.getMonth() + 1)
  const hoy = new Date()
  if (v < hoy) return 'row-expired'
  if (estaVenciendo(fecha)) return 'row-expiring'
  return ''
}

function exportarPagos() {
  const content = [
    columns.map(col => col.label).join(','),
    ...pagos.value.map(p => [
      p.usuarioId?.email,
      p.monto,
      new Date(p.fecha).toISOString(),
      new Date(new Date(p.fecha).setMonth(new Date(p.fecha).getMonth() + 1)).toISOString()
    ].join(','))
  ].join('\r\n')

  const status = exportFile('Reporte_Pagos_Astra.csv', content, 'text/csv')
  if (status !== true) {
    $q.notify({ message: 'Error al exportar archivo', color: 'negative' })
  }
}

onMounted(() => {
  listPagos()
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

.mystic-card {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 12px;
}

.alert-glow {
  border-color: #fbbf24;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.2);
}

.export-btn {
  border: 1px dashed #fbbf24;
  color: #fbbf24;
}

.mystic-table {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.row-expiring {
  background: rgba(251, 191, 36, 0.1) !important;
}

.row-expired {
  opacity: 0.5;
  background: rgba(0,0,0,0.2) !important;
}
</style>