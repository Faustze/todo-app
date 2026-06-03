<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <Input.Root
      :id="titleId"
      v-model="form.title"
      :error="v$.title.$error"
      class="task-form__field"
    >
      <label :for="titleId" class="task-form__label">Название</label>
      <Input.Control class="task-form__input" placeholder="Введите название задачи" />
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
      <label :for="descId" class="task-form__label">Описание</label>
      <Input.Control
        as="textarea"
        class="task-form__textarea"
        placeholder="Описание задачи (необязательно)"
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
        <label :for="statusId" class="task-form__label">Статус</label>
        <UiSelect v-model="form.status" :options="statusOptions" placeholder="Выберите статус..." />
      </div>
      <div class="task-form__field">
        <label :for="priorityId" class="task-form__label">Приоритет</label>
        <UiSelect v-model="form.priority" :options="priorityOptions" placeholder="Выберите приоритет..." />
      </div>
    </div>

    <div class="task-form__actions">
      <UiButton variant="ghost" @click="emit('cancel')">
        Отмена
      </UiButton>
      <UiButton variant="solid" @click="handleSubmit">
        {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
      </UiButton>
    </div>

    <div class="task-form__close_btn">
      <UiButton variant="ghost" @click="emit('cancel')">
        <IconX size="22" />
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TaskFormValues, TaskPriority, TaskStatus } from '@/types/task'
import { IconX } from '@tabler/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { Input } from '@vuetify/v0'
import { computed, reactive } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'

defineOptions({ name: 'TaskForm' })

const props = defineProps<{
  mode: 'create' | 'edit'
  initial?: Partial<TaskFormValues>
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

const form = reactive<TaskFormValues>({
  title: props.initial?.title ?? '',
  description: props.initial?.description ?? '',
  status: props.initial?.status ?? 'in-progress',
  priority: props.initial?.priority ?? 'middle',
})

const rules = {
  title: {
    required: helpers.withMessage(
      'Поле обязательно для заполнения',
      required,
    ),
    minLength: helpers.withMessage(
      'Название должно содержать минимум 3 символа',
      minLength(3),
    ),
    maxLength: helpers.withMessage(
      ({ $params }) => `Название не должно превышать ${$params.max} символов`,
      maxLength(200),
    ),
  },
  description: {
    maxLength: helpers.withMessage(
      ({ $params }) => `Описание не должно превышать ${$params.max} символов`,
      maxLength(500),
    ),
  },
}

const v$ = useVuelidate(rules, form)

const statusOptions: Array<{ id: TaskStatus, label: string }> = [
  { id: 'in-progress', label: 'В процессе' },
  { id: 'done', label: 'Выполнено' },
  { id: 'cancel', label: 'Отменено' },
]

const priorityOptions: Array<{ id: TaskPriority, label: string }> = [
  { id: 'low', label: 'Низкий' },
  { id: 'middle', label: 'Средний' },
  { id: 'high', label: 'Высокий' },
]

async function handleSubmit() {
  const valid = await v$.value.$validate()
  if (!valid)
    return
  emit('submit', { ...form })
}
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
    right: 0.5rem;
  }
</style>
