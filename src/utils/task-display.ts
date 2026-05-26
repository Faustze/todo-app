import type { TaskStatus, TaskPriority } from '@/types/task'
import { TASK_STATUSES } from '@/constants/taskStatuses'
import { TASK_PRIORITIES } from '@/constants/taskPriorities'
import { displayDate } from '@/utils/date'

function statusLabel(status: TaskStatus): string {
  return TASK_STATUSES[status]?.label ?? status
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

interface TaskStatusConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

interface TaskPriorityConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export { statusLabel, priorityLabel, formatDate, statusColor, priorityColor }
