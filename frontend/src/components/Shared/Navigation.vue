<template>
  <div class="navigation">
    <RouterLink to="/">
      <div class="logo text-emerald-500 font-bold text-2xl">grepbase</div>
    </RouterLink>
    <div class="navigation-links-wrapper w-full flex items-center">
      <ul class="navigation-links flex items-center gap-8">
        <li>
          <RouterLink to="/" active-class="font-semibold" class="p-1">
            Store Viewer
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/edit" active-class="font-semibold" class="p-1">
            Store Editor (JSON)
          </RouterLink>
        </li>
      </ul>
      <div class="user-buttons ml-auto">
        <button v-if="user" @click="handleSignout" class="bg-blue-500 px-3 py-2 rounded text-gray-50 cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup type="ts">
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

async function handleSignout() {
  await authStore.signout();

  if (!user.value) {
    router.push('/signin');
  }
}

</script>

<style scoped>
.navigation {
  display: flex;
  gap: 8rem;
}
</style>