<template>
  <q-drawer v-model="drawer" side="right" overlay :width="450" class="command-center text-white">
    <!-- HEADER -->
    <div class="q-pa-lg flex justify-between items-center border-bottom">
      <div class="row items-center q-gutter-md">
        <div class="pulse-container">
          <q-icon name="settings_input_component" color="amber" size="32px" />
          <div class="pulse-ring"></div>
        </div>
        <div>
          <div class="text-h6 text-weight-bolder letter-spacing-1">CENTRO DE COMANDO</div>
          <div class="text-caption text-amber-5 text-uppercase">Administración Global del Sistema</div>
        </div>
      </div>
      <q-btn flat round icon="close" color="grey-5" @click="drawer = false" />
    </div>

    <q-scroll-area class="drawer-scroll">
      <div class="q-pa-lg q-gutter-y-xl">
        
        <!-- MÓDULO 1: ESTADO DEL NÚCLEO (HEALTH) -->
        <section>
          <div class="section-title">
            <q-icon name="memory" class="q-mr-sm" /> ESTADO DEL NÚCLEO
          </div>
          <q-card flat class="module-card q-pa-md q-mt-md">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <div class="text-caption text-grey-5">Latencia API</div>
                <div class="text-h6 text-positive">24ms <q-icon name="trending_down" size="14px" /></div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-5">Uptime</div>
                <div class="text-h6">99.9%</div>
              </div>
              <div class="col-12 q-mt-sm">
                <div class="row justify-between text-caption text-grey-5">
                  <span>Carga del Servidor</span>
                  <span>12%</span>
                </div>
                <q-linear-progress :value="0.12" color="amber" class="q-mt-xs" rounded />
              </div>
            </div>
          </q-card>
        </section>

        <!-- MÓDULO 2: PARÁMETROS FINANCIEROS -->
        <section>
          <div class="section-title">
            <q-icon name="payments" class="q-mr-sm" /> FLUJO DE ENERGÍA (FINANZAS)
          </div>
          <div class="q-mt-md q-gutter-y-md">
            <div class="control-row">
              <div class="text-body2">Precio Suscripción Premium</div>
              <q-input 
                v-model.number="config.precio" 
                type="number" 
                dark dense outlined 
                prefix="$" 
                class="compact-input"
              />
            </div>
            <div class="control-row">
              <div class="text-body2">Moneda Principal</div>
              <q-select 
                v-model="config.moneda" 
                :options="['USD', 'EUR', 'COP']" 
                dark dense outlined 
                class="compact-input"
              />
            </div>
          </div>
        </section>

        <!-- MÓDULO 3: PROTOCOLO DE SEGURIDAD -->
        <section>
          <div class="section-title">
            <q-icon name="security" class="q-mr-sm" /> PROTOCOLO DE SEGURIDAD
          </div>
          <q-card flat class="module-card q-mt-md overflow-hidden">
            <q-list dark padding>
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Modo Mantenimiento</q-item-label>
                  <q-item-label caption class="text-grey-5">Bloquea el acceso a usuarios externos</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle color="red" v-model="config.mantenimiento" />
                </q-item-section>
              </q-item>
              
              <q-separator dark inset class="opacity-10" />

              <q-item clickable v-ripple @click="backupSystem">
                <q-item-section avatar>
                  <q-icon name="cloud_download" color="amber" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Generar Snapshot (Backup)</q-item-label>
                  <q-item-label caption>Respaldar base de datos mística</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </section>

        <!-- MÓDULO 4: INTELIGENCIA ARTIFICIAL -->
        <section>
          <div class="section-title">
            <q-icon name="auto_awesome" class="q-mr-sm" /> CONFIGURACIÓN DE IA
          </div>
          <div class="q-mt-md">
            <div class="text-caption text-grey-5 q-mb-sm">Nivel de Sabiduría (Temperatura)</div>
            <q-slider 
              v-model="config.aiCreativity" 
              :min="0" :max="1" :step="0.1" 
              label 
              color="amber" 
            />
            <div class="row justify-between text-caption text-grey-6 italic">
              <span>Precisa / Técnica</span>
              <span>Creativa / Mística</span>
            </div>
          </div>
        </section>

      </div>
    </q-scroll-area>

    <!-- FOOTER ACCIONES -->
    <div class="absolute-bottom q-pa-lg border-top bg-dark-soft">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-btn flat class="full-width text-grey-5" label="Descartar" @click="drawer = false" />
        </div>
        <div class="col-6">
          <q-btn 
            unelevated 
            class="full-width save-btn" 
            label="Aplicar Cambios" 
            :loading="saving"
            @click="saveChanges"
          />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const drawer = ref(false)
const saving = ref(false)

const config = ref({
  precio: 49.99,
  moneda: 'USD',
  mantenimiento: false,
  aiCreativity: 0.7
})

const saveChanges = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    $q.notify({
      message: 'Protocolos actualizados correctamente',
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right'
    })
    drawer.value = false
  }, 2000)
}

const backupSystem = () => {
  $q.notify({
    message: 'Iniciando respaldo de base de datos...',
    color: 'info',
    icon: 'storage',
    timeout: 3000
  })
}

defineExpose({
  openDrawer: () => { drawer.value = true }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Montserrat:wght@300;400;600&display=swap');

.command-center {
  background: rgba(10, 10, 15, 0.98);
  backdrop-filter: blur(25px);
  border-left: 1px solid rgba(251, 191, 36, 0.2);
  font-family: 'Montserrat', sans-serif;
}

.border-bottom { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.border-top { border-top: 1px solid rgba(255, 255, 255, 0.05); }

.drawer-scroll {
  height: calc(100vh - 160px);
}

.letter-spacing-1 { letter-spacing: 2px; font-family: 'Cinzel', serif; }

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 1.5px;
  opacity: 0.8;
}

.module-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.compact-input {
  width: 120px;
}

.save-btn {
  background: linear-gradient(135deg, #fbbf24, #d97706);
  color: #000;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bg-dark-soft {
  background: rgba(0, 0, 0, 0.4);
}

/* ANIMACIONES */
.pulse-container {
  position: relative;
  display: inline-block;
}

.pulse-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid #fbbf24;
  border-radius: 50%;
  animation: pulse 2s infinite;
  opacity: 0;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

.opacity-10 { opacity: 0.1; }
</style>