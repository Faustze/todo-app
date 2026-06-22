import type { TaskStatus } from '@/types/task'

interface TaskStatusConfig {
  id: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export const TASK_STATUSES: Record<TaskStatus, TaskStatusConfig> = {
  'in-progress': { id: 'In Progress', color: 'warning' },
  'done': { id: 'Done', color: 'success' },
  'cancel': { id: 'Cancelled', color: 'error' },
}
