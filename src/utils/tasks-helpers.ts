import { STORAGE_KEY } from "@/constants/storageKeys"
import type { Task } from "@/types/task"

const mockTasks: Task[] = [{
  id: '123',
  title: 'title',
  status: 'done',
  priority: 'low',
  createdAtUtc: new Date(),
  updatedAtUtc: new Date(),
},
{
  id: '1243',
  title: 'title',
  status: 'in-progress',
  priority: 'middle',
  createdAtUtc: new Date(),
  updatedAtUtc: new Date(),
},
{
  id: '12435',
  title: 'title',
  status: 'cancel',
  priority: 'high',
  createdAtUtc: new Date(),
  updatedAtUtc: new Date(),
  }
]
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

function load(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? deserialize(raw) : mockTasks
  } catch {
    return []
  }
}

function save(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, serialize(tasks))
}

export { serialize, deserialize, load, save }
