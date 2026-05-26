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

  const tasksStore = useTasks()
  const { filter, totalCount, doneCount } = storeToRefs(tasksStore)
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
      <div class="page__stats">
        <span class="page__stat">Всего: {{ totalCount }}</span>
        <span class="page__stat">Выполнено: {{ doneCount }}</span>
      </div>
      <DkButton variant="solid" @click="createOpen = true">
        + Новая задача
      </DkButton>
    </header>

    <DkToggle
      v-model="activeFilter"
      :options="FILTER_OPTIONS"
      class="page__filter"
    />

    <TaskList />

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
    justify-content: space-between;
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
</style>
