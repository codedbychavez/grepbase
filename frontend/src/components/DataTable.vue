<template>
  <div class="data-table overflow-x-auto">
    <table class="min-w-full table-auto bg-white shadow-lg rounded-lg">
      <thead class="bg-gray-200">
      <th v-for="(value, key) in tableData[0]" :key="key"
          class="px-6 py-3 text-left font-medium text-stone-800 capitalize tracking-wider">{{ key }}
      </th>
      <th class="px-6 py-3 text-left font-medium text-stone-800 capitalize tracking-wider">Actions</th>
      </thead>
      <tbody>
      <tr v-for="row in tableData" :key="row.id" class="transition-all hover:bg-indigo-50">
        <td v-for="(value, key) in row" :key="key" class="px-6 py-4 text-gray-700 border-t border-gray-200">{{
            value
          }}
        </td>
        <td class="flex gap-2 px-6 py-4 text-gray-700 border-t border-gray-200">
          <button class="bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded"><Plus /></button>
          <button class="bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded"><Pencil /></button>
          <button class="bg-gray-100 hover:bg-gray-300 text-sm px-2 py-1 rounded"><Trash /></button>
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

defineProps<{
  tableData: Array<Record<any, any>>,
}>()

</script>

<style scoped></style>