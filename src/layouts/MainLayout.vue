<script setup lang="ts">
import vite from '@/assets/vite.svg'
import vue from '@/assets/vue.svg'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <header class="w-full h-14">
      <div class="flex flex-row items-center justify-between px-4">
        <div class="flex flex-row gap-2">
          <h6 class="text-on-primary">
            Todo App
          </h6>
          <img :src="vite" width="24" height="24">
          <img :src="vue" width="24" height="24">
          <!-- Vuetify0 -->
          <!-- UnoCSS -->
        </div>
        <div class="shrink-0 text-on-primary">
          <span>avatar</span>
        </div>
      </div>
    </header>
    <main class="w-full grow-1">
      <section class="max-w-2xl mx-auto">
        <div class="p-4">
          <RouterView />
        </div>
      </section>
    </main>
    <footer class="shrink-0 p-1">
      @Faustze
    </footer>
  </div>
</template>
