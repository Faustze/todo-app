<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <div class="main-layout">
    <header class="main-layout__header">
      <div class="main-layout__brand">
        <h1 class="main-layout__title">Todo App</h1>
        <a
          href="https://github.com/Faustze/todo-app"
          target="_blank"
          rel="noopener noreferrer"
          class="main-layout__github"
          title="Source code"
        >
          <svg class="main-layout__github-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
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
    gap: 1rem;
  }

  .main-layout__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--v0-text);
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

  .main-layout__github-icon {
    display: block;
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
