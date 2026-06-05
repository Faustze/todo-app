<template>
  <Atom as="span" v-bind="slotProps.attrs">
    <slot v-bind="slotProps" />
  </Atom>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import { Atom } from '@vuetify/v0'
import { computed, toRef } from 'vue'

const props = defineProps<{
  color: TagColorKey
}>()

const emit = defineEmits<{
  remove: []
}>()

const classes = computed(() => [
  'inline-flex items-center gap-2 px-2 py-0.5 rounded-sm',
  'bg-surface-variant text-on-surface-variant',
].join(' '))

const slotProps = toRef(() => ({
  attrs: {
    class: classes.value,
    style: {
      border: `1px solid var(--v0-${props.color})`,
    },
    role: 'option',
  },
  onRemove: () => emit('remove'),
}))
</script>
