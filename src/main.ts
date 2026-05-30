import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import 'virtual:uno.css'

import '@unocss/reset/normalize.css'
import '@/assets/styles/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
registerPlugins(app)

app.mount('#app')

app.config.errorHandler = (err) => {
  console.error(err)
}
