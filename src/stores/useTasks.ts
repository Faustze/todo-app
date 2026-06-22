import type { SortBy, SortDir } from '@/types/sort'
import type { CreateTask, DatePreset, DateRange, Task, TaskFilter, TaskWithTag, UpdateTask } from '@/types/task'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { countTasksByStatus, filterTasks, filterTasksByDateRange, filterTasksByPreset, searchTasks, sortTasks } from '@/utils/task-filters'
import { save } from '@/utils/tasks-helpers'
import { useTags } from './useTags'

export const useTasks = defineStore('tasks', () => {
  const { success, info, error } = useSnackbar()
  const tagsStore = useTags()

  const tasks = ref<Task[]>([])
  const filter = ref<TaskFilter>('in-progress')
  const dateRange = ref<DateRange>({ from: null, to: null })
  const datePreset = ref<DatePreset>(null)
  const searchQuery = ref('')
  const sortBy = ref<SortBy>('date')
  const sortDir = ref<SortDir>('desc')

  // Add tag to tasks from tags store
  const tasksWithTag = computed(() => {
    return tasks.value.map(task => ({
      ...task,
      tag: task.tagId ? tagsStore.tags.find(t => t.id === task.tagId) : undefined,
    })) as TaskWithTag[]
  })

  const filteredTasks = computed(() => {
    const byStatus = filterTasks(tasksWithTag.value, filter.value)
    const byDateRange = filterTasksByDateRange(byStatus, dateRange.value)
    const byPreset = datePreset.value
      ? filterTasksByPreset(byDateRange, datePreset.value)
      : byDateRange
    const bySearch = searchTasks(byPreset, searchQuery.value)
    return sortTasks(bySearch, sortBy.value, sortDir.value)
  })
  const totalCount = computed(() => tasks.value.length)
  const doneCount = computed(() => countTasksByStatus(tasks.value, 'done'))

  function getTaskById(id: string): Task | undefined {
    const task = tasks.value.find(t => t.id === id)
    if (!task)
      return undefined
    return {
      ...task,
      tag: task.tagId ? tagsStore.tags.find(t => t.id === task.tagId) : undefined,
    } as Task
  }

  function create(payload: CreateTask): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title: payload.title,
      description: payload.description ?? '',
      priority: payload.priority,
      createdAtUtc: new Date(),
      updatedAtUtc: new Date(),
      status: 'in-progress',
      tagId: payload.tagId,
    }
    tasks.value.push(task)
    success(`Task "${payload.title}" created`)
  }

  function update(id: string, payload: UpdateTask): void {
    const idx = tasks.value.findIndex(t => t.id === id)
    const existing = tasks.value[idx]
    const newTask = {
      id,
      updatedAtUtc: new Date(),
      ...payload,
    }
    if (idx !== -1) {
      Object.assign(tasks.value[idx], newTask)
      const title = payload.title ?? existing?.title ?? ''
      info(`Task "${title}" updated`)
    }
  }

  function remove(id: string): void {
    const task = tasks.value.find(t => t.id === id)
    tasks.value = tasks.value.filter(t => t.id !== id)
    if (task) {
      error(`Task "${task.title}" deleted`)
    }
  }

  function setFilter(f: TaskFilter): void {
    filter.value = f
  }

  function setDateRange(range: DateRange): void {
    dateRange.value = range
  }

  function setDatePreset(preset: DatePreset): void {
    datePreset.value = preset
  }

  function resetFilters(): void {
    filter.value = 'in-progress'
    dateRange.value = { from: null, to: null }
    datePreset.value = null
  }

  function setSearchQuery(q: string): void {
    searchQuery.value = q
  }

  function setSortBy(by: SortBy): void {
    sortBy.value = by
  }

  function toggleSortDir(): void {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  }

  watch(tasks, val => save(val), { deep: true })

  return {
    tasks,
    filter,
    dateRange,
    datePreset,
    searchQuery,
    sortBy,
    sortDir,
    filteredTasks,
    totalCount,
    doneCount,
    getTaskById,
    create,
    update,
    remove,
    setFilter,
    setDateRange,
    setDatePreset,
    resetFilters,
    setSearchQuery,
    setSortBy,
    toggleSortDir,
  }
}, { persist: {
  key: 'todo-app-tasks-store',
  // restore Date from ISO strings after hydration from localStorage
  afterHydrate(ctx) {
    ctx.store.tasks = ctx.store.tasks.map((t: Task) => ({
      ...t,
      createdAtUtc: new Date(t.createdAtUtc),
      updatedAtUtc: new Date(t.updatedAtUtc),
    }))
  },
} })
