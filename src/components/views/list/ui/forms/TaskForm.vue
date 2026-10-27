<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <button type="button" class="task-form__close" @click="handleCancel">
      <PhX size="18" />
    </button>

    <h2 class="task-form__heading">
      {{ mode === 'create' ? 'New task' : 'Edit task' }}
    </h2>

    <Input.Root
      :id="titleId"
      v-model="form.title"
      :error="v$.title.$error"
      class="task-form__field"
    >
      <label :for="titleId" class="task-form__label">Title</label>
      <Input.Control class="task-form__input" placeholder="Enter task title" />
      <Input.Error>
        <span
          v-for="error of v$.title.$errors"
          :key="error.$uid"
          class="task-form__error"
        >
          {{ error.$message }}
        </span>
      </Input.Error>
    </Input.Root>

    <Input.Root
      :id="descId"
      v-model="form.description"
      :error="v$.description.$error"
      class="task-form__field"
    >
      <label :for="descId" class="task-form__label">Description</label>
      <Input.Control
        as="textarea"
        class="task-form__textarea"
        placeholder="Task description (optional)"
        rows="2"
      />
      <Input.Error>
        <span
          v-for="error of v$.description.$errors"
          :key="error.$uid"
          class="task-form__error"
        >
          {{ error.$message }}
        </span>
      </Input.Error>
    </Input.Root>

    <div v-if="mode === 'edit'" class="task-form__field">
      <label :for="statusId" class="task-form__label">Status</label>
      <UiSelect :id="statusId" v-model="form.status" :options="statusOptions" placeholder="Select status..." />
    </div>

    <div class="task-form__field">
      <span class="task-form__label">Priority</span>
      <div class="task-form__priority-grid">
        <button
          v-for="opt in priorityOptions"
          :key="opt.id"
          type="button"
          class="task-form__priority-btn"
          :class="{ [`task-form__priority-btn--${opt.id}`]: form.priority === opt.id }"
          @click="form.priority = opt.id"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="task-form__field">
      <span class="task-form__label">Tag</span>
      <div class="task-form__tag-grid">
        <button
          v-for="tag in tags ?? []"
          :key="tag.id"
          type="button"
          class="task-form__tag-pill"
          :class="{ 'task-form__tag-pill--active': form.tagId === tag.id }"
          :style="tagPillStyle(tag.color)"
          @click="form.tagId = form.tagId === tag.id ? undefined : tag.id"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>

    <div class="task-form__actions">
      <button type="button" class="task-form__cancel" @click="handleCancel">
        Cancel
      </button>
      <button type="submit" class="task-form__submit" :disabled="form.title.trim().length < 3">
        {{ mode === 'create' ? 'Create task' : 'Save changes' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import type { TaskTag } from '@/types/tag'
import type { TaskFormValues, TaskPriority, TaskStatus } from '@/types/task'
import { PhX } from '@phosphor-icons/vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { Input } from '@vuetify/v0'
import { computed, reactive, watch } from 'vue'
import UiSelect from '@/components/ui/UiSelect.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  initial?: Partial<TaskFormValues>
  tags?: TaskTag[]
}>()

const emit = defineEmits<{
  submit: [values: TaskFormValues]
  cancel: []
}>()

const uid = computed(() => `task-form-${props.mode}`)
const titleId = computed(() => `${uid.value}-title`)
const descId = computed(() => `${uid.value}-description`)
const statusId = computed(() => `${uid.value}-status-label`)

const form = reactive<TaskFormValues>({
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  status: props.initial?.status ?? 'in-progress',
  priority: props.initial?.priority ?? 'middle',
  tagId: props.initial?.tagId,
})

function tagPillStyle(color: TagColorKey) {
  return {
    color: `var(--v0-${color})`,
    background: `color-mix(in srgb, var(--v0-${color}) 12%, transparent)`,
  }
}

const rules = {
  title: {
    required: helpers.withMessage(
      'This field is required',
      required,
    ),
    minLength: helpers.withMessage(
      'Title must be at least 3 characters',
      minLength(3),
    ),
    maxLength: helpers.withMessage(
      ({ $params }) => `Title must not exceed ${$params.max} characters`,
      maxLength(200),
    ),
  },
  description: {
    maxLength: helpers.withMessage(
      ({ $params }) => `Description must not exceed ${$params.max} characters`,
      maxLength(500),
    ),
  },
}

const v$ = useVuelidate(rules, form)

const statusOptions: Array<{ id: TaskStatus, label: string }> = [
  { id: 'in-progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
  { id: 'cancel', label: 'Cancelled' },
]

const priorityOptions: Array<{ id: TaskPriority, label: string }> = [
  { id: 'low', label: 'Low' },
  { id: 'middle', label: 'Medium' },
  { id: 'high', label: 'High' },
]

async function handleSubmit() {
  const valid = await v$.value.$validate()
  if (!valid)
    return
  emit('submit', { ...form })
  if (props.mode === 'create') {
    resetForm()
  }
}

async function handleCancel() {
  emit('cancel')
  if (props.mode === 'create') {
    resetForm()
  }
}

function resetForm() {
  Object.assign(form, {
    title: '',
    description: '',
    priority: 'middle',
    status: 'in-progress',
    tagId: undefined,
  })
  v$.value.$reset()
}

// Keep form in sync with initial values (e.g. when UpdateTaskModal switches between tasks)
watch(() => props.initial, (val) => {
  if (val) {
    Object.assign(form, {
      title: val.title ?? '',
      description: val.description ?? '',
      status: val.status ?? 'in-progress',
      priority: val.priority ?? 'middle',
      tagId: val.tagId,
    })
  }
}, { deep: true })
</script>

<style scoped>
  .task-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .task-form__close {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--v0-muted);
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      color var(--dur-color) var(--ease-out);
  }

  .task-form__close:hover {
    background: color-mix(in srgb, var(--v0-text) 8%, transparent);
    color: var(--v0-text);
  }

  .task-form__close:active {
    transform: scale(0.98);
  }

  .task-form__heading {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--v0-text);
    padding-right: 32px;
  }

  .task-form__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .task-form__label {
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    color: var(--v0-muted);
  }

  .task-form__input,
  .task-form__textarea {
    padding: 8px 12px;
    border: 1px solid var(--v0-border);
    border-radius: 8px;
    background: var(--v0-surface-2);
    color: var(--v0-text);
    font-size: 0.875rem;
    line-height: 1.25rem;
    outline: none;
    transition:
      border-color var(--dur-color) var(--ease-out),
      box-shadow var(--dur-color) var(--ease-out);
  }

  .task-form__input::placeholder,
  .task-form__textarea::placeholder {
    color: var(--v0-muted);
  }

  .task-form__textarea {
    resize: vertical;
    min-height: 64px;
    font-family: inherit;
  }

  .task-form__input[data-focused],
  .task-form__textarea[data-focused] {
    border-color: var(--v0-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-primary) 20%, transparent);
  }

  .task-form__input[data-state="invalid"],
  .task-form__textarea[data-state="invalid"] {
    border-color: var(--v0-error);
  }

  .task-form__error {
    font-size: 0.75rem;
    line-height: 1rem;
    color: var(--v0-error);
  }

  .task-form__priority-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .task-form__priority-btn {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--v0-border);
    background: var(--v0-surface-2);
    color: var(--v0-muted);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      border-color var(--dur-color) var(--ease-out),
      background var(--dur-color) var(--ease-out),
      color var(--dur-color) var(--ease-out);
  }

  .task-form__priority-btn:hover {
    color: var(--v0-text);
    border-color: var(--v0-border-strong);
  }

  .task-form__priority-btn:active {
    transform: scale(0.98);
  }

  .task-form__priority-btn--low,
  .task-form__priority-btn--low:hover {
    border-color: color-mix(in srgb, var(--v0-muted) 60%, transparent);
    background: color-mix(in srgb, var(--v0-muted) 14%, transparent);
    color: var(--v0-text);
  }

  .task-form__priority-btn--middle,
  .task-form__priority-btn--middle:hover {
    border-color: color-mix(in srgb, var(--v0-primary) 60%, transparent);
    background: color-mix(in srgb, var(--v0-primary) 14%, transparent);
    color: var(--v0-primary);
  }

  .task-form__priority-btn--high,
  .task-form__priority-btn--high:hover {
    border-color: color-mix(in srgb, var(--v0-error) 60%, transparent);
    background: color-mix(in srgb, var(--v0-error) 14%, transparent);
    color: var(--v0-error);
  }

  .task-form__tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .task-form__tag-pill {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid transparent;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 500;
    cursor: pointer;
    opacity: 0.6;
    transition:
      opacity var(--dur-color) var(--ease-out),
      border-color var(--dur-color) var(--ease-out);
  }

  .task-form__tag-pill:hover {
    opacity: 0.85;
  }

  .task-form__tag-pill:active {
    transform: scale(0.98);
  }

  .task-form__tag-pill--active,
  .task-form__tag-pill--active:hover {
    opacity: 1;
    border-color: currentcolor;
  }

  .task-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }

  .task-form__cancel {
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--v0-muted);
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      color var(--dur-color) var(--ease-out);
  }

  .task-form__cancel:hover {
    color: var(--v0-text);
    background: color-mix(in srgb, var(--v0-text) 6%, transparent);
  }

  .task-form__cancel:active {
    transform: scale(0.98);
  }

  .task-form__submit {
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      opacity var(--dur-color) var(--ease-out);
  }

  .task-form__submit:not(:disabled):hover {
    background: var(--v0-primary-deep);
  }

  .task-form__submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .task-form__submit:not(:disabled):active {
    transform: scale(0.98);
  }
</style>
