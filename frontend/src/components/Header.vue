<template>
  <header class="bg-white shadow-md p-4">
      <div class="navigation flex justify-between items-center gap-4">
        <Logo />

        <ul class="navigation-links flex items-center gap-8">
          <li>
            <RouterLink to="/" active-class="font-semibold" class="p-1">
              Data
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/media" active-class="font-semibold" class="p-1">
              Media
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/about" active-class="font-semibold" class="p-1">
              About
            </RouterLink>
          </li>
        </ul>

        <div class="user-buttons">
          <button v-if="user" @click="handleSignout" class="border border-gray-500 px-2 py-1 rounded text-gray-700 text-sm cursor-pointer hover:border-gray-700">
            Logout
          </button>
        </div>
      </div>

  </header>
</template>

<script setup>

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { notify } from "@kyvg/vue3-notification";
import Logo from './Logo.vue';

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

async function handleSignout() {
  await authStore.signout();

  if (!user.value) {
    router.push('/signin');

    notify({
      type: 'success',
      title: 'You are signed out'
    })
  }
}
</script>