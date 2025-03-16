<template>
  <main class="py-16">
    <h1 class="text-3xl">Data Viewer</h1>
    <div class="my-8">
      <label for="key" class="block">Select your store key</label>
      <select name="key" v-model="selectedKey"
              class="mt-2 bg-gray-200 px-4 py-2 rounded-md">
        <option v-for="storeKey in storeKeys" :key="storeKey" :value="storeKey" class="p-1">{{ storeKey }}</option>
      </select>
    </div>
    <DataTable :table-data="storeData"/>
  </main>
</template>
<script setup lang="ts">

import {useFetch} from '@vueuse/core';
import {onMounted, ref, watch} from "vue";
import {useAppStore} from '@/stores/appStore';
import DataTable from "@/components/DataTable.vue";
import {storeToRefs} from "pinia";

const storeData = ref<Array<Record<string, any>>>([]);
const selectedKey = ref<string>('');
const storeKeys = ref<Array<string>>([]);
const baseUrl = "http://localhost:3000/store";

const appStore = useAppStore();
const {selectedStore} = storeToRefs(appStore);

onMounted(async () => {

  // Fetch store keys
  const {data: keys, error: keyError} = await useFetch<Array<string[]> | null>(`${baseUrl}/keys`).json();
  storeKeys.value = keys.value;
  selectedKey.value = keys.value[0];

  // Fetch data for the first key
  const {data, error} = await useFetch(`${baseUrl}/${selectedKey.value}`).json();
  storeData.value = data.value;

  selectedStore.value = selectedKey.value;

})

watch(selectedKey, async (newKey) => {
  const {data, error} = await useFetch(`${baseUrl}/${selectedKey.value}`).json();
  storeData.value = data.value;
})


</script>
