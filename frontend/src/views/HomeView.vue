<template>
  <main class="py-16">
    <CreateStoreModal @close-create-store-modal="handleCloseCreateStoreModal" :show="showCreateStoreModal" />
    <DeleteStoreModal @close-delete-store-modal="handleCloseDeleteStoreModal" :show="showDeleteStoreModal" />
    <RenameStoreModal @close-rename-store-modal="handleCloseRenameStoreModal" :show="showRenameStoreModal" />
    <h1 class="text-3xl">Data Stores</h1>
    <div class="my-8">
      <div class="my-8 flex gap-8 items-end">
        <div v-if="stores.length > 0" class="select-wrapper">
          <label for="key" class="block">Select your store</label>
          <select name="key" v-model="selectedStore" class="mt-2 bg-gray-200 px-4 py-2 rounded-md">
            <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
          </select>
        </div>

        <div class="quick-actions flex gap-2 ml-auto">
          <button type="button" @click="handleCreateStore()"
            class="cursor-pointer bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200 flex gap-1 items-center">
            Create Store</button>
          <button v-if="stores.length > 0" type="button" @click="handleDeleteStore()"
            class="cursor-pointer px-2 py-1 bg-rose-500 hover:bg-rose-600 rounded-md text-gray-50 disabled:bg-gray-200 flex gap-1 items-center">
            Delete
            Store</button>
          <button v-if="stores.length > 0" type="button" @click="handleRenameStore()"
            class="cursor-pointer bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200 flex gap-1">
            Rename
            Store</button>
        </div>
      </div>
    </div>
    <DataTable v-if="storeData.length > 0" :table-data="storeData" />
    <div v-else>
      <div v-if="stores.length > 0" class="w-3/4 mt-4 border border-gray-100 p-4 rounded-sm shadow-sm bg-white">
        <p class="text-sm text-gray-500 w-max">
          No store data. Create your first store item below.
        </p>

        <h5 class="modal-title text-2xl mt-4">Create Item</h5>
        <Form ref="form" v-slot="{ meta }" @submit="handleCreateInitialStoreItem" class="my-6">
          <div v-for="(pair, index) in keyValuePairs" :key="index" class="my-2 flex gap-3 items-center">
            <Field :name="`key+${index}`" v-model="pair.key" :rules="validateKeyValue" type="text"
              class="w-1/2 p-2 border border-gray-200 rounded-md" placeholder="Key" required />
            <span class="text-gray-500">:</span>
            <Field :name="`value+${index}`" v-model="pair.value" :rules="validateKeyValue" type="text"
              class="w-1/2 p-2 border border-gray-200 rounded-md" placeholder="Value" required />
            <button type="button" @click="removePair(index)" :disabled="keyValuePairs.length === 1"
              class="text-red-500 hover:text-red-700 cursor-pointer p-2 bg-gray-100 rounded-full disabled:cursor-not-allowed disabled:text-gray-300">
              <Trash />
            </button>
          </div>

          <button type="button" @click="addPair"
            class="mt-1 px-2 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer flex items-center">
            <Plus />
          </button>

          <div class="text-right">
            <button :disabled="!meta.valid" type="submit"
              class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">
              {{ isCreating ? 'Creating...' : 'Create Initial Item' }}
            </button>
          </div>
        </Form>
      </div>
    </div>

  </main>
</template>
<script setup lang="ts">

import { onMounted, watch, ref, useTemplateRef } from "vue";
import { useDataStore } from '@/stores/dataStore';
import DataTable from "@/components/DataTable.vue";
import CreateStoreModal from "@/components/CreateStoreModal.vue";
import DeleteStoreModal from "@/components/DeleteStoreModal.vue";
import RenameStoreModal from "@/components/RenameStoreModal.vue";
import { storeToRefs } from "pinia";
import { notify } from "@kyvg/vue3-notification";
import { Form, Field } from 'vee-validate';
import Plus from "@/components/Icons/Plus.vue";
import Trash from "@/components/Icons/Trash.vue";

const dataStore = useDataStore();
const { selectedStore, storeData, stores } = storeToRefs(dataStore);

const showCreateStoreModal = ref<boolean>(false);
const showDeleteStoreModal = ref<boolean>(false);
const showRenameStoreModal = ref<boolean>(false);

const isCreating = ref<boolean>(false);

const keyValuePairs = ref([{ key: '', value: '' }]);

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

function validateKeyValue(value: any) {
  if (!value) {
    return 'This field is required'
  }

  return true;
}

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
  keyValuePairs.value = [{ key: '', value: '' }];

}

function addPair() {
  keyValuePairs.value.push({ key: '', value: '' });
}

function removePair(index: number) {
  if (keyValuePairs.value.length === 1) {
    return;
  }
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
