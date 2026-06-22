import type { TaskPriority } from '@/types/task'

interface TaskPriorityConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export const TASK_PRIORITIES: Record<TaskPriority, TaskPriorityConfig> = {
  low: { label: 'Low', color: 'primary' },
  middle: { label: 'Medium', color: 'warning' },
  high: { label: 'High', color: 'error' },
}
