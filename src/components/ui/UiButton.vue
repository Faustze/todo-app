<template>
  <Button.Root
    class="ui-button"
    :class="{ 'ui-button--custom': color }"
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
        <IconLoader size="22" />
      </span>
    </Button.Loading>
    <Button.HiddenInput />
  </Button.Root>
</template>

<script setup lang="ts">
import type { ThemeColorKey } from '@/tokens/colors'
import { IconLoader } from '@tabler/icons-vue'
import { Button } from '@vuetify/v0'
import { computed } from 'vue'

const {
  variant = 'solid',
  size = 'md',
  color,
  loading = false,
  disabled = false,
} = defineProps<{
  variant?: 'solid' | 'outline' | 'ghost' | 'icon' | 'chip'
  size?: 'sm' | 'md' | 'lg' | 'extra-sm'
  color?: ThemeColorKey
  loading?: boolean
  disabled?: boolean
}>()

const colorStyle = computed(() => {
  if (!color)
    return {}
  const onMap: Record<string, string> = {
    'primary': 'on-primary',
    'secondary': 'on-secondary',
    'error': 'on-error',
    'info': 'on-info',
    'success': 'on-success',
    'warning': 'on-warning',
    'background': 'on-background',
    'surface': 'on-surface',
    'surface-variant': 'on-surface-variant',
  }
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
    border-radius: 0.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
  }

  .ui-button[data-variant="solid"] {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border-color: var(--v0-primary);
  }

  .ui-button[data-variant="outline"] {
    background: transparent;
    color: var(--v0-primary);
    border-color: var(--v0-primary);
  }

  .ui-button[data-variant="chip"] {
    background: transparent;
    border-color: var(--v0-divider);
  }

  .ui-button[data-variant="ghost"] {
    background: transparent;
    color: var(--v0-text);
  }

  .ui-button[data-variant="icon"] {
    background: transparent;
    color: var(--v0-text);
    padding: 0px !important;
  }

  @media (hover: hover) {
    .ui-button[data-variant="solid"]:hover {
      background: var(--v0-primary-dark);
      border-color: var(--v0-primary-dark);
    }

    .ui-button--custom[data-variant="solid"]:hover {
      background: color-mix(in srgb, var(--btn-color) 80%, black);
      border-color: color-mix(in srgb, var(--btn-color) 80%, black);
    }

    .ui-button[data-variant="outline"]:hover {
      color: var(--v0-primary-dark);
    }

    .ui-button[data-variant="chip"]:hover {
      color: var(--v0-primary-dark);
      border-color: var(--v0-primary);
    }

    .ui-button[data-variant="ghost"]:hover {
      color: var(--v0-primary);
    }

    .ui-button[data-variant="icon"]:hover {
      color: var(--v0-primary);
    }

    .ui-button--custom[data-variant="outline"]:hover {
      color: var(--btn-hover-color);
    }

    .ui-button--custom[data-variant="ghost"]:hover {
      color: var(--btn-hover-color);
    }

    .ui-button--custom[data-variant="icon"]:hover {
      color: var(--btn-hover-color);
    }

    .ui-button--custom[data-variant="chip"]:hover {
      color: var(--btn-hover-color);
      border-color: var(--btn-hover-color);
    }
  }

  .ui-button--custom[data-variant="outline"] {
    color: var(--btn-color);
    border-color: var(--btn-color);
  }

  .ui-button--custom[data-variant="ghost"] {
    color: var(--btn-color);
  }

  .ui-button--custom[data-variant="icon"] {
    color: var(--btn-color);
  }

  .ui-button--custom[data-variant="chip"] {
    color: var(--btn-color);
  }

  .ui-button[data-size="extra-sm"] {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }

  .ui-button[data-size="sm"] {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .ui-button[data-size="md"] {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .ui-button[data-size="lg"] {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  /* Адаптивные кнопки: shrink on mobile */
  @media (max-width: 599px) {
    .ui-button[data-size="md"] {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }
    .ui-button[data-size="sm"] {
      padding: 0.25rem 0.625rem;
      font-size: 0.75rem;
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
