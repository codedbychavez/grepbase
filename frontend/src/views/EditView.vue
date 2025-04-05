<template>
  <main class="py-16">
    <h1 class="text-3xl">Store Editor</h1>
    <div class="my-8 flex gap-8 items-end">
      <div class="select-wrapper">
        <label for="key" class="block">Select your store</label>
        <select name="key" v-model="selectedStore" class="mt-2 bg-gray-200 px-4 py-2 rounded-md">
          <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
        </select>
      </div>
      <div class="quick-actions flex gap-2 ml-auto">
        <button type="button" @click="handleCreateStore()"
          class="cursor-pointer bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">Create
          Store</button>
        <button type="button" @click="handleDeleteStore()"
          class="cursor-pointer px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-gray-50 disabled:bg-gray-200">Delete
          Store</button>
        <button type="button" @click="handleRenameStore()"
          class="cursor-pointer bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">Rename
          Store</button>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">

import { onMounted, watch, ref } from "vue";
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from "pinia";
import JsonEditorVue from 'json-editor-vue';
import CreateStoreModal from "@/components/CreateStoreModal.vue";
import DeleteStoreModal from "@/components/DeleteStoreModal.vue";
import RenameStoreModal from "@/components/RenameStoreModal.vue";

const dataStore = useDataStore();
const { selectedStore, storeData, stores } = storeToRefs(dataStore);
const showCreateStoreModal = ref<boolean>(false);
const showDeleteStoreModal = ref<boolean>(false);
const showRenameStoreModal = ref<boolean>(false);

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
