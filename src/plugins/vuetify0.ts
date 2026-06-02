import type { App } from 'vue'
import { createThemePlugin } from '@vuetify/v0'
import { darkColors, lightColors } from '@/tokens/colors'

export default function vuetify0Plugin(app: App): void {
  app.use(
    createThemePlugin({
      default: 'dark',
      target: 'html',
      themes: {
        light: { dark: false, colors: lightColors },
        dark: { dark: true, colors: darkColors },
      },
    }),
  )
}
