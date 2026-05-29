<script setup lang="ts">
  import type { TaskFormValues, TaskFilter } from '@/types/task'
  import { shallowRef, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import DkButton from '@/components/ui/DkButton.vue'
  import DkToggle from '@/components/ui/DkToggle.vue'
  import TaskList from '@/components/tasks/TaskList.vue'
  import CreateTaskModal from '@/components/tasks/CreateTaskModal.vue'
  import { useTasks } from '@/stores/useTasks'
  import { FILTER_OPTIONS } from '@/utils/task-filters'
  import DkSortButtons from '@/components/DkSortButtons.vue'
  import { IconSearch } from '@tabler/icons-vue'

  const tasksStore = useTasks()
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

<template>
  <div class="page">
    <header class="page__header">
      <DkButton variant="solid" @click="createOpen = true">
        + Новая задача
      </DkButton>
    </header>

    <DkToggle
      v-model="activeFilter"
      :options="FILTER_OPTIONS"
      class="page__filter"
    />

    <div class="flex flex-row gap-2">
      <div class="page__search flex-grow-1">
        <IconSearch class="page__search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию..."
          class="page__search-input"
        />
      </div>
      <DkSortButtons />
    </div>

    <TaskList />

    <!-- <div class="page__stats">
      <span class="page__stat">Всего: {{ totalCount }}</span>
      <span class="page__stat">Выполнено: {{ doneCount }}</span>
    </div> -->

    <CreateTaskModal v-model="createOpen" @create="handleCreate" />
  </div>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .page__header {
    display: flex;
    align-items: center;
    justify-content: end;
  }

  .page__stats {
    display: flex;
    gap: 1rem;
  }

  .page__stat {
    font-size: 0.875rem;
    color: var(--v0-muted);
  }

  .page__filter {
    display: flex;
    justify-content: center;
  }

  .page__search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
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
</style>
