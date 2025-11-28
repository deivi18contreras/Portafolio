<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <h1 class="q-ma-md">AHORCADO</h1>

        <q-toolbar-title>
          <q-avatar></q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered>
      <!-- Drawer content -->
      <q-btn color="primary" label="Inicio" to="/" class="full-width q-mb-sm"/>
      <q-btn color="primary" label="Juego" to="/juego" class="full-width q-mb-sm"/>
      <q-btn color="primary" label="Niveles" to="/niveles" class="full-width q-mb-sm"/>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar></q-avatar>
          <div></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer
    }
  }
}
</script>
