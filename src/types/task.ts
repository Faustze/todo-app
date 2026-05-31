// SUBTYPES
export type TaskStatus = 'done' | 'in-progress' | 'cancel'
export type TaskPriority = 'low' | 'middle' | 'high'

// FILTER
export type TaskFilter = TaskStatus | 'all'

// CRUD
export type CreateTask = Pick<Task, 'title' | 'priority' | 'description'>
export type UpdateTask = Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status'>>

// ACTIONS
export interface TaskItemActionOption {
  id: string
  label: string
  action?: (v?: any) => any
}
// FORM
export interface TaskFormValues {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  createdAtUtc: Date
  updatedAtUtc: Date
  // syncAtUtc: Date
}
