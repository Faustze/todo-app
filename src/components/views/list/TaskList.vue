<template>
  <div class="flex flex-col">
    <TransitionGroup
      name="task"
      tag="div"
      class="flex flex-col gap-2 task-list"
      @pointermove="onPointerMove"
      @pointerleave="onPointerLeave"
    >
      <TaskItem
        v-for="(task, index) in tasks"
        :key="task.id"
        :task="task"
        :number="index + 1"
        class="task-list__item"
        @edit="onEdit"
        @delete="onDelete"
        @show="onShow"
      />
    </TransitionGroup>

    <EmptyState v-if="tasks.length === 0">
      <p class="text-muted">
        Задачи не найдены
      </p>
    </EmptyState>

    <UpdateTaskModal
      v-model="editOpen"
      :task="editingTask"
      :tags="tags"
      @update="handleUpdate"
    />

    <DeleteTaskModal
      v-model="deleteOpen"
      :task-title="deletingTask?.title"
      @confirm="handleDelete"
      @cancel="deleteOpen = false; deletingTask = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag.ts'
import type { TaskFormValues, TaskWithTag } from '@/types/task'
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/views/list/EmptyState.vue'
import DeleteTaskModal from '@/components/views/list/ui/modals/DeleteTaskModal.vue'
import UpdateTaskModal from '@/components/views/list/ui/modals/UpdateTaskModal.vue'
import { useProximity } from '@/composables/useProximity.ts'
import TaskItem from './TaskItem.vue'

const props = defineProps<{
  tasks: TaskWithTag[]
  tags: TaskTag[]
}>()

const emits = defineEmits<{
  edit: [id: string, values: TaskFormValues]
  delete: [id: string]
  show: [id: string]
}>()
const router = useRouter()
const { onPointerMove, onPointerLeave } = useProximity('task-list__item')

const editingTask = shallowRef<TaskWithTag | null>(null)
const editOpen = ref(false)

const deletingTask = shallowRef<{ id: string, title: string } | null>(null)
const deleteOpen = ref(false)

function onEdit(task: TaskWithTag) {
  editingTask.value = task
  editOpen.value = true
}

function handleUpdate(id: string, values: TaskFormValues) {
  emits('edit', id, values)
  editOpen.value = false
}

function handleDelete() {
  if (deletingTask.value) {
    emits('delete', deletingTask.value.id)
  }
  deleteOpen.value = false
}

function onDelete(id: string) {
  const task = props.tasks.find(t => t.id === id)
  if (task) {
    deletingTask.value = { id: task.id, title: task.title }
    deleteOpen.value = true
  }
}

function onShow(id: string) {
  router.push({ path: `/task/${id}` })
}
</script>
