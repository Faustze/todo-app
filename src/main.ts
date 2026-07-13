import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import 'virtual:uno.css'

import '@unocss/reset/normalize.css'
import '@fontsource-variable/geist/index.css'
import '@/assets/styles/style.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
registerPlugins(app)

app.mount('#app')

app.config.errorHandler = (err) => {
  console.error(err)
}
