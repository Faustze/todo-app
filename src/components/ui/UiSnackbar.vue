<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <TransitionGroup name="snackbar" tag="div" class="snackbar-container">
        <Snackbar.Root
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          class="snackbar"
          :class="`snackbar--${item.severity || 'info'}`"
        >
          <Snackbar.Content class="snackbar__content">
            <span class="snackbar__text">{{ item.subject }}</span>
          </Snackbar.Content>
          <Snackbar.Close class="snackbar__close">
            <IconX size="16" />
          </Snackbar.Close>
        </Snackbar.Root>
      </TransitionGroup>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import { Snackbar } from '@vuetify/v0'
</script>

<style>
  .snackbar-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
  }

  @media (max-width: 599px) {
    .snackbar-container {
      bottom: 0;
      left: 0;
      right: 0;
      transform: none;
    }
  }

  .snackbar {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border-width: 1px;
    border-style: solid;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 280px;
    max-width: 420px;
  }

  @media (max-width: 599px) {
    .snackbar {
      min-width: auto;
      max-width: none;
      width: 100%;
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
  }

  .snackbar--success {
    background: color-mix(in srgb, var(--v0-success) 12%, var(--v0-surface));
    border-color: var(--v0-success);
  }

  .snackbar--error {
    background: color-mix(in srgb, var(--v0-error) 12%, var(--v0-surface));
    border-color: var(--v0-error);
  }

  .snackbar--warning {
    background: color-mix(in srgb, var(--v0-warning) 12%, var(--v0-surface));
    border-color: var(--v0-warning);
  }

  .snackbar--info {
    background: color-mix(in srgb, var(--v0-primary) 12%, var(--v0-surface));
    border-color: var(--v0-primary);
  }

  .snackbar__content {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .snackbar__text {
    color: var(--v0-text);
  }

  .snackbar__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--v0-muted);
    transition: color 0.15s ease;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    .snackbar__close:hover {
      color: var(--v0-text);
    }
  }

  /* TransitionGroup animations */
  .snackbar-enter-active,
  .snackbar-leave-active {
    transition: all 0.3s ease;
  }

  .snackbar-enter-from {
    opacity: 0;
    transform: translateY(1rem) scale(0.95);
  }

  .snackbar-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem) scale(0.95);
  }

  .snackbar-move {
    transition: transform 0.3s ease;
  }
</style>
