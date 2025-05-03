<template>
  <main class="py-16">
    <h1 class="text-3xl">Media Bucket</h1>
    <p class="mt-4">Manage your images, videos and audio</p>
    <div class="flex items-center mt-8">
      <div class="select-wrapper">
        <label for="key" class="block mb-5">1. Select your store</label>
        <select name="key" v-model="selectedStore" class="bg-gray-200 px-4 py-2 rounded-sm">
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
      <div class="w-1/2 bg-white p-4 rounded-sm">
        <MediaUploader :selected-media-type="selectedMediaType" />
      </div>
      <div class="w-1/2 bg-white p-4 rounded-sm">
        <h1 class="text-purple-500 text-lg font-semibold">Media Viewer</h1>
        <div class="mt-4 p-8 border-1 border-gray-100 shadow rounded h-8/12 overflow-auto">
          <div v-if="storeData.length > 0">
            <div v-for="item in storeData" :key="item.id"
              class="flex items-center gap-2 justify-between px-4 py-2 rounded border border-gray-200 text-sm not-[last-child]:mb-2">
              <div>
                <div @click="toggleFileDetails(item.id)"
                  class="font-semibold cursor-pointer text-blue-500 underline underline-offset-4">{{
                    item.name }}</div>

                <div v-if="expandedId === item.id">

                  <div class="file-details mt-2 bg-gray-700 p-2 text-white whitespace-pre-wrap">
                    {{ JSON.stringify(item, null, 2) }}
                  </div>
                  <div class="preview mt-2">
                    <img class="w-2xs" v-if="selectedMediaType === 'image'" :src="appConfigs.apiBaseUrl + item.path"
                      :alt="item.name">

                    <video controls class="w-2xs" v-if="selectedMediaType === 'video'"
                      :src="appConfigs.apiBaseUrl + item.path" :alt="item.name" />

                    <audio controls class="w-2xs" v-if="selectedMediaType === 'audio'"
                      :src="appConfigs.apiBaseUrl + item.path" :alt="item.name" />
                  </div>
                </div>

              </div>
              <div class="flex gap-2 self-start">
                <button @click="handleCopyToClipboard(`${appConfigs.apiBaseUrl}${item.path}`)"
                  class="p-2 mt-1 bg-gray-200 rounded-full text-blue-500 cursor-pointer">
                  <Copy />
                </button>
                <button @click="handleDeleteMedia(item.id)"
                  class="p-2 mt-1 bg-gray-200 rounded-full text-red-500 cursor-pointer">
                  <Trash />
                </button>
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
import Copy from "@/components/Icons/Copy.vue";
import { EMediaType } from "@/stores/dataStore";
import { notify } from "@kyvg/vue3-notification";

const dataStore = useDataStore();
const appStore = useAppStore();
const { selectedStore, stores, storeData, selectedMediaType } = storeToRefs(dataStore);
const { appConfigs } = storeToRefs(appStore);

const expandedId = ref<string | null>('');

onMounted(async () => {
  await dataStore.getStores();
  await dataStore.getMediaItems(selectedStore.value, selectedMediaType.value);
})

watch(selectedStore, async (newSelectedStore) => {
  await dataStore.getMediaItems(newSelectedStore, selectedMediaType.value);
  // Set the selected store
  selectedStore.value = newSelectedStore;
})

async function handleSelectMediaType(mediaType: EMediaType) {
  selectedMediaType.value = mediaType;
  await dataStore.getMediaItems(selectedStore.value, selectedMediaType.value);
}

function toggleFileDetails(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

async function handleDeleteMedia(mediaId: string) {
  const didDelete = await dataStore.deleteMediaItem(mediaId);

  if (didDelete === true) {
    notify({
      type: 'success',
      title: 'Media item deleted',
      text: 'Media item was deleted successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Delete failed',
      text: 'There was an error.'
    })
  }
}

function handleCopyToClipboard(path: string) {
  navigator.clipboard.writeText(path).then(() => {
    notify({
      type: 'success',
      title: 'Copied media path to clipboard'
    })
  })
}

</script>