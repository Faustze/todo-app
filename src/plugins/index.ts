import type { App } from 'vue'
import { router } from '../router'
import todoAppPlugins from './todoApp'
import vuetify0 from './vuetify0'

export function registerPlugins(app: App): void {
  vuetify0(app)
  app.use(router)
  todoAppPlugins(app)
}
