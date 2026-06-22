<template>
  <form class="task-form" @submit.prevent="handleSubmit">
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
          class="task-form__error text-xs"
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
        rows="3"
      />
      <Input.Error>
        <span
          v-for="error of v$.description.$errors"
          :key="error.$uid"
          class="task-form__error text-xs"
        >
          {{ error.$message }}
        </span>
      </Input.Error>
    </Input.Root>

    <div class="task-form__row">
      <div class="task-form__field">
        <label :for="statusId" class="task-form__label">Status</label>
        <UiSelect v-model="form.status" :options="statusOptions" placeholder="Select status..." />
      </div>
      <div class="task-form__field">
        <label :for="priorityId" class="task-form__label">Priority</label>
        <UiSelect v-model="form.priority" :options="priorityOptions" placeholder="Select priority..." />
      </div>
    </div>

    <div class="task-form__field">
      <label :for="tagIdId" class="task-form__label">Tag</label>
      <UiSelect v-model="form.tagId" :options="tagOptions" placeholder="Select tag..." />
    </div>

    <div class="task-form__actions">
      <UiButton variant="text" color="text" size="sm" @click="handleCancel">
        <p class="text-text hover:text-primary">
          Cancel
        </p>
      </UiButton>
      <UiButton variant="solid" color="primary" size="sm" @click="handleSubmit">
        {{ mode === 'create' ? 'Create' : 'Save' }}
      </UiButton>
    </div>

    <div class="task-form__close_btn">
      <UiButton variant="text" color="text" @click="handleCancel">
        <IconX class="text-text hover:text-primary" size="22" />
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag'
import type { TaskFormValues, TaskPriority, TaskStatus } from '@/types/task'
import { IconX } from '@tabler/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { Input } from '@vuetify/v0'
import { computed, reactive, watch } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
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
const priorityId = computed(() => `${uid.value}-priority`)
const statusId = computed(() => `${uid.value}-status-label`)
const tagIdId = computed(() => `${uid.value}-tag`)

const form = reactive<TaskFormValues>({
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  status: props.initial?.status ?? 'in-progress',
  priority: props.initial?.priority ?? 'middle',
  tagId: props.initial?.tagId,
})

const tagOptions = computed(() => [
  { id: '', label: 'No tag' },
  ...(props.tags ?? []).map(t => ({ id: t.id, label: t.name })),
])

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
  { id: 'in-progress', label: 'In Progress' },
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
    gap: 1.25rem;
  }

  .task-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .task-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .task-form__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--v0-text);
  }

  .task-form__input {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
    background: var(--v0-surface);
    color: var(--v0-text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .task-form__input[data-focused] {
    border-color: var(--v0-primary);
  }

  .task-form__input[data-state="invalid"] {
    border-color: var(--v0-error);
  }

  .task-form__textarea {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
    background: var(--v0-surface);
    color: var(--v0-text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s ease;
    resize: vertical;
    min-height: 60px;
  }

  .task-form__textarea[data-focused] {
    border-color: var(--v0-primary);
  }

  .task-form__textarea[data-state="invalid"] {
    border-color: var(--v0-error);
  }

  .task-form__error {
    color: var(--v0-error);
  }

  .task-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .task-form__close_btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
</style>
