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
        v-for="(entry, index) in visibleEntries"
        :key="`${entry.task.id}-${entry.epoch}`"
        :task="entry.task"
        :number="index + 1"
        class="task-list__item"
        :style="{ '--stagger': `${Math.min(index * 40, 360)}ms` }"
        @edit="onEdit"
        @delete="onDelete"
        @show="onShow"
      />
    </TransitionGroup>

    <EmptyState v-if="tasks.length === 0">
      <template #action>
        <button type="button" class="task-list__reset" @click="resetFilters">
          Reset filters
        </button>
      </template>
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
import { storeToRefs } from 'pinia'
import { ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/views/list/EmptyState.vue'
import DeleteTaskModal from '@/components/views/list/ui/modals/DeleteTaskModal.vue'
import UpdateTaskModal from '@/components/views/list/ui/modals/UpdateTaskModal.vue'
import { useProximity } from '@/composables/useProximity.ts'
import { useTasks } from '@/stores/useTasks'
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
const tasksStore = useTasks()
const { resetFilters } = tasksStore
const { filter, sortBy, sortDir, datePreset } = storeToRefs(tasksStore)

interface VisibleEntry {
  task: TaskWithTag
  epoch: number
}

let epoch = 0
const immediateRemovalIds = new Set<string>()
const visibleEntries = ref<VisibleEntry[]>(props.tasks.map(task => ({ task, epoch })))

// Filter/sort/period changes replay the full entrance stagger
watch([filter, sortBy, sortDir, datePreset], () => {
  epoch += 1
  visibleEntries.value = props.tasks.map(task => ({ task, epoch }))
})

watch(() => props.tasks, (next) => {
  const nextIds = new Set(next.map(t => t.id))
  const prevIds = new Set(visibleEntries.value.map(e => e.task.id))

  // Update entries still present; keep removed ones' last snapshot until
  // their grace-period timeout below actually drops them from the array
  const kept = visibleEntries.value.map((entry) => {
    const updated = next.find(t => t.id === entry.task.id)
    return updated ? { ...entry, task: updated } : entry
  })
  const added = next
    .filter(t => !prevIds.has(t.id))
    .map(task => ({ task, epoch }))
  visibleEntries.value = [...kept, ...added].sort((a, b) => {
    const ai = next.findIndex(t => t.id === a.task.id)
    const bi = next.findIndex(t => t.id === b.task.id)
    if (ai === -1)
      return 1
    if (bi === -1)
      return -1
    return ai - bi
  })

  // Removed items: collapse immediately if explicitly deleted, otherwise
  // wait so the checkbox/strike animation is visible before the row leaves
  for (const prevEntry of prevIds) {
    if (nextIds.has(prevEntry))
      continue
    const id = prevEntry
    const delay = immediateRemovalIds.has(id) ? 0 : 550
    immediateRemovalIds.delete(id)
    setTimeout(() => {
      visibleEntries.value = visibleEntries.value.filter(e => e.task.id !== id)
    }, delay)
  }
}, { deep: true })

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
    immediateRemovalIds.add(deletingTask.value.id)
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

<style scoped>
.task-list__reset {
  padding: 7px 16px;
  border-radius: 8px;
  border: 1px solid var(--v0-border);
  background: transparent;
  color: var(--v0-text);
  font-size: 12.5px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.task-list__reset:hover {
  border-color: color-mix(in srgb, var(--v0-primary) 50%, transparent);
  color: var(--v0-primary);
}
</style>

<style>
.task-enter-active {
  transition:
    opacity 0.5s cubic-bezier(0.16, 0.84, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 0.84, 0.3, 1);
  transition-delay: var(--stagger, 0ms);
}

.task-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.task-leave-active {
  transition:
    opacity 0.34s ease,
    transform 0.34s ease,
    max-height 0.34s ease,
    padding-top 0.34s ease,
    padding-bottom 0.34s ease,
    margin-bottom 0.34s ease;
  overflow: hidden;
  max-height: 120px !important;
}

.task-leave-to {
  opacity: 0 !important;
  transform: translateX(36px) !important;
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
  border-width: 0 !important;
}

.task-move {
  transition: transform 0.34s ease;
}

@media (prefers-reduced-motion: reduce) {
  .task-enter-active,
  .task-leave-active,
  .task-move {
    transition: none !important;
  }
}
</style>
