<script setup lang="ts">
  import type { TaskFormValues } from '@/types/task'
  import DkModal from '@/components/ui/DkModal.vue'
  import TaskForm from './TaskForm.vue'

  defineOptions({ name: 'CreateTaskModal' })

  const open = defineModel<boolean>({ default: false })

  const emit = defineEmits<{
    create: [values: TaskFormValues]
  }>()

  function handleSubmit(values: TaskFormValues) {
    emit('create', values)
    open.value = false
  }

  function handleCancel() {
    open.value = false
  }
</script>

<template>
  <DkModal v-model="open">
    <div class="create-task-modal">
      <h2 class="create-task-modal__title">Новая задача</h2>
      <TaskForm mode="create" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
  </DkModal>
</template>

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
