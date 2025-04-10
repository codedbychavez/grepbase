<template>
  <div class="media-uploader">
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <input accept="image/png, image/jpeg" ref="theFile" type="file" name="fileInput" id="fileInput"
        class="border border-green-500 border-dashed p-8" />
      <button :disabled="canUpload" type="submit"
        class="mt-4 px-2 py-1 bg-green-500 text-gray-50 rounded">Upload</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();

const { selectedStore } = storeToRefs(dataStore);

const props = defineProps<{
  selectedMediaType: string,
}>()

const theFile = useTemplateRef('theFile');

const canUpload = computed((): boolean => {
  if (theFile.value?.files) {
    return theFile.value?.files?.length > 0;
  }
  return false;
})

function handleSubmit() {
  if (theFile.value?.files) {
    const file = theFile.value?.files[0];
    dataStore.uploadMedia(selectedStore.value, file);
  }
}

</script>

<style>
#fileInput {
  width: 100%;
  height: 320px;
}
</style>