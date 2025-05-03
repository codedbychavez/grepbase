<template>
  <div v-if="props.show" class="fixed bg-black/50 inset-0 flex items-center justify-center z-50">
    <div class="modal fade" id="deleteStoreModal" role="dialog">
      <div class="modal-dialog bg-white border border-gray-200 p-8 rounded-lg" role="document">
        <div class="modal-content">
          <div class="modal-header flex">
            <h5 class="modal-title text-2xl ml-auto">Delete Store</h5>
            <button @click="$emit('closeDeleteStoreModal')" type="button"
              class="ml-auto close p-3 bg-gray-200 cursor-pointer rounded-full" data-dismiss="modal" aria-label="Close">
              <Close />
            </button>
          </div>
          <div class="modal-body">
            <Form v-slot="{ meta }" @submit="handleDeleteStore">
              <div class="mb-3">
                <label for="storeName" class="form-label text-sm text-stone-700 block capitalize">Store
                  Name</label>
                <Field name="storeName" :value="selectedStore" :rules="validateName" type="text"
                  class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
                  disabled readonly />
              </div>
              <div class="text-right">
                <button :disabled="!meta.valid" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-sm text-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
                  {{ isDeleting ? 'Deleting...' : 'Delete Store' }}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import Close from "@/components/Icons/Close.vue";
import { Form, Field } from "vee-validate";

import { notify } from "@kyvg/vue3-notification";
import { useDataStore } from "@/stores/dataStore";
import { storeToRefs } from "pinia";

const dataStore = useDataStore();

const { selectedStore } = storeToRefs(dataStore);

const props = defineProps<{
  show: boolean;
}>();

const emits = defineEmits(['closeDeleteStoreModal']);
const isDeleting = ref(false);

function validateName(value: any) {
  if (!value) {
    return 'This field is required'
  }

  return true;
}

const handleDeleteStore = async () => {
  isDeleting.value = true;

  const didDelete = await dataStore.deleteStore(selectedStore.value);

  if (didDelete === true) {
    notify({
      type: 'success',
      title: 'Store delete',
      text: 'Store was deleted successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Delete failed',
      text: 'There was an error.'
    })
  }

  emits('closeDeleteStoreModal');
  isDeleting.value = false;

}
</script>

<style scoped>
.modal {
  width: 40rem;
}
</style>
