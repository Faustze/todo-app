import { defineConfig, presetWind4 } from 'unocss'
import { lightColors, radius, spacing } from './src/tokens'

export default defineConfig({
  presets: [presetWind4()],

  theme: {
    colors: Object.fromEntries(
      Object.keys(lightColors).map(key => [key, `var(--v0-${key})`]),
    ),
    spacing,
    borderRadius: radius,
    fontFamily: {
      mono: '"JetBrains Mono", ui-monospace, Consolas, monospace',
    },
  },

  shortcuts: {
    'btn-primary': 'bg-primary text-on-primary px-4 py-2 rounded-md',
    'card': 'bg-surface text-on-surface rounded-lg p-6',
  },
})
