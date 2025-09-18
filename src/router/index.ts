import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Index.vue'
import Payment from '@/components/Payment.vue'
import PublicAppSheet from '@/components/PublicAppSheet.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment,
  },
  {
    path: '/libraries',
    name: 'Libraries',
    component: PublicAppSheet,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
