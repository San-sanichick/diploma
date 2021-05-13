import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: "/users/:userId",
        component: () => import("../views/User.vue"),
        children: [
            {
                path: "projects",
                component: () => import('../views/User/ProjectList.vue'),
                meta: {
                    title: "Список проектов"
                }
            },
            {
                path: "projects/:id",
                component: () => import('../views/User/ProjectEditor.vue'),
                // props: true
                meta: {
                    title: "Редактор"
                }
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
            title: "Авторизация"
        }
    },
    {
        path: '/auth/signup',
        name: 'Регистрация',
        component: () => import('../views/SignUp.vue'),
        meta: {
            title: "Регистрация"
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
