<template>
  <q-page padding class="mystic-pro-bg text-white">
    <!-- PANEL DE INTELIGENCIA FINANCIERA (SUPERIOR) -->
    <div class="row q-col-gutter-md q-mb-lg items-stretch">
      <!-- 1. MÉTRICAS PRINCIPALES -->
      <div class="col-12 col-md-4">
        <q-card class="stat-card-pro full-height" flat bordered>
          <q-card-section>
            <div class="text-overline text-amber-5">Energía Total Acumulada</div>
            <div class="text-h3 text-weight-bolder text-amber-1">{{ formatCurrency(totalIngresos) }}</div>
            
            <q-separator dark class="q-my-md opacity-20" />
            
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-grey-5">En Riesgo (3 días)</div>
                <div class="text-subtitle1 text-orange-5">{{ suscripcionesVenciendo }} Almas</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-5">Ticket Promedio</div>
                <div class="text-subtitle1 text-amber-2">{{ formatCurrency(totalIngresos / (pagos.length || 1)) }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 2. MAPA DE CALOR REAL (Flujo de Energía) -->
      <div class="col-12 col-md-5">
        <q-card class="stat-card-pro full-height" flat bordered>
          <q-card-section>
            <div class="text-overline text-amber-5 q-mb-sm">Ritmo del Cosmos (Flujo 30 días)</div>
            <div class="heatmap-grid">
              <div v-for="(day, index) in heatmapData" :key="index" class="heat-square" :style="{ background: day.color }">
                <q-tooltip>
                  Día: {{ day.date }}<br>
                  Ingresos: {{ formatCurrency(day.amount) }}<br>
                  Ofrendas: {{ day.count }}
                </q-tooltip>
              </div>
            </div>
            <div class="row justify-between text-grey-6 q-mt-xs" style="font-size: 10px">
              <span>Hace 30 lunas</span>
              <span>Hoy</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- 3. DISTRIBUCIÓN POR MÉTODOS REAL -->
      <div class="col-12 col-md-3">
        <q-card class="stat-card-pro full-height" flat bordered>
          <q-card-section>
            <div class="text-overline text-amber-5 q-mb-md">Fuentes de Energía (Real)</div>
            <div class="column q-gutter-y-sm">
               <div v-for="method in realPaymentMethods" :key="method.name" class="energy-source">
                  <div class="row justify-between items-center q-mb-xs">
                     <div class="flex items-center">
                        <q-icon :name="method.icon" :color="method.color" size="14px" class="q-mr-xs"/> 
                        <span class="text-caption" style="font-size: 10px">{{ method.label }}</span>
                     </div>
                     <span class="text-caption text-weight-bold" style="font-size: 10px">{{ method.percent }}%</span>
                  </div>
                  <q-linear-progress :value="method.percent / 100" :color="method.color" track-color="grey-10" rounded class="source-bar" />
               </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- BARRA DE ACCIONES -->
    <q-card class="mystic-toolbar q-mb-lg" flat bordered>
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-4">
          <q-input v-model="emailBuscar" dark outlined dense color="amber" placeholder="Buscar por email..." @keyup.enter="listPagos">
            <template v-slot:prepend><q-icon name="search" color="amber-5" /></template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn-toggle v-model="filtroEstado" toggle-color="amber-9" toggle-text-color="black" flat dense dark rounded
            :options="[{label: 'Todas', value: 'all'}, {label: 'En Disputa', value: 'dispute'}, {label: 'Vigentes', value: 'active'}]" />
        </div>
        <q-space />
        <div class="col-auto q-gutter-x-sm">
          <q-btn color="purple-9" label="Nuevo Cupón" icon="confirmation_number" rounded unelevated @click="showCouponDialog = true" />
          <q-btn color="amber-9" text-color="black" label="Exportar CSV" icon="ios_share" rounded unelevated @click="exportarPagos" />
        </div>
      </q-card-section>
    </q-card>

    <!-- TABLA DE PAGOS -->
    <q-table :rows="filteredPagos" :columns="columns" row-key="_id" dark flat bordered class="mystic-table-pro" :loading="loadingTable" :pagination="{ rowsPerPage: 10 }">
      <template v-slot:body-cell-usuarioId="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar size="32px" class="q-mr-sm border-amber">
              <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${props.row.usuarioId?.email}`" />
            </q-avatar>
            <div class="column">
              <span class="text-weight-bold text-amber-2">{{ props.row.usuarioId?.email || 'Anónimo' }}</span>
              <span class="text-caption text-grey-5">{{ props.row._id.slice(-6).toUpperCase() }}</span>
            </div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-monto="props">
        <q-td :props="props">
          <span class="text-h6 text-amber-5 q-mr-sm">{{ formatCurrency(props.row.monto) }}</span>
          <q-badge v-if="props.row.status === 'dispute'" color="negative" rounded>DISPUTA</q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-vencimiento="props">
        <q-td :props="props">
          <div style="min-width: 140px">
            <q-linear-progress :value="getSubscriptionProgress(props.row.fecha)" :color="getSubscriptionColor(props.row.fecha)" rounded class="energy-bar q-mb-xs" />
            <div class="text-caption text-center" :class="getSubscriptionClass(props.row.fecha)">{{ getStatusText(props.row.fecha) }}</div>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn flat round icon="receipt_long" color="amber" size="sm" @click="imprimirRecibo(props.row)" />
          <q-btn flat round :icon="props.row.status === 'dispute' ? 'verified' : 'gavel'" 
            :color="props.row.status === 'dispute' ? 'positive' : 'negative'" size="sm" @click="toggleDisputa(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- DIÁLOGOS -->
    <q-dialog v-model="showCouponDialog">
      <q-card class="expediente-card-pro text-white" style="width: 400px">
        <q-card-section class="bg-purple-9 text-white"><div class="text-h6 mystic-title">Nuevo Ritual de Descuento</div></q-card-section>
        <q-card-section class="q-pa-lg q-gutter-md">
          <q-input v-model="newCoupon.code" label="Código Mágico" dark filled color="amber" mask="AAAAAA" />
          <q-input v-model="newCoupon.percent" label="Descuento (%)" dark filled color="amber" type="number" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cerrar" v-close-popup color="grey-5" />
          <q-btn label="Crear" color="amber-9" text-color="black" @click="crearCupon" unelevated rounded />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showReceipt">
       <q-card class="receipt-paper q-pa-xl text-black">
          <div class="text-center"><div class="text-h4 mystic-title text-purple-10">ASTRA AI</div><div class="text-overline">Comprobante de Ofrenda</div></div>
          <q-separator class="q-my-lg" />
          <div class="row justify-between">
             <div class="column"><div class="text-caption">USUARIO</div><div class="text-subtitle1 text-weight-bold">{{ currentReceipt?.usuarioId?.email }}</div></div>
             <div class="column text-right"><div class="text-caption">FECHA</div><div class="text-subtitle1 text-weight-bold">{{ formatDate(currentReceipt?.fecha) }}</div></div>
          </div>
          <div class="q-mt-xl bg-grey-2 q-pa-md rounded-borders flex justify-between">
             <div class="text-h6">Suscripción Premium</div><div class="text-h5 text-weight-bolder">{{ formatCurrency(currentReceipt?.monto) }}</div>
          </div>
          <div class="text-center q-mt-lg no-print"><q-btn icon="print" label="Imprimir" color="purple-10" @click="windowPrint" /></div>
       </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { getData } from '../../services/services'
import { useQuasar, exportFile } from 'quasar'

const $q = useQuasar()
const pagos = ref([])
const emailBuscar = ref("")
const filtroEstado = ref("all")
const loadingTable = ref(false)
const showCouponDialog = ref(false)
const showReceipt = ref(false)
const currentReceipt = ref(null)
const newCoupon = reactive({ code: '', percent: 20 })

const columns = [
  { name: 'usuarioId', label: 'Buscador', align: 'left' },
  { name: 'monto', label: 'Ofrenda', align: 'left' },
  { name: 'vencimiento', label: 'Vigencia', align: 'center' },
  { name: 'fecha', label: 'Fecha', align: 'center' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

// LOGICA DE DATOS REALES
const totalIngresos = computed(() => pagos.value.reduce((acc, p) => acc + (Number(p.monto) || 0), 0))

const realPaymentMethods = computed(() => {
  const counts = { mercadopago: 0, transferencia: 0, tarjeta: 0, efectivo: 0 }
  pagos.value.forEach(p => {
    const tipo = (p.tipo || 'otros').toLowerCase()
    if (counts.hasOwnProperty(tipo)) counts[tipo] += p.monto
    else counts['efectivo'] += p.monto
  })

  const total = totalIngresos.value || 1
  return [
    { name: 'mp', label: 'MercadoPago', percent: Math.round((counts.mercadopago / total) * 100), icon: 'payments', color: 'amber-5' },
    { name: 'trans', label: 'Transferencia', percent: Math.round((counts.transferencia / total) * 100), icon: 'account_balance', color: 'purple-4' },
    { name: 'card', label: 'Tarjeta', percent: Math.round((counts.tarjeta / total) * 100), icon: 'credit_card', color: 'blue-4' },
    { name: 'cash', label: 'Otros/Efectivo', percent: Math.round((counts.efectivo / total) * 100), icon: 'local_atm', color: 'green-4' }
  ]
})

const heatmapData = computed(() => {
  const days = []
  const hoy = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(hoy.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    
    const dayPagos = pagos.value.filter(p => p.fecha?.startsWith(dateStr))
    const amount = dayPagos.reduce((acc, p) => acc + p.monto, 0)
    
    // Cálculo de color basado en intensidad (máximo simulado de 500k para tope de color)
    const intensity = Math.min(1, amount / 500000)
    let color = 'rgba(255, 255, 255, 0.05)'
    if (amount > 0) {
      color = `rgba(251, 191, 36, ${0.1 + intensity * 0.9})`
    }

    days.push({
      date: dateStr,
      amount: amount,
      count: dayPagos.length,
      color: color
    })
  }
  return days
})

const suscripcionesVenciendo = computed(() => pagos.value.filter(p => estaVenciendo(p.fecha)).length)

const filteredPagos = computed(() => {
  let list = pagos.value
  if (filtroEstado.value === 'dispute') list = list.filter(p => p.status === 'dispute')
  if (filtroEstado.value === 'active') list = list.filter(p => !haVencido(p.fecha))
  return list
})

async function listPagos(showLoading = true) {
  if (showLoading) loadingTable.value = true
  try {
    let url = emailBuscar.value ? `pagos?email=${emailBuscar.value}` : "pagos"
    let res = await getData(url)
    pagos.value = res.map(p => ({ ...p, status: p.status || 'approved' }))
  } catch (error) { console.error(error) } finally { loadingTable.value = false }
}

function toggleDisputa(pago) {
  pago.status = pago.status === 'dispute' ? 'approved' : 'dispute'
  $q.notify({ message: pago.status === 'dispute' ? 'Marcado en disputa' : 'Disputa resuelta', color: 'amber-9', textColor: 'black' })
}

function imprimirRecibo(pago) { currentReceipt.value = pago; showReceipt.value = true; }
function crearCupon() { $q.notify({ message: 'Cupón creado', color: 'purple-9' }); showCouponDialog.value = false; }
function windowPrint() { window.print() }
function formatCurrency(v) { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v) }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '--' }
function haVencido(f) { const v = new Date(f); v.setMonth(v.getMonth() + 1); return v < new Date() }
function estaVenciendo(f) { 
  const v = new Date(f); v.setMonth(v.getMonth() + 1);
  const diff = (v - new Date()) / 86400000; return diff >= 0 && diff <= 3
}
function getSubscriptionProgress(f) { 
  const v = new Date(f); v.setMonth(v.getMonth() + 1);
  return Math.max(0, Math.min(1, (v - new Date()) / 2592000000))
}
function getSubscriptionColor(f) { return haVencido(f) ? 'grey-8' : (estaVenciendo(f) ? 'orange-5' : 'cyan-4') }
function getSubscriptionClass(f) { return haVencido(f) ? 'text-grey-7' : (estaVenciendo(f) ? 'text-orange-5' : 'text-cyan-4') }
function getStatusText(f) { 
  if (haVencido(f)) return 'EXPIRADA'
  const v = new Date(f); v.setMonth(v.getMonth() + 1);
  return `${Math.floor((v - new Date()) / 86400000)} días restantes`
}

function exportarPagos() {
  const content = [columns.map(c => c.label).join(','), ...pagos.value.map(p => [p.usuarioId?.email, p.monto, p.fecha, p.status].join(','))].join('\r\n')
  exportFile('Reporte_Pagos.csv', content, 'text/csv')
}

onMounted(() => listPagos())
</script>

<style scoped>
.mystic-pro-bg { background: radial-gradient(circle at 100% 100%, #1e1b4b 0%, #0f172a 50%, #020617 100%); min-height: 100vh; }
.mystic-title { font-family: 'Cinzel', serif; text-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }
.stat-card-pro { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(245, 158, 11, 0.2); backdrop-filter: blur(10px); border-radius: 16px; }
.heatmap-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; height: 100px; }
.heat-square { border-radius: 3px; transition: background 0.5s ease; }
.source-bar { height: 6px; border-radius: 10px; }
.mystic-toolbar { background: rgba(15, 23, 42, 0.8); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.2); }
.mystic-table-pro { background: rgba(15, 23, 42, 0.6) !important; border-radius: 20px; }
.energy-bar { height: 6px; border-radius: 10px; }
.receipt-paper { background: #fff; width: 500px; }
.no-print { @media print { display: none; } }
.opacity-20 { opacity: 0.2; }
</style>