<template>
  <notifications position="bottom right" />
  <header class="bg-white shadow-md p-4">
    <div class="container">
      <Navigation />
    </div>
  </header>

  <div class="container p-4">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/Shared/Navigation.vue";
import { Notifications } from "@kyvg/vue3-notification";
</script>

<style scoped>
.container {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
