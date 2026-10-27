<template>
  <div class="segmented">
    <button
      v-for="opt in options"
      :key="opt.id"
      type="button"
      class="segmented__item"
      :class="{ 'segmented__item--active': datePreset === opt.id }"
      @click="toggle(opt.id)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DatePreset } from '@/types/task'
import { storeToRefs } from 'pinia'
import { useTasks } from '@/stores/useTasks'

const store = useTasks()
const { datePreset } = storeToRefs(store)
const { setDatePreset } = store

const options: { id: NonNullable<DatePreset>, label: string }[] = [
  { id: 'today', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
]

function toggle(id: DatePreset) {
  setDatePreset(datePreset.value === id ? null : id)
}
</script>

<style scoped>
.segmented {
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--v0-border);
  background: var(--v0-surface);
}

/* Nested radius: 12px outer minus 4px gap = 8px */
.segmented__item {
  padding: 4px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--v0-muted);
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    color var(--dur-color) var(--ease-out);
}

.segmented__item:hover {
  color: var(--v0-text);
  background: color-mix(in srgb, var(--v0-text) 5%, transparent);
}

.segmented__item:active {
  transform: scale(0.98);
}

.segmented__item--active,
.segmented__item--active:hover {
  background: var(--v0-surface-2);
  color: var(--v0-text);
  font-weight: 500;
}
</style>
