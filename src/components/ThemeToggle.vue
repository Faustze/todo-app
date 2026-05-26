<script setup lang="ts">
  import { IconSun, IconMoon } from '@tabler/icons-vue'
  import { IN_BROWSER, useStorage, useTheme } from '@vuetify/v0'
  import { watch } from 'vue'

  defineOptions({ name: 'ThemeToggle' })

  const storage = useStorage()
  const theme = useTheme()
  const storedTheme = storage.get<string>('theme')

  type ViewTransitionAPI = {
    startViewTransition: (update: () => void | Promise<void>) => {
      ready: Promise<void>
      finished: Promise<void>
    }
  }

  watch(() => theme.selectedId.value, id => {
    if (typeof id === 'string') {
      storedTheme.value = id
    }
  })

  function animateCircle(root: HTMLElement, x: number, y: number, radius: number, nextTheme: string) {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${radius}px at ${x}px ${y}px)`,
    ]

    const isDark = nextTheme === 'dark'
    const targetPseudo = isDark ? '::view-transition-new(root)' : '::view-transition-old(root)'
    const clipPathValue = isDark ? clipPath : [...clipPath].reverse()

    return root.animate(
      { clipPath: clipPathValue },
      {
        duration: 500,
        easing: 'ease-in-out',
        fill: 'both',
        pseudoElement: targetPseudo,
      },
    )
  }

  function toggleTheme(event: MouseEvent) {
    const nextTheme = theme.isDark.value ? 'light' : 'dark'
    event.stopPropagation()

    if (!IN_BROWSER) {
      theme.cycle()
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Fallback if View Transition API is unavailable or user prefers reduced motion
    if (reduceMotion) {
      theme.cycle()
      return
    }

    const doc = document as Document & ViewTransitionAPI
    if (!doc.startViewTransition) {
      theme.cycle()
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    const root = document.documentElement

    root.style.setProperty('--theme-transition-x', `${x}px`)
    root.style.setProperty('--theme-transition-y', `${y}px`)
    root.style.setProperty('--theme-transition-radius', `${endRadius}px`)
    root.dataset.themeTransition = nextTheme

    try {
      const transition = doc.startViewTransition(() => {
        theme.cycle()
      })

      if (!transition?.ready) {
        return
      }

      transition.ready
        .then(() => {
          animateCircle(root, x, y, endRadius, nextTheme)
        })
        .catch(() => {
          // ready rejected — theme already changed, just clean up
        })
        .finally(() => {
          transition.finished.finally(() => {
            root.style.removeProperty('--theme-transition-x')
            root.style.removeProperty('--theme-transition-y')
            root.style.removeProperty('--theme-transition-radius')
            root.removeAttribute('data-theme-transition')
          })
        })
    } catch {
      theme.cycle()
    }
  }
</script>

<template>
  <button
    class="theme-toggle"
    :title="theme.isDark.value ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <IconSun v-if="theme.isDark.value" class="theme-toggle__icon" />
    <IconMoon v-else class="theme-toggle__icon" />
  </button>
</template>

<style scoped>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--v0-border);
    border-radius: 0.5rem;
    background: var(--v0-surface);
    color: var(--v0-text);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .theme-toggle:hover {
    background: var(--v0-background);
    color: var(--v0-primary);
  }

  .theme-toggle__icon {
    width: 18px;
    height: 18px;
  }
</style>
