<template>
  <q-page class="templo-astral-page">
    <!-- FONDO INMERSIVO: NEBULOSA LÍQUIDA -->
    <div class="nebula-overlay"></div>
    <div class="stars-fixed"></div>

    <Perfil ref="perfilRef" />
    <notificaciones ref="notifRef" />

    <!-- HEADER (Iconos respetados como pediste) -->
    <q-header class="transparent-header" flat>
      <q-toolbar class="container-max q-py-lg">
        <div class="templo-logo">
           <span class="text-gold letter-spacing-5">ASTRA</span>
           <span class="text-white opacity-40">●</span>
           <span class="text-white letter-spacing-5">AI</span>
        </div>
        <q-space />
        <q-btn flat round icon="notifications" @click="notifRef.openDrawer()" class="text-gold">
          <q-badge floating color="amber-10" rounded v-if="authStore.unreadCount > 0">{{ authStore.unreadCount }}</q-badge>
        </q-btn>
        <q-avatar size="45px" class="avatar-glow cursor-pointer q-ml-md" @click="perfilRef.openDrawer()">
          <img :src="user.avatar" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="container-max q-pb-xl">
        
        <!-- BIENVENIDA MÍSTICA -->
        <div class="row justify-center q-mb-xl text-center animate-fade-in">
           <div class="col-12">
              <div class="text-overline text-gold q-mb-sm">PORTAL DE LA SABIDURÍA</div>
              <h1 class="text-h2 cinzel-font text-white q-ma-none">Bienvenido, <span class="text-gold">{{ user.nombre }}</span></h1>
              <div class="aura-divider q-mx-auto q-mt-md"></div>
           </div>
        </div>

        <!-- SECCIÓN 1: EL ALTAR DE LA ESENCIA (Lectura Principal) -->
        <div class="row justify-center q-mb-xl">
           <div class="col-12 col-md-10">
              <q-card class="altar-card glass-morph q-pa-xl">
                 <div v-if="lecturaPrincipal" class="row items-center q-col-gutter-xl">
                    <div class="col-12 col-md-5 flex flex-center">
                       <div class="mandala-container">
                          <div class="mandala-ring ring-1"></div>
                          <div class="mandala-ring ring-2"></div>
                          <div class="numero-maestro">
                             <div class="text-caption text-gold">NÚMERO</div>
                             <div class="text-h2 text-white text-weight-bolder">{{ lecturaPrincipal.numeroCamino }}</div>
                             <div class="text-caption text-gold">MAESTRO</div>
                          </div>
                       </div>
                    </div>
                    <div class="col-12 col-md-7">
                       <h3 class="text-h4 cinzel-font text-gold q-mb-md">Tu Esencia Revelada</h3>
                       <p class="text-body1 text-grey-4 text-justify line-height-2">{{ lecturaPrincipal.descripcion }}</p>
                       <div class="row q-gutter-sm q-mt-lg">
                          <div v-for="talento in lecturaPrincipal.talentos" :key="talento" class="talent-tag">
                             {{ talento }}
                          </div>
                       </div>
                    </div>
                 </div>
                 <!-- Si no hay lectura principal -->
                 <div v-else class="text-center q-pa-xl">
                    <q-icon name="auto_awesome" color="amber-5" size="80px" class="q-mb-md opacity-40" />
                    <h4 class="text-h4 cinzel-font text-white">Tu destino aún está oculto</h4>
                    <p class="text-subtitle1 text-grey-5 q-mb-xl">Realiza tu primera consulta para despertar tu esencia numerológica.</p>
                    <q-btn label="REVELAR MI ESENCIA" color="amber-9" text-color="black" rounded unelevated class="mystic-btn-gold" @click="generarLecturaPrincipal" :loading="loadingPrincipal" />
                 </div>
              </q-card>
           </div>
        </div>

        <div class="row q-col-gutter-xl">
           <!-- SECCIÓN 2: EL ORÁCULO DE LA INTRIGA (Lectura Diaria) -->
           <div class="col-12 col-md-6">
              <div class="section-title text-white q-mb-lg cinzel-font">El Oráculo Diario</div>
              <div class="card-reveal-container">
                 <div class="oracle-card-inner" :class="{ 'is-flipped': lecturaHoy }">
                    <!-- CARA POSTERIOR: LA CARTA CERRADA -->
                    <div class="oracle-card-back flex flex-center column">
                       <div class="card-pattern"></div>
                       <q-icon name="psychic" size="80px" color="amber-5" class="q-mb-md" />
                       <div class="text-h5 text-gold cinzel-font">MENSAJE DEL DÍA</div>
                       <p class="text-grey-5 q-px-xl text-center">Los astros han cambiado su posición. ¿Deseas conocer tu nueva vibración?</p>
                       <q-btn label="VOLTEAR CARTA" flat color="amber-5" rounded outline @click="generarLecturaDiaria" :loading="loadingDiaria" class="q-mt-md" />
                    </div>

                    <!-- CARA FRONTAL: LA LECTURA REVELADA -->
                    <div v-if="lecturaHoy" class="oracle-card-front q-pa-xl">
                       <div class="row justify-between items-center q-mb-md">
                          <div class="text-h3 text-gold text-weight-bolder">{{ lecturaHoy.energiaDelDia }}</div>
                          <q-icon name="flare" color="amber-5" size="md" />
                       </div>
                       <div class="text-subtitle1 text-white italic-quote q-mb-lg">"{{ lecturaHoy.mensaje }}"</div>
                       
                       <!-- LÓGICA DE INTRIGA: TEXTO DIFUMINADO SI NO ES PREMIUM -->
                       <div class="lectura-contenido-wrapper" :class="{ 'is-blurred': authStore.usuario?.estado !== 1 }">
                          <p class="text-body2 text-grey-4">{{ lecturaHoy.consejo }}</p>
                          <div class="blur-overlay" v-if="authStore.usuario?.estado !== 1">
                             <div class="column flex-center">
                                <q-icon name="lock" size="lg" color="amber-5" class="q-mb-sm" />
                                <span class="text-white text-weight-bold">Saber más requiere Ascensión Premium</span>
                                <q-btn label="DESBLOQUEAR AHORA" flat color="amber-5" class="q-mt-sm" @click="showPremiumModal = true" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- SECCIÓN 3: LA BÓVEDA DE SABIDURÍA (Historial) -->
           <div class="col-12 col-md-6">
              <div class="section-title text-white q-mb-lg cinzel-font">Bóveda de Recuerdos</div>
              <div class="vault-grid">
                 <q-card v-for="(hist, i) in historial" :key="i" class="crystal-card glass-morph cursor-pointer">
                    <q-card-section class="column flex-center">
                       <div class="crystal-icon" :style="{ background: hist.color }"></div>
                       <div class="text-caption text-gold q-mt-md">{{ hist.fecha }}</div>
                       <div class="text-subtitle2 text-white">{{ hist.titulo }}</div>
                    </q-card-section>
                 </q-card>
                 <!-- Espacio vacío si no hay mucho historial -->
                 <div class="empty-crystal flex flex-center column opacity-40">
                    <q-icon name="history" size="md" />
                    <span style="font-size: 10px">PROXIMAMENTE</span>
                 </div>
              </div>

              <!-- SECCIÓN 4: ASCENSIÓN ASTRAL (Banner Premium de Lujo) -->
              <div class="premium-ascension-banner q-mt-xl animate-float">
                 <div class="banner-content row items-center no-wrap">
                    <div class="col-auto q-mr-lg">
                       <q-icon name="workspace_premium" size="50px" color="amber-9" />
                    </div>
                    <div class="col">
                       <div class="text-h6 text-white cinzel-font">Ascensión Premium</div>
                       <div class="text-caption text-grey-5">Trasciende las limitaciones y accede al oráculo infinito.</div>
                    </div>
                    <div class="col-auto">
                       <q-btn label="UNIRME" color="amber-9" text-color="black" rounded size="md" unelevated class="mystic-btn-gold" @click="showPremiumModal = true" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </q-page>
    </q-page-container>

    <!-- DIÁLOGO PREMIUM TIPO TEMPLO -->
    <q-dialog v-model="showPremiumModal">
      <q-card class="templo-modal-card text-white">
        <div class="modal-glow"></div>
        <q-card-section class="text-center q-pa-xl">
          <q-icon name="auto_awesome" color="amber-9" size="60px" class="q-mb-md" />
          <h3 class="text-h3 cinzel-font text-gold q-ma-none">Astra Premium</h3>
          <p class="text-subtitle1 text-grey-5 q-mt-md">Conviértete en un Iluminado y accede a todas las lecturas sin límites.</p>
          
          <div class="benefits-list q-my-xl text-left">
             <div class="benefit-item" v-for="b in benefits" :key="b">
                <q-icon name="stars" color="amber-9" class="q-mr-md" />
                <span>{{ b }}</span>
             </div>
          </div>

          <div class="price-tag q-mb-xl">
             <span class="currency">$</span>15.000 <span class="period">/ MES</span>
          </div>

          <q-btn label="ACTIVAR ASCENSIÓN" color="amber-9" text-color="black" 
            class="full-width q-py-md mystic-btn-gold" rounded size="lg" unelevated @click="activarPremium" :loading="loadingPago" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Perfil from '../../components/perfil.vue'
import Notificaciones from '../../components/notificaciones.vue'
import { useAuthStore } from '../../store/Auth.js'
import { postData } from '../../services/services.js'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()
const perfilRef = ref(null)
const notifRef = ref(null)

const loadingPrincipal = ref(false)
const loadingDiaria = ref(false)
const loadingPago = ref(false)
const showPremiumModal = ref(false)

const lecturaPrincipal = ref(null)
const lecturaHoy = ref(null)

const user = ref({
    nombre: authStore.usuario?.nombre || 'Buscador',
    avatar: authStore.usuario?.avatar || 'https://i.pravatar.cc/150?img=33'
})

const benefits = [
  "Revelaciones diarias ilimitadas",
  "Historial eterno de sabiduria",
  "Analisis de compatibilidad profunda",
  "Sin interrupciones misticas"
]

const historial = ref([
    { titulo: "Alineación", fecha: "Ayer", color: "radial-gradient(circle, #f59e0b, transparent)" },
    { titulo: "Conexión", fecha: "15 Mar", color: "radial-gradient(circle, #8b5cf6, transparent)" },
    { titulo: "Energía", fecha: "12 Mar", color: "radial-gradient(circle, #10b981, transparent)" }
])

const activarPremium = async () => {
    loadingPago.value = true
    try {
        const res = await postData('pagos/create-preference', {
            usuarioId: authStore.usuario._id,
            monto: 15000,
            description: "Plan Premium Astra AI"
        })
        if (res.data?.init_point) window.location.href = res.data.init_point
    } catch (error) {
        $q.notify({ message: 'Error en la conexión mística.', color: 'negative' })
    } finally { loadingPago.value = false }
}

const fetchLecturaPrincipal = async () => {
    try {
        const res = await postData(`lectura/principal/${authStore.usuario._id}`)
        if (res.status === 200 || res.status === 201) lecturaPrincipal.value = res.data.contenido
    } catch (e) {}
}

const generarLecturaPrincipal = async () => {
    loadingPrincipal.value = true
    try {
        const res = await postData(`lectura/principal/${authStore.usuario._id}`)
        lecturaPrincipal.value = res.data.contenido
        $q.notify({ message: 'Tu esencia ha sido revelada.', color: 'amber-9' })
    } catch (e) { $q.notify({ message: 'El cosmos está saturado. Intenta luego.', color: 'negative' }) }
    finally { loadingPrincipal.value = false }
}

const generarLecturaDiaria = async () => {
    loadingDiaria.value = true
    try {
        const res = await postData(`lectura/diaria/${authStore.usuario._id}`)
        lecturaHoy.value = res.data.contenido
    } catch (error) {
        if (error.response?.status === 403) showPremiumModal.value = true
        else $q.notify({ message: 'Intenta de nuevo más tarde.', color: 'negative' })
    } finally { loadingDiaria.value = false }
}

onMounted(() => fetchLecturaPrincipal())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

.templo-astral-page {
  background: #02040a;
  color: #fff;
  font-family: 'Cinzel', serif;
  overflow-x: hidden;
}

.cinzel-font { font-family: 'Cinzel', serif; }
.text-gold { color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
.letter-spacing-5 { letter-spacing: 5px; }
.line-height-2 { line-height: 2; }

/* NEBULA BACKGROUND */
.nebula-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 50%, #1a103d 0%, #02040a 100%);
  opacity: 0.8; z-index: 0;
}
.stars-fixed {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
  opacity: 0.2; z-index: 0;
}

.container-max { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; }

/* HEADER */
.transparent-header { background: transparent; }
.avatar-glow { border: 2px solid #d4af37; box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }

.aura-divider {
  width: 100px; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

/* GLASSMORPH */
.glass-morph {
  background: rgba(15, 20, 30, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 30px;
}

/* MANDALA LECTURA PRINCIPAL */
.mandala-container {
  position: relative; width: 280px; height: 280px;
  display: flex; align-items: center; justify-content: center;
}
.mandala-ring {
  position: absolute; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 50%;
}
.ring-1 { width: 100%; height: 100%; animation: rotateMandala 30s linear infinite; border-style: dashed; }
.ring-2 { width: 80%; height: 80%; animation: rotateMandala 20s linear infinite reverse; }

@keyframes rotateMandala { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.numero-maestro { text-align: center; z-index: 2; }

.talent-tag {
  background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 5px 15px; border-radius: 50px; font-size: 11px; color: #d4af37;
}

/* ORACLE CARD REVEAL (3D FLIP) */
.card-reveal-container { perspective: 1000px; height: 450px; }
.oracle-card-inner {
  position: relative; width: 100%; height: 100%;
  transition: transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}
.is-flipped { transform: rotateY(180deg); }

.oracle-card-back, .oracle-card-front {
  position: absolute; width: 100%; height: 100%;
  backface-visibility: hidden; border-radius: 30px; overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.2);
}

.oracle-card-back {
  background: #0f141e; z-index: 2;
}
.card-pattern {
  position: absolute; width: 100%; height: 100%;
  background-image: radial-gradient(#d4af37 0.5px, transparent 0.5px);
  background-size: 20px 20px; opacity: 0.1;
}

.oracle-card-front {
  background: linear-gradient(135deg, #0f141e 0%, #1a103d 100%);
  transform: rotateY(180deg);
}

/* INTRIGA BLUR EFFECT */
.is-blurred { position: relative; filter: blur(4px); pointer-events: none; }
.blur-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 20, 30, 0.6);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 10; border-radius: 15px;
  pointer-events: all;
}

/* VAULT GRID (CRYSTALS) */
.vault-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
.crystal-card { height: 140px; }
.crystal-icon {
  width: 40px; height: 40px; border-radius: 50%; filter: blur(10px); opacity: 0.6;
}
.empty-crystal { border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px; }

/* PREMIUM BANNER */
.premium-ascension-banner {
  background: linear-gradient(90deg, #1a103d, #d4af37, #1a103d);
  padding: 1px; border-radius: 20px;
}
.banner-content {
  background: #02040a; padding: 25px; border-radius: 20px;
}

/* BUTTONS */
.mystic-btn-gold {
  background: #d4af37 !important; font-weight: 900; letter-spacing: 2px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
}

/* MODAL */
.templo-modal-card {
  background: #0f141e; border: 2px solid #d4af37; border-radius: 40px;
}
.price-tag { font-size: 50px; font-weight: 900; color: #d4af37; }
.currency { font-size: 20px; vertical-align: top; }
.period { font-size: 14px; color: #666; }

/* ANIMATIONS */
.animate-float { animation: floating 4s ease-in-out infinite; }
@keyframes floating { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.animate-fade-in { animation: fadeIn 1.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>