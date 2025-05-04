<template>
  <main class="py-16">
    <CreateStoreModal @close-create-store-modal="handleCloseCreateStoreModal" :show="showCreateStoreModal" />
    <DeleteStoreModal @close-delete-store-modal="handleCloseDeleteStoreModal" :show="showDeleteStoreModal" />
    <RenameStoreModal @close-rename-store-modal="handleCloseRenameStoreModal" :show="showRenameStoreModal" />
    <h1 class="text-3xl">Data Stores</h1>
    <div class="my-8">
      <div class="my-8 flex gap-8 items-end">
        <StoreSelector />

        <div class="quick-actions flex gap-2 ml-auto">
          <button type="button" @click="handleCreateStore()"
            class="cursor-pointer px-2 py-1 border border-gray-500 hover:border-gray-700 rounded-sm text-sm text-gray-700 disabled:bg-gray-200 flex gap-1 items-center">
            Create Store</button>
          <button v-if="stores.length > 0" type="button" @click="handleDeleteStore()"
            class="cursor-pointer px-2 py-1 border border-gray-500 hover:border-gray-700 rounded-sm text-sm text-gray-700 disabled:bg-gray-200 flex gap-1 items-center">
            Delete
            Store</button>
          <button v-if="stores.length > 0" type="button" @click="handleRenameStore()"
            class="cursor-pointer px-2 py-1 border border-gray-500 hover:border-gray-700 rounded-sm text-sm text-gray-700 disabled:bg-gray-200 flex gap-1">
            Rename
            Store</button>
        </div>
      </div>
    </div>
    <DataTable v-if="storeItems.length > 0" :table-data="storeItems" />
    <div v-else>
      <div v-if="stores.length > 0" class="w-3/4 mt-4 border border-gray-100 p-4 rounded-sm shadow-sm bg-white">
        <p class="text text-gray-700 w-max">
          Create your first store item
        </p>

        <Form ref="form" v-slot="{ meta }" @submit="handleCreateInitialStoreItem" class="my-6">
          <div v-for="(pair, index) in keyValuePairs" :key="index" class="my-2 flex gap-3 items-center">
            <Field :name="`key+${index}`" v-model="pair.key" :rules="validateRequired" type="text"
              class="w-1/2 p-2 border border-gray-200 rounded-sm" placeholder="Key" required />
            <span class="text-gray-500">:</span>
            <Field :name="`value+${index}`" v-model="pair.value" :rules="validateRequired" type="text"
              class="w-1/2 p-2 border border-gray-200 rounded-sm" placeholder="Value" required />
            <button type="button" @click="removePair(index)" :disabled="keyValuePairs.length === 1"
              class="text-red-500 hover:text-red-700 cursor-pointer p-2 bg-gray-100 rounded-full disabled:cursor-not-allowed disabled:text-gray-300">
              <Trash />
            </button>
          </div>

          <button type="button" @click="addPair"
            class="mt-2 px-2 py-1 text-sm border border-gray-500 hover:border-gray-700 text-gray-700 rounded-sm cursor-pointer flex items-center">
            Add pair
          </button>

          <div class="text-right">
            <button :disabled="!meta.valid" type="submit"
              class="mt-6 bg-green-500 cursor-pointer px-2 py-1 rounded-sm text-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
              Create Item
            </button>
          </div>
        </Form>
      </div>
    </div>

  </main>
</template>
<script setup lang="ts">

import { ref } from "vue";
import { useDataStore } from '@/stores/dataStore';
import DataTable from "@/components/DataTable.vue";
import CreateStoreModal from "@/components/CreateStoreModal.vue";
import DeleteStoreModal from "@/components/DeleteStoreModal.vue";
import RenameStoreModal from "@/components/RenameStoreModal.vue";
import { storeToRefs } from "pinia";
import { Form, Field } from 'vee-validate';
import Trash from "@/components/Icons/Trash.vue";
import { validateRequired } from "@/utils/formValidations.ts";
import StoreSelector from "@/components/StoreSelector.vue";

const dataStore = useDataStore();
const { storeItems, stores } = storeToRefs(dataStore);

const showCreateStoreModal = ref<boolean>(false);
const showDeleteStoreModal = ref<boolean>(false);
const showRenameStoreModal = ref<boolean>(false);

const keyValuePairs = ref([{ key: '', value: '' }]);

dataStore.$subscribe((mutation, state) => {
  if (mutation.type === 'direct' && state.selectedStore) {
    dataStore.getStoreItems(state.selectedStore);
  }
})

async function handleCreateStore() {
  showCreateStoreModal.value = true;
}

async function handleCreateInitialStoreItem() {
  const item = keyValuePairs.value.reduce((obj: Record<string, string>, { key, value }) => {
    obj[key] = value;
    return obj;
  }, {});

  await dataStore.createStoreItem(item);
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
