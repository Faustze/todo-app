<script setup lang="ts">
  import { IconEraser } from '@tabler/icons-vue'

  defineOptions({ name: 'EmptyState' })
</script>

<template>
  <div class="empty-state">
    <IconEraser size="48" class="empty-state__icon" />
    <h3 class="empty-state__title">Задач пока нет</h3>
    <p class="empty-state__hint">Создайте первую задачу, чтобы начать</p>
    <slot />
  </div>
</template>

<style scoped>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
    gap: 0.75rem;
  }

  .empty-state__icon {
    color: var(--v0-muted);
    opacity: 0.5;
  }

  .empty-state__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--v0-text);
  }

  .empty-state__hint {
    font-size: 0.875rem;
    color: var(--v0-muted);
  }
</style>
