<template>
  <div class="flex flex-col gap-3">
    <TransitionGroup name="task" tag="div" class="flex flex-col gap-3">
      <TaskItem
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        :task="task"
        :number="index + 1"
        @edit="onEdit"
        @delete="onDelete"
        @show="onShow"
      />
    </TransitionGroup>

    <EmptyState v-if="filteredTasks.length === 0">
      <p class="text-muted">
        Задачи не найдены
      </p>
    </EmptyState>

    <UpdateTaskModal
      v-model="editOpen"
      :task="editingTask"
      @update="handleUpdate"
    />

    <DeleteTaskModal
      v-model="deleteOpen"
      :task-title="deletingTask?.title"
      @confirm="handleConfirmDelete"
      @cancel="deleteOpen = false; deletingTask = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskFormValues } from '@/types/task'
import { storeToRefs } from 'pinia'
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/views/list/EmptyState.vue'
import DeleteTaskModal from '@/components/views/list/ui/modals/DeleteTaskModal.vue'
import UpdateTaskModal from '@/components/views/list/ui/modals/UpdateTaskModal.vue'
import { useTasks } from '@/stores/useTasks'
import TaskItem from './TaskItem.vue'

const router = useRouter()
const tasksStore = useTasks()
const { filteredTasks } = storeToRefs(tasksStore)
const { update, remove } = tasksStore

const editingTask = shallowRef<Task | null>(null)
const editOpen = ref(false)

const deletingTask = shallowRef<{ id: string, title: string } | null>(null)
const deleteOpen = ref(false)

function onEdit(task: Task) {
  editingTask.value = task
  editOpen.value = true
}

function onDelete(id: string, title: string) {
  deletingTask.value = { id, title }
  deleteOpen.value = true
}

function onShow(id: string) {
  router.push({ path: `/task/${id}` })
}

function handleUpdate(id: string, values: TaskFormValues) {
  update(id, {
    title: values.title,
    description: values.description,
    priority: values.priority,
    status: values.status,
  })
}

function handleConfirmDelete() {
  if (deletingTask.value) {
    remove(deletingTask.value.id)
  }
  deleteOpen.value = false
  deletingTask.value = null
}
</script>
