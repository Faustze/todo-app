import type { TaskTag } from '@/types/tag'
import { TAGS_STORAGE_KEY } from '@/constants/storageKeys'

function serialize(tasks: TaskTag[]): string {
  return JSON.stringify(tasks)
}

function deserialize(raw: string): TaskTag[] {
  const parsed: TaskTag[] = JSON.parse(raw)
  return parsed
}

function save(tasks: TaskTag[]): void {
  localStorage.setItem(TAGS_STORAGE_KEY, serialize(tasks))
}

export { deserialize, save, serialize }
