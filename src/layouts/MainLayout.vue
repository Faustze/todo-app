<script setup lang="ts">
  import ThemeToggle from '@/components/ThemeToggle.vue'
  import { IconBrandGithub } from '@tabler/icons-vue'
</script>

<template>
  <div class="main-layout">
    <header class="main-layout__header">
      <div class="main-layout__brand">
        <a
          href="https://github.com/Faustze/todo-app"
          target="_blank"
          rel="noopener noreferrer"
          class="main-layout__github"
          title="Source code"
        >
          <IconBrandGithub size="20" />
        </a>
      </div>
      <ThemeToggle />
    </header>
    <main class="main-layout__main">
      <div class="main-layout__content">
        <RouterView />
      </div>
    </main>
    <footer class="main-layout__footer">
      <span class="text-muted">&copy; 2026 Todo App — Builded with Vuetify0</span>
    </footer>
  </div>
</template>

<style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    background: var(--v0-background);
    color: var(--v0-text);
  }

  .main-layout__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background: var(--v0-surface);
    border-bottom: 1px solid var(--v0-border);
  }

  .main-layout__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .main-layout__github {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v0-muted);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .main-layout__github:hover {
    color: var(--v0-text);
  }

  .main-layout__main {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .main-layout__content {
    width: 100%;
    max-width: 720px;
    padding: 1.5rem;
  }

  .text-muted {
    color: var(--v0-muted);
    font-size: 0.875rem;
  }

  .main-layout__footer {
    text-align: center;
    padding: 1rem;
    border-top: 1px solid var(--v0-border);
  }
</style>
