<template>
  <main class="py-16">
    <h1 class="text-3xl">Store Editor</h1>
    <div class="my-8">
      <label for="key" class="block">Select your store key</label>
      <select name="key" v-model="selectedStore" class="mt-2 bg-gray-200 px-4 py-2 rounded-md">
        <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
      </select>
    </div>
    <pre>
      <JsonEditorVue v-model="storeData" />
    </pre>
  </main>
</template>
<script setup lang="ts">

import { onMounted, watch } from "vue";
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from "pinia";
import JsonEditorVue from 'json-editor-vue'

const dataStore = useDataStore();
const { selectedStore, storeData, stores } = storeToRefs(dataStore);

onMounted(async () => {
  // Fetch all data stores
  await dataStore.fetchStores();
  // Fetch data for selected store
  await dataStore.fetchStoreData(selectedStore.value);
})

watch(selectedStore, async (newSelectedStore) => {
  await dataStore.fetchStoreData(newSelectedStore);
  // Set the selected store
  selectedStore.value = newSelectedStore;
})


</script>
