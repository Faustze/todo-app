<template>
  <div :class="klass" class="ui-toggle">
    <Single.Root v-model="model">
      <Single.Item
        v-for="option in options"
        :key="option.value"
        v-slot="{ isSelected, attrs }"
        :value="option.value"
      >
        <button
          type="button"
          class="ui-toggle__option"
          :data-active="isSelected || undefined"
          v-bind="attrs"
        >
          {{ option.label }}
        </button>
      </Single.Item>
    </Single.Root>
  </div>
</template>

<script setup lang="ts">
import { Single } from '@vuetify/v0'

const { options = [], class: klass } = defineProps<{
  options?: Array<{ value: string, label: string }>
  class?: string
}>()

const model = defineModel<string>({ default: 'in-progress' })
</script>

<style scoped>
  .ui-toggle {
    display: inline-flex;
    background: var(--v0-surface-2);
    border-radius: 0.75rem;
    padding: 0.25rem;
    gap: 0.25rem;
  }

  .ui-toggle__option {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--v0-muted);
    font-weight: 500;
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      color var(--dur-color) var(--ease-out);
  }

  .ui-toggle__option[data-active] {
    background: var(--v0-surface);
    color: var(--v0-text);

  }
</style>
