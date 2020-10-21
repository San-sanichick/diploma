import { createStore } from 'vuex';
import UserInterface from '@/types/User';

export default createStore({
    state: {
        user: null as UserInterface | null
    },
    getters: {
        isLogged(state): boolean {
            return state.user !== null;
        }
    },
    mutations: {
        logIn(state, payload) {
            state.user = payload.user;
            console.log(state.user);
        },
        logOut(state) {
            state.user = null;
        }
    },
    actions: {

    },
    modules: {
    }
})
