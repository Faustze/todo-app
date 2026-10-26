<template>
  <PhCircle
    :size="size"
    class="tag-color-picker"
    :style="{ '--tag-color': `var(--v0-${color})` }"
  />
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import { PhCircle } from '@phosphor-icons/vue'

withDefaults(defineProps<{
  color?: TagColorKey
  size?: string
}>(), {
  color: 'tag-6',
  size: '20',
})
</script>

<style>
  .tag-color-picker {
    color: var(--tag-color);
    transition: color var(--dur-color) var(--ease-out);
  }
</style>
