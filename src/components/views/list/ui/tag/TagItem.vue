<template>
  <div class="flex items-center justify-between gap-3 pa-2 bg-surface border border-border rounded-sm transition-[border-color,scale,filter] duration-250 hover:border-primary cursor-pointer">
    <div class="flex flex-row justify-start gap-2 items-center flex-1 min-w-0">
      <UiButton variant="icon" @click="openColorPicker">
        <TagColorPicker :color="tag.color" />
      </UiButton>

      <!-- Режим отображения -->
      <div
        v-if="!isEditing"
        class="flex flex-row items-center gap-1 cursor-text flex-1 min-w-0"
        title="Нажмите для редактирования"
        @click="startEdit"
      >
        <h4 class="task-item__title text-base font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">
          {{ tag.name }}
        </h4>
        <IconPencil size="16" class="text-muted shrink-0" />
      </div>

      <!-- Режим редактирования: UiInput + Vuelidate -->
      <div v-else style="max-width: 15rem">
        <UiField :error-message="v$.name.$errors[0]?.$message">
          <UiInput
            v-model="form.name"
            placeholder="Название тега"
            @blur="handleBlur"
            @keydown.enter.prevent="submitEdit"
            @keydown.escape.prevent="cancelEdit"
          />
        </UiField>
      </div>
    </div>

    <div class="flex flex-row justify-end gap-2">
      <IconTrash size="20" class="text-error hover:text-primary cursor-pointer" @click="emit('delete', tag)" />
    </div>
  </div>

  <TagColorPaletteModal
    v-model="isColorPickerOpen"
    v-model:selected-color="selectedColor"
    @confirm="confirmColor"
  />
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { TagColorKey } from '@/constants/tag'
import type { TaskTag } from '@/types/tag'
import { IconPencil, IconTrash } from '@tabler/icons-vue'
import { ref, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiField from '@/components/ui/UiField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import { useTagValidation } from '@/composables/useTagValidation'
import TagColorPaletteModal from './TagColorPaletteModal.vue'
import TagColorPicker from './TagColorPicker.vue'

const props = defineProps<{
  tag: TaskTag
  /** Имена всех тегов для проверки дубликатов (Vuelidate unique) */
  allNames?: Ref<string[]> | string[]
}>()

const emit = defineEmits<{
  edit: [tag: TaskTag]
  delete: [tag: TaskTag]
  colorPick: [tag: TaskTag]
}>()

const isEditing = ref(false)

// Реактивная ссылка на оригинальное имя (для исключения из unique-проверки)
const originalName: Ref<string> = ref('')

// Реактивная ссылка на имена всех тегов
const namesRef: Ref<string[]> = ref([])
watch(
  () => props.allNames,
  (val) => {
    if (Array.isArray(val))
      namesRef.value = val
    else if (val)
      namesRef.value = val.value
  },
  { immediate: true },
)

const { form, v$, resetForm } = useTagValidation(originalName, namesRef)

function startEdit() {
  originalName.value = props.tag.name
  form.value.name = props.tag.name
  v$.value.$reset()
  isEditing.value = true
}

function submitEdit() {
  v$.value.$touch()
  if (v$.value.$invalid)
    return

  const newName = form.value.name.trim()
  if (newName !== props.tag.name) {
    emit('edit', { ...props.tag, name: newName })
  }
  isEditing.value = false
}

function handleBlur() {
  // Небольшая задержка, чтобы клик по кнопке удаления успел сработать
  setTimeout(() => {
    if (isEditing.value) {
      submitEdit()
    }
  }, 150)
}

function cancelEdit() {
  resetForm()
  isEditing.value = false
}

// --- Color picker modal ---
const isColorPickerOpen = ref(false)
const selectedColor = ref<TagColorKey>('primary')

function openColorPicker() {
  selectedColor.value = props.tag.color
  isColorPickerOpen.value = true
}

function confirmColor() {
  if (selectedColor.value !== props.tag.color) {
    emit('edit', { ...props.tag, color: selectedColor.value })
  }
  isColorPickerOpen.value = false
}
</script>
