<script setup lang="ts">
  import { Input } from '@vuetify/v0'
  import type { TaskFormValues, TaskStatus, TaskPriority } from '@/types/task'
  import { useVuelidate } from '@vuelidate/core'
  import {
    required,
    maxLength,
    minLength,
    helpers,
  } from '@vuelidate/validators'
  import { reactive } from 'vue'

  defineOptions({ name: 'TaskForm' })

  const props = defineProps<{
    mode: 'create' | 'edit'
    initial?: Partial<TaskFormValues>
  }>()

  const emit = defineEmits<{
    submit: [values: TaskFormValues]
    cancel: []
  }>()

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

  const statusOptions: Array<{ value: TaskStatus, label: string }> = [
    { value: 'in-progress', label: 'В процессе' },
    { value: 'done', label: 'Выполнено' },
    { value: 'cancel', label: 'Отменено' },
  ]

  const priorityOptions: Array<{ value: TaskPriority, label: string }> = [
    { value: 'low', label: 'Низкий' },
    { value: 'middle', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
  ]

  async function handleSubmit() {
    const valid = await v$.value.$validate()
    if (!valid) return
    emit('submit', { ...form })
  }
</script>

<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <Input.Root
      v-model="form.title"
      :error="v$.title.$error"
      class="task-form__field"
    >
      <label class="task-form__label">Название</label>
      <Input.Control
        class="task-form__input"
        placeholder="Введите название задачи"
      />
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
      v-model="form.description"
      :error="v$.description.$error"
      class="task-form__field"
    >
      <label class="task-form__label">Описание</label>
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
          class="task-form__error"
        >
          {{ error.$message }}
        </span>
      </Input.Error>
    </Input.Root>

    <div class="task-form__row">
      <div class="task-form__field">
        <label class="task-form__label">Статус</label>
        <select v-model="form.status" class="task-form__select">
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="task-form__field">
        <label class="task-form__label">Приоритет</label>
        <select v-model="form.priority" class="task-form__select">
          <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="task-form__actions">
      <button type="button" class="task-form__btn task-form__btn--ghost" @click="emit('cancel')">
        Отмена
      </button>
      <button type="submit" class="task-form__btn task-form__btn--primary">
        {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
      </button>
    </div>
  </form>
</template>

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
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-primary) 20%, transparent);
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
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-primary) 20%, transparent);
  }

  .task-form__textarea[data-state="invalid"] {
    border-color: var(--v0-error);
  }

  .task-form__select {
    padding: 0.625rem 2.5rem 0.625rem 0.88rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
    background: var(--v0-surface) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 0.75rem center;
    color: var(--v0-text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s ease;
    appearance: none;
    width: 100%;
  }

  .task-form__select:focus {
    border-color: var(--v0-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-primary) 20%, transparent);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23818cf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  }

  .task-form__select option {
    background: var(--v0-surface);
    color: var(--v0-text);
  }

  .task-form__error {
    font-size: 0.8125rem;
    color: var(--v0-error);
  }

  .task-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .task-form__btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .task-form__btn--ghost {
    background: transparent;
    color: var(--v0-muted);
    border: 1px solid var(--v0-border);
  }

  .task-form__btn--ghost:hover {
    background: var(--v0-surface);
    color: var(--v0-text);
  }

  .task-form__btn--primary {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border: none;
  }

  .task-form__btn--primary:hover {
    opacity: 0.9;
  }
</style>
