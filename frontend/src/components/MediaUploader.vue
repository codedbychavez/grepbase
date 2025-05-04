<template>
  <div class="media-uploader">
    <form ref="theForm" @submit.prevent="handleUploadMedia" enctype="multipart/form-data">
      <input @change="handleFileInputChange" :accept="acceptFiles" ref="theFile" type="file" name="fileInput"
        id="fileInput" multiple="false" required class="border border-green-500 border-dashed p-8 cursor-pointer" />
      <button :disabled="!canUpload" type="submit"
        class="mt-4 px-2 py-1 bg-green-500 text-gray-50 rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400">Upload</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, ref, computed, watch } from 'vue';
import { useMediaStore } from '@/stores/mediaStore';
import { storeToRefs } from 'pinia';
import { EMediaType } from '@/stores/mediaStore';

const mediaStore = useMediaStore();

const theFile = useTemplateRef<HTMLInputElement>('theFile');
const theForm = useTemplateRef<HTMLFormElement>('theForm');
const canUpload = ref<boolean>(false);

const props = defineProps<{
  selectedMediaType: string,
}>()

watch(function () { return props.selectedMediaType }, function (newValue) {
  theForm.value?.reset();
})

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

function handleFileInputChange() {
  if (theFile.value?.files) {
    if (theFile.value?.files?.length > 0) {
      canUpload.value = true;
    }
  } else {
    canUpload.value = false;
  }
}

async function handleUploadMedia() {
  if (theFile.value?.files) {
    const file = theFile.value?.files[0];
    if (file) {
      await mediaStore.uploadMediaItem(file, props.selectedMediaType);
    }
    else return;
  }
  await mediaStore.getMediaItems(props.selectedMediaType);
}

</script>

<style>
#fileInput {
  width: 100%;
  height: 320px;
}
</style>