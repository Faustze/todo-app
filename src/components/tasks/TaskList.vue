<template>
  <div class="task-list">
    <TransitionGroup name="task" tag="div" class="task-list__items">
      <TaskItem
        v-for="(task, index) in filteredTasks"
        :key="task.id"
        :task="task"
        :number="index + 1"
        @edit="onEdit"
        @delete="onDelete"
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
import EmptyState from '@/components/common/EmptyState.vue'
import { useTasks } from '@/stores/useTasks'
import DeleteTaskModal from './DeleteTaskModal.vue'
import TaskItem from './TaskItem.vue'
import UpdateTaskModal from './UpdateTaskModal.vue'

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

<style scoped>
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .task-list__items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .task-move,
  .task-enter-active,
  .task-leave-active {
    transition: all 0.3s ease;
  }

  .task-enter-from,
  .task-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }

  .task-leave-active {
    position: absolute;
  }
</style>
