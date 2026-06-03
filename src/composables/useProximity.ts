interface ProximityReturnType {
  PROXIMITY_RANGE: number
  MAX_SCALE: number
  HAS_HOVER: boolean
  onPointerMove: (e: PointerEvent) => void
  onPointerLeave: (e: PointerEvent) => void
}

export function useProximity(cls: string): ProximityReturnType {
  // Proximity highlight: items near cursor get subtle scale + brightness boost
  // Only on hover-capable devices (desktop), skip touch
  const PROXIMITY_RANGE = 160 // px — radius of influence
  const MAX_SCALE = 1.02
  const HAS_HOVER = window.matchMedia('(hover: hover)').matches

  function onPointerMove(e: PointerEvent): void {
    if (!HAS_HOVER)
      return
    const container = e.currentTarget as HTMLElement
    const items = container.querySelectorAll<HTMLElement>(`.${cls}`)
    const mouseY = e.clientY

    items.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2
      const dist = Math.abs(mouseY - centerY)
      const t = Math.max(0, 1 - dist / PROXIMITY_RANGE)

      el.style.scale = String(1 + t * (MAX_SCALE - 1))
      el.style.filter = t > 0 ? `brightness(${1 + t * 0.06})` : ''
    })
  }

  function onPointerLeave(e: PointerEvent): void {
    if (!HAS_HOVER)
      return
    const container = e.currentTarget as HTMLElement
    const items = container.querySelectorAll<HTMLElement>(`.${cls}`)
    items.forEach((el) => {
      el.style.scale = ''
      el.style.filter = ''
    })
  }

  return {
    PROXIMITY_RANGE,
    MAX_SCALE,
    HAS_HOVER,
    onPointerMove,
    onPointerLeave,
  }
}
