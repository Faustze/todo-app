<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <button type="button" class="task-form__close" @click="handleCancel">
      <IconX size="18" />
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
      <label :for="titleId" class="task-form__label mono">TITLE</label>
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
      <label :for="descId" class="task-form__label mono">DESCRIPTION</label>
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
      <label :for="statusId" class="task-form__label mono">STATUS</label>
      <UiSelect :id="statusId" v-model="form.status" :options="statusOptions" placeholder="Select status..." />
    </div>

    <div class="task-form__field">
      <span class="task-form__label mono">PRIORITY</span>
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
      <span class="task-form__label mono">TAG</span>
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
        {{ mode === 'create' ? 'Create' : 'Save' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import type { TaskTag } from '@/types/tag'
import type { TaskFormValues, TaskPriority, TaskStatus } from '@/types/task'
import { IconX } from '@tabler/icons-vue'
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
    borderColor: `color-mix(in srgb, var(--v0-${color}) 45%, transparent)`,
    background: `color-mix(in srgb, var(--v0-${color}) 10%, transparent)`,
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
    gap: 16px;
  }

  .task-form__close {
    position: absolute;
    top: 22px;
    right: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--v0-muted);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .task-form__close:hover {
    background: color-mix(in srgb, var(--v0-text) 8%, transparent);
    color: var(--v0-text);
  }

  .task-form__heading {
    font-size: 16px;
    font-weight: 650;
    color: var(--v0-text);
    padding-right: 26px;
  }

  .task-form__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .task-form__label {
    font-size: 10.5px;
    letter-spacing: 0.1em;
    color: var(--v0-muted);
  }

  .task-form__input,
  .task-form__textarea {
    padding: 9px 12px;
    border: none;
    border-radius: 8px;
    background: var(--v0-surface-2);
    color: var(--v0-text);
    font-size: 13.5px;
    outline: none;
    transition: box-shadow 0.2s ease;
  }

  .task-form__textarea {
    resize: vertical;
    min-height: 52px;
    font-family: inherit;
  }

  .task-form__input[data-focused],
  .task-form__textarea[data-focused] {
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--v0-primary) 18%, transparent),
      0 0 18px color-mix(in srgb, var(--v0-primary) 15%, transparent);
  }

  .task-form__input[data-state="invalid"],
  .task-form__textarea[data-state="invalid"] {
    box-shadow: 0 0 0 1.5px var(--v0-error);
  }

  .task-form__error {
    font-size: 11px;
    color: var(--v0-error);
  }

  .task-form__priority-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .task-form__priority-btn {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid var(--v0-border);
    background: var(--v0-surface-2);
    color: var(--v0-muted);
    font-size: 12.5px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  .task-form__priority-btn--low {
    border-color: color-mix(in srgb, var(--v0-primary) 45%, transparent);
    background: color-mix(in srgb, var(--v0-primary) 13%, transparent);
    color: var(--v0-primary);
  }

  .task-form__priority-btn--middle {
    border-color: color-mix(in srgb, var(--v0-warning) 45%, transparent);
    background: color-mix(in srgb, var(--v0-warning) 13%, transparent);
    color: var(--v0-warning);
  }

  .task-form__priority-btn--high {
    border-color: color-mix(in srgb, var(--v0-error) 45%, transparent);
    background: color-mix(in srgb, var(--v0-error) 13%, transparent);
    color: var(--v0-error);
  }

  .task-form__tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .task-form__tag-pill {
    padding: 4px 12px;
    border-radius: 99px;
    border: 1px solid;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s ease, box-shadow 0.15s ease;
  }

  .task-form__tag-pill--active {
    opacity: 1;
    box-shadow: 0 0 10px color-mix(in srgb, currentcolor 45%, transparent);
  }

  .task-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
  }

  .task-form__cancel {
    padding: 8px 14px;
    border-radius: 9px;
    border: none;
    background: transparent;
    color: var(--v0-muted);
    font-size: 13px;
    cursor: pointer;
    transition: color 0.15s ease;
  }

  .task-form__cancel:hover {
    color: var(--v0-text);
  }

  .task-form__submit {
    padding: 8px 18px;
    border-radius: 9px;
    border: 1px solid color-mix(in srgb, var(--v0-primary) 60%, transparent);
    background: linear-gradient(180deg, var(--v0-primary), var(--v0-primary-deep));
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.18s ease;
  }

  .task-form__submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .task-form__submit:not(:disabled):active {
    transform: scale(0.97);
  }
</style>
