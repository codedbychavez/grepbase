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
        <button v-if="user" @click="handleLogout" class="cursor-pointer bg-blue-500 px-3 py-2 rounded text-gray-50">Logout</button>
        <RouterLink v-else to="/auth" class="bg-blue-500 px-3 py-2 rounded text-gray-50">
          My Account
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup type="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { notify } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const { user } = storeToRefs(authStore);

async function handleLogout() {

  await authStore.signout();

  setTimeout(() => {
    if (user.value == null) {
      notify({
        type: 'success',
        title: "Signout Successful",
        text: "Welcome to grepbase"
      })
    } else {
      notify({
        type: 'error',
        title: 'Signout Failed',
        text: 'Signout failed, please try again'
      })
    }
    router.push('/auth');
  }, 2000)
}

</script>

<style scoped>
.navigation {
  display: flex;
  gap: 8rem;
}
</style>