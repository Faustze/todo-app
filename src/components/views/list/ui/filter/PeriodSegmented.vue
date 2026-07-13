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
  padding: 3px;
  border-radius: 10px;
  border: 1px solid var(--v0-border);
  background: var(--v0-surface);
}

.segmented__item {
  padding: 6px 13px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--v0-muted);
  font-size: 12.5px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.segmented__item:hover {
  color: var(--v0-text);
}

.segmented__item--active {
  background: var(--v0-seg-active);
  color: var(--v0-text);
  font-weight: 560;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--v0-border);
}
</style>
