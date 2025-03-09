<template>
    <header class="bg-emerald-500">
      <div class="container">
      <Navigation/>
      </div>
    </header>

  <div class="container">
    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/Shared/Navigation.vue";
</script>

<style scoped>

.container {
  max-width: 1440px;
  margin: 0 auto;
}

</style>
