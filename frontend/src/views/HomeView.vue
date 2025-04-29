<template>
  <main class="py-16">
    <CreateStoreModal @close-create-store-modal="handleCloseCreateStoreModal" :show="showCreateStoreModal" />
    <DeleteStoreModal @close-delete-store-modal="handleCloseDeleteStoreModal" :show="showDeleteStoreModal" />
    <RenameStoreModal @close-rename-store-modal="handleCloseRenameStoreModal" :show="showRenameStoreModal" />
    <h1 class="text-3xl">Your Data</h1>
    <div class="my-8">
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
    </div>
    <DataTable v-if="storeData.length > 0" :table-data="storeData" />
    <div v-else class="w-3/4 mt-4 border border-gray-100 p-4 rounded-sm shadow-sm">
      <p class="text-sm text-red-500 w-max">
        No store data. Create your first store item below.
      </p>

      <h5 class="modal-title text-2xl mt-4">Create Store Item</h5>
      <form @submit.prevent="handleCreateInitialStoreItem" class="my-6">
        <label class="form-label text-sm text-stone-700 block capitalize">Define your first
          item</label>
        <div v-for="(pair, index) in keyValuePairs" :key="index" class="my-2 flex gap-3 items-center">
          <input v-model="pair.key" type="text" class="w-1/2 p-2 border border-gray-200 rounded-md" placeholder="Key"
            required />
          <span class="text-gray-500">:</span>
          <input v-model="pair.value" type="text" class="w-1/2 p-2 border border-gray-200 rounded-md"
            placeholder="Value" required />
          <button type="button" @click="removePair(index)"
            class="text-red-500 hover:text-red-700 cursor-pointer p-2 bg-gray-100 rounded-full" title="Remove">
            <Close />
          </button>
        </div>

        <button type="button" @click="addPair"
          class="mt-1 px-2 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer">
          Add Pair
        </button>

        <div class="text-right">
          <button :disabled="isCreating" type="submit"
            class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">
            {{ isCreating ? 'Creating...' : 'Create Initial Item' }}
          </button>
        </div>
      </form>
    </div>

  </main>
</template>
<script setup lang="ts">

import { onMounted, watch, ref } from "vue";
import { useDataStore } from '@/stores/dataStore';
import DataTable from "@/components/DataTable.vue";
import CreateStoreModal from "@/components/CreateStoreModal.vue";
import DeleteStoreModal from "@/components/DeleteStoreModal.vue";
import RenameStoreModal from "@/components/RenameStoreModal.vue";
import Close from "@/components/Icons/Close.vue";
import { storeToRefs } from "pinia";
import { notify } from "@kyvg/vue3-notification";

const dataStore = useDataStore();
const { selectedStore, storeData, stores } = storeToRefs(dataStore);

const showCreateStoreModal = ref<boolean>(false);
const showDeleteStoreModal = ref<boolean>(false);
const showRenameStoreModal = ref<boolean>(false);

const isCreating = ref<boolean>(false);

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

async function handleCreateStore() {
  showCreateStoreModal.value = true;
}

async function handleCreateInitialStoreItem() {
  isCreating.value = true;
  const keyValueObject = keyValuePairs.value.reduce((obj: Record<string, string>, { key, value }) => {
    obj[key] = value;
    return obj;
  }, {});

  const data = {
    item: keyValueObject
  }

  const didCreate = await dataStore.createInitialStoreItem(data);

  if (didCreate === true) {
    notify({
      type: 'success',
      title: 'Store created',
      text: 'Store was created successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Create failed',
      text: 'There was an error.'
    })
  }

  isCreating.value = false;

}



const keyValuePairs = ref([{ key: '', value: '' }]);

function addPair() {
  keyValuePairs.value.push({ key: '', value: '' });
}

function removePair(index: number) {
  keyValuePairs.value.splice(index, 1);
}

async function handleDeleteStore() {
  showDeleteStoreModal.value = true;
}

async function handleRenameStore() {
  showRenameStoreModal.value = true;
}

function handleCloseCreateStoreModal() {
  showCreateStoreModal.value = false;
}

function handleCloseDeleteStoreModal() {
  showDeleteStoreModal.value = false;
}

function handleCloseRenameStoreModal() {
  showRenameStoreModal.value = false;
}


</script>
