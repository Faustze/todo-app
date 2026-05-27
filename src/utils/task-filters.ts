import { TASK_STATUSES } from '@/constants/taskStatuses'
import type { Task, TaskFilter } from '@/types/task'

export const FILTER_OPTIONS: Array<{ value: string, label: string }> = [
  { value: 'all', label: 'Все' },
  ...Object.entries(TASK_STATUSES).map(([value, config]) => ({
    value,
    label: config.label,
  })),
]

export function matchesTaskFilter(task: Task, filter: TaskFilter): boolean {
  return filter === 'all' || task.status === filter
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return filter === 'all'
    ? tasks
    : tasks.filter(task => matchesTaskFilter(task, filter))
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks
  const q = query.toLowerCase().trim()
  return tasks.filter(task => task.title.toLowerCase().includes(q))
}

export function countTasksByStatus(tasks: Task[], status: Task['status']): number {
  return tasks.filter(task => task.status === status).length
}

export type SortBy = 'date' | 'priority'
export type SortDir = 'asc' | 'desc'

const PRIORITY_ORDER: Record<TaskPriority, number> = { low: 1, middle: 2, high: 3 }

export function sortTasks(tasks: Task[], by: SortBy, dir: SortDir): Task[] {
  const sorted = [...tasks]
  const sign = dir === 'asc' ? 1 : -1
  if (by === 'date') {
    sorted.sort((a, b) => sign * (new Date(a.createdAtUtc).getTime() - new Date(b.createdAtUtc).getTime()))
  } else {
    sorted.sort((a, b) => sign * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]))
  }
  return sorted
}
