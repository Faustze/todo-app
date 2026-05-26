<script setup lang="ts">
  defineOptions({ name: 'EmptyState' })
</script>

<template>
  <div class="empty-state">
    <svg class="empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
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
