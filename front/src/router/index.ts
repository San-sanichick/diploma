import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: "/:userId",
        component: () => import("../views/User.vue"),
        children: [
            {
                path: "projects",
                component: () => import('../views/User/ProjectList.vue'),
                meta: {
                    title: "Project list"
                }
            },
            {
                path: "projects/:id",
                component: () => import('../views/User/ProjectEditor.vue'),
                props: true
            }
        ],
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/auth/login',
        name: 'Авторизация',
        component: () => import('../views/Login.vue'),
        meta: {
            title: "Login"
        }
    },
    {
        path: '/auth/signup',
        name: 'Регистрация',
        component: () => import('../views/SignUp.vue'),
        meta: {
            title: "Sign up"
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import('../views/404.vue'),
        meta: {
            title: "404"
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router
