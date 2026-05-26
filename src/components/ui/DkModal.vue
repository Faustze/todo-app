<script setup lang="ts">
  import { Dialog } from '@vuetify/v0'
  import { useBreakpoints } from '@vuetify/v0'
  import { toRef } from 'vue'

  defineOptions({ name: 'DkModal' })

  const open = defineModel<boolean>({ default: false })

  const breakpoints = useBreakpoints()
  const mobile = toRef(() => breakpoints.smAndDown.value)
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content class="dk-modal" :data-mobile="mobile || undefined">
      <slot />
    </Dialog.Content>
  </Dialog.Root>
</template>

<style>
  .dk-modal {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 90%;
    max-width: 480px;
    max-height: 85vh;
    background: var(--v0-surface);
    border: 1px solid var(--v0-border);
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .dk-modal[data-mobile] {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    width: 100%;
    max-width: none;
    max-height: 90vh;
    border-radius: 1rem 1rem 0 0;
  }
</style>
