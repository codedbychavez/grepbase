<template>
  <div class="app-container h-full flex flex-col bg-gray-50">
    <notifications position="bottom right" />
    <Header v-if="user" />
    <div class="container h-full p-4">
      <RouterView />
    </div>
  </div>

</template>

<script setup>

import { storeToRefs } from 'pinia';

import Header from './components/Header.vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);


</script>

<style scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
}


</style>
