<template>
  <Button.Root
    class="ui-button"
    :loading="loading"
    :disabled="disabled"
    :data-variant="variant"
    :data-size="size"
    :style="colorStyle"
  >
    <Button.Content>
      <slot />
    </Button.Content>

    <Button.Loading>
      <span class="ui-button__spinner">
        <PhCircleNotch size="20" />
      </span>
    </Button.Loading>
    <Button.HiddenInput />
  </Button.Root>
</template>

<script setup lang="ts">
import type { ThemeColorKey } from '@/tokens/colors'
import { PhCircleNotch } from '@phosphor-icons/vue'
import { Button } from '@vuetify/v0'
import { computed } from 'vue'

const { variant = 'solid', color } = defineProps<{
  variant?: 'solid' | 'outline' | 'text' | 'icon' | 'chip'
  size?: 'sm' | 'md' | 'lg' | 'extra-sm'
  color: ThemeColorKey
  loading?: boolean
  disabled?: boolean
}>()

const onMap: Record<string, string> = {
  'primary': 'on-primary',
  'primary-dark': 'on-primary',
  'primary-deep': 'on-primary',
  'secondary': 'on-secondary',
  'mint': 'on-secondary',
  'error': 'on-error',
  'info': 'on-info',
  'success': 'on-success',
  'warning': 'on-warning',
  'background': 'on-background',
  'surface': 'on-surface',
  'surface-variant': 'on-surface-variant',
}

const colorStyle = computed(() => {
  const onColor = onMap[color]
  return {
    '--btn-color': `var(--v0-${color})`,
    '--btn-on-color': onColor ? `var(--v0-${onColor})` : `var(--v0-on-surface)`,
    '--btn-hover-color': `color-mix(in srgb, var(--v0-${color}) 70%, var(--v0-text))`,
  }
})
</script>

<style>
  .ui-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      border-color var(--dur-color) var(--ease-out),
      color var(--dur-color) var(--ease-out),
      opacity var(--dur-color) var(--ease-out);
    border: 1px solid transparent;
  }

  /* === SOLID === */
  .ui-button[data-variant="solid"] {
    background: var(--btn-color);
    color: var(--btn-on-color);
    border-color: var(--btn-color);
  }

  /* === OUTLINE === */
  .ui-button[data-variant="outline"] {
    background: transparent;
    color: var(--btn-color);
    border-color: var(--btn-color);
  }

  /* === TEXT === */
  .ui-button[data-variant="text"] {
    background: transparent;
    color: var(--btn-color);
  }

  /* === ICON === */
  .ui-button[data-variant="icon"] {
    background: transparent;
    color: var(--btn-color);
    padding: 0;
  }

  /* === CHIP === */
  .ui-button[data-variant="chip"] {
    background: transparent;
    color: var(--btn-color);
    border-color: var(--btn-color);
  }

  /* === HOVER === */
  @media (hover: hover) {
    .ui-button[data-variant="solid"]:hover {
      background: color-mix(in srgb, var(--btn-color) 85%, var(--v0-text));
      border-color: color-mix(in srgb, var(--btn-color) 85%, var(--v0-text));
    }

    .ui-button[data-variant="outline"]:hover,
    .ui-button[data-variant="chip"]:hover {
      color: var(--btn-hover-color);
      border-color: var(--btn-hover-color);
    }

    .ui-button[data-variant="text"]:hover,
    .ui-button[data-variant="icon"]:hover {
      color: var(--btn-hover-color);
      background: color-mix(in srgb, var(--v0-text) 6%, transparent);
    }
  }

  .ui-button:not([data-disabled]):active {
    transform: scale(0.98);
  }

  .ui-button[data-size="extra-sm"] {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .ui-button[data-size="sm"] {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  /* Main button: 8px by 12px, text-base semibold */
  .ui-button[data-size="md"] {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .ui-button[data-size="lg"] {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  /* Responsive buttons: shrink on mobile */
  @media (max-width: 599px) {
    .ui-button[data-size="md"] {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    .ui-button[data-size="sm"] {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      line-height: 1rem;
    }
  }

  .ui-button[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ui-button[data-loading] {
    pointer-events: none;
    cursor: default;
  }

  .ui-button__spinner {
    position: absolute;
    inset: 0;
    margin: auto;
    display: inline-flex;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
