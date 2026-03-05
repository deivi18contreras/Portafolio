import { createRouter, createWebHashHistory } from "vue-router";
import inicio from "../views/inicio.vue";
import juego from "../views/juego.vue";

const routes = [
    {
        path: '/',
        component: inicio
    },
    {
        path: '/juego',
        component: juego
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})