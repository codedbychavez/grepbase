<template>
  <div class="modal fade" id="editModal" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header"></div>
        <div class="modal-body">
          {{ row }}
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  row: Record<any, any>,
}>();

</script>