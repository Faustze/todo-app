import type { TaskStatus } from '@/types/task'

interface TaskStatusConfig {
  id: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export const TASK_STATUSES: Record<TaskStatus, TaskStatusConfig> = {
  'in-progress': { id: 'В процессе', color: 'warning' },
  'done': { id: 'Выполнено', color: 'success' },
  'cancel': { id: 'Отменено', color: 'error' },
}
