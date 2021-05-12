import { createApp } from 'vue';
import { Router } from "vue-router";
import { MutationTree, Store } from "vuex";
import App from './App.vue';
import axios, { AxiosError, AxiosResponse } from "axios";
import moment from "moment";
import FlashMessage, { FlashMessagePlugin } from "@smartweb/vue-flash-message";
import mitt, { Emitter } from "mitt";

import router from './router';
import store from './store';

import UserInterface from '@/types/User';
import config from "./config/config";
import Axios from 'axios';

axios.defaults.baseURL = config.API_URI;

const DEFAULT_TITLE = "This page has no header";

// Programmed routing
router.beforeEach(async (to, from, next) => {
    /**
     * setting page header
     */
    document.title = to.meta.title as string ?? DEFAULT_TITLE;

    // Checking if user is logged
    if (to.matched.some(record => record.meta.requiresAuth)) {        
        if (await store.getters.isLogged) {
            next();
            return;
        }
        // if not, redirect him to login page
        next('/auth/login');

    } else if (to.path === '/auth/login' || to.path === '/auth/signup') { // if user is logged then he can't go to signup/login pages
        if (! await store.getters.isLogged) {
            next();
            return;
        } else if (from.path === to.path) {
            const userId = await store.getters.getUser.id;
            next(`/${userId}/projects`);
        }
        next(from.path);

    } else if (to.path === '/auth/logout') {    // if user is going to logout, then call logout
        if (store.getters.isLogged) {           // routine and redirect him to login page
            await store.dispatch("logOut");
        }
        next('/auth/login');
        return;

    } else if (to.path === '/') {   
        const userId = store.getters.getUser.id;  // redirect to default page if logged in
        next(`/${userId}/projects`);
        return;

    } else {    // in all other cases let user go where he wants
        next();
    }
});


// so that axios doesn't eat my 4XX errors
axios.defaults.validateStatus = (status): boolean => {
    return true;
}

axios.interceptors.response.use((res: AxiosResponse) => {
        return res;
    },
    async (err: AxiosError) => {

        const originalReq = err.config;
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken !== "undefined" && err.response?.status === 401) {
            // originalReq.retr
            const newToken = await axios.post("/token/refresh", { refreshToken });
            originalReq.headers["Authorization"] = `Bearer ${newToken}`;
            return Axios.request(originalReq);
        }

        if (err && err.response && err.response.status === 401) {
            router.push("/auth/login/");
            return Promise.reject(err);
        }
    }
)

const filters = {
    dateFilter: (date: string) => {
        return moment(date).format("HH:mm:ss, DD/MM/YYYY");
    }
}

declare module "@vue/runtime-core" {
    interface State {
        user: UserInterface | null;
    }

    interface ComponentCustomProperties {
        $flashMessage: FlashMessagePlugin;
        $router: Router;
        $store: Store<State>;
        $filters: typeof filters;
        $emitter: Emitter;
    }
}

const app = createApp(App);

// ! IMPORTANT SHIT
app.config.globalProperties.$filters = filters;
app.config.globalProperties.$emitter = mitt();

app.directive("focus", {
    mounted(el: HTMLInputElement) {
        el.focus();
    }
})

app.use(store).use(router).use(FlashMessage, {
    name: 'flashMessage',
    tag: 'FlashMessage',
    time: 1000,
    strategy: 'single'
}).mount('#app');
