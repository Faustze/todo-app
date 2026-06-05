<template>
  <div class="flex items-center justify-between gap-3 pa-2 bg-surface border border-border rounded-sm transition-[border-color,scale,filter] duration-250 hover:border-primary cursor-pointer">
    <div class="flex flex-row justify-start gap-2 items-center flex-1 min-w-0">
      <TagColorVignette size="20" :color="tag.color" />
      <h4 class="task-item__title text-base font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">
        {{ tag.name }}
      </h4>
    </div>

    <div class="flex flex-row justify-end gap-2">
      <IconPencil size="20" class="text-muted hover:text-primary" @click.stop="emit('edit', tag)" />
      <IconTrash size="20" class="text-error hover:text-primary" @click.stop="emit('delete', tag)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag'
import { IconPencil, IconTrash } from '@tabler/icons-vue'
import TagColorVignette from './TagColorVignette.vue'

defineProps<{
  tag: TaskTag
}>()

const emit = defineEmits<{
  edit: [tag: TaskTag]
  delete: [tag: TaskTag]
}>()
</script>
