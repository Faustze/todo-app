import type { CreateTask, Task, TaskFilter, UpdateTask } from '@/types/task'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { countTasksByStatus, filterTasks } from '@/utils/task-filters'
import { load, save } from '@/utils/tasks-helpers'

export const useTasks = defineStore('tasks', () => {
  const tasks = ref<Task[]>(load())
  const filter = ref<TaskFilter>('all')

  const filteredTasks = computed(() => filterTasks(tasks.value, filter.value))
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

  watch(tasks, (val) => save(val), { deep: true })

  return {
    tasks, filter,
    filteredTasks, totalCount, doneCount,
    create, update, remove, setFilter,
  }
})
