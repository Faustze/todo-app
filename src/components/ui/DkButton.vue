<script setup lang="ts">
  import type { ThemeColorKey } from '@/tokens/colors'
  import { Button } from '@vuetify/v0'
  import { IconLoader } from '@tabler/icons-vue'
  import { computed } from 'vue';

  defineOptions({ name: 'DkButton' })

  const {
    variant = 'solid',
    size = 'md',
    color,
    loading = false,
    disabled = false,
  } = defineProps<{
    variant?: 'solid' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    color?: ThemeColorKey
    loading?: boolean
    disabled?: boolean
  }>()

  const colorStyle = computed(() => {
    if (!color) return {}
    const onMap: Record<string, string> = {
      primary: 'on-primary',
      secondary: 'on-secondary',
      error: 'on-error',
      info: 'on-info',
      success: 'on-success',
      warning: 'on-warning',
      background: 'on-background',
      surface: 'on-surface',
      'surface-variant': 'on-surface-variant',
    }
    const onColor = onMap[color]
    return {
      '--btn-color': `var(--v0-${color})`,
      '--btn-on-color': onColor ? `var(--v0-${onColor})` : `var(--v0-on-surface)`,
    }
  })
</script>

<template>
  <Button.Root
    class="dk-button"
    :class="{ 'dk-button--custom': color }"
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
      <span class="dk-button__spinner">
        <IconLoader size="22" />
      </span>
    </Button.Loading>
    <Button.HiddenInput>

    </Button.HiddenInput>
  </Button.Root>
</template>

<style>
  .dk-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .dk-button[data-variant="solid"] {
    background: var(--v0-primary);
    color: var(--v0-on-primary);
    border: none;
  }

  .dk-button[data-variant="outline"] {
    background: transparent;
    color: var(--v0-primary);
    border: 1px solid var(--v0-primary);
  }

  .dk-button[data-variant="ghost"] {
    background: transparent;
    color: var(--v0-text);
    border: none;
    &:hover {
      color: var(--v0-primary)
    }
  }

  .dk-button--custom[data-variant="solid"] {
    background: var(--btn-color);
    color: var(--btn-on-color);
  }

  .dk-button--custom[data-variant="outline"] {
    color: var(--btn-color);
    border-color: var(--btn-color);
  }

  .dk-button--custom[data-variant="ghost"] {
    color: var(--btn-color);
  }

  .dk-button[data-size="sm"] {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .dk-button[data-size="md"] {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .dk-button[data-size="lg"] {
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
  }

  .dk-button[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dk-button[data-loading] {
    pointer-events: none;
    cursor: default;
  }

  .dk-button__spinner {
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
