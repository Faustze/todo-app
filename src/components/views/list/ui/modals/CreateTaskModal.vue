<template>
  <UiModal v-model="open">
    <div class="pa-4">
      <h2 class="text-lg font-semibold text-text mb-5">
        Новая задача
      </h2>
      <hr class="border-gray-500 rounded-lg my-4">
      <TaskForm mode="create" :tags="props.tags" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
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
