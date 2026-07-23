import type { App } from 'vue'
import {
  createBreakpointsPlugin,
  createNotificationsPlugin,
  createRulesPlugin,
} from '@vuetify/v0'

export default function todoAppPlugins(app: App): void {
  app.use(
    createRulesPlugin({
      aliases: {
        required: v => !!v || 'This field is required',
      },
    }),
  )

  app.use(createBreakpointsPlugin())
  app.use(createNotificationsPlugin())
}
