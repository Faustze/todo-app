import type { Ref } from 'vue'
import { useBreakpoints } from '@vuetify/v0'
import { ref, watch } from 'vue'

interface UseSidebarReturn {
  isOpen: Ref<boolean>
  isMobile: Ref<boolean>
  toggle: () => void
  close: () => void
  open: () => void
}

let isMobile: Ref<boolean> | undefined
let isOpen: Ref<boolean> | undefined

export function useSidebar(): UseSidebarReturn {
  // useBreakpoints() needs an active component instance to inject the
  // app-level context, so this must run lazily on first real call rather
  // than at module scope (which would silently fall back to isMobile=true)
  if (!isMobile || !isOpen) {
    isMobile = useBreakpoints().smAndDown
    isOpen = ref(!isMobile.value)

    // Auto-close when crossing into mobile, auto-open back on desktop
    watch(isMobile, (mobile) => {
      isOpen!.value = !mobile
    })
  }

  function toggle(): void {
    isOpen!.value = !isOpen!.value
  }

  function close(): void {
    isOpen!.value = false
  }

  function open(): void {
    isOpen!.value = true
  }

  return { isOpen, isMobile, toggle, close, open }
}
