<template>
  <q-card
    class="categoria-card"
    flat
    bordered
    clickable
    @click="$emit('select')"
  >
    <div class="img-wrapper">
      <img v-if="image" :src="image" alt="categoria" />
    </div>

    <div class="title">
      {{ title }}
    </div>
  </q-card>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});
</script>

<style scoped>
.categoria-card {
  border-radius: 15px;
  overflow: hidden;
  transition: 0.25s ease;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
}

.categoria-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.5);
}

.img-wrapper {
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  text-align: center;
  padding: 12px 0;
  font-weight: bold;
  color: white;
  font-size: 20px;
  text-shadow: 0 0 5px black;
}
</style>
