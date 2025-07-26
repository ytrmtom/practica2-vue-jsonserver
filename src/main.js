import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'bootstrap'

//createApp(App).use(store).use(router).use(VueAxios, axios).mount('#app')
// ✅ Crea la app y usa el router
const app = createApp(App)

app.use(router) // ✅ Esto instala Vue Router (provee <router-view> y <router-link>)
app.mount('#app')
