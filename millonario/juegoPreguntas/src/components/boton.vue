<template>
    <div>
        <q-btn :color="props.color" :text-color="props.textColor" :label="props.label" :disabled="props.disabled"
            @click="accion" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["accionBoton"]);

const props = defineProps({
    color: {
        type: String,
        default: "blue",
    },
    textColor: {
        type: String,
        default: "black",
    },
    label: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

function accion() {
    emit("accionBoton");
}
</script>
