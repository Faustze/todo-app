<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{
  task: Task
  number: number
}>()
</script>

<template>
  <div
    class="task-item" :class="{
      'task-item--low': task.priority === 'low',
      'task-item--middle': task.priority === 'middle',
      'task-item--high': task.priority === 'high',
    }"
  >
    <div class="flex flex-row gap-2 items-center justify-center">
      <div class="p-2">
        <h6>{{ number }}</h6>
      </div>
      <div class="p-2">
        <p>{{ task.title }}</p>
      </div>
      <div class="p-2">
        <!-- TaskChipStatus -->
        <span>{{ task.status }}</span>
      </div>
    </div>
    <!-- Actions -->
    <div class="flex flex-row gap-2 items-center justify-center">
      <Button color="warning">
        <FaIcon icon="edit" class="text-on-surface" />
      </Button>
      <Button color="error">
        <FaIcon icon="trash" class="text-on-surface" />
      </Button>
      <!-- StatusIcon (hover:tooltip) -->
      <FaIcon icon="circle-info" class="text-on-primary" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.task-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid black;
}

.task-item--low {
  color: gray;
}
.task-item--middle {
  color: white;
}
.task-item--high {
  color: white;
  border: 2px solid red;
}
</style>
