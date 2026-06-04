<template>
  <div class="flex flex-col gap-1">
    <Input.Root :id="id ?? fieldId" v-model="model" :error="!!error || !!errorMessage" v-bind="$attrs">
      <slot :field-id="id ?? fieldId" />
    </Input.Root>
    <span v-if="errorMessage" class="text-xs text-error">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@vuetify/v0'
import { useId } from 'vue'

defineProps<{
  id?: string
  error?: boolean
  errorMessage?: string
}>()

const model = defineModel<string>({ default: '' })
const fieldId = useId()
</script>
