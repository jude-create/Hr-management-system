import './assets/main.css'
import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import { createPinia } from 'pinia'



const app = createApp(App)

app.use(VCalendar, {}) 
app.use(createPinia())
app.use(router)
app.mount('#app')
