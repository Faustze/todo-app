import type { App } from 'vue'
import vuetify0 from './vuetify0'
import todoAppPlugins from './todoApp'
import { router } from '../router'

export function registerPlugins(app: App) {
  vuetify0(app)
  app.use(router)
  todoAppPlugins(app)
}
