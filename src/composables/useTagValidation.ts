import type { Ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'

export interface TagFormValues {
  name: string
}

/**
 * Tag form validation (create / inline edit).
 *
 * @param originalName — original name of the tag being edited (to exclude from duplicate check)
 * @param allNames     — names of all tags (reactive reference from store)
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
      required: helpers.withMessage('Name is required', required),
      minLength: helpers.withMessage('Minimum 2 characters', minLength(2)),
      maxLength: helpers.withMessage('Maximum 20 characters', maxLength(20)),
      unique: helpers.withMessage(
        'A tag with this name already exists',
        (value: string) => {
          if (!value || !allNames?.value)
            return true
          const lower = value.toLowerCase()
          const origLower = originalName?.value?.toLowerCase()
          return !allNames.value.some((n) => {
            const nLower = n.toLowerCase()
            // Skip the original name of the tag being edited
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
