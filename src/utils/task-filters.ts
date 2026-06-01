import type { FilterOption } from '@/types/filter'
import type { SortBy, SortDir } from '@/types/sort'

export type { SortBy, SortDir }
import type { Task, TaskFilter, TaskPriority } from '@/types/task'
import { TASK_STATUSES } from '@/constants/taskStatuses'

export const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'status-group',
    label: 'Статус',
    children: [
      { id: 'all', label: 'Все' },
      ...Object.entries(TASK_STATUSES).map(([id, config]) => ({
        id,
        label: config.id,
      })),
    ],
  },
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
  if (!query.trim())
    return tasks
  const q = query.toLowerCase().trim()
  return tasks.filter(task => task.title.toLowerCase().includes(q))
}

export function countTasksByStatus(tasks: Task[], status: Task['status']): number {
  return tasks.filter(task => task.status === status).length
}

const PRIORITY_ORDER: Record<TaskPriority, number> = { low: 1, middle: 2, high: 3 }

export function sortTasks(tasks: Task[], by: SortBy, dir: SortDir): Task[] {
  const sorted = [...tasks]
  const sign = dir === 'asc' ? 1 : -1
  if (by === 'date') {
    sorted.sort((a, b) => sign * (new Date(a.createdAtUtc).getTime() - new Date(b.createdAtUtc).getTime()))
  }
  else {
    sorted.sort((a, b) => sign * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]))
  }
  return sorted
}
