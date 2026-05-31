<template>
  <div class="task-item" :class="`task-item--${task.priority}`">
    <div class="task-item__info">
      <IconStatus :task-id="task.id" :status="task.status" />
      <div class="task-item__content">
        <h4 class="task-item__title">
          {{ task.title }}
        </h4>
      </div>
    </div>

    <!-- <div class="task-item__meta">
      <span class="task-item__date">{{ formatDate(task.createdAtUtc) }}</span>
    </div> -->

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
import IconStatus from './IconStatus.vue'
import TaskItemActions from './TaskItemActions.vue'

defineProps<{
  task: Task
  number: number
}>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string, title: string]
  show: [id: string]
}>()
</script>

<style scoped>
  .task-item {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    justify-content: space-between;
    padding: 0.3rem 1rem;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 0.2rem;
    transition: border-color 0.15s ease;
  }

  .task-item:hover {
    border-color: var(--v0-primary);
    cursor: pointer;
  }

  /* High priority — bold text, error tint, colored left border */
  .task-item--high {
    border-left: 1px solid var(--v0-error);
    background: color-mix(in srgb, var(--v0-error) 8%, var(--v0-surface));
  }
  .task-item--high .task-item__title {
    font-weight: 700;
    color: var(--v0-text);
  }

  /* Middle priority — default, subtle primary border-left */
  .task-item--middle {
    border-left: 1px solid var(--v0-primary);
  }
  .task-item--middle .task-item__title {
    font-weight: 500;
    color: var(--v0-text);
  }

  /* Low priority — muted, fades into background */
  .task-item--low {
    border-left: 1px solid var(--v0-muted);
  }
  .task-item--low .task-item__title {
    font-weight: 400;
    color: color-mix(in srgb, var(--v0-muted) 80%, transparent);
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
    align-items: start;
    gap: 1px;
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

  /*
  .task-item__description {
    font-size: 0.5rem;
    font-weight: 500;
    color: var(--v0-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  */

  .task-item__meta {
    display: flex;
    align-self: end;
    justify-items: end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .task-item__date {
    font-size: 0.6rem;
    color: var(--v0-muted);
  }
</style>
