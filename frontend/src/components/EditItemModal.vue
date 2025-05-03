<template>
  <div v-if="show" class="fixed bg-black/50 inset-0 flex items-center justify-center z-50">
    <div class="modal fade" id="editModal" role="dialog">
      <div class="modal-dialog bg-white border border-gray-200 p-8 rounded-lg" role="document">
        <div class="modal-content">
          <div class="modal-header flex">
            <h5 class="modal-title text-2xl ml-auto">Edit Item</h5>
            <button @click="$emit('closeEditItemModal')" type="button"
              class="ml-auto close p-3 bg-gray-200 cursor-pointer rounded-full" data-dismiss="modal" aria-label="Close">
              <Close />
            </button>
          </div>
          <div class="modal-body">
            <Form v-slot="{ meta }" @submit="handleEditItem">
              <div v-for="(value, key) in row" :key="key" class="mb-3">
                <label v-if="key !== 'id'" :for="key" class="form-label text-sm text-stone-700 block capitalize">{{ key
                  }}</label>
                <Field v-if="key !== 'id'" :id="key" :name="key" v-model="formData[key]" :rules="validateRequired"
                  type="text"
                  class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
                  :placeholder="'Enter ' + key" />
              </div>
              <div class="text-right">
                <button :disabled="!meta.valid" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-sm text-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
                  Update
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
import { ref, watch, defineProps } from "vue";
import Close from "@/components/Icons/Close.vue";
import { Form, Field } from "vee-validate";

import { useDataStore } from "@/stores/dataStore";
import { validateRequired } from "@/utils/formValidations.ts";

const dataStore = useDataStore();

const props = defineProps<{
  row: Record<string, any>;
  show: boolean;
}>();

const emits = defineEmits(['closeEditItemModal']);

const formData = ref({ ...props.row });

// Watch for changes to `row` and update `formData` accordingly
watch(() => props.row, (newRow) => {
  formData.value = { ...newRow };
}, { deep: true });

const handleEditItem = async () => {
  await dataStore.editStoreItem(formData.value);
  emits('closeEditItemModal');
}
</script>
