<template>
  <Dialog.Root v-model="open">
    <Dialog.Content class="ui-modal" :data-mobile="mobile || undefined">
      <slot />
    </Dialog.Content>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog, useBreakpoints } from '@vuetify/v0'
import { toRef } from 'vue'

const open = defineModel<boolean>({ default: false })

const breakpoints = useBreakpoints()
const mobile = toRef(() => breakpoints.smAndDown.value)
</script>

<style>
  .ui-modal {
    width: 90%;
    max-width: 480px;
    max-height: 85vh;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .ui-modal[data-mobile] {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 90%;
    max-width: none;
    max-height: 90vh;
    border-radius: 1rem 1rem 0 0;
  }
</style>
