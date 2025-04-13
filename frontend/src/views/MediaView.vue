<template>
  <main class="py-16">
    <h1 class="text-3xl">Media Bucket</h1>
    <p class="mt-4">Manage your images, videos and audio</p>
    <div class="flex items-center mt-8">
      <div class="select-wrapper">
        <label for="key" class="block mb-5">1. Select your store</label>
        <select name="key" v-model="selectedStore" class="bg-gray-200 px-4 py-2 rounded-md">
          <option v-for="store in stores" :key="store" :value="store" class="p-1">{{ store }}</option>
        </select>
      </div>
      <div class="media-types ml-16">
        <label for="key" class="block mb-4">2. Select your media type</label>
        <ul class="flex gap-6">
          <li @click="handleSelectMediaType(EMediaType.image)"
            :class="selectedMediaType == EMediaType.image ? 'border-blue-500' : 'border-gray-200'"
            class="px-4 py-2 border-2 bg-gray-50 cursor-pointer">Images</li>
          <li @click="handleSelectMediaType(EMediaType.video)"
            :class="selectedMediaType == EMediaType.video ? 'border-blue-500' : 'border-gray-200'"
            class="px-4 py-2 border-2 bg-gray-50 cursor-pointer">Video</li>
          <li @click="handleSelectMediaType(EMediaType.audio)"
            :class="selectedMediaType == EMediaType.audio ? 'border-blue-500' : 'border-gray-200'"
            class="px-4 py-2 border-2 bg-gray-50 cursor-pointer">Audio</li>
        </ul>
      </div>
    </div>
    <div class="flex mt-16 gap-8">
      <!-- TODO: File upload component -->
      <div class="w-1/2">
        <MediaUploader :selected-media-type="selectedMediaType" />
      </div>

      <!-- TODO: Media viewier -->
      <div class="w-1/2">
        <h1 class="text-purple-500 text-lg font-semibold">Media Viewer</h1>
        <div class="mt-4 p-8 border-1 border-gray-100 shadow rounded h-8/12 overflow-y-scroll">
          <div v-if="storeData.length > 0">
            <div v-for="item in storeData" :key="item.id"
              class="flex gap-2 items-center px-4 py-2 rounded justify-between bg-gray-200 text-sm not-[last-child]:mb-2">
              <div>
                <div @click="toggleFileDetails(item.id)" class="font-semibold cursor-pointer hover:text-blue-500">{{
                  item.name }}</div>

                <div v-if="expandedId === item.id">

                  <div class="file-details mt-2 bg-gray-700 p-2 text-white whitespace-pre-wrap">
                    {{ JSON.stringify(item, null, 2) }}
                  </div>
                  <div class="preview mt-2">
                    <img class="w-2xs" v-if="selectedMediaType === 'image'" :src="appConfigs.apiBaseUrl + item.path" :alt="item.name">

                    <video class="w-2xs" v-if="selectedMediaType === 'video'" :src="appConfigs.apiBaseUrl + item.path" :alt="item.name" />
                  </div>
                </div>

              </div>
              <div class="p-1 self-start mt-1 bg-gray-300 rounded-full text-red-500 cursor-pointer">
                <Trash />
              </div>
            </div>

          </div>
          <p v-else class="text-gray-400">
            No media found.
          </p>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useDataStore } from "@/stores/dataStore";
import { useAppStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import MediaUploader from "@/components/MediaUploader.vue";
import Trash from "@/components/Icons/Trash.vue";
import { EMediaType } from "@/stores/dataStore";

const dataStore = useDataStore();
const appStore = useAppStore();
const { selectedStore, stores, storeData, selectedMediaType } = storeToRefs(dataStore);
const { appConfigs } = storeToRefs(appStore);

const expandedId = ref<string | null>('');

onMounted(async () => {
  // Fetch all data stores
  await dataStore.fetchStores();
  // Fetch data for selected store
  await dataStore.fetchMedia(selectedStore.value, selectedMediaType.value);
})

watch(selectedStore, async (newSelectedStore) => {
  await dataStore.fetchMedia(newSelectedStore, selectedMediaType.value);
  // Set the selected store
  selectedStore.value = newSelectedStore;
})

async function handleSelectMediaType(mediaType: EMediaType) {
  selectedMediaType.value = mediaType;
  await dataStore.fetchMedia(selectedStore.value, selectedMediaType.value);
}

function toggleFileDetails(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

</script>