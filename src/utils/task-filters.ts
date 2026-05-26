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

export function countTasksByStatus(tasks: Task[], status: Task['status']): number {
  return tasks.filter(task => task.status === status).length
}
