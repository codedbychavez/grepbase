import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { useFetch } from "@vueuse/core";
import { useAppStore } from "./appStore";
import { useDataStore } from "./dataStore";
import { notify } from "@kyvg/vue3-notification";

export const enum EMediaType {
  image = 'image',
  video = 'video',
  audio = 'audio',
}

export const useMediaStore = defineStore("mediaStore", () => {

  const appStore = useAppStore();
  const dataStore = useDataStore();

  const { appConfigs } = storeToRefs(appStore);
  const { selectedStore } = storeToRefs(dataStore);

  const mediaItems = ref<Array<Record<any, any>>>([]);
  const selectedMediaType = ref<EMediaType>(EMediaType.image);

  // ## MEDIA ITEM MANAGEMENT ##

  // Upload media item
  async function uploadMediaItem(file: File, mediaType: string): Promise<void> {
    const url = `${appConfigs.value.apiBaseUrl}/upload-media-item/${selectedStore.value}`
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('mediaType', mediaType);
    const { data, error } = await useFetch(url).post(formData);
    if (data.value) {
      notify({
        type: 'success',
        title: 'Media uploaded',
        text: 'Media uploaded successfully'
      })
    }
    if (error.value) {
      notify({
        type: 'success',
        title: 'Media uploaded',
        text: 'Media uploaded successfully'
      })
    }
  }

  // Get media by type
  async function getMediaItems(mediaType: string): Promise<void> {
    const url = `${appConfigs.value.apiBaseUrl}/get-media-items/${selectedStore.value}/${mediaType}`;
    const { data, error } = await useFetch(url).json();
    if (error.value) {
      return;
    } else {
      mediaItems.value = data.value;
    }
  }

  // Delete media item
  async function deleteMediaItem(mediaId: string): Promise<void> {
    const url = `${appConfigs.value.apiBaseUrl}/delete-media-item/${selectedStore.value}/${mediaId}`
    const { data, error } = await useFetch(url).delete(mediaId);
    if (data.value) {
      notify({
        type: 'success',
        title: 'Media item deleted',
        text: 'Media item was deleted successfully.'
      })
    }
    if (error.value) {
      notify({
        type: 'error',
        title: 'Delete failed',
        text: 'There was an error.'
      })
    }
    await getMediaItems(selectedMediaType.value);
  }

  return {
    mediaItems,
    uploadMediaItem, getMediaItems, selectedMediaType, deleteMediaItem
  }
})