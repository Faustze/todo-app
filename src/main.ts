import { createApp } from 'vue'
import { router } from '@/router'
import App from './App.vue'
// components
import Button from './components/ui/Button.vue'
// plugins
import fontawesome from './plugins/fontawesome'
import vuetify0 from './plugins/vuetify0'
import 'virtual:uno.css'
import '@unocss/reset/normalize.css'

import './style.scss'

const app = createApp(App)

vuetify0(app)
fontawesome(app)
app.use(router)
app.component('Button', Button)

app.mount('#app')

app.config.errorHandler = (err) => {
  console.error(err)
  // console.info(info)
  // console.log(instance)
}
