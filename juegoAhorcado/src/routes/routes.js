import { createRouter, createWebHashHistory } from "vue-router"
import Categoria from "../views/Categoria.vue"
import Inicio from "../views/Inicio.vue"
import Juego from "../views/Juego.vue"
import Niveles from "../views/Niveles.vue"
import Personajes from "../views/Personajes.vue"
import Podio from "../views/Podio.vue"
const routes = [
    { path: "/", component: Inicio },
    { path: "/categoria", component: Categoria },
    { path: "/niveles", component: Niveles },
    { path: "/juego", component: Juego },
    { path: "/personajes", component: Personajes },
    { path: "/podio", component: Podio }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
