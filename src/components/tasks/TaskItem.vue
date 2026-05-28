<script setup lang="ts">
  import type { Task } from '@/types/task'
  import DkButton from '@/components/ui/DkButton.vue'
  import { formatDate } from '@/utils/task-display'
  import { IconEdit, IconTrash } from '@tabler/icons-vue'
  import IconStatus from './IconStatus.vue'

  defineProps<{
    task: Task
    number: number
  }>()

  const emit = defineEmits<{
    edit: [task: Task]
    delete: [id: string, title: string]
  }>()
</script>

<template>
  <div class="task-item" :class="`task-item--${task.priority}`">
    <div class="task-item__info">
      <IconStatus :task-id="task.id" :status="task.status" />
      <div class="task-item__content">
        <h4 class="task-item__title">{{ task.title }}</h4>
        <div class="task-item__meta">
          <span class="task-item__date">{{ formatDate(task.createdAtUtc) }}</span>
        </div>
      </div>
    </div>
    <div class="task-item__actions">
      <DkButton variant="ghost" color="warning" size="sm" @click="emit('edit', task)">
        <IconEdit size="20" />
      </DkButton>
      <DkButton variant="outline" color="error" size="sm" @click="emit('delete', task.id, task.title)">
        <IconTrash size="20" />
      </DkButton>
    </div>
  </div>
</template>

<style scoped>
  .task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 1rem;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 0.75rem;
    transition: border-color 0.15s ease;
  }

  .task-item:hover {
    border-color: var(--v0-primary);
  }

  /* High: red border-left + light red tint */
  .task-item--high {
    border-left: 3px solid var(--v0-error);
    background: color-mix(in srgb, var(--v0-error) 4%, var(--v0-surface));
  }

  .task-item--high .task-item__title {
    font-weight: 600;
  }

  /* Middle: yellow border-left */
  .task-item--middle {
    border-left: 3px solid var(--v0-warning);
  }

  /* Low: gray border-left, muted title */
  .task-item--low {
    border-left: 3px solid var(--v0-muted);
  }

  .task-item--low .task-item__title {
    color: var(--v0-muted);
  }

  .task-item__info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
    flex: 1;
  }

  .task-item__content {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    min-width: 0;
  }

  .task-item__title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--v0-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .task-item__meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .task-item__date {
    font-size: 0.75rem;
    color: var(--v0-muted);
  }

  .task-item__actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
</style>
