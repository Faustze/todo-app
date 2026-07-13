<template>
  <div class="shell">
    <AmbientBackground />
    <Sidebar />
    <div
      v-if="isMobile && isOpen"
      class="shell__backdrop"
      @click="close"
    />
    <main class="shell__main">
      <div v-if="!isOpen" class="shell__topbar">
        <button
          type="button"
          class="shell__reopen"
          title="Show sidebar"
          @click="open"
        >
          <IconLayoutSidebarLeftExpand size="18" />
        </button>
      </div>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { IconLayoutSidebarLeftExpand } from '@tabler/icons-vue'
import AmbientBackground from '@/components/layout/AmbientBackground.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { useSidebar } from '@/composables/useSidebar'

const { isOpen, isMobile, open, close } = useSidebar()
</script>

<style scoped>
.shell {
  position: relative;
  display: flex;
  height: 100dvh;
  overflow: hidden;
  background: var(--v0-background);
  color: var(--v0-text);
}

.shell__main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.shell__backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: color-mix(in srgb, #000 55%, transparent);
  backdrop-filter: blur(2px);
}

.shell__topbar {
  display: flex;
  align-items: center;
  padding: 16px 32px 0;
}

.shell__reopen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid var(--v0-border);
  border-radius: 8px;
  background: var(--v0-surface);
  color: var(--v0-muted);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
}

.shell__reopen:hover {
  border-color: color-mix(in srgb, var(--v0-primary) 50%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--v0-primary) 20%, transparent);
  color: var(--v0-primary);
}
</style>
