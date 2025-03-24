<template>
  <main class="py-16">
    <CreateStoreModal @close-create-store-modal="handleCloseCreateStoreModal" :show="showCreateStoreModal" />
    <DeleteStoreModal @close-delete-store-modal="handleCloseDeleteStoreModal" :show="showDeleteStoreModal" />
    <h1 class="text-3xl">Store Editor</h1>
    <div class="my-8 flex gap-8 items-end">
      <div class="select-wrapper">
        <label for="key" class="block">Select your store</label>
        <select name="key" v-model="selectedStore" class="mt-2 bg-gray-200 px-4 py-2 rounded-md">
          <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
        </select>
      </div>
      <div class="quick-actions flex gap-4">
        <button type="button" @click="handleSaveStoreData()" :disabled="isStoreModified"
          class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">Save</button>
        <button type="button" @click="handleCreateStore()"
          class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">Create
          Store</button>
        <button type="button" @click="handleDeleteStore()"
          class="mt-4 bg-red-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">Delete
          Store</button>
      </div>
    </div>

    <JsonEditorVue :stringified="false" v-model="storeData" mode="text" :main-menu-bar="false" />
  </main>
</template>
<script setup lang="ts">

import { onMounted, watch, ref, computed } from "vue";
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from "pinia";
import { notify } from "@kyvg/vue3-notification";
import JsonEditorVue from 'json-editor-vue'
import { isEqual, sortBy } from "lodash";
import CreateStoreModal from "@/components/CreateStoreModal.vue";
import DeleteStoreModal from "@/components/DeleteStoreModal.vue";

const dataStore = useDataStore();
const { selectedStore, storeData, stores } = storeToRefs(dataStore);
const originalStoreData = ref<Record<string, any>>([]);
const showCreateStoreModal = ref<boolean>(false);
const showDeleteStoreModal = ref<boolean>(false);

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
  const didUpdate = await dataStore.editStoreData(selectedStore.value, storeData.value);

  if (didUpdate === true) {
    notify({
      type: 'success',
      title: 'Store updated',
      text: 'Store was updated successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Update failed',
      text: 'There was an error.'
    })
  }
}

async function handleCreateStore() {
  showCreateStoreModal.value = true;
}

async function handleDeleteStore() {
  showDeleteStoreModal.value = true;
}

function handleCloseCreateStoreModal() {
  showCreateStoreModal.value = false;
}

function handleCloseDeleteStoreModal() {
  showDeleteStoreModal.value = false;
}

const isStoreModified = computed(() => {

    if (originalStoreData.value && storeData.value) {
      if (originalStoreData.value.length !== storeData.value.length) return false;
    }

    // Sort both arrays by 'id' before comparison
    const sortedOriginalStoreData = sortBy(originalStoreData.value, "id");
    const sortedStoreData = sortBy(storeData.value, "id");

    return isEqual(sortedOriginalStoreData, sortedStoreData);

})

</script>
