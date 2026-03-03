import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { healthCheck } from './api/auth'

const app = createApp(App)

// Router guard to check authentication before each route change
router.beforeEach(async (to, _from, next) => {
    const isAuthenticated = await healthCheck();
    if (isAuthenticated) {
        next();
    } else {
        if (to.name === "Login") {
            next();
        } else {
            next({ name: "Login" }); 
        }
    }


})

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})