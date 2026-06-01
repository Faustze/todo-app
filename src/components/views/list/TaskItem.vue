<template>
  <div class="task-item flex items-center justify-between gap-3 px-4 py-3 bg-surface border border-border rounded-sm transition-border-color duration-150 hover:border-primary cursor-pointer" :class="priorityClass">
    <div class="task-item__info flex items-center gap-3 min-w-0 flex-1">
      <IconStatus :task-id="task.id" :status="task.status" />
      <div class="min-w-0">
        <h4 class="task-item__title text-base font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
          {{ task.title }}
        </h4>
      </div>
    </div>

    <TaskItemActions
      :task="task"
      @edit="emit('edit', task)"
      @delete="emit('delete', task.id, task.title)"
      @show="emit('show', task.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task'
import { computed } from 'vue'
import IconStatus from './IconStatus.vue'
import TaskItemActions from './TaskItemActions.vue'

const props = defineProps<{
  task: Task
  number: number
}>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string, title: string]
  show: [id: string]
}>()

const priorityClass = computed(() => {
  const map: Record<string, string> = {
    high: 'task-item--high',
    middle: 'task-item--middle',
    low: 'task-item--low',
  }
  return map[props.task.priority] || ''
})
</script>

<style scoped>
  .task-item--high {
    border-left: 1px solid var(--v0-error);
    background: color-mix(in srgb, var(--v0-error) 8%, var(--v0-surface));
  }
  .task-item--high .task-item__title {
    font-weight: 700;
    color: var(--v0-text);
  }

  .task-item--middle {
    border-left: 1px solid var(--v0-primary);
  }
  .task-item--middle .task-item__title {
    font-weight: 500;
    color: var(--v0-text);
  }

  .task-item--low {
    border-left: 1px solid var(--v0-muted);
  }
  .task-item--low .task-item__title {
    font-weight: 400;
    color: color-mix(in srgb, var(--v0-muted) 80%, transparent);
  }
</style>
