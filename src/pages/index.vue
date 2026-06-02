<template>
  <div class="page">
    <header class="flex flex-row gap-2 justify-end">
      <UiButton variant="solid" @click="createOpen = true">
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
      </div>
    </div>
    <TaskList />
    <CreateTaskModal v-model="createOpen" @create="handleCreate" />
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
import { useTasks } from '@/stores/useTasks'

const tasksStore = useTasks()
const loading = ref(false)
const { searchQuery } = storeToRefs(tasksStore)
const { create, setDateRange } = tasksStore

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

const createOpen = shallowRef(false)

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
