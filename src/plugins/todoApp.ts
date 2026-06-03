import {
  createBreakpointsPlugin,
  createNotificationsPlugin,
  createRulesPlugin,
} from '@vuetify/v0'
import type { App } from 'vue'

export default function todoAppPlugins(app: App) {
  app.use(
    createRulesPlugin({
      aliases: {
        required: v => !!v || 'Обязательное поле',
      },
    }),
  )

  app.use(createBreakpointsPlugin())
  app.use(createNotificationsPlugin())
}
