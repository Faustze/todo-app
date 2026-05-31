<template>
  <div class="page">
    <header class="flex flex-row gap-p">
      <UiSortButtons />
      <div class="ml-auto" />
      <FilterSelect v-model="activeFilter" :options="FILTER_OPTIONS" placeholder="Выберите статус..." />
    </header>

    <div class="flex flex-row gap-2">
      <div class="grow">
        <label for="task-search" class="sr-only">Поиск по названию</label>
        <SearchInput v-model="searchQuery" :loading="loading" :count="1" placeholder="Поиск по названию..." />
      </div>
      <div class="flex ml-auto" style="height: 42px;">
        <UiButton variant="outline" size="sm" @click="createOpen = true">
          <IconPlus size="20" />
        </UiButton>
      </div>
    </div>

    <TaskList />

    <!-- <div class="page__stats">
      <span class="page__stat">Всего: {{ totalCount }}</span>
      <span class="page__stat">Выполнено: {{ doneCount }}</span>
    </div> -->

    <CreateTaskModal v-model="createOpen" @create="handleCreate" />
  </div>
</template>

<script setup lang="ts">
import type { TaskFilter, TaskFormValues } from '@/types/task'
import { IconPlus } from '@tabler/icons-vue'
import { storeToRefs } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import TaskList from '@/components/views/list/TaskList.vue'
import FilterSelect from '@/components/views/list/ui/filter/FilterSelect.vue'
import CreateTaskModal from '@/components/views/list/ui/modals/CreateTaskModal.vue'
import SearchInput from '@/components/views/list/ui/SearchInput.vue'
import UiSortButtons from '@/components/views/list/ui/sort/UiSortButtons.vue'
import { useTasks } from '@/stores/useTasks'
import { FILTER_OPTIONS } from '@/utils/task-filters'

const tasksStore = useTasks()
const loading = ref(false)
const { filter, searchQuery } = storeToRefs(tasksStore)
const { create, setFilter } = tasksStore

const createOpen = shallowRef(false)

const activeFilter = computed({
  get: () => filter.value,
  set: (v: string) => setFilter(v as TaskFilter),
})

function handleCreate(values: TaskFormValues): void {
  create({
    title: values.title,
    description: values.description,
    priority: values.priority,
  })
}
</script>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .page__stats {
    display: flex;
    gap: 1rem;
  }

  .page__stat {
    font-size: 0.875rem;
    color: var(--v0-muted);
  }

  .page__search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.2rem;
    background: var(--v0-surface);
    transition: border-color 0.15s ease;
  }

  .page__search:focus-within {
    border-color: var(--v0-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-primary) 20%, transparent);
  }

  .page__search-icon {
    color: var(--v0-muted);
    flex-shrink: 0;
  }

  .page__search-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--v0-text);
    font-size: 0.9375rem;
    outline: none;
    min-width: 0;
  }

  .page__search-input::placeholder {
    color: var(--v0-muted);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
