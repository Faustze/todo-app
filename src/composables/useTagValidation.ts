import type { Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'

export interface TagFormValues {
  name: string
}

/**
 * Валидация формы тега (create / inline edit).
 *
 * @param originalName — оригинальное имя редактируемого тега (для исключения из проверки дубликатов)
 * @param allNames     — имена всех тегов (реактивная ссылка из store)
 */
export function useTagValidation(originalName?: Ref<string>, allNames?: Ref<string[]>): {
  form: Ref<TagFormValues>
  v$: Ref
  resetForm: () => void
  touch: () => void
} {
  const form = ref<TagFormValues>({ name: '' })

  const rules = computed(() => ({
    name: {
      required: helpers.withMessage('Название обязательно', required),
      minLength: helpers.withMessage('Минимум 2 символа', minLength(2)),
      maxLength: helpers.withMessage('Максимум 20 символов', maxLength(20)),
      unique: helpers.withMessage(
        'Тег с таким именем уже существует',
        (value: string) => {
          if (!value || !allNames?.value)
            return true
          const lower = value.toLowerCase()
          const origLower = originalName?.value?.toLowerCase()
          return !allNames.value.some((n) => {
            const nLower = n.toLowerCase()
            // Пропускаем оригинальное имя редактируемого тега
            if (nLower === origLower)
              return false
            return nLower === lower
          })
        },
      ),
    },
  }))

  const v$ = useVuelidate(rules, form)

  function resetForm(): void {
    form.value = { name: '' }
    v$.value.$reset()
  }

  function touch(): void {
    v$.value.$touch()
  }

  return { form, v$, resetForm, touch }
}
