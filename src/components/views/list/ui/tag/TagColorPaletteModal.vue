<template>
  <UiModal v-model="open">
    <div class="p-4">
      <h3 class="text-base font-medium text-text mb-3">
        Выберите цвет тега
      </h3>
      <TagColorPalette
        :model-value="selectedColor"
        @select="selectedColor = $event"
      />
      <div class="flex justify-end gap-2 mt-4">
        <UiButton variant="ghost" @click="open = false">
          Отмена
        </UiButton>
        <UiButton variant="solid" @click="emit('confirm', selectedColor)">
          Применить
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import UiButton from '@/components/ui/UiButton.vue'
import UiModal from '@/components/ui/UiModal.vue'
import TagColorPalette from './TagColorPalette.vue'

const open = defineModel<boolean>({ default: false })
const selectedColor = defineModel<TagColorKey>('selectedColor', { required: true })

const emit = defineEmits<{
  confirm: [color: TagColorKey]
}>()
</script>
