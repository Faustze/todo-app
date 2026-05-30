<template>
  <div class="ui-layout" :data-mobile="mobile || undefined">
    <aside v-if="$slots.sidebar" class="ui-layout__sidebar">
      <slot name="sidebar" />
    </aside>

    <main class="ui-layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from '@vuetify/v0'
import { toRef } from 'vue'

const breakpoints = useBreakpoints()
const mobile = toRef(() => breakpoints.smAndDown.value)
</script>

<style scoped>
  .ui-layout {
    display: flex;
    flex: 1;
    min-height: 0;
    background: var(--v0-background);
  }

  .ui-layout__sidebar {
    width: 260px;
    flex-shrink: 0;
    border-right: 1px solid var(--v0-border);
    background: var(--v0-surface);
    padding: 1rem;
    overflow-y: auto;
  }

  .ui-layout__main {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .ui-layout[data-mobile] {
    flex-direction: column;
  }

  .ui-layout[data-mobile] .ui-layout__sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--v0-border);
  }
</style>
