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
            <Form v-slot="{ meta }" @submit="handleCreateItem">
              <div v-for="(value, key) in row" :key="key" class="mb-3">
                <label v-if="key !== 'id'" :for="key" class="form-label text-sm text-stone-700 block capitalize">{{ key
                }}</label>
                <Field :rules="validateValue" v-if="key !== 'id'" name="key" v-model="formData[key]" type="text"
                  class="form-control my-1 bg-white w-full p-2 border border-gray-200 rounded-sm"
                  :placeholder="'Enter ' + key" />
              </div>
              <div class="text-right">
                <button :disabled="!meta.valid" type="submit"
                  class="mt-4 bg-green-500 cursor-pointer px-2 py-1 rounded-sm text-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed">
                  {{ isCreating ? 'Creating...' : 'Create Item' }}
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
import { ref, watch, defineProps, onMounted } from "vue";
import Close from "@/components/Icons/Close.vue";
import { Form, Field } from "vee-validate";

import { notify } from "@kyvg/vue3-notification";
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
      return acc;
    }, {} as Record<string, any>);
  }
});

onMounted(() => {
  formData.value = Object.keys(props.row).reduce((acc, key) => {
    return acc;
  }, {} as Record<string, any>)
});

function validateValue(value: any) {
  if (!value) {
    return 'This field is required'
  }

  return true;
}

const handleCreateItem = async () => {
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

  emits('closeCreateModal');
  isCreating.value = false;
}
</script>

<style scoped>
.modal {
  width: 40rem;
}
</style>
