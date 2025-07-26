import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/LibrosView.vue') },
  { path: '/autores', component: () => import('../views/AutoresView.vue') },
  { path: '/categorias', component: () => import('../views/CategoriasView.vue') },
  { path: '/usuarios', component: () => import('../views/UsuariosView.vue') },
  { path: '/prestamos', component: () => import('../views/PrestamosView.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
