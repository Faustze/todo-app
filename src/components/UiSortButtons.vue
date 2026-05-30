<template>
  <div class="ui-sort">
    <UiButton
      :variant="sortBy === 'date' ? 'solid' : 'ghost'"
      size="sm"
      @click="toggle('date')"
    >
      <div class="flex flex-row items-center gap-2">
        <IconCalendar size="16" />
        <span>Дата</span>
        <component :is="dirIcon(sortDir)" v-if="sortBy === 'date'" size="14" />
      </div>
    </UiButton>

    <UiButton
      :variant="sortBy === 'priority' ? 'solid' : 'ghost'"
      size="sm"
      @click="toggle('priority')"
    >
      <div class="flex flex-row items-center gap-2">
        <IconFlag size="16" />
        <span>Приоритет</span>
        <component :is="dirIcon(sortDir)" v-if="sortBy === 'priority'" size="14" />
      </div>
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import type { SortBy, SortDir } from '@/utils/task-filters'
import { IconCalendar, IconFlag, IconSortAscending, IconSortDescending } from '@tabler/icons-vue'
import { storeToRefs } from 'pinia'
import UiButton from '@/components/ui/UiButton.vue'
import { useTasks } from '@/stores/useTasks'

const store = useTasks()
const { sortBy, sortDir } = storeToRefs(store)
const { setSortBy, toggleSortDir } = store

function toggle(by: SortBy) {
  if (sortBy.value === by) {
    toggleSortDir()
  }
  else {
    setSortBy(by)
  }
}

function dirIcon(d: SortDir) {
  return d === 'asc' ? IconSortAscending : IconSortDescending
}
</script>

<style scoped>
  .ui-sort {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
