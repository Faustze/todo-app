import type { TagColorKey } from '@/constants/tag'

export interface TaskTag {
  id: string
  name: string
  color: TagColorKey
}

// CRUD
export type CreateTaskTag = Pick<TaskTag, 'name' | 'color'>
export type UpdateTaskTag = Partial<Pick<TaskTag, 'name' | 'color'>>
