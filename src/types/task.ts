export type TaskStatus = 'done' | 'in-progress' | 'cancel'
export type TaskPriority = 'low' | 'middle' | 'high'
export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
}
