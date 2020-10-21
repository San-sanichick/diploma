import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {        
        if (store.getters.isLogged) {
            next();
            return;
        }
        next('/auth/login');
    } else if (to.path === '/auth/login' || to.path === '/auth/signup') {
        if (!store.getters.isLogged) {
            next();
            return;
        }
        next(from.path);
    } else if (to.path === '/auth/logout') {
        if (!store.getters.isLogged) {
            store.commit("logOut");
            
        }
        next('/auth/login');
        return;
    } else if (to.path === '/') {
        next('/projects');
        return; 
    } else {
        next();
    }
});

createApp(App).use(store).use(router).mount('#app')
