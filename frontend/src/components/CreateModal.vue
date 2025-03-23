<template>
  <div v-if="show" class="fixed bg-black/50 inset-0 flex items-center justify-center z-50">
    <div class="modal fade" id="createModal" role="dialog">
      <div class="modal-dialog bg-white border border-gray-200 p-8 rounded-lg" role="document">
        <div class="modal-content">
          <div class="modal-header flex">
            <h5 class="modal-title text-2xl ml-auto">Create Item</h5>
            <button @click="$emit('closeCreateModal')" type="button"
              class="ml-auto close p-3 bg-gray-200 cursor-pointer rounded-full" data-dismiss="modal" aria-label="Close">
              <Close />
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div v-for="(value, key) in row" :key="key" class="mb-3">
                <label :for="key" class="form-label text-sm text-stone-700 block capitalize">{{ key
                }}</label>
                <input :id="key" v-model="formData[key]" type="text"
                  class="disabled:bg-gray-200 disabled:cursor-not-allowed form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-md"
                  :placeholder="'Enter ' + key" :disabled="key == 'id'" />
              </div>
              <div class="text-right">
                <button :disabled="isCreating" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-md text-gray-50 disabled:bg-gray-200">
                  {{ isCreating ? 'Creating...' : 'Create Item' }}
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
import { ref, watch, defineProps, onMounted } from "vue";
import Close from "@/components/Icons/Close.vue";

import { notify } from "@kyvg/vue3-notification";
import { v4 as uuid } from "uuid";
import { useDataStore } from "@/stores/dataStore";

const dataStore = useDataStore();

const props = defineProps<{
  row: Record<string, any>;
  show: boolean;
}>();

const emits = defineEmits(['closeCreateModal']);

const formData = ref<Record<string, any>>({});
const isCreating = ref(false);

watch(() => props.show, (newVal) => {
  if (newVal) {
    formData.value = Object.keys(props.row).reduce((acc, key) => {
      acc[key] = key === "id" ? uuid() : "";
      return acc;
    }, {} as Record<string, any>);
  }
});

onMounted(() => {
  formData.value = Object.keys(props.row).reduce((acc, key) => {
    acc[key] = key === "id" ? uuid() : "";
    return acc;
  }, {} as Record<string, any>)
});

const submitForm = async () => {
  isCreating.value = true;
  const data = { ...formData.value }

  const didCreate = await dataStore.createStoreItem(data);

  if (didCreate === true) {
    notify({
      type: 'success',
      title: 'Item created',
      text: 'Item was created successfully.'
    })
  } else {
    notify({
      type: 'error',
      title: 'Create failed',
      text: 'There was an error.'
    })
  }

  setTimeout(() => {
    emits('closeCreateModal');
    isCreating.value = false;
  }, 2000)

}
</script>

<style scoped>
.modal {
  width: 40rem;
}
</style>
