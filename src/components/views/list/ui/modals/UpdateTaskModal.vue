<template>
  <UiModal v-model="open">
    <div class="pa-4">
      <h2 class="text-lg font-semibold text-text mb-5">
        Редактирование задачи
      </h2>
      <hr class="border-gray-500 rounded-lg my-4">
      <TaskForm
        :key="task?.id"
        mode="edit"
        :initial="initialValues"
        :tags="effectiveTags"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag'
import type { TaskFormValues, TaskWithTag } from '@/types/task'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import UiModal from '@/components/ui/UiModal.vue'
import TaskForm from '@/components/views/list/ui/forms/TaskForm.vue'
import { useTags } from '@/stores/useTags'

const props = defineProps<{
  task: TaskWithTag | null
  tags?: TaskTag[]
}>()

const emit = defineEmits<{
  update: [id: string, values: TaskFormValues]
}>()

const open = defineModel<boolean>({ default: false })

// Используем теги из store, если не переданы через props
const tagsStore = useTags()
const { tags: storeTags } = storeToRefs(tagsStore)
const effectiveTags = computed(() => props.tags ?? storeTags.value)

const initialValues = computed((): TaskFormValues => {
  return {
    title: props.task?.title ?? '',
    description: props.task?.description ?? '',
    status: props.task?.status ?? 'in-progress',
    priority: props.task?.priority ?? 'middle',
    tagId: props.task?.tag?.id,
  }
})

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
