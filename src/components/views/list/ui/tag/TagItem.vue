<template>
  <div class="flex items-center justify-between gap-3 pa-2 bg-surface border border-border rounded-sm transition-[border-color,scale,filter] duration-250 hover:border-primary cursor-pointer">
    <div class="flex flex-row justify-start gap-2">
      <UiButton variant="icon" @click="emit('colorPick', tag)">
        <!-- Компонент с динамическим цветом -->
        <TagColorPicker color="error" />
      </UiButton>
      <div class="min-w-0">
        <h4 class="task-item__title text-base font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
          {{ tag.name }}
        </h4>
      </div>
    </div>

    <div class="flex flex-row justify-end gap-2">
      <IconPencil size="20" class="text-info hover:text-primary" @click="emit('edit', tag)" />
      <IconTrash size="20" class="text-error hover:text-primary" @click="emit('delete', tag)" />
    </div>

    <!-- Цвет тега в виде IconVignette заполненная цветом  -->
    <!-- Название тега + (Редактирование не лету?) -->
    <!-- Кнопка удаления тега (IconTrash) -->
  </div>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag'
import { IconPencil, IconTrash } from '@tabler/icons-vue'
import UiButton from '@/components/ui/UiButton.vue'
import TagColorPicker from './TagColorPicker.vue'

defineProps<{
  tag: TaskTag
}>()

const emit = defineEmits<{
  edit: [tag: TaskTag]
  delete: [tag: TaskTag]
  colorPick: [tag: TaskTag]
}>()
</script>
