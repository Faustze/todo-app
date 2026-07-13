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
        <IconPlus size="14" />
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
import { IconPlus } from '@tabler/icons-vue'
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
    padding: 40px 32px 90px;
  }

  .page__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 22px;
  }

  .page__title {
    font-size: 23px;
    font-weight: 680;
    letter-spacing: -0.02em;
    color: var(--v0-text);
  }

  .page__subtitle {
    margin-top: 4px;
    font-size: 11.5px;
    color: var(--v0-muted);
  }

  .page__new-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: 9px;
    border: 1px solid color-mix(in srgb, var(--v0-primary) 60%, transparent);
    background: linear-gradient(180deg, var(--v0-primary), var(--v0-primary-deep));
    color: #fff;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 0 24px color-mix(in srgb, var(--v0-primary) 40%, transparent), 0 2px 8px rgba(0, 0, 0, 0.35);
    transition: transform 0.18s ease, filter 0.2s ease, box-shadow 0.2s ease;
  }

  .page__new-btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.07);
    box-shadow: 0 0 30px color-mix(in srgb, var(--v0-primary) 55%, transparent), 0 2px 8px rgba(0, 0, 0, 0.35);
  }

  .page__new-btn:active {
    transform: scale(0.97);
  }

  .page__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
  }

  .page__search {
    flex: 1 1 200px;
  }

  @media (max-width: 640px) {
    .page {
      padding: 24px 16px 70px;
    }

    .page__toolbar {
      gap: 8px;
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
