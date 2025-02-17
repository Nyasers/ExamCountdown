import { install } from 'ant-design-vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

install(app)
app.mount("#app")
