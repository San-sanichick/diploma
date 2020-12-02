import { createStore } from 'vuex';
import axios from "axios";
import UserInterface from '@/types/User';
import config from "../config/config";

export default createStore({
    state: {
        user: null as UserInterface | null
    },
    getters: {
        isLogged(state): boolean {
            const localStorageString = localStorage.getItem("user");
            let user = null;
            if (typeof localStorageString === "string" && localStorageString.length !== 0) {
                user = JSON.parse(localStorageString);
            }
            state.user = user;
            return state.user !== null;
        },
        getUser(state): UserInterface | null {
            const localStorageString = localStorage.getItem("user");
            let user = null;
            if (typeof localStorageString === "string" && localStorageString.length !== 0) {
                user = JSON.parse(localStorageString);
            }
            state.user = user;
            return state.user;
        }
    },
    mutations: {
        async setUser(state, payload) {
            localStorage.setItem("user", JSON.stringify(payload.user));
            state.user = payload.user;
        },
        logOut(state) {
            localStorage.setItem("user", "");
            state.user = null;
        }
    },
    actions: {
        async logIn(context, payload) {
            try {
                const res = await axios.get(`http://localhost:${config.apiPort}/api/users/login?email=${payload.user.email}&password=${payload.user.password}`);
                if (res.data.data) {
                    const user = res.data.data;
                    context.commit("setUser", {user});
                } else {
                    console.log(res.data.msg);
                }
            } catch (err) {
                console.error(err);
            }
        }
    },
    modules: {
    }
})
