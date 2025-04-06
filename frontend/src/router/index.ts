import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import { useAuthStore } from '@/stores/authStore';
import SigninView from '@/views/SigninView.vue';
import SignupView from '@/views/SignupView.vue';
import MediaView from '@/views/MediaView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/media',
      name: 'media',
      component: MediaView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninView,
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: {
        requiresAuth: false,
      }
    },
  ],
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkSession();

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      path: '/signin',
    }
  }
});

export default router
