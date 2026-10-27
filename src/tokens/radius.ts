// Tailwind radius values only (redesign skill). Nested shapes with a gap under 32px
// use inner = outer - gap, applied only when the result is above 2px.
export const radius = {
  'xs': '2px',
  'sm': '4px',
  'md': '6px',
  'lg': '8px',
  'xl': '12px',
  '2xl': '16px',
  'full': '9999px',
} as const
