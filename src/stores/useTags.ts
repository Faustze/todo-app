import type { CreateTaskTag, TaskTag, UpdateTaskTag } from '@/types/tag'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { save } from '@/utils/tags-helpers'

export const useTags = defineStore('tags', () => {
  const { success, info, error } = useSnackbar()

  const tags = ref<TaskTag[]>([
    {
      id: '123',
      name: 'tag1',
      color: 'primary',
    },
    {
      id: '1234',
      name: 'tag2',
      color: 'primary',
    },
    {
      id: '1235',
      name: 'tag2',
      color: 'primary',
    },
  ])

  function getTagById(id: string): TaskTag | undefined {
    return tags.value.find(t => t.id === id)
  }

  function create(payload: CreateTaskTag): void {
    const tag: TaskTag = {
      id: crypto.randomUUID(),
      name: payload.name,
      color: payload.color,
    }
    tags.value.unshift(tag)
    success(`Тег «${payload.name}» создан`)
  }

  function update(id: string, payload: UpdateTaskTag): void {
    const idx = tags.value.findIndex(t => t.id === id)
    const existing = tags.value[idx]
    const newTag = { id, ...payload }
    if (idx !== -1) {
      Object.assign(tags.value[idx], newTag)
      const name = payload.name ?? existing?.name ?? ''
      info(`Тег «${name}» обновлён`)
    }
  }

  function remove(id: string): void {
    const tag = tags.value.find(t => t.id === id)
    tags.value = tags.value.filter(t => t.id !== id)
    if (tag) {
      error(`Тег «${tag.name}» удалён`)
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
