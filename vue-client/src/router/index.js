import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/HomePage.vue'
import WorkersPage from '../pages/WorkersPage.vue'
import WorkerDetailPage from '../pages/WorkerDetailPage.vue'
import AdminLogin from '../pages/admin/AdminLogin.vue'
import AdminWorkers from '../pages/admin/AdminWorkers.vue'
import AdminBookings from '../pages/admin/AdminBookings.vue'
import AdminAnalytics from '../pages/admin/AdminAnalytics.vue'

function isAdmin() {
  return !!localStorage.getItem('joy_admin_token')
}

const routes = [
  { path: '/', component: HomePage },
  { path: '/workers', component: WorkersPage },
  { path: '/workers/:id', component: WorkerDetailPage },
  { path: '/admin/login', component: AdminLogin },
  {
    path: '/admin/workers',
    component: AdminWorkers,
    beforeEnter: (to, from, next) => isAdmin() ? next() : next('/admin/login')
  },
  {
    path: '/admin/bookings',
    component: AdminBookings,
    beforeEnter: (to, from, next) => isAdmin() ? next() : next('/admin/login')
  },
  {
    path: '/admin/analytics',
    component: AdminAnalytics,
    beforeEnter: (to, from, next) => isAdmin() ? next() : next('/admin/login')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
