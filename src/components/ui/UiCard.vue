<template>
  <Atom as="div" class="ui-card">
    <slot />
  </Atom>
</template>

<script setup lang="ts">
import { Atom } from '@vuetify/v0'
</script>

<style>
  .ui-card {
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 0.75rem;
    padding: 1.5rem;
    height: 100%;
  }
</style>
