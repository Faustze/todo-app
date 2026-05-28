import type { CreateTask, Task, TaskFilter, UpdateTask } from '@/types/task'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { countTasksByStatus, filterTasks, searchTasks, sortTasks } from '@/utils/task-filters'
import type { SortBy, SortDir } from '@/utils/task-filters'
import { load, save } from '@/utils/tasks-helpers'

export const useTasks = defineStore('tasks', () => {
  const tasks = ref<Task[]>(load())
  const filter = ref<TaskFilter>('in-progress')
  const searchQuery = ref('')
  const sortBy = ref<SortBy>('date')
  const sortDir = ref<SortDir>('desc')

  const filteredTasks = computed(() => {
    const byStatus = filterTasks(tasks.value, filter.value)
    const bySearch = searchTasks(byStatus, searchQuery.value)
    return sortTasks(bySearch, sortBy.value, sortDir.value)
  })
  const totalCount = computed(() => tasks.value.length)
  const doneCount = computed(() => countTasksByStatus(tasks.value, 'done'))

  function create(payload: CreateTask): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title: payload.title,
      description: payload.description ?? '',
      priority: payload.priority,
      createdAtUtc: new Date(),
      updatedAtUtc: new Date(),
      status: 'in-progress',
    }
    tasks.value.unshift(task)
  }

  function update(id: string, payload: UpdateTask): void {
    const idx = tasks.value.findIndex(t => t.id === id)
    const newTask = {
      id,
      updatedAtUtc: Date.now(),
      ...payload
    }
    if (idx !== -1) {
      Object.assign(tasks.value[idx], newTask)
    }
  }

  function remove(id: string): void {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function setFilter(f: TaskFilter): void {
    filter.value = f
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

  watch(tasks, (val) => save(val), { deep: true })

  return {
    tasks, filter, searchQuery, sortBy, sortDir,
    filteredTasks, totalCount, doneCount,
    create, update, remove, setFilter, setSearchQuery, setSortBy, toggleSortDir,
  }
})
