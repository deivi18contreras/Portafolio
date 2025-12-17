import { createRouter, createWebHashHistory } from "vue-router";                    // LOGIN / REGISTRO
import asistencia from "../components/Asistencia.vue";   // ASISTENCIA
import login from "../components/Login.vue"
const routes = [
  { path: "/", component: login },
  { path: "/asistencia", component: asistencia }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
