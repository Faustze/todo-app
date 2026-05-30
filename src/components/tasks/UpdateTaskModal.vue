<template>
  <UiModal v-model="open">
    <div class="update-task-modal">
      <h2 class="update-task-modal__title">
        Редактирование задачи
      </h2>
      <hr class="border-gray-500 rounded-lg my-4">
      <TaskForm
        :key="task?.id"
        mode="edit"
        :initial="initialValues"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { Task, TaskFormValues } from '@/types/task'
import { computed } from 'vue'
import UiModal from '@/components/ui/UiModal.vue'
import TaskForm from './TaskForm.vue'

defineOptions({ name: 'UpdateTaskModal' })

const props = defineProps<{
  task: Task | null
}>()

const emit = defineEmits<{
  update: [id: string, values: TaskFormValues]
}>()

const open = defineModel<boolean>({ default: false })

const initialValues = computed<TaskFormValues>(() => ({
  title: props.task?.title ?? '',
  description: props.task?.description ?? '',
  status: props.task?.status ?? 'in-progress',
  priority: props.task?.priority ?? 'middle',
}))

function handleSubmit(values: TaskFormValues) {
  if (!props.task)
    return
  emit('update', props.task.id, values)
  open.value = false
}

function handleCancel() {
  open.value = false
}
</script>

<style scoped>
  .update-task-modal {
    padding: 1.5rem;
  }

  .update-task-modal__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-text);
    margin-bottom: 1.25rem;
  }
</style>
