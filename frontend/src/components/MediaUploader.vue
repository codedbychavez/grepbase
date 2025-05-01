<template>
  <div class="media-uploader">
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <input @change="handleFileInputChange" :accept="acceptFiles" ref="theFile" type="file" name="fileInput" id="fileInput" multiple="false"
        class="border border-green-500 border-dashed p-8 cursor-pointer" />
      <button :disabled="!canUpload" type="submit"
        class="mt-4 px-2 py-1 bg-green-500 text-gray-50 rounded cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400">Upload</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from 'pinia';
import { notify } from '@kyvg/vue3-notification';
import { EMediaType } from '@/stores/dataStore';

const dataStore = useDataStore();

const { selectedStore, selectedMediaType } = storeToRefs(dataStore);

const props = defineProps<{
  selectedMediaType: string,
}>()

const acceptFiles = computed(() => {
  switch (props.selectedMediaType) {
    case EMediaType.image:
      return 'image/png, image/jpeg';
  
    case (EMediaType.video):
      return 'video/mp4';

    case (EMediaType.audio):
      return 'audio/mp3';

    default:
      break;
  }
})

const theFile = useTemplateRef('theFile');
const isUploading = ref<boolean>(false);
const canUpload = ref<boolean>(false);

function handleFileInputChange() {
  if (theFile.value?.files) {
    if (theFile.value?.files?.length > 0) {
      canUpload.value = true;
    }
  } else {
    canUpload.value = false;
  }
}

async function handleSubmit() {
  isUploading.value = true;
  if (theFile.value?.files) {
    const file = theFile.value?.files[0];
    if (file) {
      const isUploaded = await dataStore.uploadMedia(selectedStore.value, file, props.selectedMediaType);

      if (isUploaded) {
        notify({
          type: 'success',
          title: 'Media uploaded',
          text: 'Media uploaded successfully'
        })
        isUploading.value = false;
      } else {
        notify({
          type: 'success',
          title: 'Media uploaded',
          text: 'Media uploaded successfully'
        })
        isUploading.value = false;
      }
    }
    else return;
  }
  await dataStore.fetchMedia(selectedStore.value, selectedMediaType.value);
}

</script>

<style>
#fileInput {
  width: 100%;
  height: 320px;
}
</style>