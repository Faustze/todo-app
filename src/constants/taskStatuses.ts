import type { TaskStatus } from '@/types/task'

interface TaskStatusConfig {
  label: string
  color: 'primary' | 'success' | 'error' | 'warning'
}

export const TASK_STATUSES: Record<TaskStatus, TaskStatusConfig> = {
  'in-progress': { label: 'В процессе', color: 'warning' },
  'done': { label: 'Выполнено', color: 'success' },
  'cancel': { label: 'Отменено', color: 'error' },
}
