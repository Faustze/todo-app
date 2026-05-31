<template>
  <div v-if="task" class="task-view">
    <h2 class="task-view__title">
      {{ task.title }}
    </h2>

    <p v-if="task.description" class="task-view__description">
      {{ task.description }}
    </p>

    <div class="task-view__meta">
      <div class="task-view__field">
        <span class="task-view__label">Статус</span>
        <span class="task-view__value" :class="`task-view__value--${task.status}`">
          {{ statusLabel(task.status) }}
        </span>
      </div>
      <div class="task-view__field">
        <span class="task-view__label">Приоритет</span>
        <span class="task-view__value" :class="`task-view__value--${task.priority}`">
          {{ priorityLabel(task.priority) }}
        </span>
      </div>
      <div class="task-view__field">
        <span class="task-view__label">Создано</span>
        <span class="task-view__value">{{ formatDate(task.createdAtUtc) }}</span>
      </div>
      <div class="task-view__field">
        <span class="task-view__label">Обновлено</span>
        <span class="task-view__value">{{ formatDate(task.updatedAtUtc) }}</span>
      </div>
    </div>
  </div>

  <div v-else class="task-view__empty">
    Задача не найдена
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task'
import { formatDate, priorityLabel, statusLabel } from '@/utils/task-display'

defineProps<{
  task: Task | undefined
}>()
</script>

<style scoped>
  .task-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
    background: var(--v0-surface);
  }

  .task-view__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--v0-text);
    margin: 0;
    line-height: 1.3;
    word-break: break-word;
  }

  .task-view__description {
    font-size: 0.9375rem;
    color: var(--v0-muted);
    margin: 0;
    line-height: 1.5;
  }

  .task-view__meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--v0-border);
  }

  .task-view__field {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .task-view__label {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--v0-muted);
  }

  .task-view__value {
    font-size: 0.875rem;
    color: var(--v0-text);
  }

  .task-view__value--done {
    color: var(--v0-success);
  }

  .task-view__value--in-progress {
    color: var(--v0-warning);
  }

  .task-view__value--cancel {
    color: var(--v0-error);
  }

  .task-view__value--high {
    color: var(--v0-error);
  }

  .task-view__value--middle {
    color: var(--v0-primary);
  }

  .task-view__value--low {
    color: var(--v0-muted);
  }

  .task-view__empty {
    padding: 2rem;
    text-align: center;
    color: var(--v0-muted);
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
  }
</style>
