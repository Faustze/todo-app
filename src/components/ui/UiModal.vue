<template>
  <Dialog.Root :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <Dialog.Content
      class="ui-modal"
      :data-mobile="mobile || undefined"
      :blocking="blocking"
      :close-on-click-outside="!blocking"
      @keydown.esc="$emit('update:modelValue', false)"
    >
      <slot />
    </Dialog.Content>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog, useBreakpoints } from '@vuetify/v0'
import { toRef } from 'vue'

defineProps<{
  modelValue?: boolean
  blocking?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const breakpoints = useBreakpoints()
// Fullscreen sheet on phones and tablets, centered card from desktop up
const mobile = toRef(() => breakpoints.mdAndDown.value)
</script>

<style>
  .ui-modal {
    position: relative;
    width: min(440px, 100%);
    max-height: 85vh;
    padding: 24px;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 16px;
    box-shadow: 0 24px 80px -12px color-mix(in srgb, var(--v0-background) 40%, rgba(0, 0, 0, 0.5));
    overflow: auto;
    opacity: 0;
    transform: translateY(16px) scale(0.98);
    transition:
      opacity var(--dur-color) var(--ease-out),
      transform var(--dur-move) var(--ease-out),
      overlay var(--dur-move) allow-discrete,
      display var(--dur-move) allow-discrete;
  }

  .ui-modal[open] {
    opacity: 1;
    transform: none;
  }

  @starting-style {
    .ui-modal[open] {
      opacity: 0;
      transform: translateY(16px) scale(0.98);
    }
  }

  .ui-modal::backdrop {
    background: color-mix(in srgb, #000 55%, transparent);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition:
      opacity var(--dur-color) var(--ease-out),
      overlay var(--dur-color) allow-discrete,
      display var(--dur-color) allow-discrete;
  }

  .ui-modal[open]::backdrop {
    opacity: 1;
  }

  @starting-style {
    .ui-modal[open]::backdrop {
      opacity: 0;
    }
  }

  .ui-modal[data-mobile] {
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    transform: translateY(24px);
  }

  .ui-modal[data-mobile][open] {
    transform: none;
  }

  @starting-style {
    .ui-modal[data-mobile][open] {
      transform: translateY(24px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ui-modal {
      transition: none;
    }
  }
</style>
