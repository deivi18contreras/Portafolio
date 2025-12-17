import { createApp } from 'vue'
import { router } from './router/routes'
import { Quasar, Notify } from 'quasar'

// Iconos
import '@quasar/extras/material-icons/material-icons.css'

// Estilos de Quasar
import 'quasar/src/css/index.sass'
import './style.css'

import App from './App.vue'

const app = createApp(App)

app.use(router)

app.use(Quasar, {
  plugins: {
    Notify   
  }
})

app.mount('#app')
