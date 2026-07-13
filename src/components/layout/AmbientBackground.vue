<template>
  <div class="ambient" aria-hidden="true">
    <span class="ambient__orb ambient__orb--a" />
    <span class="ambient__orb ambient__orb--b" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AmbientBackground' })
</script>

<style scoped>
.ambient {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.ambient__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}

.ambient__orb--a {
  width: 520px;
  height: 520px;
  top: -180px;
  left: 18%;
  background: radial-gradient(circle, var(--v0-primary-deep), transparent 65%);
  opacity: 0.15;
  animation: ambient-drift-a 26s ease-in-out infinite alternate;
}

.ambient__orb--b {
  width: 480px;
  height: 480px;
  bottom: -220px;
  right: -80px;
  filter: blur(100px);
  background: radial-gradient(circle, var(--v0-mint), transparent 65%);
  opacity: 0.105;
  animation: ambient-drift-b 32s ease-in-out infinite alternate;
}

@keyframes ambient-drift-a {
  to {
    transform: translate(60px, 40px) scale(1.15);
  }
}

@keyframes ambient-drift-b {
  to {
    transform: translate(-70px, -30px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient__orb {
    animation: none;
  }
}
</style>

<style>
html[data-theme='light'] .ambient__orb--a {
  opacity: 0.1;
}

html[data-theme='light'] .ambient__orb--b {
  opacity: 0.07;
}
</style>
