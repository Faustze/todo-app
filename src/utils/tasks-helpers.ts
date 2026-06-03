import type { Task } from '@/types/task'
import { TASKS_STORAGE_KEY } from '@/constants/storageKeys'

function serialize(tasks: Task[]): string {
  return JSON.stringify(tasks)
}

function deserialize(raw: string): Task[] {
  const parsed: Task[] = JSON.parse(raw)
  return parsed.map(t => ({
    ...t,
    createdAtUtc: new Date(t.createdAtUtc),
  }))
}

function save(tasks: Task[]): void {
  localStorage.setItem(TASKS_STORAGE_KEY, serialize(tasks))
}

export { deserialize, save, serialize }

// фукнции для не persist store
// function load(): Task[] {
//   try {
//     const raw = localStorage.getItem(TASKS_STORAGE_KEY)
//     return raw ? deserialize(raw) : mockTasks
//   }
//   catch {
//     return []
//   }
// }

// const mockTasks: Task[] = [{
//   id: '123',
//   title: 'title',
//   status: 'done',
//   priority: 'low',
//   createdAtUtc: new Date(),
//   updatedAtUtc: new Date(),
// }, {
//   id: '1243',
//   title: 'title',
//   status: 'in-progress',
//   priority: 'middle',
//   createdAtUtc: new Date(),
//   updatedAtUtc: new Date(),
// }, {
//   id: '12435',
//   title: 'title',
//   status: 'cancel',
//   priority: 'high',
//   createdAtUtc: new Date(),
//   updatedAtUtc: new Date(),
// }]
