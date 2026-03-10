import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  // 1. RUTAS PÚBLICAS O DE USUARIO NORMAL
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("../views/loginUsers.vue") },
      { path: "crear-user", component: () => import("../views/crearUser.vue") },
      { path: "seccionUser", component: () => import("../views/user/seccionUser.vue") }
      // ❌ Eliminé "seccionAdmin" de aquí. Ya no es hijo de MainLayout.
    ]
  },

  // 2. RUTAS DE ADMINISTRADOR (Aquí seccionAdmin.vue es el Layout principal)
  {
    path: "/admin",
    component: () => import("../views/admin/seccionAdmin.vue"),
    children: [
      {
        path: "", // Carga en /admin
        component: () => import("../views/admin/AdminDashboard.vue")
      },
      {
        path: "usuarios", // Carga en /admin/usuarios
        component: () => import("../views/admin/UsuariosPage.vue")
      },
      {
        path: "pagos", // Carga en /admin/pagos
        component: () => import("../views/admin/PagosPage.vue")
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})