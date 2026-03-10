import { createApp } from 'vue'
import {Quasar, Notify, Dialog, Loading} from 'quasar'
import { createPinia } from 'pinia'
import '@quasar/extras/material-icons/material-icons.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'quasar/src/css/index.sass'
import './style.css'
import App from './App.vue'
import router from './router/router'

const myApp = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

myApp.use(Quasar,{
    plugins: {
        Notify,
        Dialog,
        Loading
    },
})
myApp.use(pinia)
myApp.use(router)
myApp.mount('#app')
