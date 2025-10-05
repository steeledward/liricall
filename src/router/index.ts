import { createRouter, createWebHistory } from 'vue-router'
import AdminLibraries from '@/components/admin/Libraries.vue'
import Referers from '@/components/admin/Referers.vue'
import Reviews from '@/components/admin/Reviews.vue'
import Index from '@/components/Index.vue'
import Libraries from '@/components/Libraries.vue'
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
    path: '/appsheet',
    name: 'Appsheet',
    component: PublicAppSheet,
  },
  {
    path: '/libraries',
    name: 'Libraries',
    component: Libraries,
  },
  {
    path: '/admin/libraries',
    name: '/Admin/Libraries',
    component: AdminLibraries,
  },
  {
    path: '/admin/referers',
    name: '/Admin/Referers',
    component: Referers,
  },
  {
    path: '/admin/reviews',
    name: '/Admin/Reviews',
    component: Reviews,
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
