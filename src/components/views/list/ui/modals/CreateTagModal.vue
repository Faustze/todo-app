<template>
  <UiModal v-model="open">
    <div class="pa-4">
      <h2 class="text-lg font-semibold text-text mb-3">
        Новый тег
      </h2>

      <UiField :error-message="v$.name.$errors[0]?.$message">
        <UiInput
          v-model="form.name"
          placeholder="Название тега"
          @keydown.enter.prevent="submit"
          @blur="touch"
        />
      </UiField>

      <div class="mt-4">
        <div class="text-sm text-muted mb-2">
          Цвет тега
        </div>
        <TagColorPalette
          :model-value="selectedColor"
          @select="selectedColor = $event"
        />
      </div>

      <div class="flex justify-end gap-2 mt-5">
        <UiButton variant="text" color="text" size="sm" @click="cancel">
          Отмена
        </UiButton>
        <UiButton variant="solid" color="primary" size="sm" @click="submit">
          Создать
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { TagFormValues } from '@/composables/useTagValidation'
import type { TagColorKey } from '@/constants/tag'
import { ref, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiField from '@/components/ui/UiField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiModal from '@/components/ui/UiModal.vue'
import TagColorPalette from '@/components/views/list/ui/tag/TagColorPalette.vue'
import { useTagValidation } from '@/composables/useTagValidation'

const props = defineProps<{
  allNames?: Ref<string[]> | string[]
}>()

const emit = defineEmits<{
  create: [values: TagFormValues & { color: TagColorKey }]
}>()

const open = defineModel<boolean>({ default: false })
const selectedColor = ref<TagColorKey>('tag-1')

const namesRef = ref<string[]>([])
watch(
  () => props.allNames,
  (value) => {
    if (Array.isArray(value))
      namesRef.value = value
    else if (value)
      namesRef.value = value.value
  },
  { immediate: true },
)

const { form, v$, resetForm, touch } = useTagValidation(undefined, namesRef)

function close() {
  open.value = false
  selectedColor.value = 'tag-1'
  resetForm()
}

function cancel() {
  close()
}

function submit() {
  v$.value.$touch()
  if (v$.value.$invalid)
    return

  emit('create', {
    name: form.value.name.trim(),
    color: selectedColor.value,
  })
  close()
}
</script>
