<template>
  <UiModal v-model="open">
    <div class="edit-tag-modal p-4">
      <h2 class="edit-tag-modal__title text-lg font-semibold text-text mb-3">
        Edit tag
      </h2>

      <UiField :error-message="v$.name.$errors[0]?.$message">
        <UiInput
          v-model="form.name"
          placeholder="Tag name"
          @keydown.enter.prevent="submit"
          @blur="touch"
        />
      </UiField>

      <div class="mt-4">
        <div class="text-sm text-muted mb-2">
          Tag color
        </div>
        <TagColorPalette
          :model-value="selectedColor"
          @select="selectedColor = $event"
        />
      </div>

      <div class="flex justify-end gap-2 mt-5">
        <UiButton variant="text" color="text" size="sm" @click="cancel">
          Cancel
        </UiButton>
        <UiButton variant="solid" color="primary" size="sm" @click="submit">
          Save
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import type { TagFormValues } from '@/composables/useTagValidation'
import type { TagColorKey } from '@/constants/tag'
import type { TaskTag } from '@/types/tag'
import { ref, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiField from '@/components/ui/UiField.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiModal from '@/components/ui/UiModal.vue'
import TagColorPalette from '@/components/views/list/ui/tag/TagColorPalette.vue'
import { useTagValidation } from '@/composables/useTagValidation'

const props = defineProps<{
  tag: TaskTag | null
  allNames?: Ref<string[]> | string[]
}>()

const emit = defineEmits<{
  save: [values: TagFormValues & { color: TagColorKey }]
}>()

const open = defineModel<boolean>({ default: false })
const selectedColor = ref<TagColorKey>('tag-1')
const originalName = ref('')

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

const { form, v$, resetForm, touch } = useTagValidation(originalName, namesRef)

watch(
  () => props.tag,
  (tag) => {
    if (tag) {
      originalName.value = tag.name
      form.value.name = tag.name
      selectedColor.value = tag.color
      v$.value.$reset()
    }
    else {
      originalName.value = ''
      form.value.name = ''
      selectedColor.value = 'tag-1'
      v$.value.$reset()
    }
  },
  { immediate: true },
)

function close() {
  open.value = false
  resetForm()
  selectedColor.value = 'tag-1'
  originalName.value = ''
}

function cancel() {
  close()
}

function submit() {
  v$.value.$touch()
  if (v$.value.$invalid)
    return

  emit('save', {
    name: form.value.name.trim(),
    color: selectedColor.value,
  })
  close()
}
</script>

<style scoped>
.edit-tag-modal__title {
  color: var(--v0-text);
}
</style>
