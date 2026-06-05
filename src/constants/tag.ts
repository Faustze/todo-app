export const TagColorPalette = {
  'tag-1': '#6366f1',
  'tag-2': '#3b82f6',
  'tag-3': '#ef4444',
  'tag-4': '#0ea5e9',
  'tag-5': '#22c55e',
  'tag-6': '#f59e0b',
  'tag-7': '#64748b',
} as const

export type TagColorKey = keyof typeof TagColorPalette
