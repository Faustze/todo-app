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
  }

  .ui-button[data-variant="solid"] {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border: none;
    &:hover {
      background: var(--v0-primary-dark)
    }
  }

  .ui-button[data-variant="outline"] {
    background: transparent;
    color: var(--v0-primary);
    border: 1px solid var(--v0-primary);
    &:hover {
      color: var(--v0-primary-dark)
    }
  }

  .ui-button[data-variant="chip"] {
    background: transparent;
    border: 1px solid var(--v0-divider);
    &:hover {
      color: var(--v0-primary-dark);
      border: 1px solid var(--v0-primary);
    }
  }

  .ui-button[data-variant="ghost"] {
    background: transparent;
    color: var(--v0-text);
    border: none;
    &:hover {
      color: var(--v0-primary)
    }
  }

  .ui-button[data-variant="icon"] {
    background: transparent;
    color: var(--v0-text);
    border: none;
    padding: 0px !important;
    &:hover {
      color: var(--v0-primary)
    }
  }

  .ui-button--custom[data-variant="solid"] {
    background: var(--btn-color);
    color: var(--btn-on-color);
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
    &:hover {
      color: var(--btn-color); /* Darker */
    }
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
