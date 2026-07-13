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
    padding: 22px;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border-strong);
    border-radius: 14px;
    box-shadow: 0 24px 80px -12px rgba(0, 0, 0, 0.6);
    overflow: auto;
    opacity: 0;
    transform: translateY(16px) scale(0.96);
    transition:
      opacity 0.25s ease,
      transform 0.32s cubic-bezier(0.16, 0.84, 0.3, 1),
      overlay 0.32s allow-discrete,
      display 0.32s allow-discrete;
  }

  .ui-modal[open] {
    opacity: 1;
    transform: none;
  }

  @starting-style {
    .ui-modal[open] {
      opacity: 0;
      transform: translateY(16px) scale(0.96);
    }
  }

  .ui-modal::backdrop {
    background: color-mix(in srgb, #000 55%, transparent);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: opacity 0.25s ease, overlay 0.25s allow-discrete, display 0.25s allow-discrete;
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
