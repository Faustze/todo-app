<template>
  <div class="empty">
    <p class="empty__text mono">
      <slot>No tasks match your filters</slot>
    </p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'EmptyState' })
</script>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px 24px;
  border: 1px dashed var(--v0-border-strong);
  border-radius: 12px;
  text-align: center;
}

.empty__text {
  font-size: 12px;
  color: var(--v0-muted);
}
</style>
