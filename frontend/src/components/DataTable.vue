<template>
  <div class="data-table overflow-x-auto">
    <EditItemModal @close-edit-item-modal="handleCloseEditItemModal()" :show="showEditItemModal" :row="selectedRow" />
    <DeleteItemModal @close-delete-item-modal="handleCloseDeleteItemModal()" :show="showDeleteItemModal"
      :row="selectedRow" />
    <CreateItemModal @close-create-item-modal="handleCloseCreateItemModal()" :show="showCreateItemModal"
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
            <button @click="handleCreateItem(row)"
              class="cursor-pointer bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded">
              <Plus />
            </button>
            <button @click="handleEditItem(row)"
              class=" cursor-pointer bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded">
              <Pencil />
            </button>
            <button @click="handleDeleteItem(row)"
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
import EditItemModal from "@/components/EditItemModal.vue";
import DeleteItemModal from "@/components/DeleteItemModal.vue";
import CreateItemModal from "@/components/CreateItemModal.vue";
import { ref } from "vue";

defineProps<{
  tableData: Array<Record<any, any>>,
}>()

const selectedRow = ref<Record<any, any>>({});
const showEditItemModal = ref<boolean>(false);
const showDeleteItemModal = ref<boolean>(false);
const showCreateItemModal = ref<boolean>(false);

const handleCloseEditItemModal = () => showEditItemModal.value = false;
const handleCloseDeleteItemModal = () => showDeleteItemModal.value = false;
const handleCloseCreateItemModal = () => showCreateItemModal.value = false;

const handleEditItem = (row: Record<any, any>) => {
  selectedRow.value = row;
  showEditItemModal.value = true;
}

const handleDeleteItem = (row: Record<any, any>) => {
  selectedRow.value = row;
  showDeleteItemModal.value = true;
}

const handleCreateItem = (row: Record<any, any>) => {
  selectedRow.value = row;
  showCreateItemModal.value = true;
}

</script>