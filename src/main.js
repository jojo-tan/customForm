import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 路由
import router from '@/router/index.js'

// element-ui全局全部引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')
