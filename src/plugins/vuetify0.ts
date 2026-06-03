import type { App } from 'vue'
import { createStoragePlugin, createThemePlugin } from '@vuetify/v0'
import { darkColors, lightColors } from '@/tokens/colors'

export default function vuetify0Plugin(app: App): void {
  // Storage must be registered before theme (theme persist reads storage on install)
  app.use(createStoragePlugin())

  app.use(
    createThemePlugin({
      default: 'dark',
      target: 'html',
      persist: true,
      themes: {
        light: { dark: false, colors: lightColors },
        dark: { dark: true, colors: darkColors },
      },
    }),
  )
}
