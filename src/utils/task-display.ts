import type { TaskPriority, TaskStatus } from '@/types/task'
import { TASK_PRIORITIES } from '@/constants/taskPriorities'
import { TASK_STATUSES } from '@/constants/taskStatuses'
import { displayDate } from '@/utils/date'

function statusLabel(status: TaskStatus): string {
  return TASK_STATUSES[status]?.id ?? status
}

function priorityLabel(priority: TaskPriority): string {
  return TASK_PRIORITIES[priority]?.label ?? priority
}

function formatDate(date: Date): string {
  return displayDate(date)
}

function statusColor(status: TaskStatus): TaskStatusConfig['color'] {
  return TASK_STATUSES[status]?.color ?? 'primary'
}

function priorityColor(priority: TaskPriority): TaskPriorityConfig['color'] {
  return TASK_PRIORITIES[priority]?.color ?? 'primary'
}

function priorityIcon(priority: TaskPriority): string {
  return { high: '↑', middle: '→', low: '↓' }[priority]
}

interface TaskStatusConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

interface TaskPriorityConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export { formatDate, priorityColor, priorityIcon, priorityLabel, statusColor, statusLabel }
