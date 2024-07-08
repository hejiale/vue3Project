import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './tailwind.css'
import router from './router'
import './utils/request/index'

const app = createApp(App);
app.use(createPinia())
app.use(router).mount('#app')

