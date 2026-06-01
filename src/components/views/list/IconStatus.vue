<template>
  <button
    v-if="status === 'in-progress' || status === 'done'"
    type="button"
    class="inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0 leading-none"
    :title="status === 'in-progress' ? 'Отметить выполненным' : 'Вернуть в процесс'"
    @click="toggleStatus"
  >
    <IconSquare
      v-if="status === 'in-progress'"
      size="24"
      class="text-muted opacity-40 transition-opacity duration-150 hover:opacity-70"
    />
    <IconSquareCheck
      v-else
      size="24"
      color="var(--v0-primary)"
    />
  </button>

  <span
    v-else
    class="inline-flex items-center justify-center cursor-default bg-transparent border-none p-0 leading-none"
    :title="TASK_STATUSES[status].id"
  >
    <IconBan size="24" color="var(--v0-error)" />
  </span>
</template>

<script setup lang="ts">
import type { TaskStatus } from '@/types/task'
import { IconBan, IconSquare, IconSquareCheck } from '@tabler/icons-vue'
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
