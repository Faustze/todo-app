import type { App } from 'vue'
import { createThemePlugin } from '@vuetify/v0'
import { colors } from '@/tokens'

export default function vuetify0(app: App) {
  app.use(
    createThemePlugin({
      default: 'light',
      themes: {
        light: {
          dark: false,
          colors, // --v0-primary, --v0-surface и т.д. из коробки
        },
        dark: {
          dark: true,
          colors: {
            ...colors,
          },
        },
      },
    }),
  )
}
