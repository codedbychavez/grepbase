<template>
  <main class="py-16">
    <h1 class="text-3xl">Media Bucket</h1>
    <p class="mt-4">Manage your images, videos and audio</p>
    <div class="flex items-center mt-8">
      <StoreSelector />
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
          <div v-if="storeItems.length > 0">
            <div v-for="item in storeItems" :key="item.id"
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
import { onMounted, ref } from "vue";
import { useDataStore } from "@/stores/dataStore";
import { useAppStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import StoreSelector from "@/components/StoreSelector.vue";

import MediaUploader from "@/components/MediaUploader.vue";
import Trash from "@/components/Icons/Trash.vue";
import Copy from "@/components/Icons/Copy.vue";
import { EMediaType } from "@/stores/dataStore";
import { notify } from "@kyvg/vue3-notification";

const dataStore = useDataStore();
const appStore = useAppStore();
const { selectedStore, storeItems, selectedMediaType } = storeToRefs(dataStore);
const { appConfigs } = storeToRefs(appStore);

const expandedId = ref<string | null>('');

dataStore.$subscribe((mutation, state) => {
  if (mutation.type === 'direct' && state.selectedStore) {
    dataStore.getMediaItems(state.selectedStore, state.selectedMediaType);
  }
})

async function handleSelectMediaType(mediaType: EMediaType) {
  selectedMediaType.value = mediaType;
  await dataStore.getMediaItems(selectedStore.value, selectedMediaType.value);
}

function toggleFileDetails(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

async function handleDeleteMedia(mediaId: string) {
  await dataStore.deleteMediaItem(mediaId);
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