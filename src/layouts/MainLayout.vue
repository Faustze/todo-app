<template>
  <div class="flex flex-col min-h-dvh bg-background text-text">
    <header class="flex items-center justify-between px-6 py-3 bg-surface border-b border-border">
      <div class="flex items-center gap-3">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Faustze/todo-app"
          class="flex items-center justify-center text-muted transition-colors duration-150 hover:text-primary"
          title="Source code"
        >
          <IconBrandGithub size="20" />
        </a>
      </div>
      <ThemeToggle />
    </header>
    <main class="flex-1 flex justify-center">
      <div class="w-full max-w-[720px] px-6 py-6">
        <RouterView />
      </div>
    </main>
    <footer class="text-center py-0.5 border-t border-border">
      <div class="flex items-center justify-center gap-2 text-xs">
        <p class="text-muted">
          &copy; 2026 Todo App — Builded with
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://0.vuetifyjs.com/"
          class="text-muted transition-colors duration-150 hover:text-primary hover:border-b-primary"
          title="Source code"
        >Vuetify0</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { IconBrandGithub } from '@tabler/icons-vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>
