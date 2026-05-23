import { defineConfig, presetWind4 } from 'unocss'
import { colors, radius, spacing, typography } from './src/tokens'

export default defineConfig({
  presets: [presetWind4()],

  theme: {
    colors: Object.fromEntries(
      Object.keys(colors).map(key => [key, `var(--v0-${key})`]),
    ),
    spacing,
    borderRadius: radius,
    fontFamily: {
      sans: typography.fontSans,
      mono: typography.fontMono,
    },
    fontSize: {
      'sm': typography.textSm,
      'base': typography.textBase,
      'lg': typography.textLg,
      'xl': typography.textXl,
      '2xl': typography.text2xl,
    },
  },

  shortcuts: {
    'btn-primary': 'bg-primary text-on-primary px-4 py-2 rounded-md',
    'card': 'bg-surface text-on-surface rounded-lg p-6',
  },
})
