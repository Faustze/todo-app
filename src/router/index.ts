import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/index.vue') },
  { path: '/task/:id', component: () => import('@/pages/tasks/[id].vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
