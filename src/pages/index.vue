<template>
  <div class="page">
    <header class="flex flex-row gap-2 justify-end">
      <UiButton variant="solid" color="primary" size="md" @click="createOpen = true">
        <IconPlus size="20" />
      </UiButton>
    </header>

    <div class="flex flex-row gap-2">
      <div class="grow">
        <label for="task-search" class="sr-only">Поиск по названию</label>
        <SearchInput v-model="searchQuery" :loading="loading" :count="1" placeholder="Поиск по названию..." />
      </div>
      <div class="flex flex-row gap-2 items-start">
        <SortPanel />
        <FilterPanel />
        <TagPanel />
      </div>
    </div>
    <TaskList :tasks="filteredTasks" :tags="tags" @edit="handleEdit" @delete="handleDelete" />
    <CreateTaskModal v-model="createOpen" :tags="tags" @create="handleCreate" />
  </div>
</template>

<script setup lang="ts">
import type DateRangePicker from '@/components/views/list/ui/filter/DateRangePicker.vue'
import type { TaskFormValues } from '@/types/task'
import { IconPlus } from '@tabler/icons-vue'
import { storeToRefs } from 'pinia'
import { ref, shallowRef, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import TaskList from '@/components/views/list/TaskList.vue'
import FilterPanel from '@/components/views/list/ui/filter/FilterPanel.vue'
import CreateTaskModal from '@/components/views/list/ui/modals/CreateTaskModal.vue'
import SearchInput from '@/components/views/list/ui/SearchInput.vue'
import SortPanel from '@/components/views/list/ui/sort/SortPanel.vue'
import TagPanel from '@/components/views/list/ui/tag/TagPanel.vue'
import { useTags } from '@/stores/useTags'
import { useTasks } from '@/stores/useTasks'

const tasksStore = useTasks()
const tagsStore = useTags()
const { filteredTasks, searchQuery } = storeToRefs(tasksStore)
const { tags } = storeToRefs(tagsStore)
const { create, setDateRange, update, remove } = tasksStore

const createOpen = shallowRef(false)
const loading = ref(false)
const dateRangePicker = ref<InstanceType<typeof DateRangePicker> | null>(null)

watch(
  () => dateRangePicker.value?.range,
  (newRange) => {
    if (newRange) {
      setDateRange({ from: newRange.from, to: newRange.to })
    }
  },
  { deep: true },
)

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
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
