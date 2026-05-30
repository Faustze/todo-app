<template>
  <UiModal v-model="open">
    <div class="create-task-modal">
      <h2 class="create-task-modal__title">
        Новая задача
      </h2>
      <hr class="border-gray-500 rounded-lg my-4">
      <TaskForm mode="create" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { TaskFormValues } from '@/types/task'
import UiModal from '@/components/ui/UiModal.vue'
import TaskForm from './TaskForm.vue'

defineOptions({ name: 'CreateTaskModal' })

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

<style scoped>
  .create-task-modal {
    padding: 1.5rem;
  }

  .create-task-modal__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-text);
    margin-bottom: 1.25rem;
  }
</style>
