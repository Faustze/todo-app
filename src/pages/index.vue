<template>
  <div class="page">
    <header class="page__header">
      <div>
        <h1 class="page__title">
          Tasks
        </h1>
        <p class="page__subtitle mono">
          {{ filteredTasks.length }} shown · {{ activeCount }} active · {{ doneCount }} done
        </p>
      </div>
      <button type="button" class="page__new-btn" @click="createOpen = true">
        <PhPlus size="16" weight="bold" />
        New task
      </button>
    </header>

    <div class="page__toolbar">
      <label for="task-search" class="sr-only">Search by title</label>
      <SearchInput id="task-search" v-model:query="searchQuery" class="page__search" :loading="loading" :count="1" placeholder="Search by title..." />
      <SortPanel />
      <PeriodSegmented />
    </div>

    <TaskList :tasks="filteredTasks" :tags="tags" @edit="handleEdit" @delete="handleDelete" />
    <CreateTaskModal v-model="createOpen" :tags="tags" @create="handleCreate" />
  </div>
</template>

<script setup lang="ts">
import type { TaskFormValues } from '@/types/task'
import { PhPlus } from '@phosphor-icons/vue'
import { storeToRefs } from 'pinia'
import { ref, shallowRef } from 'vue'
import TaskList from '@/components/views/list/TaskList.vue'
import PeriodSegmented from '@/components/views/list/ui/filter/PeriodSegmented.vue'
import CreateTaskModal from '@/components/views/list/ui/modals/CreateTaskModal.vue'
import SearchInput from '@/components/views/list/ui/SearchInput.vue'
import SortPanel from '@/components/views/list/ui/sort/SortPanel.vue'
import { useTags } from '@/stores/useTags'
import { useTasks } from '@/stores/useTasks'

const tasksStore = useTasks()
const tagsStore = useTags()
const { filteredTasks, searchQuery, activeCount, doneCount } = storeToRefs(tasksStore)
const { tags } = storeToRefs(tagsStore)
const { create, update, remove } = tasksStore

const createOpen = shallowRef(false)
const loading = ref(false)

function handleCreate(values: TaskFormValues): void {
  create({
    title: values.title,
    description: values.description,
    priority: values.priority,
    tagId: values.tagId,
  })
}

function handleEdit(id: string, values: TaskFormValues) {
  update(id, {
    title: values.title,
    description: values.description,
    priority: values.priority,
    status: values.status,
    tagId: values.tagId,
  })
}

function handleDelete(id: string) {
  remove(id)
}
</script>

<style scoped>
  .page {
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 32px 96px;
  }

  .page__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }

  .page__title {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: var(--v0-text);
  }

  .page__subtitle {
    margin-top: 4px;
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--v0-muted);
  }

  .page__new-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      transform var(--dur-color) var(--ease-out);
  }

  .page__new-btn:hover {
    background: var(--v0-primary-deep);
  }

  .page__new-btn:active {
    transform: scale(0.98);
  }

  .page__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
  }

  .page__search {
    flex: 1 1 200px;
  }

  @media (max-width: 640px) {
    .page {
      padding: 24px 16px 64px;
    }

    .page__title {
      font-size: 1.5rem;
      line-height: 2rem;
    }

    .page__new-btn {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .page__search {
      flex-basis: 100%;
    }
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
