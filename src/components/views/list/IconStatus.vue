<template>
  <button
    v-if="localStatus === 'in-progress' || localStatus === 'done'"
    type="button"
    class="inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0 leading-none"
    :title="localStatus === 'in-progress' ? 'Mark as done' : 'Return to progress'"
    @click="toggleStatus"
  >
    <IconSquare
      v-if="localStatus === 'in-progress'"
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
    :title="TASK_STATUSES[localStatus].id"
  >
    <IconBan size="24" color="var(--v0-error)" />
  </span>
</template>

<script setup lang="ts">
import type { TaskStatus } from '@/types/task'
import { IconBan, IconSquare, IconSquareCheck } from '@tabler/icons-vue'
import { ref, watch } from 'vue'
import { TASK_STATUSES } from '@/constants/taskStatuses'
import { useTasks } from '@/stores/useTasks'

const props = defineProps<{
  taskId: string
  status: TaskStatus
}>()

const tasksStore = useTasks()

// Local status for instant visual feedback
const localStatus = ref<TaskStatus>(props.status)

// Sync on external change (e.g. from another component)
watch(() => props.status, (newStatus) => {
  localStatus.value = newStatus
})

function toggleStatus() {
  // Instantly toggle local status — animation is visible immediately
  localStatus.value = localStatus.value === 'in-progress' ? 'done' : 'in-progress'

  // Defer actual store update so animation has time to play
  setTimeout(() => {
    tasksStore.update(props.taskId, { status: localStatus.value })
  }, 200)
}
</script>
