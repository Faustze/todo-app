<template>
  <div
    class="task-item"
    :class="[priorityClass, { 'task-item--done': task.status === 'done', 'task-item--cancel': task.status === 'cancel' }]"
    @click="emit('show', task.id)"
  >
    <IconStatus :task-id="task.id" :status="task.status" />

    <div class="task-item__body">
      <h4 class="task-item__title" :class="{ 'task-item__title--struck': task.status === 'done' || task.status === 'cancel' }">
        {{ task.title }}
      </h4>
    </div>

    <div class="task-item__meta">
      <span class="task-item__date mono">{{ formatDate(task.createdAtUtc) }}</span>
      <span class="task-item__arrow mono">{{ priorityIcon(task.priority) }}</span>
      <span
        v-if="task.tag"
        class="task-item__pill"
        :style="{
          color: `var(--v0-${task.tag.color})`,
          background: `color-mix(in srgb, var(--v0-${task.tag.color}) 12%, transparent)`,
        }"
      >
        {{ task.tag.name }}
      </span>
    </div>

    <div class="task-item__actions">
      <button type="button" class="task-item__action" title="Edit" @click.stop="emit('edit', task)">
        <PhPencilSimple size="16" />
      </button>
      <button type="button" class="task-item__action task-item__action--danger" title="Delete" @click.stop="emit('delete', task.id)">
        <PhTrash size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithTag } from '@/types/task'
import { PhPencilSimple, PhTrash } from '@phosphor-icons/vue'
import { computed } from 'vue'
import { formatDate, priorityIcon } from '@/utils/task-display'
import IconStatus from './IconStatus.vue'

const props = defineProps<{
  task: TaskWithTag
  number: number
}>()

const emit = defineEmits<{
  edit: [task: TaskWithTag]
  delete: [id: string]
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
.task-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 12px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-border);
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    border-color var(--dur-color) var(--ease-out),
    opacity var(--dur-color) var(--ease-out),
    transform var(--dur-color) var(--ease-out),
    scale var(--dur-color) var(--ease-out),
    filter var(--dur-color) var(--ease-out);
}

.task-item:hover {
  background: var(--v0-surface-2);
  border-color: var(--v0-border-strong);
}

.task-item:active {
  transform: translateY(1px);
}

/* Priority: weight and arrow color carry the hierarchy */
.task-item__title {
  font-weight: 500;
}

.task-item--high .task-item__title {
  font-weight: 600;
}

.task-item--high .task-item__arrow {
  color: var(--v0-error);
}

.task-item--middle .task-item__arrow {
  color: var(--v0-primary);
}

.task-item--low .task-item__title {
  font-weight: 400;
}

.task-item--low .task-item__arrow {
  color: var(--v0-muted);
}

/* Done / cancelled */
.task-item--done,
.task-item--cancel {
  cursor: default;
}

.task-item--done {
  opacity: 0.6;
}

.task-item--cancel {
  opacity: 0.5;
}

/* Body */
.task-item__body {
  flex: 1;
  min-width: 0;
}

.task-item__title {
  position: relative;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.01em;
  color: var(--v0-text);
}

.task-item__title--struck {
  color: var(--v0-muted);
}

.task-item__title--struck::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  height: 1px;
  width: 100%;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-move) var(--ease-out);
}

.task-item--done .task-item__title--struck::after,
.task-item--cancel .task-item__title--struck::after {
  transform: scaleX(1);
}

/* Meta */
.task-item__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.task-item__date {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--v0-muted);
}

.task-item__arrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
}

.task-item__pill {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
}

/* Hover actions */
.task-item__actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(4px);
  transition:
    opacity var(--dur-color) var(--ease-out),
    transform var(--dur-color) var(--ease-out);
}

@media (hover: none) {
  .task-item__actions {
    opacity: 1;
    transform: none;
  }
}

.task-item:hover .task-item__actions,
.task-item:focus-within .task-item__actions {
  opacity: 1;
  transform: translateX(0);
}

.task-item__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    color var(--dur-color) var(--ease-out);
}

.task-item__action:hover {
  background: color-mix(in srgb, var(--v0-text) 8%, transparent);
  color: var(--v0-text);
}

.task-item__action:active {
  transform: scale(0.98);
}

.task-item__action--danger:hover {
  background: color-mix(in srgb, var(--v0-error) 14%, transparent);
  color: var(--v0-error);
}
</style>
