<template>
  <div class="tag-color-palette">
    <button
      v-for="key in colorKeys"
      :key="key"
      type="button"
      class="tag-color-palette__swatch"
      :class="{ 'is-selected': modelValue === key }"
      :style="{ '--swatch-color': `var(--v0-${key})` }"
      :title="key"
      @click="emit('select', key)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import { TagColorPalette as paletteColors } from '@/constants/tag'

defineProps<{
  modelValue: TagColorKey
}>()

const emit = defineEmits<{
  select: [color: TagColorKey]
}>()

const colorKeys = Object.keys(paletteColors) as TagColorKey[]
</script>

<style>
  .tag-color-palette {
    display: grid;
    justify-items: center;
    align-items: center;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .tag-color-palette__swatch {
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    background: var(--swatch-color);
    border: 2px solid transparent;
    cursor: pointer;
    transition:
      transform var(--dur-color) var(--ease-out),
      border-color var(--dur-color) var(--ease-out);
  }

  .tag-color-palette__swatch:hover {
    transform: scale(1.1);
  }

  .tag-color-palette__swatch:active {
    transform: scale(0.98);
  }

  .tag-color-palette__swatch.is-selected {
    border-color: var(--v0-text);
    box-shadow: 0 0 0 2px var(--v0-surface), 0 0 0 4px var(--swatch-color);
  }
</style>
