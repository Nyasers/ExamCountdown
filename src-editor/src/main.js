import { createApp } from 'vue'
import { install } from 'ant-design-vue'
import App from './App.vue'

const app = createApp(App)

install(app)
app.mount("#app")
