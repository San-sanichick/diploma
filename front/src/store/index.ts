import { createStore } from 'vuex';
import UserInterface from '@/types/User';

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
        logIn(state, payload) {
            // TODO: this is where the call to backend is to see if user is valid
            localStorage.setItem("user", JSON.stringify(payload.user));
            state.user = payload.user;
        },
        logOut(state) {
            localStorage.setItem("user", "");
            state.user = null;
        }
    },
    actions: {

    },
    modules: {
    }
})
