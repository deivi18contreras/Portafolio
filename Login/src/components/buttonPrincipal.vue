<template>
  <q-btn :color="props.color" :text-color="props.textColor" :label="props.label" :type="props.type"
    @click="emit('accionBoton')"></q-btn>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(["accionBoton"]);

const props = defineProps({
  color: {
    type: String,
    default: "black"
  },
  textColor: {
    type: String,
    default: "white"
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "button"
  }
});
</script>
