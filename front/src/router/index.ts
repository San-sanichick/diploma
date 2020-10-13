import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Проекты',
        component: () => import('../views/ProjectList.vue')
    },
    {
        path: '/login',
        name: 'Авторизация',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/signup',
        name: 'Регистрация',
        component: () => import('../views/SignUp.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
