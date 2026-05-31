<template>
  <Input.Root :id="id ?? fieldId" v-model="model" v-bind="$attrs">
    <slot :field-id="id ?? fieldId" />
  </Input.Root>
</template>

<script setup lang="ts">
import { Input } from '@vuetify/v0'
import { useId } from 'vue'

defineProps<{
  id?: string
  error?: boolean
}>()

const model = defineModel<string>({ default: '' })
const fieldId = useId()
</script>
