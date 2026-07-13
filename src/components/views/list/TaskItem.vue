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
          borderColor: `color-mix(in srgb, var(--v0-${task.tag.color}) 45%, transparent)`,
          background: `color-mix(in srgb, var(--v0-${task.tag.color}) 10%, transparent)`,
        }"
      >
        {{ task.tag.name }}
      </span>
    </div>

    <div class="task-item__actions">
      <button type="button" class="task-item__action" title="Edit" @click.stop="emit('edit', task)">
        <IconPencil size="14" />
      </button>
      <button type="button" class="task-item__action task-item__action--danger" title="Delete" @click.stop="emit('delete', task.id)">
        <IconTrash size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskWithTag } from '@/types/task'
import { IconPencil, IconTrash } from '@tabler/icons-vue'
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
  padding: 13px 16px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-border);
  border-left: 2px solid var(--v0-border-strong);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, scale 0.2s ease, filter 0.2s ease;
}

.task-item:hover {
  border-color: color-mix(in srgb, var(--v0-primary) 50%, var(--v0-border));
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--v0-primary) 16%, transparent),
    0 6px 24px -6px color-mix(in srgb, var(--v0-primary) 30%, transparent);
}

/* Priority */
.task-item--high {
  border-left-color: var(--v0-error);
  background: linear-gradient(90deg, color-mix(in srgb, var(--v0-error) 6%, transparent), transparent 45%), var(--v0-surface);
}

.task-item--high .task-item__title {
  font-weight: 620;
}

.task-item--high .task-item__arrow {
  color: var(--v0-error);
}

.task-item--middle {
  border-left-color: var(--v0-primary);
}

.task-item--middle .task-item__arrow {
  color: var(--v0-primary);
}

.task-item--low {
  border-left-color: var(--v0-border-strong);
}

.task-item--low .task-item__title {
  font-weight: 430;
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
  font-size: 14px;
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
  width: 0;
  background: currentColor;
  transition: width 0.35s ease;
}

.task-item--done .task-item__title--struck::after,
.task-item--cancel .task-item__title--struck::after {
  width: 100%;
}

/* Meta */
.task-item__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.task-item__date {
  font-size: 11px;
  color: var(--v0-muted);
}

.task-item__arrow {
  font-size: 13px;
  font-weight: 600;
}

.task-item__pill {
  padding: 2px 9px;
  border-radius: 99px;
  border: 1px solid;
  font-size: 11.5px;
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
  transition: opacity 0.2s ease, transform 0.2s ease;
}

@media (hover: none) {
  .task-item__actions {
    opacity: 1;
    transform: none;
  }
}

.task-item:hover .task-item__actions {
  opacity: 1;
  transform: translateX(0);
}

.task-item__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.task-item__action:hover {
  background: color-mix(in srgb, var(--v0-text) 8%, transparent);
  color: var(--v0-text);
}

.task-item__action--danger:hover {
  background: color-mix(in srgb, var(--v0-error) 14%, transparent);
  color: var(--v0-error);
}
</style>
