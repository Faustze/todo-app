<script setup lang="ts">
  import type { Task } from '@/types/task'
  import DkButton from '@/components/ui/DkButton.vue'
  import { statusLabel, priorityLabel, formatDate } from '@/utils/task-display'
  import { IconEdit, IconTrash } from '@tabler/icons-vue';

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
      <span class="task-item__number">{{ number }}.</span>
      <div class="task-item__content">
        <h4 class="task-item__title">{{ task.title }}</h4>
        <div class="task-item__meta">
          <span class="task-item__badge" :data-status="task.status">
            {{ statusLabel(task.status) }}
          </span>
          <span class="task-item__badge task-item__badge--priority" :data-priority="task.priority">
            {{ priorityLabel(task.priority) }}
          </span>
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
    padding: 0.75rem 1rem;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 0.75rem;
    transition: border-color 0.15s ease;
  }

  .task-item:hover {
    border-color: var(--v0-primary);
  }

  .task-item--high {
    border-left: 3px solid var(--v0-error);
  }

  .task-item--middle {
    border-left: 3px solid var(--v0-warning);
  }

  .task-item--low {
    border-left: 3px solid var(--v0-primary);
  }

  .task-item__info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
    flex: 1;
  }

  .task-item__number {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--v0-muted);
    min-width: 1.5rem;
    text-align: right;
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

  .task-item__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .task-item__badge[data-status="in-progress"] {
    background: color-mix(in srgb, var(--v0-warning) 15%, transparent);
    color: var(--v0-warning);
  }

  .task-item__badge[data-status="done"] {
    background: color-mix(in srgb, var(--v0-success) 15%, transparent);
    color: var(--v0-success);
  }

  .task-item__badge[data-status="cancel"] {
    background: color-mix(in srgb, var(--v0-error) 15%, transparent);
    color: var(--v0-error);
  }

  .task-item__badge--priority[data-priority="low"] {
    background: color-mix(in srgb, var(--v0-primary) 10%, transparent);
    color: var(--v0-primary);
  }

  .task-item__badge--priority[data-priority="middle"] {
    background: color-mix(in srgb, var(--v0-warning) 10%, transparent);
    color: var(--v0-warning);
  }

  .task-item__badge--priority[data-priority="high"] {
    background: color-mix(in srgb, var(--v0-error) 10%, transparent);
    color: var(--v0-error);
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
