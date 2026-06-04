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
    const name = payload.name.trim()

    // Финальная проверка дубликата (race condition protection)
    const duplicate = tags.value.find(t => t.name.toLowerCase() === name.toLowerCase())
    if (duplicate) {
      warning(`Тег «${name}» уже существует`)
      return
    }

    const tag: TaskTag = {
      id: crypto.randomUUID(),
      name,
      color: payload.color,
    }
    tags.value.unshift(tag)
    success(`Тег «${name}» создан`)
  }

  function update(id: string, payload: UpdateTaskTag): void {
    const idx = tags.value.findIndex(t => t.id === id)
    if (idx === -1) {
      error(`Тег не найден`)
      return
    }

    const existing = tags.value[idx]
    const name = payload.name?.trim() ?? existing.name

    // Финальная проверка дубликата (race condition protection)
    const duplicate = tags.value.find(t => t.id !== id && t.name.toLowerCase() === name.toLowerCase())
    if (duplicate) {
      warning(`Тег «${name}» уже существует`)
      return
    }

    Object.assign(tags.value[idx], { ...payload, name })
    info(`Тег «${name}» обновлён`)
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
