import type { TaskTag } from '@/types/tag'

// SUBTYPES
export type TaskStatus = 'done' | 'in-progress' | 'cancel'
export type TaskPriority = 'low' | 'middle' | 'high'

// FILTER
export type TaskFilter = TaskStatus | 'all'

// CRUD
export type CreateTask = Pick<Task, 'title' | 'priority' | 'description'>
export type UpdateTask = Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status'>>

// DATE
export interface DateRange { from: Date | null, to: Date | null }
export type DatePreset = 'today' | 'week' | 'month' | null

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
  status: TaskStatus
  priority: TaskPriority
  createdAtUtc: Date
  updatedAtUtc: Date

  description?: string
  tag?: TaskTag
  // syncAtUtc: Date
}
