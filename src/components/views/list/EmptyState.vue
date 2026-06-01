<template>
  <div class="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
    <IconEraser size="48" class="text-muted opacity-50" />
    <h3 class="text-lg font-semibold text-text">
      Задач пока нет
    </h3>
    <p class="text-sm text-muted">
      Создайте первую задачу, чтобы начать
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IconEraser } from '@tabler/icons-vue'
</script>
