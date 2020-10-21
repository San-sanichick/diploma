import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/projects',
        name: 'Проекты',
        component: () => import('../views/ProjectList.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/auth/login',
        name: 'Авторизация',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/auth/signup',
        name: 'Регистрация',
        component: () => import('../views/SignUp.vue')
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import('../views/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router
