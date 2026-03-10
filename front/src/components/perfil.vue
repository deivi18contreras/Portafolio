<template>
  <q-drawer v-model="drawer" side="right" overlay :width="420" class="glass-profile text-white">
    <!-- BOTÓN CERRAR (X) -->
    <div class="q-pa-md row justify-end">
      <q-btn flat round icon="close" color="grey-5" @click="drawer = false" />
    </div>

    <!-- HEADER PERFIL -->
    <div class="text-center q-pb-xl">
      <div class="profile-avatar-container q-mb-md">
        <q-avatar size="130px" class="profile-avatar shadow-20">
          <img :src="authStore.usuario?.avatar || 'https://i.pravatar.cc/300?img=12'" />
        </q-avatar>
        <div class="status-badge" :class="authStore.usuario?.estado === 1 ? 'active' : 'inactive'"></div>
      </div>

      <div class="text-h5 text-weight-bold text-gradient">
        {{ authStore.usuario?.nombre }}
      </div>
      <div class="text-caption text-grey-5 letter-spacing-2">
        {{ authStore.usuario?.email }}
      </div>
    </div>

    <!-- INFORMACIÓN DE SUSCRIPCIÓN Y CUENTA -->
    <div class="q-px-lg q-gutter-y-md">
      
      <!-- TIEMPO DE SESIÓN -->
      <q-card class="info-card">
        <q-card-section class="row items-center no-wrap">
          <q-icon name="timer" color="primary" size="24px" class="q-mr-md" />
          <div>
            <div class="text-caption text-grey-5">Tiempo de Sesión Activa</div>
            <div class="text-subtitle1 text-weight-bold">{{ sessionTime }}</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- TIEMPO CON LA CUENTA -->
      <q-card class="info-card">
        <q-card-section class="row items-center no-wrap">
          <q-icon name="event" color="secondary" size="24px" class="q-mr-md" />
          <div>
            <div class="text-caption text-grey-5">Miembro desde</div>
            <div class="text-subtitle1 text-weight-bold">{{ accountAge }}</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ESTADO DE SUSCRIPCIÓN -->
      <q-card class="info-card subscription-card" :class="{ 'is-active': authStore.usuario?.estado === 1 || authStore.rol === 'admin' }">
        <q-card-section>
          <div class="row items-center justify-between q-mb-xs">
            <div class="text-weight-bold">Estado de Cuenta</div>
            <q-badge :color="(authStore.usuario?.estado === 1 || authStore.rol === 'admin') ? 'positive' : 'warning'" rounded>
              {{ authStore.rol === 'admin' ? 'ADMINISTRADOR' : (authStore.usuario?.estado === 1 ? 'PREMIUM' : 'GRATUITA') }}
            </q-badge>
          </div>
          
          <div v-if="authStore.rol === 'admin'">
            <div class="text-caption text-amber-5">Acceso Total al Sistema</div>
            <div class="text-h6 text-amber">Suscripción Vitalicia</div>
          </div>
          <div v-else-if="authStore.usuario?.estado === 1">
            <div class="text-caption text-grey-4">Tiempo restante:</div>
            <div class="text-h6">{{ remainingSubscription }}</div>
          </div>
          <div v-else class="text-caption text-grey-5">
            Mejora a Premium para obtener revelaciones diarias.
          </div>
        </q-card-section>
      </q-card>

      <!-- CAMBIAR CONTRASEÑA -->
      <q-btn
        outline
        color="secondary"
        class="full-width q-mt-sm"
        label="Cambiar Contraseña"
        icon="lock_reset"
        @click="iniciarRecuperacionPassword"
      />

    </div>

    <!-- ACCIONES -->
    <div class="q-pa-xl absolute-bottom">
      <q-btn
        flat
        class="full-width logout-btn"
        label="Cerrar Sesión"
        icon="power_settings_new"
        @click="logout"
      />
    </div>

  </q-drawer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../store/Auth.js'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { postData } from '../services/services.js'

const drawer = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()
const now = ref(new Date())
let timerInterval = null

const sessionTime = computed(() => {
  if (!authStore.sessionStart) return '00:00:00'
  const start = new Date(authStore.sessionStart)
  const diff = Math.floor((now.value - start) / 1000)
  
  const h = Math.floor(diff / 3600).toString().padStart(2, '0')
  const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
  const s = (diff % 60).toString().padStart(2, '0')
  
  return `${h}:${m}:${s}`
})

const accountAge = computed(() => {
  const createdAt = authStore.usuario?.createdAt
  if (!createdAt) return 'Nuevo Explorador'
  const date = new Date(createdAt)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
})

const remainingSubscription = computed(() => {
  const expiry = authStore.usuario?.suscripcionExpira
  if (!expiry) return 'Sin fecha de expiración'
  const diff = new Date(expiry) - now.value
  if (diff <= 0) return 'Expirada'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  return `${days} días restantes`
})

const iniciarRecuperacionPassword = async () => {
  $q.loading.show({ message: 'Enviando código de seguridad...' })
  
  try {
    const email = authStore.usuario.email;
    const res = await postData("usuario/forgot-password", { email });
    
    $q.loading.hide()
    
    $q.notify({
      color: 'positive',
      message: 'Código enviado',
      caption: res.data.mensaje,
      icon: 'send'
    })
    
    solicitarNuevoPassword();
    
  } catch (error) {
    $q.loading.hide()
    const mensaje = error.response?.data?.msg || "Error al solicitar recuperación";
    $q.notify({ color: 'negative', message: 'Error', caption: mensaje, icon: 'error' })
  }
}

const solicitarNuevoPassword = () => {
  $q.dialog({
    title: 'Restablecer Contraseña',
    message: 'Ingresa el código de 6 dígitos enviado a tu correo:',
    dark: true,
    prompt: {
      model: '',
      type: 'text',
      label: 'Código de 6 dígitos',
      filled: true,
      mask: '######' 
    },
    cancel: true,
    persistent: true
  }).onOk(async (codigoRecibido) => {
    
    $q.dialog({
      title: 'Nueva Clave',
      message: 'Escribe tu nueva contraseña (mínimo 8 caracteres):',
      dark: true,
      prompt: {
        model: '',
        type: 'password',
        label: 'Nueva Contraseña',
        filled: true
      },
      cancel: true
    }).onOk(async (newPassword) => {
      $q.loading.show({ message: 'Actualizando contraseña...' })
      try {
        await postData("usuario/reset-password", { 
          token: codigoRecibido, 
          newPassword: newPassword
        });

        $q.notify({
          color: 'positive',
          message: '¡Éxito!',
          caption: 'Contraseña actualizada correctamente',
          icon: 'check_circle'
        })
      } catch (error) {
        const msg = error.response?.data?.mensaje || "Código inválido o expirado";
        $q.notify({ color: 'negative', message: 'Error', caption: msg, icon: 'error' })
      } finally {
        $q.loading.hide()
      }
    });
  });
};

const logout = () => {
  $q.dialog({
    title: 'Confirmar Cierre de Sesión',
    message: '¿Estás seguro de que quieres finalizar tu viaje cósmico por ahora?',
    dark: true,
    cancel: true,
    persistent: true
  }).onOk(() => {
    authStore.token = ''
    authStore.usuario = null
    authStore.rol = ''
    authStore.sessionStart = null
    router.push('/')
  })
}

onMounted(() => {
  timerInterval = setInterval(() => {
    now.value = new Date()
  }, 1000)
  
  if (!authStore.sessionStart && authStore.token) {
    authStore.sessionStart = new Date().toISOString()
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

defineExpose({
  openDrawer: () => drawer.value = true
})
</script>

<style scoped>
.glass-profile {
  background: rgba(18, 11, 25, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  border: 4px solid rgba(140, 43, 238, 0.3);
  background: #1d1429;
}

.status-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid #120b19;
}

.status-badge.active { background: #4caf50; box-shadow: 0 0 10px #4caf50; }
.status-badge.inactive { background: #f44336; }

.text-gradient {
  background: linear-gradient(to right, #fff, #8c2bee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.info-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: 0.3s;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(140, 43, 238, 0.4);
}

.subscription-card.is-active {
  background: linear-gradient(135deg, rgba(140, 43, 238, 0.15), rgba(59, 130, 246, 0.05));
  border-color: rgba(140, 43, 238, 0.3);
}

.logout-btn {
  color: #ff5252;
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-radius: 12px;
  transition: 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 82, 82, 0.1);
  border-color: #ff5252;
}
</style>
