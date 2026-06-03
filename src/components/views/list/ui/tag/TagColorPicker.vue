<template>
  <IconVignette
    size="20"
    class="tag-color-picker"
    :style="{
      '--tag-color': `var(--v0-${color})`,
      '--tag-hover-color': `var(--v0-${hoverColor})`,
    }"
  />
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import { IconVignette } from '@tabler/icons-vue'

withDefaults(defineProps<{
  color: TagColorKey
  hoverColor?: TagColorKey
}>(), {
  hoverColor: 'warning',
})
</script>

<style>
  .tag-color-picker {
    color: var(--tag-color);
    transition: color 0.15s ease;
  }

  @media (hover: hover) {
    .tag-color-picker:hover {
      color: var(--tag-hover-color);
    }
  }
</style>
