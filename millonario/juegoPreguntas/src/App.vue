<template>
  <q-layout view="lHh Lpr lFf">
    
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { useRoute } from 'vue-router';

const router = useRoute()
</script>

