import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Chat from '../views/Chat.vue'
import Records from '../views/Records.vue'

import Home from '../views/Home.vue'
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/dashboard', name: 'dashboard', component: Dashboard },
    { path: '/chat', name: 'chat', component: Chat },
    { path: '/records', name: 'records', component: Records },
    { path: '/home', name: 'home', component: Home }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 简单的登录态守卫：
// - 未登录访问受保护路由 -> 重定向到 /login
// - 已登录访问 /login -> 重定向到 /dashboard
// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token')
//     // 允许 /login 和 /home 免登录访问
//     if (!token && to.path !== '/login' && to.path !== '/home') return next('/login')
//     if (token && to.path === '/login') return next('/dashboard')
//     return next()
// })

export default router
