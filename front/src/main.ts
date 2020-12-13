import { createApp } from 'vue';
import {Router} from "vue-router";
import {Store} from "vuex";
import App from './App.vue';
import axios from "axios";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import router from './router';
import store from './store';
import FlashMessage, { FlashMessagePlugin } from "@smartweb/vue-flash-message";

import UserInterface from '@/types/User';
import config from "./config/config";

axios.defaults.baseURL = config.API_URI;

// AxiosAuthRefreshRequestConfig

// Programmed routing
router.beforeEach(async (to, from, next) => {
    // Checking if user is logged
    console.log(to.path);
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
    } else if (to.path === '/auth/logout') {    // if user is going to logout, then call logout routine
        if (store.getters.isLogged) {           // and redirect him to login page
            await store.dispatch("logOut");
        }
        next('/auth/login');
        return;
    } else if (to.path === '/') {   
        const userId = store.getters.getUser.id;            // redirect to default page if logged in
        next(`/${userId}/projects`);
        return; 
    } else {    // in all other cases let user go where he wants
        next();
    }
});

const refreshAuthLogic = async (failedRequest: any) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const tokenRefreshResponse = await axios.post("/token/refresh", {refreshToken});
    store.commit("setToken", {token: tokenRefreshResponse.data.token, refreshToken});
    failedRequest.response.config.headers["Authorization"] = "Bearer " + tokenRefreshResponse.data.token;
    return Promise.resolve();
}

createAuthRefreshInterceptor(axios, refreshAuthLogic);

declare module "@vue/runtime-core" {
    interface State {
        user: UserInterface | null;
    }

    interface ComponentCustomProperties {
        $flashMessage: FlashMessagePlugin;
        $router: Router;
        $store: Store<State>;
    }
}

const app = createApp(App);

app.use(store).use(router).use(FlashMessage, {
    name: 'flashMessage',
    tag: 'FlashMessage',
    time: 10000,
    strategy: 'single'
}).mount('#app');
