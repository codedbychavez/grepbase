import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import EditView from '@/views/EditView.vue';
import AuthView from '@/views/AuthView.vue';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/edit',
      name: 'edit',
      component: EditView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
        const isAuthenticated = await authStore.checkSession();


  if (to.name !== 'auth' && !isAuthenticated) next({ name: 'auth' })
  else next()
})

export default router
