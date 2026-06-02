<template>
  <Input.Root
    v-model="query"
    :label="placeholder"
    :rules="[minLengthRule]"
    validate-on="input"
  >
    <div class="relative">
      <Input.Control
        class="w-full pl-10 pr-3 py-1.5 rounded-sm border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-focused:border-primary data-[state=invalid]:border-error transition-colors focus-within:border-primary"
        :placeholder="placeholder"
      />

      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-on-surface-variant"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" x2="16.65" y1="21" y2="16.65" />
      </svg>

      <div
        v-if="loading"
        class="absolute right-3 top-1/2 -translate-y-1/2 size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div class="flex justify-between mt-1">
      <Input.Error v-slot="{ errors }" class="text-xs text-error">
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </Input.Error>

      <!-- <span v-if="query.length >= 2" class="text-xs text-on-surface-variant">
        {{ count }} результат{{ count === 1 ? '' : 'а' }}
      </span> -->
    </div>
  </Input.Root>
</template>

<script setup lang="ts">
import { Input } from '@vuetify/v0'

defineProps<{
  loading: boolean
  count: number
  placeholder?: string
}>()

const query = defineModel<string>('query', { default: '' })

function minLengthRule(v: unknown): string | true {
  return typeof v === 'string' && v.length > 0 && v.length < 2
    ? 'Должно быть минимум 2 символа'
    : true
}
</script>
