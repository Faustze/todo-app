<template>
  <IconVignette
    :size="size"
    class="tag-color-picker"
    :style="{ '--tag-color': `var(--v0-${color})` }"
  />
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import { IconVignette } from '@tabler/icons-vue'

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
    transition: color 0.15s ease;
  }
</style>
