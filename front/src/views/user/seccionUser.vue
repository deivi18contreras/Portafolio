<template>
    <q-page class="main-user-bg">

        <!-- COMPONENTES EXISTENTES -->
        <Perfil ref="perfilRef" />
        <notificaciones ref="notifRef" />

        <!-- HEADER -->
        <q-header elevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'" class="text-white">
            <q-toolbar class="q-py-sm">
                <q-toolbar-title class="text-weight-bolder row items-center">
                    <q-icon name="auto_awesome" class="q-mr-sm animate-pulse" color="secondary" size="32px" />
                    <span class="astra-title">ASTRA AI</span>
                </q-toolbar-title>

                <q-space />

                <div class="gt-xs q-mr-md">
                    <q-input dense outlined v-model="search" placeholder="Buscar sabiduría..." color="secondary"
                        :dark="$q.dark.isActive">
                        <template v-slot:prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div>

                <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="$q.dark.toggle()"
                    class="q-mr-sm" />

                <q-btn flat round icon="notifications" class="q-mr-sm" @click="notifRef.openDrawer()">
                    <q-badge floating color="red" rounded v-if="authStore.unreadCount > 0">
                        {{ authStore.unreadCount }}
                    </q-badge>
                </q-btn>

                <q-avatar size="42px" class="cursor-pointer shadow-5 profile-ring" @click="perfilRef.openDrawer()">
                    <img :src="user.avatar" />
                </q-avatar>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <q-page padding class="container-max-width">

                <!-- SECCIÓN DE BIENVENIDA -->
                <div class="welcome-section q-mb-xl text-center">
                    <div class="text-h3 text-weight-bold q-mb-sm">
                        Saludos, <span class="text-primary text-italic">{{ user.nombre }}</span>
                    </div>
                    <div class="row justify-center q-mb-md">
                        <q-chip v-if="authStore.usuario?.estado === 1" color="amber-9" text-color="white" icon="workspace_premium" class="shadow-2">
                            Buscador Premium
                        </q-chip>
                        <q-chip v-else color="grey-7" text-color="white" icon="lock" class="shadow-1">
                            Plan Gratuito
                        </q-chip>
                    </div>
                    <p class="text-subtitle1 text-grey-6 letter-spacing-1">
                        Explora los misterios de tu destino a través de los números
                    </p>
                </div>

                <!-- SECCIÓN LECTURA PRINCIPAL (ESENCIA CÓSMICA) -->
                <div class="q-mb-xl">
                    <div v-if="!lecturaPrincipal" class="row justify-center">
                        <q-card class="main-reading-promo glass-morphism text-center q-pa-xl">
                            <q-icon name="explore" size="64px" color="secondary" class="q-mb-md" />
                            <div class="text-h4 text-weight-bold q-mb-md">Tu Mapa del Destino te espera</div>
                            <p class="text-body1 text-grey-5 q-mb-lg">
                                Para una guía precisa, primero debemos calcular tu <b>Camino de Vida</b>
                                basado en tu fecha de nacimiento. Es la revelación más importante de tu existencia.
                            </p>
                            <q-btn label="Descubrir mi Esencia" color="secondary" size="lg" rounded unelevated
                                :loading="loadingPrincipal" @click="generarLecturaPrincipal" class="q-px-xl" />
                        </q-card>
                    </div>

                    <!-- VISTA DE LA LECTURA PRINCIPAL CUANDO YA EXISTE -->
                    <q-card v-else class="reading-card main-essence-card glass-morphism overflow-hidden">
                        <div class="row no-wrap">
                            <div class="col-12 col-md-4 bg-primary text-white q-pa-xl flex flex-center column">
                                <div class="text-overline opacity-80">Camino de Vida</div>
                                <div class="text-h1 text-weight-bolder">{{ lecturaPrincipal.numeroCamino }}</div>
                                <q-icon name="stars" size="50px" class="q-mt-md" />
                            </div>
                            <div class="col-12 col-md-8 q-pa-xl">
                                <div class="row justify-between items-center q-mb-md">
                                    <div class="text-h5 text-weight-bold text-primary">Tu Esencia Cósmica</div>
                                    <q-badge color="secondary" label="Lectura Principal" outline />
                                </div>

                                <p class="text-body1 q-mb-lg leading-relaxed">{{ lecturaPrincipal.descripcion }}</p>

                                <div class="row q-col-gutter-md q-mb-lg">
                                    <div class="col-12">
                                        <div class="text-subtitle2 text-weight-bold text-grey-5 q-mb-xs">Talentos
                                            Ocultos</div>
                                        <div class="row q-gutter-xs">
                                            <q-chip v-for="talento in lecturaPrincipal.talentos" :key="talento" outline
                                                color="primary" icon="bolt" dense>
                                                {{ talento }}
                                            </q-chip>
                                        </div>
                                    </div>
                                </div>

                                <div class="spiritual-msg q-pa-md bg-grey-10-transparent rounded-borders italic">
                                    <q-icon name="format_quote" color="primary" size="24px" />
                                    {{ lecturaPrincipal.mensajeEspiritual }}
                                </div>
                            </div>
                        </div>
                    </q-card>
                </div>

                <q-separator dark class="q-my-xl opacity-10" />

                <!-- BANNER PREMIUM (Si no es premium) -->
                <div v-if="authStore.usuario?.estado !== 1" class="row justify-center q-mb-xl">
                    <q-card class="premium-banner glass-morphism q-pa-lg text-center full-width max-width-800 shadow-24">
                        <div class="row items-center justify-center q-gutter-md">
                            <q-icon name="stars" color="amber" size="48px" />
                            <div class="column items-start">
                                <div class="text-h5 text-weight-bold text-amber">¡Accede al Oráculo Diario!</div>
                                <div class="text-body2 text-grey-4">Desbloquea lecturas diarias ilimitadas y consejos místicos profundos.</div>
                            </div>
                            <q-btn label="Hazte Premium" color="amber-9" text-color="white" rounded unelevated 
                                icon="workspace_premium" @click="showPremiumModal = true" class="q-px-lg" />
                        </div>
                    </q-card>
                </div>

                <!-- BOTÓN LECTURA DIARIA (ORÁCULO) -->
                <div class="row justify-center q-mb-xl">
                    <q-btn @click="generarLecturaDiaria" :loading="loadingDiaria" :disabled="!lecturaPrincipal"
                        class="oracle-btn q-px-xl q-py-lg" unelevated rounded>
                        <div class="column items-center">
                            <q-icon name="psychology" size="44px" class="q-mb-sm" />
                            <div class="text-h6 text-weight-bold">Consultar al Oráculo Diario</div>
                            <div class="text-caption opacity-70" v-if="lecturaPrincipal">Obtener guía para hoy</div>
                            <div class="text-caption opacity-70" v-else>Primero descubre tu esencia</div>
                        </div>
                    </q-btn>
                </div>

                <!-- DIÁLOGO PREMIUM -->
                <q-dialog v-model="showPremiumModal">
                    <q-card class="glass-morphism premium-dialog text-white q-pa-lg" style="min-width: 350px">
                        <q-card-section class="text-center">
                            <q-avatar icon="auto_awesome" color="amber-9" text-color="white" size="80px" class="q-mb-md" />
                            <div class="text-h4 text-weight-bolder text-amber-5 q-mb-sm">Plan Astra Premium</div>
                            <div class="text-subtitle1 text-grey-4 q-mb-lg">Tu destino revelado día tras día</div>
                        </q-card-section>

                        <q-card-section class="q-py-none">
                            <div class="benefit-item row items-center q-mb-md">
                                <q-icon name="check_circle" color="secondary" size="24px" class="q-mr-sm" />
                                <span>Lecturas diarias personalizadas ilimitadas</span>
                            </div>
                            <div class="benefit-item row items-center q-mb-md">
                                <q-icon name="check_circle" color="secondary" size="24px" class="q-mr-sm" />
                                <span>Consejos ancestrales profundos</span>
                            </div>
                            <div class="benefit-item row items-center q-mb-md">
                                <q-icon name="check_circle" color="secondary" size="24px" class="q-mr-sm" />
                                <span>Análisis de energía diario</span>
                            </div>
                            <div class="benefit-item row items-center q-mb-lg">
                                <q-icon name="check_circle" color="secondary" size="24px" class="q-mr-sm" />
                                <span>Soporte prioritario del oráculo</span>
                            </div>

                            <div class="text-center q-pa-md bg-grey-10 rounded-borders q-mb-xl border-amber">
                                <div class="text-overline text-grey-5">Inversión Única Mensual</div>
                                <div class="text-h3 text-weight-bold text-amber">$15.000 <small class="text-caption">COP</small></div>
                            </div>
                        </q-card-section>

                        <q-card-actions align="center" class="column q-gutter-sm">
                            <q-btn label="Suscribirse con Mercado Pago" color="amber-10" class="full-width q-py-md" 
                                rounded unelevated icon="payment" @click="activarPremium" :loading="loadingPago" />
                            <q-btn label="Tal vez más tarde" flat color="grey-5" v-close-popup />
                        </q-card-actions>
                    </q-card>
                </q-dialog>

                <!-- DISPLAY DE LECTURA DIARIA -->                <transition appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
                    <div v-if="lecturaHoy" class="q-mb-xl">
                        <q-card class="reading-card daily-reading-card glass-morphism">
                            <q-card-section class="row items-center q-pb-none">
                                <q-icon name="auto_stories" color="primary" size="32px" class="q-mr-md" />
                                <div class="text-h5 text-weight-bold">Revelación del {{ lecturaHoy.fecha }}</div>
                            </q-card-section>

                            <q-card-section class="q-pa-lg">
                                <div class="row q-col-gutter-lg">
                                    <div class="col-12 col-md-8">
                                        <div class="text-subtitle1 text-grey-5 q-mb-xs">Mensaje del Universo</div>
                                        <div class="text-h6 text-weight-regular italic-quote">
                                            "{{ lecturaHoy.mensaje }}"
                                        </div>

                                        <q-separator dark class="q-my-lg opacity-20" />

                                        <div class="text-subtitle1 text-grey-5 q-mb-xs">Consejo Ancestral</div>
                                        <div class="text-body1">{{ lecturaHoy.consejo }}</div>
                                    </div>

                                    <div class="col-12 col-md-4">
                                        <q-card flat class="bg-primary-transparent q-pa-md text-center border-accent">
                                            <div class="text-overline text-primary">Energía de Hoy</div>
                                            <div class="text-h4 text-weight-bolder q-my-sm">{{ lecturaHoy.energiaDelDia
                                                }}</div>
                                            <q-icon name="bolt" color="primary" size="40px" />
                                        </q-card>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </transition>

                <!-- EXPLORACIONES PREVIAS -->
                <div class="text-h5 text-weight-bold q-mb-md flex items-center">
                    <q-icon name="history" class="q-mr-sm" color="grey-6" />
                    Historial de Consultas
                </div>

                <div class="row q-col-gutter-lg">
                    <div v-for="item in exploraciones" :key="item.titulo" class="col-12 col-sm-6 col-md-3">
                        <q-card class="history-card overflow-hidden shadow-10">
                            <q-img :src="item.img" height="160px">
                                <div class="absolute-bottom bg-gradient-dark text-white">
                                    <div class="text-weight-bold">{{ item.titulo }}</div>
                                    <div class="text-caption opacity-80">{{ item.fecha }}</div>
                                </div>
                            </q-img>
                        </q-card>
                    </div>
                </div>

            </q-page>
        </q-page-container>

        <q-footer :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
            class="text-center q-pa-lg text-grey-7 border-top">
            <div class="text-overline q-mb-xs">Destino • Sabiduría • Conexión</div>
            <div>© 2024 Astra AI Numerology - Conectando tu esencia con el cosmos</div>
        </q-footer>

    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Perfil from '../../components/perfil.vue'
import Notificaciones from '../../components/notificaciones.vue'
import { useAuthStore } from '../../store/Auth.js'
import { postData, getData } from '../../services/services.js'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()
const perfilRef = ref(null)
const notifRef = ref(null)
const search = ref('')

const loadingPrincipal = ref(false)
const loadingDiaria = ref(false)
const loadingPago = ref(false)
const showPremiumModal = ref(false)

const lecturaPrincipal = ref(null)
const lecturaHoy = ref(null)

const user = ref({
    nombre: authStore.usuario?.nombre || 'Buscador',
    avatar: authStore.usuario?.avatar || 'https://i.pravatar.cc/150?img=12'
})

// Activar Plan Premium
const activarPremium = async () => {
    loadingPago.value = true
    try {
        const res = await postData('pagos/create-preference', {
            usuarioId: authStore.usuario._id,
            monto: 15000,
            description: "Plan Premium Astra AI - Lectura Diaria"
        })
        
        if (res.data && res.data.init_point) {
            // Redirigir a Mercado Pago
            window.location.href = res.data.init_point
        } else {
            throw new Error("No se pudo obtener el enlace de pago")
        }
    } catch (error) {
        $q.notify({
            message: 'Error al conectar con la pasarela de pagos.',
            color: 'negative',
            icon: 'error'
        })
    } finally {
        loadingPago.value = false
    }
}

// Obtener la lectura principal al cargar
const fetchLecturaPrincipal = async () => {
    try {
        const res = await postData(`lectura/principal/${authStore.usuario._id}`)
        if (res.status === 200 || res.status === 201) {
            lecturaPrincipal.value = res.data.contenido
        }
    } catch (error) {
        console.log("No se encontró lectura principal previa.")
    }
}

const generarLecturaPrincipal = async () => {
    loadingPrincipal.value = true
    try {
        const res = await postData(`lectura/principal/${authStore.usuario._id}`)
        lecturaPrincipal.value = res.data.contenido
        $q.notify({
            message: 'Tu esencia ha sido revelada.',
            color: 'secondary',
            icon: 'stars'
        })
    } catch (error) {
        $q.notify({
            message: 'Error al conectar con el universo.',
            color: 'negative'
        })
    } finally {
        loadingPrincipal.value = false
    }
}

const generarLecturaDiaria = async () => {
    loadingDiaria.value = true
    try {
        const res = await postData(`lectura/diaria/${authStore.usuario._id}`)
        lecturaHoy.value = res.data.contenido
        $q.notify({
            message: 'El oráculo ha hablado.',
            color: 'secondary',
            icon: 'auto_awesome'
        })
    } catch (error) {
        if (error.response?.status === 403) {
            showPremiumModal.value = true
            $q.notify({
                message: 'Esta sabiduría requiere el Plan Premium.',
                color: 'amber-9',
                icon: 'workspace_premium'
            })
        } else {
            $q.notify({
                message: error.response?.data?.msg || 'Intenta más tarde.',
                color: 'negative'
            })
        }
    } finally {
        loadingDiaria.value = false
    }
}

const exploraciones = ref([
    { titulo: 'Análisis del Alma', fecha: 'Hace 2 días', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee' },
    { titulo: 'Sincronía de Pareja', fecha: 'Hace 5 días', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa' },
    { titulo: 'Mapa del Destino', fecha: 'Hace 1 semana', img: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031' },
    { titulo: 'Matriz Cuántica', fecha: 'Hace 2 semanas', img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564' }
])

onMounted(() => {
    fetchLecturaPrincipal()
})
</script>

<style scoped>
.main-user-bg {
    background: radial-gradient(circle at top right, rgba(140, 43, 238, 0.05), transparent),
        radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.05), transparent);
}

.container-max-width {
    max-width: 1100px;
    margin: 0 auto;
}

.astra-title {
    letter-spacing: 6px;
    font-size: 1.2rem;
    color: #fff;
}

.profile-ring {
    border: 2px solid var(--q-secondary);
    padding: 2px;
}

/* CARDS */
.glass-morphism {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
}

.body--dark .glass-morphism {
    background: rgba(0, 0, 0, 0.2);
}

.main-reading-promo {
    max-width: 600px;
    border: 2px dashed rgba(140, 43, 238, 0.3);
}

.main-essence-card {
    border: 1px solid rgba(140, 43, 238, 0.2);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.bg-grey-10-transparent {
    background: rgba(255, 255, 255, 0.05);
}

.leading-relaxed {
    line-height: 1.8;
}

/* BOTÓN ORÁCULO */
.oracle-btn {
    background: linear-gradient(135deg, var(--q-primary), #3b82f6);
    color: white;
    min-width: 320px;
    box-shadow: 0 10px 30px rgba(140, 43, 238, 0.4);
    transition: all 0.4s;
}

.oracle-btn:hover:not(:disabled) {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(140, 43, 238, 0.6);
}

.oracle-btn:disabled {
    opacity: 0.5;
    background: #444;
}

.animate-pulse {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

.history-card:hover {
    transform: translateY(-8px);
    transition: 0.3s;
}

.bg-gradient-dark {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.bg-primary-transparent {
    background: rgba(140, 43, 238, 0.08);
}

.border-accent {
    border: 1px solid rgba(140, 43, 238, 0.2);
}

.italic-quote {
    font-style: italic;
    color: var(--q-secondary);
}
</style>
