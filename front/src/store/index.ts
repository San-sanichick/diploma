import { createStore } from 'vuex';
import User from '@/types/User';

export default createStore({
    state: {
        user: {} as User | null
    },
    getters: {
        isLogged(state): boolean {
            return state.user !== null;
        }
    },
    mutations: {
        logIn(state, payload) {
            state.user = payload.user;
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
