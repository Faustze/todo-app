import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerPlugins } from '@/plugins'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'

import App from './App.vue'
import '@/assets/styles/style.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
registerPlugins(app)

app.mount('#app')

app.config.errorHandler = (err) => {
  console.error(err)
}
