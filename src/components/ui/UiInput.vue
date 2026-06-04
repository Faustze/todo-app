<template>
  <Input.Root
    :id="fieldId"
    v-slot="{ isValid }"
    v-model="model"
    :label="label"
    :type="type"
    :rules="rules"
  >
    <div class="ui-input" :data-error="isValid === false || undefined">
      <label v-if="label" :for="fieldId" class="ui-input__label">
        {{ label }}
      </label>

      <Input.Control
        class="ui-input__control"
        :placeholder="placeholder"
      />

      <Input.Description v-if="description && isValid !== false" class="ui-input__description">
        {{ description }}
      </Input.Description>

      <Input.Error v-slot="{ errors: messages }">
        <span
          v-if="messages.length"
          class="ui-input__error"
        >
          {{ messages[0] }}
        </span>
      </Input.Error>
    </div>
  </Input.Root>
</template>

<script setup lang="ts">
import type { RuleInput } from '@vuetify/v0'
import { Input } from '@vuetify/v0'
import { useId } from 'vue'

const { label, description, type = 'text', placeholder, rules } = defineProps<{
  label?: string
  description?: string
  type?: string
  placeholder?: string
  rules?: RuleInput[]
}>()

const model = defineModel<string>({ default: '' })
const fieldId = useId()
</script>

<style scoped>
  .ui-input {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .ui-input__label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--v0-text);
  }

  .ui-input__control {
    padding: 0.3rem;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
    background: var(--v0-surface);
    color: var(--v0-text);
    font-size: 1rem;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .ui-input__control:focus {
    border-color: var(--v0-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--v0-primary) 20%, transparent);
  }

  .ui-input[data-error] .ui-input__control {
    border-color: var(--v0-error);
  }

  .ui-input__description {
    font-size: 0.8125rem;
    color: var(--v0-muted);
  }

  .ui-input__error {
    font-size: 0.8125rem;
    color: var(--v0-error);
  }
</style>
