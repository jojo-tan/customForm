import Vue from 'vue'
import VueRouter from 'vue-router'

// 连续点击相同路由报错处理
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

// 界面元素
const interfaceElement = () => import('@/page/interfaceElement/index.vue');

const routes = [
    { path: '/', redirect: '/interfaceElement' },
    { path: '/interfaceElement', name: 'interfaceElement', component: interfaceElement },
];

const router = new VueRouter({
    routes,
    mode: 'hash'
});

export default router;