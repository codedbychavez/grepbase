<template>
  <div class="modal fade" id="editModal" role="dialog">
    <div class="modal-dialog border border-gray-200 p-8 max-w-2xl rounded-lg" role="document">
      <div class="modal-content">
        <div class="modal-header flex">
          <h5 class="modal-title text-2xl ml-auto">Edit Entry</h5>
          <button type="button" class="ml-auto close p-3 bg-gray-200 cursor-pointer rounded-full" data-dismiss="modal"
                  aria-label="Close">
            <Close/>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div v-for="(value, key) in row" :key="key" class="mb-3">
              <label :for="key" class="form-label text-sm text-stone-700 block capitalize">{{ key }}</label>
              <input
                  :id="key"
                  v-model="formData[key]"
                  type="text"
                  class="form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
                  :placeholder="'Enter ' + key"
              />
            </div>
            <div class="text-right">
              <button type="submit" class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps} from "vue";
import Close from "@/components/Icons/Close.vue";

const props = defineProps<{
  row: Record<string, any>;
}>();

const formData = ref({...props.row});

// Watch for changes to `row` and update `formData` accordingly
watch(() => props.row, (newRow) => {
  formData.value = {...newRow};
}, {deep: true});

const submitForm = () => {
  console.log("Updated data:", formData.value);
};
</script>
