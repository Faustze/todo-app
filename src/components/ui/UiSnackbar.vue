<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <TransitionGroup name="snackbar" tag="div" class="snackbar-container">
        <Snackbar.Root
          v-for="item in items.slice(0, 3)"
          :id="item.id"
          :key="item.id"
          class="snackbar"
          :class="`snackbar--${item.severity || 'info'}`"
        >
          <span class="snackbar__dot" />
          <Snackbar.Content class="snackbar__content">
            <span class="snackbar__text">{{ item.subject }}</span>
          </Snackbar.Content>
          <Snackbar.Close class="snackbar__close">
            <IconX size="14" />
          </Snackbar.Close>
          <span class="snackbar__progress" />
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
    align-items: flex-end;
    gap: 0.5rem;
    pointer-events: none;
  }

  @media (max-width: 599px) {
    .snackbar-container {
      bottom: 0;
      left: 0;
      right: 0;
      align-items: stretch;
      transform: none;
    }
  }

  .snackbar {
    position: relative;
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 290px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--v0-surface-2);
    border: 1px solid;
    box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  @media (max-width: 599px) {
    .snackbar {
      width: 100%;
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
  }

  .snackbar__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .snackbar--success {
    border-color: color-mix(in srgb, var(--v0-mint) 45%, transparent);
  }

  .snackbar--success .snackbar__dot {
    background: var(--v0-mint);
    box-shadow: 0 0 8px color-mix(in srgb, var(--v0-mint) 65%, transparent);
  }

  .snackbar--success .snackbar__progress {
    background: var(--v0-mint);
  }

  .snackbar--error {
    border-color: color-mix(in srgb, var(--v0-error) 45%, transparent);
  }

  .snackbar--error .snackbar__dot {
    background: var(--v0-error);
    box-shadow: 0 0 8px color-mix(in srgb, var(--v0-error) 65%, transparent);
  }

  .snackbar--error .snackbar__progress {
    background: var(--v0-error);
  }

  .snackbar--warning {
    border-color: color-mix(in srgb, var(--v0-warning) 45%, transparent);
  }

  .snackbar--warning .snackbar__dot {
    background: var(--v0-warning);
    box-shadow: 0 0 8px color-mix(in srgb, var(--v0-warning) 65%, transparent);
  }

  .snackbar--warning .snackbar__progress {
    background: var(--v0-warning);
  }

  .snackbar--info {
    border-color: color-mix(in srgb, var(--v0-primary) 45%, transparent);
  }

  .snackbar--info .snackbar__dot {
    background: var(--v0-primary);
    box-shadow: 0 0 8px color-mix(in srgb, var(--v0-primary) 65%, transparent);
  }

  .snackbar--info .snackbar__progress {
    background: var(--v0-primary);
  }

  .snackbar__content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    font-size: 13px;
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

  .snackbar__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    animation: snackbar-progress 3.2s linear forwards;
    transform-origin: left;
  }

  @keyframes snackbar-progress {
    to {
      width: 0%;
    }
  }

  /* TransitionGroup animations */
  .snackbar-enter-active,
  .snackbar-leave-active {
    transition: all 0.35s ease;
  }

  .snackbar-enter-from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }

  .snackbar-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem) scale(0.95);
  }

  .snackbar-move {
    transition: transform 0.3s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .snackbar-enter-active,
    .snackbar-leave-active,
    .snackbar-move,
    .snackbar__progress {
      transition: none;
      animation: none;
    }
  }
</style>
