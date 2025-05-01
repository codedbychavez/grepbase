<template>
  <div class="data-table overflow-x-auto">
    <EditModal @close-edit-modal="handleCloseEditModal()" :show="showEditModal" :row="selectedRow" />
    <DeleteModal @close-delete-modal="handleCloseDeleteModal()" :show="showConfirmModal"
      :row="selectedRow" />
    <CreateModal @close-create-modal="handleCloseCreateModal()" :show="showCreateModal"
      :row="selectedRow" />
    <table class="min-w-full table-auto bg-white shadow-sm rounded-sm border border-gray-200">
      <thead class="bg-gray-200">
        <tr>
          <th v-for="(value, key) in tableData[0]" :key="key"
            class="px-6 py-3 text-left font-medium text-gray-900 capitalize tracking-wider">{{ key }}
          </th>
          <th class="px-6 py-3 text-left font-medium text-gray-900 capitalize tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in tableData" :key="row.id" class="transition-all hover:bg-indigo-50">
          <td v-for="(value, key) in row" :key="key" class="px-6 py-4 text-gray-700 border-t border-gray-200">{{
            value
            }}
          </td>
          <td class="flex gap-2 px-6 py-4 text-gray-700 border-t border-gray-200">
            <button @click="handleCreate(row)" class="cursor-pointer bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded">
              <Plus />
            </button>
            <button @click="handleEdit(row)"
              class=" cursor-pointer bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded">
              <Pencil />
            </button>
            <button @click="handleDelete(row)"
              class="cursor-pointer bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded">
              <Trash />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

import Trash from "@/components/Icons/Trash.vue";
import Plus from "@/components/Icons/Plus.vue";
import Pencil from "@/components/Icons/Pencil.vue";
import EditModal from "@/components/EditModal.vue";
import DeleteModal from "@/components/DeleteModal.vue";
import CreateModal from "@/components/CreateModal.vue";
import { ref } from "vue";

defineProps<{
  tableData: Array<Record<any, any>>,
}>()

const selectedRow = ref<Record<any, any>>({});
const showEditModal = ref<boolean>(false);
const showConfirmModal = ref<boolean>(false);
const showCreateModal = ref<boolean>(false);

const handleCloseEditModal = () => showEditModal.value = false;
const handleCloseDeleteModal = () => showConfirmModal.value = false;
const handleCloseCreateModal = () => showCreateModal.value = false;

const handleEdit = (row: Record<any, any>) => {
  selectedRow.value = row;
  showEditModal.value = true;
}

const handleDelete = (row: Record<any, any>) => {
  selectedRow.value = row;
  showConfirmModal.value = true;
}

const handleCreate = (row: Record<any, any>) => {
  selectedRow.value = row;
  showCreateModal.value = true;
}

</script>

<style scoped></style>