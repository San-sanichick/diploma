import { createStore } from 'vuex';
import axios from "axios";
import UserInterface from '@/types/User';
import { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";

export default createStore({
    state: {
        user: null as UserInterface | null,
        jwt: ""
    },
    getters: {
        isLogged(state): boolean {
            const localStorageString = localStorage.getItem("user");
            let user = null;

            if (typeof localStorageString === "string" && localStorageString.length !== 0) {
                user = JSON.parse(localStorageString);
            }

            const jwt = localStorage.getItem("jwt") as string;
            state.jwt = jwt;
            state.user = user;

            axios.defaults.headers.common["Authorization"] = state.jwt;
            return state.user !== null && state.jwt !== "";
        },
        getUser(state): UserInterface | null {
            const localStorageString = localStorage.getItem("user");
            let user = null;

            if (typeof localStorageString === "string" && localStorageString.length !== 0) {
                user = JSON.parse(localStorageString);
            }

            state.user = user;
            return state.user;
        },
        getJwt(state): string {
            const jwt = localStorage.getItem("jwt") as string;
            state.jwt = jwt;
            return state.jwt;
        }
    },
    mutations: {
        async setUser(state, payload) {
            localStorage.setItem("user", JSON.stringify(payload.user));
            state.user = payload.user;
        },
        async removeUser(state) {
            localStorage.setItem("user", "");
            state.user = null;
        },
        async setToken(state, payload) {
            localStorage.setItem("jwt", payload.token);
            if (payload.refreshToken) {
                localStorage.setItem("refreshToken", payload.refreshToken);
            }
            state.jwt  = payload.token;
            axios.defaults.headers.common["Authorization"] = state.jwt;
        },
        async removeToken(state) {
            localStorage.setItem("jwt", "");
            localStorage.setItem("refreshToken", "");
            state.jwt = "";
            delete axios.defaults.headers.common["Authorization"];
        }
    },
    actions: {
        async logIn(context, payload) {
            try {
                // const dataToSend = JSON.stringify(payload);
                const res = await axios.post(`/users/login`, payload, { skipAuthRefresh: true } as AxiosAuthRefreshRequestConfig);
                const user = res.data.data.user;
                if (user) {
                    context.commit("setUser", res.data.data);
                    context.commit("setToken", res.data.data);
                } else {
                    console.log(res.data.data.msg);
                }
            } catch (err) {
                console.error(err);
                throw new Error(err);
            }
        },
        async updateUser(context, payload) {
            context.commit("setUser", payload);
            context.commit("setToken", payload);
        },
        async logOut(context) {
            context.commit("removeUser");
            context.commit("removeToken");
        }
    },
    modules: {
    }
})
