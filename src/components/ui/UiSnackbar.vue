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
            <PhX size="16" />
          </Snackbar.Close>
          <span class="snackbar__progress" />
        </Snackbar.Root>
      </TransitionGroup>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>

<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'
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
    width: 320px;
    padding: 12px;
    border-radius: 12px;
    background: var(--v0-surface-2);
    border: 1px solid var(--v0-border);
    box-shadow: 0 12px 32px -8px color-mix(in srgb, var(--v0-background) 40%, rgba(0, 0, 0, 0.4));
    overflow: hidden;
  }

  @media (max-width: 599px) {
    .snackbar {
      width: 100%;
      border-radius: 0;
    }
  }

  .snackbar__dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .snackbar--success .snackbar__dot {
    background: var(--v0-success);
  }

  .snackbar--success .snackbar__progress {
    background: var(--v0-success);
  }

  .snackbar--error .snackbar__dot {
    background: var(--v0-error);
  }

  .snackbar--error .snackbar__progress {
    background: var(--v0-error);
  }

  .snackbar--warning .snackbar__dot {
    background: var(--v0-warning);
  }

  .snackbar--warning .snackbar__progress {
    background: var(--v0-warning);
  }

  .snackbar--info .snackbar__dot {
    background: var(--v0-primary);
  }

  .snackbar--info .snackbar__progress {
    background: var(--v0-primary);
  }

  .snackbar__content {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    line-height: 1.25rem;
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
    transition: color var(--dur-color) var(--ease-out);
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
    opacity: 0.6;
    /* Linear on purpose: the bar is a countdown, not a movement */
    animation: snackbar-progress 3.2s linear forwards;
    transform-origin: left;
  }

  @keyframes snackbar-progress {
    to {
      transform: scaleX(0);
    }
  }

  /* TransitionGroup animations */
  .snackbar-enter-active,
  .snackbar-leave-active {
    transition:
      opacity var(--dur-color) var(--ease-out),
      transform var(--dur-move) var(--ease-out);
  }

  .snackbar-enter-from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }

  .snackbar-leave-to {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }

  .snackbar-move {
    transition: transform var(--dur-move) var(--ease-out);
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
