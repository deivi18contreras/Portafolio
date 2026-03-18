<template>
  <q-page padding class="text-white">
    <div class="row q-mb-xl">
      <div class="col-12">
        <div class="text-overline text-amber-5 letter-spacing-2">CRÓNICAS DEL TIEMPO</div>
        <h2 class="text-h3 cinzel-font q-ma-none">El Archivo</h2>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="i in 6" :key="i" class="col-12 col-sm-6 col-md-4">
        <q-card class="vault-card glass-card-dark cursor-pointer overflow-hidden">
           <div class="vault-card-glow" :style="{ background: i % 2 === 0 ? '#6366f1' : '#fbbf24' }"></div>
           <q-card-section class="q-pa-lg">
              <div class="row items-center justify-between q-mb-md">
                 <q-icon name="history_edu" color="amber-5" />
                 <span class="text-caption text-grey-6">{{ 10 + i }} Marzo, 2026</span>
              </div>
              <div class="text-h6 text-white cinzel-font">Revelación Astral #{{ i }}</div>
              <p class="text-caption text-grey-5 q-mt-sm">Un fragmento de sabiduría guardado en los hilos del tiempo...</p>
              
              <q-separator dark class="q-my-md opacity-10" />
              
              <div class="row items-center justify-between">
                 <span class="text-amber-5 text-weight-bold">Vibración: {{ 5 + i }}</span>
                 <q-btn flat round icon="visibility" color="grey-6" />
              </div>
           </q-card-section>
        </q-card>
      </div>

      <!-- ESTADO VACÍO ELEGANTE -->
      <div class="col-12 flex flex-center column q-pa-xl opacity-30">
         <q-icon name="hourglass_empty" size="100px" color="amber-5" />
         <div class="text-h5 cinzel-font q-mt-md">Tu historia se está escribiendo...</div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.cinzel-font { font-family: 'Cinzel', serif; }

.glass-card-dark {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.vault-card { position: relative; transition: all 0.4s ease; }
.vault-card:hover {
  transform: scale(1.03) translateY(-5px);
  border-color: rgba(251, 191, 36, 0.4);
}

.vault-card-glow {
  position: absolute; top: -20%; right: -20%; width: 80px; height: 80px;
  filter: blur(50px); opacity: 0.2; border-radius: 50%;
}
</style>