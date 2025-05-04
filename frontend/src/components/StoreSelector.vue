<template>
  <div class="select-wrapper">
    <label for="key" class="block mb-5">1. Select your store</label>
    <select name="key" v-model="selectedStore" class="bg-gray-200 px-4 py-2 rounded-sm">
      <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
    </select>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { useDataStore } from "@/stores/dataStore";
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();

const { selectedStore, stores } = storeToRefs(dataStore);

onMounted(async () => {
  await dataStore.getStores();
})

watch(() => selectedStore.value, async (newSelectedStore) => {
  if (selectedStore.value) {
    selectedStore.value = newSelectedStore;
  }
})

</script>