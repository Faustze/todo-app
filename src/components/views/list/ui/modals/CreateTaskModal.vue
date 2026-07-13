<template>
  <UiModal v-model="open">
    <TaskForm mode="create" :tags="props.tags" @submit="handleSubmit" @cancel="handleCancel" />
  </UiModal>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag'
import type { TaskFormValues } from '@/types/task'
import UiModal from '@/components/ui/UiModal.vue'
import TaskForm from '@/components/views/list/ui/forms/TaskForm.vue'

const props = defineProps<{
  tags?: TaskTag[]
}>()

const emit = defineEmits<{
  create: [values: TaskFormValues]
}>()

const open = defineModel<boolean>({ default: false })

function handleSubmit(values: TaskFormValues) {
  emit('create', values)
  open.value = false
}

function handleCancel() {
  open.value = false
}
</script>
