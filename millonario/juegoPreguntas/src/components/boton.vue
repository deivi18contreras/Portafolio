<template>
<q-btn @click="presionar" :color="color", :label="label" ></q-btn>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    color:{
        type: String,
        required: true
    },
    label:{
        type: String,
        required: true
    },

});

const emits = defineEmits(['seleccionar'])
const presionar = () => {
    emits('seleccionar')
}
</script>