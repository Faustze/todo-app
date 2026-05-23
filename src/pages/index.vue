<script setup lang="ts">
import TaskList from '@/components/TaskList.vue'
</script>

<template>
  <div class="flex justify-end gap-1 my-4">
    <Button variant="ghost">
      <FaIcon icon="filter" class="text-primary" />
    </Button>
    <Button variant="ghost">
      <FaIcon icon="plus" class="text-primary" />
    </Button>
  </div>
  <TaskList />
</template>

<style scoped lang="scss">

</style>
