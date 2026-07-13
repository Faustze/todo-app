<template>
  <button
    v-if="localStatus === 'in-progress' || localStatus === 'done'"
    type="button"
    class="checkbox"
    :class="{ 'checkbox--checked': localStatus === 'done', 'checkbox--pop': popping }"
    :title="localStatus === 'in-progress' ? 'Mark as done' : 'Return to progress'"
    @click.stop="toggleStatus"
  >
    <svg viewBox="0 0 16 16" width="13" height="13">
      <path
        class="checkbox__check"
        d="M3 8.5L6.5 12L13 4.5"
        fill="none"
        stroke="var(--v0-check-ink)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <span v-else class="checkbox checkbox--cancel" :title="TASK_STATUSES[localStatus].id">
    <svg viewBox="0 0 18 18" width="18" height="18">
      <circle cx="9" cy="9" r="7" fill="none" stroke="var(--v0-error)" stroke-width="1.6" />
      <line x1="4" y1="14" x2="14" y2="4" stroke="var(--v0-error)" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  </span>
</template>

<script setup lang="ts">
import type { TaskStatus } from '@/types/task'
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
const popping = ref(false)

// Sync on external change (e.g. from another component)
watch(() => props.status, (newStatus) => {
  localStatus.value = newStatus
})

function toggleStatus() {
  // Instantly toggle local status — animation is visible immediately
  localStatus.value = localStatus.value === 'in-progress' ? 'done' : 'in-progress'
  popping.value = true
  setTimeout(() => {
    popping.value = false
  }, 350)

  // Defer actual store update so animation has time to play
  setTimeout(() => {
    tasksStore.update(props.taskId, { status: localStatus.value })
  }, 200)
}
</script>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 7px;
  border: 1.5px solid var(--v0-border-strong);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.checkbox--cancel {
  border: none;
  cursor: default;
}

@media (hover: hover) {
  .checkbox:not(.checkbox--checked):not(.checkbox--cancel):hover {
    border-color: var(--v0-mint);
    box-shadow: 0 0 12px color-mix(in srgb, var(--v0-mint) 50%, transparent);
  }
}

.checkbox--checked {
  background: var(--v0-mint);
  border-color: var(--v0-mint);
}

.checkbox--pop {
  animation: checkbox-pop 0.35s ease;
}

@keyframes checkbox-pop {
  0% {
    transform: scale(0.8);
  }
  60% {
    transform: scale(1.14);
  }
  100% {
    transform: scale(1);
  }
}

.checkbox__check {
  stroke-dasharray: 14;
  stroke-dashoffset: 14;
  transition: stroke-dashoffset 0.32s ease 0.05s;
}

.checkbox--checked .checkbox__check {
  stroke-dashoffset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .checkbox--pop {
    animation: none;
  }
  .checkbox__check {
    transition: none;
  }
}
</style>
