import type { TaskTag } from './tag'

// SUBTYPES
export type TaskStatus = 'done' | 'in-progress' | 'cancel'
export type TaskPriority = 'low' | 'middle' | 'high'

// FILTER
export type TaskFilter = TaskStatus | 'all'

// CRUD
export type CreateTask = Pick<Task, 'title' | 'priority' | 'description' | 'tagId'>
export type UpdateTask = Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'tagId'>>

// DATE
export interface DateRange { from: Date | null, to: Date | null }
export type DatePreset = 'today' | 'week' | 'month' | null

// FORM
export interface TaskFormValues {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  tagId?: string
}

export interface Task {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  createdAtUtc: Date
  updatedAtUtc: Date
  // syncAtUtc: Date

  description?: string
  tagId?: string
}

export interface TaskWithTag extends Task {
  // runtime-only: tag is resolved from useTags store
  tag?: TaskTag
}
