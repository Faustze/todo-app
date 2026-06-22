import type { CreateTaskTag, TaskTag, UpdateTaskTag } from '@/types/tag'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { save } from '@/utils/tags-helpers'

export const useTags = defineStore('tags', () => {
  const { success, info, warning, error } = useSnackbar()

  const tags = ref<TaskTag[]>([
    {
      id: '123',
      name: 'tag1',
      color: 'tag-1',
    },
    {
      id: '1234',
      name: 'tag2',
      color: 'tag-2',
    },
    {
      id: '1235',
      name: 'tag3',
      color: 'tag-3',
    },
  ])

  function getTagById(id: string): TaskTag | undefined {
    return tags.value.find(t => t.id === id)
  }

  function create(payload: CreateTaskTag): void {
    const name = payload.name.trim()

    // Final duplicate check (race condition protection)
    const duplicate = tags.value.find(t => t.name.toLowerCase() === name.toLowerCase())
    if (duplicate) {
      warning(`Tag "${name}" already exists`)
      return
    }

    const tag: TaskTag = {
      id: crypto.randomUUID(),
      name,
      color: payload.color,
    }
    tags.value.push(tag)
    success(`Tag "${name}" created`)
  }

  function update(id: string, payload: UpdateTaskTag): void {
    const idx = tags.value.findIndex(t => t.id === id)
    if (idx === -1) {
      error(`Tag not found`)
      return
    }

    const existing = tags.value[idx]
    const name = payload.name?.trim() ?? existing.name

    // Final duplicate check (race condition protection)
    const duplicate = tags.value.find(t => t.id !== id && t.name.toLowerCase() === name.toLowerCase())
    if (duplicate) {
      warning(`Tag "${name}" already exists`)
      return
    }

    Object.assign(tags.value[idx], { ...payload, name })
    info(`Tag "${name}" updated`)
  }

  function remove(id: string): void {
    const tag = tags.value.find(t => t.id === id)
    tags.value = tags.value.filter(t => t.id !== id)
    if (tag) {
      error(`Tag "${tag.name}" deleted`)
    }
  }

  watch(tags, val => save(val), { deep: true })

  return {
    tags,
    getTagById,
    create,
    update,
    remove,
  }
}, { persist: { key: 'tags-store' } })
