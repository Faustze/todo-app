<template>
  <!-- in-progress / done: checkbox -->
  <button
    v-if="status === 'in-progress' || status === 'done'"
    type="button"
    class="status-control"
    :title="status === 'in-progress' ? 'Отметить выполненным' : 'Вернуть в процесс'"
    @click="toggleStatus"
  >
    <IconSquare
      v-if="status === 'in-progress'"
      size="24"
      class="status-control__empty"
    />
    <IconSquareCheck
      v-else
      size="24"
      color="var(--v0-primary)"
      class="status-control__checked"
    />
  </button>

  <!-- cancel: static icon -->
  <span
    v-else
    class="status-control status-control--static"
    :title="TASK_STATUSES[status].id"
  >
    <IconBan size="24" color="var(--v0-error)" />
  </span>
</template>

<script setup lang="ts">
import type { TaskStatus } from '@/types/task'
import {
  IconBan,
  IconSquare,
  IconSquareCheck,
} from '@tabler/icons-vue'
import { TASK_STATUSES } from '@/constants/taskStatuses'
import { useTasks } from '@/stores/useTasks'

const props = defineProps<{
  taskId: string
  status: TaskStatus
}>()

const tasksStore = useTasks()

function toggleStatus() {
  if (props.status === 'in-progress') {
    tasksStore.update(props.taskId, { status: 'done' })
  }
  else if (props.status === 'done') {
    tasksStore.update(props.taskId, { status: 'in-progress' })
  }
}
</script>

<style scoped>
  .status-control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0;
    line-height: 1;
  }

  .status-control--static {
    cursor: default;
  }

  .status-control__empty {
    color: var(--v0-muted);
    opacity: 0.4;
    transition: opacity 0.15s ease;
  }

  .status-control:hover .status-control__empty {
    opacity: 0.7;
  }
</style>
