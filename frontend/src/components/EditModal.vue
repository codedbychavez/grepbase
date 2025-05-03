<template>
  <div v-if="show" class="fixed bg-black/50 inset-0 flex items-center justify-center z-50">
    <div class="modal fade" id="editModal" role="dialog">
      <div class="modal-dialog bg-white border border-gray-200 p-8 rounded-lg" role="document">
        <div class="modal-content">
          <div class="modal-header flex">
            <h5 class="modal-title text-2xl ml-auto">Edit Item</h5>
            <button @click="$emit('closeEditModal')" type="button"
              class="ml-auto close p-3 bg-gray-200 cursor-pointer rounded-full" data-dismiss="modal" aria-label="Close">
              <Close />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div v-for="(value, key) in row" :key="key" class="mb-3">
                <label v-if="key !== 'id'" :for="key" class="form-label text-sm text-stone-700 block capitalize">{{ key
                }}</label>
                <input v-if="key !== 'id'" :id="key" v-model="formData[key]" type="text"
                  class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
                  :placeholder="'Enter ' + key" />
              </div>
              <div class="text-right">
                <button :disabled="isUpdating" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">
                  {{ isUpdating ? 'Update...' : 'Update' }}
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
import { ref, watch, defineProps } from "vue";
import Close from "@/components/Icons/Close.vue";

import { notify } from "@kyvg/vue3-notification";
import { useDataStore } from "@/stores/dataStore";

const dataStore = useDataStore();

const props = defineProps<{
  row: Record<string, any>;
  show: boolean;
}>();

const emits = defineEmits(['closeEditModal']);

const formData = ref({ ...props.row });
const isUpdating = ref(false);

// Watch for changes to `row` and update `formData` accordingly
watch(() => props.row, (newRow) => {
  formData.value = { ...newRow };
}, { deep: true });

const submitForm = async () => {
  isUpdating.value = true;

  const didUpdate = await dataStore.editStoreItem(formData.value);

  if (didUpdate === true) {
    notify({
      type: 'success',
      title: 'Item updated',
      text: 'Item was updated successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Update failed',
      text: 'There was an error.'
    })
  }

  emits('closeEditModal');
  isUpdating.value = false;

}
</script>

<style scoped>
.modal {
  width: 40rem;
}
</style>
