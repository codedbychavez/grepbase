<template>
  <main class="py-16">
    <h1 class="text-3xl">Store Editor</h1>
    <div class="my-8 flex gap-8 items-end">
      <div class="select-wrapper">
        <label for="key" class="block">Select your store key</label>
        <select name="key" v-model="selectedStore" class="mt-2 bg-gray-200 px-4 py-2 rounded-md">
          <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
        </select>
      </div>
      <div class="quick-actions">
        <button type="button" @click="handleSaveStoreData()" :disabled="!isStoreModified"
          class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">Save</button>
      </div>
    </div>

    <JsonEditorVue v-model="storeData" />
  </main>
</template>
<script setup lang="ts">

import { onMounted, watch, ref, computed } from "vue";
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from "pinia";
import JsonEditorVue from 'json-editor-vue'
import { isEqual, sortBy } from "lodash";

const dataStore = useDataStore();
const { selectedStore, storeData, stores } = storeToRefs(dataStore);
const originalStoreData = ref<Record<string, any>>([]);

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

  originalStoreData.value = storeData.value;
})

async function handleSaveStoreData() {
  originalStoreData.value = storeData.value;

  
}

const isStoreModified = computed(() => {
  if (originalStoreData.value.length !== storeData.value.length) return true;

  // Sort both arrays by 'id' before comparison
  const sortedOriginalStoreData = sortBy(originalStoreData.value, "id");
  const sortedStoreData = sortBy(storeData.value, "id");

  return !isEqual(sortedOriginalStoreData, sortedStoreData);
})

</script>
