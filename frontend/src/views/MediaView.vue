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
          <li @click="handleSelectMediaType(EMediaType.image)" :class=" selectedMediaType == EMediaType.image ? 'border-blue-500' : 'border-gray-200'"
            class="px-4 py-2 border-2 bg-gray-50 cursor-pointer">Images</li>
          <li @click="handleSelectMediaType(EMediaType.video)" :class=" selectedMediaType == EMediaType.video ? 'border-blue-500' : 'border-gray-200'"
            class="px-4 py-2 border-2 bg-gray-50 cursor-pointer">Video</li>
          <li @click="handleSelectMediaType(EMediaType.audio)" :class=" selectedMediaType == EMediaType.audio ? 'border-blue-500' : 'border-gray-200'"
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
      <div class="w-1/2 bg-gray-200 p-8">
        <pre>
          {{ storeData }}
        </pre>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { useDataStore } from "@/stores/dataStore";
import { storeToRefs } from "pinia";
import MediaUploader from "@/components/MediaUploader.vue";

const dataStore = useDataStore();
const { selectedStore, stores, storeData } = storeToRefs(dataStore);

const enum EMediaType {
  image = 'image',
  video = 'video',
  audio = 'audio',
}

const selectedMediaType = ref<EMediaType>(EMediaType.image);

function handleSelectMediaType(mediaType: EMediaType) {
  selectedMediaType.value = mediaType;
}


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

</script>