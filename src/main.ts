import { createSSRApp } from 'vue'
import App from './App.vue'
import httpInterceptor from '@/api/http'
import { createPinia } from 'pinia'
import uView from '@ued_fpi/uview-ui'
const pinia = createPinia()
export function createApp() {
    
    const app: any = createSSRApp(App)
    app.mpType = 'app'
    app.use(pinia)
    app.use(uView)
    app.use(httpInterceptor, app)
    app.config.errorHandler = (err: any, vm: any, info: string) => {
        console.log('[全局异常]：', err, vm, info)
    }
    return {
        app
    }
}
