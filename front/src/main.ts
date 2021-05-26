import { createApp } from "vue";
import { Router } from "vue-router";
import { Store } from "vuex";
import App from './App.vue';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import moment from "moment";
import FlashMessage, { FlashMessagePlugin } from "@smartweb/vue-flash-message";
import mitt, { Emitter } from "mitt";
import { debounce } from "./utils/debounce";

import router from './router';
import store from './store';

import UserInterface from './types/User';
import config from "./config/config";
import Axios from 'axios';

axios.defaults.baseURL = config.API_URI;

const DEFAULT_TITLE = "This page has no header";

// Programmed routing
// This is not stupid, you're stupid 👀
router.beforeEach(async (to, from, next) => {
    /**
     * setting page header
     */
    document.title = to.meta.title as string ?? DEFAULT_TITLE;

    // Checking if user is logged
    if (to.matched.some(record => record.meta.requiresAuth)) {        
        if (store.getters.isLogged) {
            next();
            return;
        }
        // if not, redirect him to login page
        next('/auth/login');

    } else if (to.path === '/auth/login' || to.path === '/auth/signup') { // if user is logged then he can't go to signup/login pages
        if (!store.getters.isLogged) {
            next();
            return;
        } else if (from.path === to.path) {
            const userId = store.getters.getUser._id;
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
        if (store.getters.isLogged) {
            const userId = store.getters.getUser._id;  // redirect to default page if logged in
            next(`/users/${userId}/projects`);
            return;
        } else {
            next('/auth/login');
            return;
        }
    } else if (to.path.includes("undefined")) {
        next("/404");
        return;
    } else {    // in all other cases let user go where he wants
        next();
    }
});


// so that axios doesn't eat my 4XX and 5XX errors
axios.defaults.validateStatus = (status): boolean => {
    return status === 401 ? false : true;
}

// uhh, maybe this works
axios.interceptors.response.use((res: AxiosResponse) => {
        return res;
    },
    async (err: AxiosError) => {
        const originalReq = err.config;
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken !== "undefined" && err && err.response && err.response?.status === 401) {
            const res = await axios.post("/token/refresh", { refreshToken });
            const newToken = res.data.token;
            store.commit("setToken", { token: newToken });
            originalReq.headers["Authorization"] = newToken;
            return Axios.request(originalReq);
        }

        if (err && err.response && err.response.status === 401) {
            router.push("/auth/login/");
            return Promise.reject(err);
        }
    }
);

axios.interceptors.request.use((req: AxiosRequestConfig) => {
        return req;
    },
    async (err: AxiosError) => {
        console.error(err.config)
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
        $axios: typeof axios;
    }
}

const app = createApp(App);

// ! IMPORTANT SHIT
app.config.globalProperties.$filters = filters;
app.config.globalProperties.$emitter = mitt();
app.config.globalProperties.$axios = axios;

app.directive("focus", {
    mounted(el: HTMLInputElement) {
        el.focus();
    }
});

app.directive("debounce", (el: HTMLInputElement, binding) => {
    const
        delay = parseInt(binding.arg ?? "300"),
        func = binding.value;

    el.addEventListener("keyup", debounce<typeof func>(func, delay));
});

app.use(store).use(router).use(FlashMessage, {
    name: 'flashMessage',
    tag: 'FlashMessage',
    time: 1000,
    strategy: 'single'
}).mount('#app');
