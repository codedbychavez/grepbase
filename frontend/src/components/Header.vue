<template>
  <header class="bg-white shadow-md p-4">
    <div class="container">
      <div class="navigation flex gap-8">
        <Logo />
        <div class="navigation-links-wrapper w-full flex items-center">
          <ul class="navigation-links flex items-center gap-8">
            <li>
              <RouterLink to="/" active-class="font-semibold" class="p-1">
                Dashboard
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/media" active-class="font-semibold" class="p-1">
                Media Bucket
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" active-class="font-semibold" class="p-1">
                About
              </RouterLink>
            </li>
          </ul>
          <div class="user-buttons ml-auto">
            <button v-if="user" @click="handleSignout"
              class="bg-blue-500 px-3 py-2 rounded text-gray-50 cursor-pointer">
              Logout
            </button>
          </div>
        </div>
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