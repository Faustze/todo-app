<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import DkButton from '@/components/ui/DkButton.vue'
  import { useTasks } from '@/stores/useTasks'
  import type { SortBy, SortDir } from '@/utils/task-filters'
import { IconSortAscending, IconSortDescending, IconCalendar, IconFlag } from '@tabler/icons-vue'

  defineOptions({ name: 'DkSortButtons' })

  const store = useTasks()
  const { sortBy, sortDir } = storeToRefs(store)
  const { setSortBy, toggleSortDir } = store

  function toggle(by: SortBy) {
    if (sortBy.value === by) {
      toggleSortDir()
    } else {
      setSortBy(by)
    }
  }

  function dirIcon(d: SortDir) {
    return d === 'asc' ? IconSortAscending : IconSortDescending
  }
</script>

<template>
  <div class="dk-sort">
    <DkButton
      :variant="sortBy === 'date' ? 'solid' : 'ghost'"
      size="sm"
      @click="toggle('date')"
    >
      <div class="flex flex-row items-center gap-2">
        <IconCalendar size="16" />
        <span>Дата</span>
        <component :is="dirIcon(sortDir)" v-if="sortBy === 'date'" size="14" />
      </div>
    </DkButton>

    <DkButton
      :variant="sortBy === 'priority' ? 'solid' : 'ghost'"
      size="sm"
      @click="toggle('priority')"
    >
      <div class="flex flex-row items-center gap-2">
        <IconFlag size="16" />
        <span>Приоритет</span>
        <component :is="dirIcon(sortDir)" v-if="sortBy === 'priority'" size="14" />
      </div>
    </DkButton>
  </div>
</template>

<style scoped>
  .dk-sort {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
