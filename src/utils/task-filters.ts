import type { FilterOption } from '@/types/filter'
import type { SortBy, SortDir } from '@/types/sort'
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

export function filterTasksByDateRange(tasks: Task[], range: { from: Date | null, to: Date | null }): Task[] {
  if (!range.from && !range.to)
    return tasks
  return tasks.filter((task) => {
    const created = new Date(task.createdAtUtc).getTime()
    if (range.from && created < range.from.getTime())
      return false
    if (range.to) {
      const endOfTo = new Date(range.to)
      endOfTo.setHours(23, 59, 59, 999)
      if (created > endOfTo.getTime())
        return false
    }
    return true
  })
}

export function getPresetRange(preset: string): { from: Date, to: Date } {
  const to = new Date()
  const from = new Date(to)

  switch (preset) {
    case 'today':
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      break
    case 'week':
      from.setDate(from.getDate() - 7)
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      break
    case 'month':
      from.setMonth(from.getMonth() - 1)
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      break
  }

  return { from, to }
}

export function filterTasksByPreset(tasks: Task[], preset: string): Task[] {
  const { from, to } = getPresetRange(preset)
  return tasks.filter((task) => {
    const created = new Date(task.createdAtUtc).getTime()
    return created >= from.getTime() && created <= to.getTime()
  })
}
