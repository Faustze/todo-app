import type { App } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleInfo, faEdit, faFilter, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFilter, faPlus, faEdit, faTrash, faCircleInfo)

export default function fontawesome(app: App) {
  app.component('FaIcon', FontAwesomeIcon)
}
