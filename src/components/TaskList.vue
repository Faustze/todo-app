<script setup lang="ts">
import TaskItem from '@/components/TaskItem.vue'
import { tasks } from '@/constants/tasks'
</script>

<template>
  <div class="flex flex-col gap-2">
    <TaskItem
      v-for="(task, index) in tasks" :key="task.id" :task="task" :number="index + 1"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
