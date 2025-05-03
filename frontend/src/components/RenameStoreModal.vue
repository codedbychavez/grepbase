<template>
  <div v-if="props.show" class="fixed bg-black/50 inset-0 flex items-center justify-center z-50">
    <div class="modal fade" id="renameStoreModal" role="dialog">
      <div class="modal-dialog bg-white border border-gray-200 p-8 rounded-lg" role="document">
        <div class="modal-content">
          <div class="modal-header flex">
            <h5 class="modal-title text-2xl ml-auto">Rename Store</h5>
            <button @click="$emit('closeRenameStoreModal')" type="button"
              class="ml-auto close p-3 bg-gray-200 cursor-pointer rounded-full" data-dismiss="modal" aria-label="Close">
              <Close />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleRenameStore">
              <div class="mb-3">
                <label for="storeName" class="form-label text-sm text-stone-700 block capitalize">Store
                  Name</label>
                <input name="storeName" v-model="newStoreName" type="text"
                  class="form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
                  placeholder="Enter store name" maxlength="30" />
              </div>
              <div class="text-right">
                <button :disabled="isRenaming" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-sm text-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
                  {{ isRenaming ? 'Renaming...' : 'Rename Store' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, reactive, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Close from "@/components/Icons/Close.vue";

import { notify } from "@kyvg/vue3-notification";
import { useDataStore } from "@/stores/dataStore";

const dataStore = useDataStore();
const { selectedStore } = storeToRefs(dataStore);
const isRenaming = ref(false);

const emits = defineEmits(['closeRenameStoreModal']);

const props = defineProps<{
  show: boolean;
}>();

const newStoreName = ref<string>(selectedStore.value);

watch(function () { return props.show }, function (show) {
  if (show) {
    newStoreName.value = selectedStore.value;
  }
})

async function handleRenameStore() {
  isRenaming.value = true;

  const didRename = await dataStore.renameStore(selectedStore.value, newStoreName.value);

  if (didRename === true) {
    notify({
      type: 'success',
      title: 'Store renamed',
      text: 'Store was renamed successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Rename failed',
      text: 'There was an error.'
    })
  }

  emits('closeRenameStoreModal');
  isRenaming.value = false;

}
</script>

<style scoped>
.modal {
  width: 40rem;
}
</style>
