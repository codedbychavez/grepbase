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
            <Form v-slot="{ meta }" @submit="handleRenameStore">
              <div class="mb-3">
                <label for="storeName" class="form-label text-sm text-stone-700 block capitalize">Store
                  Name</label>
                <Field name="storeName" v-model="newStoreName" type="text" :rules="validateRequired"
                  class="form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
                  placeholder="Enter store name" maxlength="30" />
              </div>
              <div class="text-right">
                <button :disabled="!meta.valid" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-sm text-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
                  Rename Store
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
import { ref, defineProps, watch } from "vue";
import { storeToRefs } from "pinia";
import Close from "@/components/Icons/Close.vue";
import { Form, Field } from "vee-validate";
import { validateRequired } from "@/utils/formValidations.ts";
import { useDataStore } from "@/stores/dataStore";


const dataStore = useDataStore();
const { selectedStore } = storeToRefs(dataStore);

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
  await dataStore.renameStore(selectedStore.value, newStoreName.value);
  emits('closeRenameStoreModal');
}
</script>
