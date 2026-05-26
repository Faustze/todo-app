<script setup lang="ts">
import { Button } from '@vuetify/v0'
import { useAttrs, computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    variant?: 'flat' | 'outlined' | 'ghost' | 'icon'
    color?: 'primary' | 'secondary' | 'error' | 'warning'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'flat',
    color: 'primary',
    type: 'button',
  }
)

const attrs = useAttrs()
const isDisabled = computed(() => props.disabled || props.loading)

const colorMap = {
  primary: { '--btn-text': 'var(--v0-on-primary)' },
  secondary: { '--btn-text': 'var(--v0-on-secondary)' },
  error: { '--btn-text': 'var(--v0-on-primary)' },
  warning: { '--btn-text': 'var(--v0-on-primary)' },
} as const

const variantStyles = computed(() => {
  const base: Record<string, string> = {
    '--btn-bg': 'transparent',
    '--btn-border': 'transparent',
  }
  const c = props.color
  switch (props.variant) {
    case 'flat':
      return { ...base, '--btn-bg': `var(--v0-${c})`, ...colorMap[c] }
    case 'outlined':
      return { ...base, '--btn-border': `var(--v0-${c})`, '--btn-text': `var(--v0-${c})` }
    case 'ghost':
      return { ...base, '--btn-text': `var(--v0-${c})` }
    case 'icon':
      return { ...base, '--btn-text': `var(--v0-${c})` }
    default:
      return base
  }
})
</script>

<template>
  <Button.Root
    v-bind="attrs"
    :disabled="isDisabled"
    :loading="props.loading"
    :type="props.type"
    class="btn"
    :class="`btn--${props.variant}`"
    :style="variantStyles"
  >
    <Button.Loading>
      <span class="btn__spinner" />
    </Button.Loading>
    <slot />
  </Button.Root>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  height: 36px;
  padding: 0 var(--spacing-3);
  border: 1px solid var(--btn-border);
  border-radius: var(--radius-md);
  background: var(--btn-bg);
  color: var(--btn-text);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: opacity 0.15s ease, background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn:focus-visible {
  outline-color: var(--btn-text);
}

.btn:hover:not([data-disabled]) {
  opacity: 0.88;
}

.btn:active:not([data-disabled]) {
  transform: scale(0.97);
}

.btn[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn--icon {
  padding: 0;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
