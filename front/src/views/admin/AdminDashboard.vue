<template>
  <q-page padding class="mystic-bg text-white">
    <div class="q-pb-lg text-center">
      <h1 class="text-h3 text-amber-5 mystic-title q-ma-none">Panel de Control</h1>
      <p class="text-deep-purple-3 q-mt-sm">Resumen de la energía financiera y comunitaria 🌌</p>
    </div>

    <!-- KPIs PRINCIPALES -->
    <div class="row q-col-gutter-md q-mb-lg justify-center">
      <div class="col-12 col-sm-4">
        <q-card dark bordered class="mystic-card text-center">
          <q-card-section>
            <q-icon name="account_balance_wallet" size="3em" color="amber" class="q-mb-sm" />
            <div class="text-h6 text-deep-purple-2">Ingresos Totales</div>
            <div class="text-h4 text-amber text-weight-bold">${{ totalMonto }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card dark bordered class="mystic-card text-center">
          <q-card-section>
            <q-icon name="group" size="3em" color="amber" class="q-mb-sm" />
            <div class="text-h6 text-deep-purple-2">Almas Registradas</div>
            <div class="text-h4 text-amber text-weight-bold">{{ totalUsuarios }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card dark bordered class="mystic-card text-center">
          <q-card-section>
            <q-icon name="pending_actions" size="3em" color="amber" class="q-mb-sm" />
            <div class="text-h6 text-deep-purple-2">Pagos del Mes</div>
            <div class="text-h4 text-amber text-weight-bold">{{ pagosMes }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <!-- GRÁFICO DE REGISTROS -->
      <div class="col-12 col-lg-6">
        <q-card dark bordered class="mystic-card full-height">
          <q-card-section>
            <div class="text-h5 text-amber-4 q-mb-md mystic-title">Flujo de Almas (7 días)</div>
            <div class="chart-container">
              <div class="bar-chart">
                <div class="bar-group" v-for="(day, index) in chartData" :key="index">
                  <div class="bar" :style="{ height: (day.count * 20) + 'px' }">
                    <q-tooltip>{{ day.count }} nuevos registros</q-tooltip>
                  </div>
                  <div class="label text-uppercase">{{ day.label }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- ÚLTIMOS MOVIMIENTOS -->
      <div class="col-12 col-lg-4">
        <q-card dark bordered class="mystic-card">
          <q-card-section>
            <div class="text-h5 text-amber-4 q-mb-md mystic-title">Últimos Pagos</div>
            <q-list dark separator class="mystic-list">
              <q-item v-for="pago in ultimosPagos" :key="pago._id">
                <q-item-section avatar>
                  <q-avatar color="purple-9" text-color="amber">
                    <q-icon name="monetization_on" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ pago.usuarioId?.nombre || 'Buscador' }}</q-item-label>
                  <q-item-label caption class="text-deep-purple-3">{{ formatDate(pago.fecha) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="text-h6 text-amber">+${{ pago.monto }}</div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData } from '../../services/services'

const pagos = ref([])
const usuarios = ref([])
const totalMonto = ref(0)
const totalUsuarios = ref(0)
const pagosMes = ref(0)

// Gráfico basado en datos reales
const chartData = computed(() => {
  const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last7Days.push({
      date: d.toLocaleDateString(),
      label: d.toLocaleDateString('es-ES', { weekday: 'short' }),
      count: 0
    })
  }

  usuarios.value.forEach(u => {
    const uDate = new Date(u.createdAt).toLocaleDateString()
    const day = last7Days.find(d => d.date === uDate)
    if (day) day.count++
  })

  return last7Days
})

const ultimosPagos = computed(() => {
  return [...pagos.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5)
})

async function loadData() {
  try {
    const [resPagos, resUsers] = await Promise.all([
      getData("pagos"),
      getData("usuario")
    ])

    pagos.value = resPagos
    usuarios.value = resUsers
    totalUsuarios.value = resUsers.length
    
    totalMonto.value = resPagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0)
    
    // Filtrar pagos del mes actual
    const mesActual = new Date().getMonth()
    pagosMes.value = resPagos.filter(p => new Date(p.fecha).getMonth() === mesActual).length

  } catch (error) {
    console.log("Error cargando Dashboard:", error)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadData()
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
  border-radius: 16px;
}

/* GRÁFICO */
.chart-container {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-top: 20px;
}

.bar-chart {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar {
  width: 30px;
  background: linear-gradient(to top, #8c2bee, #fbbf24);
  border-radius: 4px 4px 0 0;
  transition: height 1s ease;
  min-height: 2px;
}

.label {
  margin-top: 8px;
  font-size: 10px;
  color: #c4b5fd;
}

.mystic-list {
  background: rgba(88, 28, 135, 0.1);
  border-radius: 8px;
}
</style>