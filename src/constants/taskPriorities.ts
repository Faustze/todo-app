import type { TaskPriority } from '@/types/task'

interface TaskPriorityConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export const TASK_PRIORITIES: Record<TaskPriority, TaskPriorityConfig> = {
  'low': { label: 'Низкий', color: 'primary' },
  'middle': { label: 'Средний', color: 'warning' },
  'high': { label: 'Высокий', color: 'error' },
}
