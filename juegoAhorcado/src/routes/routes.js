import { createRouter, createWebHashHistory } from "vue-router"

import Categoria from "../views/Categoria.vue"
import Inicio from "../views/Inicio.vue"
import Juego from "../views/Juego.vue"
import Niveles from "../views/Niveles.vue"
import Personajes from "../views/Personajes.vue"

const routes = [
    { path: "/", component: Inicio },
    { path: "/juego", component: Juego },
    { path: "/niveles", component: Niveles },
    { path: "/categoria", component: Categoria },
    { path: "/personajes", component: Personajes }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
