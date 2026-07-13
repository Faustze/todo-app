<template>
  <Input.Root
    v-model="query"
    :label="placeholder"
    :rules="[minLengthRule]"
    validate-on="input"
  >
    <div class="search">
      <svg class="search__icon" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </svg>

      <Input.Control
        class="search__control"
        :placeholder="placeholder"
      />

      <div v-if="loading" class="search__spinner" />
      <kbd v-else class="search__kbd mono">{{ shortcutLabel }}</kbd>
    </div>

    <Input.Error v-slot="{ errors }" class="search__error">
      <span v-for="error in errors" :key="error">{{ error }}</span>
    </Input.Error>
  </Input.Root>
</template>

<script setup lang="ts">
import { Input } from '@vuetify/v0'
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{
  loading: boolean
  count: number
  placeholder?: string
}>()

const query = defineModel<string>('query', { default: '' })

const shortcutLabel = /Mac/i.test(navigator.platform ?? navigator.userAgent) ? '⌘K' : 'Ctrl K'

function minLengthRule(v: unknown): string | true {
  return typeof v === 'string' && v.length > 0 && v.length < 2
    ? 'Must be at least 2 characters'
    : true
}

function onKeydown(e: KeyboardEvent) {
  const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
  if (isShortcut) {
    e.preventDefault()
    document.querySelector<HTMLInputElement>('.search__control')?.focus()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 330px;
}

@media (max-width: 640px) {
  .search {
    max-width: none;
  }
}

.search__icon {
  position: absolute;
  left: 11px;
  width: 15px;
  height: 15px;
  color: var(--v0-muted);
  pointer-events: none;
}

.search__control {
  width: 100%;
  padding: 9px 62px 9px 34px;
  border-radius: 9px;
  border: 1px solid var(--v0-border);
  background: var(--v0-surface);
  color: var(--v0-text);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search__control::placeholder {
  color: var(--v0-muted);
}

.search__control:focus {
  border-color: color-mix(in srgb, var(--v0-primary) 65%, transparent);
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--v0-primary) 18%, transparent),
    0 0 18px color-mix(in srgb, var(--v0-primary) 15%, transparent);
}

.search__kbd {
  position: absolute;
  right: 8px;
  padding: 2px 6px;
  font-size: 10px;
  color: var(--v0-muted);
  border: 1px solid var(--v0-border);
  background: var(--v0-surface-2);
  border-radius: 6px;
  pointer-events: none;
}

.search__spinner {
  position: absolute;
  right: 11px;
  width: 14px;
  height: 14px;
  border: 2px solid var(--v0-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: search-spin 0.7s linear infinite;
}

@keyframes search-spin {
  to {
    transform: rotate(360deg);
  }
}

.search__error {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--v0-error);
}
</style>
