<template>
  <div class="empty">
    <PhListChecks class="empty__icon" size="32" />
    <p class="empty__text">
      <slot>No tasks match your filters</slot>
    </p>
    <p class="empty__hint">
      Try another status or period, or clear the search.
    </p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { PhListChecks } from '@phosphor-icons/vue'

defineOptions({ name: 'EmptyState' })
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  border-radius: 12px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-border);
  text-align: center;
}

.empty__icon {
  color: var(--v0-muted);
  margin-bottom: 4px;
}

.empty__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--v0-text);
}

.empty__hint {
  margin-top: 0;
  max-width: 320px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--v0-muted);
}
</style>
