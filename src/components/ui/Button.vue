<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'flat' | 'outlined' | 'ghost'
  color?: 'primary' | 'secondary' | 'error' | 'warning'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'flat',
  color: 'primary',
})
</script>

<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, `btn--${color}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: $radius-md;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;

  @include focus-ring(var(--btn-color));

  &:hover:not(:disabled)  { opacity: 0.88; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled              { opacity: 0.4; cursor: not-allowed; }
  &--loading              { pointer-events: none; }

  // --- color задаёт CSS-переменные, variant их использует ---

  &--primary {
    --btn-color:    var(--v0-primary);
    --btn-on-color: var(--v0-on-primary);
  }

  &--secondary {
    --btn-color:    var(--v0-secondary);
    --btn-on-color: var(--v0-on-secondary);
  }

  &--error {
    --btn-color:    var(--v0-error);
    --btn-on-color: var(--v0-on-primary);
  }

  &--warning {
    --btn-color:    var(--v0-warning);
    --btn-on-color: var(--v0-on-primary);
  }

  // --- variant только читает --btn-color, не знает о конкретных цветах ---

  &--flat {
    background: var(--btn-color);
    color: var(--btn-on-color);
  }

  &--outlined {
    background: transparent;
    color: var(--btn-color);
    border: 1px solid var(--btn-color);

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--btn-color) 8%, transparent);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--btn-color);

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--btn-color) 8%, transparent);
    }
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: $radius-full;
    animation: spin 0.6s linear infinite;
  }

  @include breakpoint(md) {
    padding: 10px 20px;
    font-size: 1rem;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
