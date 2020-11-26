import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Programmed routing
router.beforeEach((to, from, next) => {
    // Checking if user is logged
    console.log(to.path);
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
        }
        next(from.path);
    } else if (to.path === '/auth/logout') {    // if user is going to logout, then call logout routine
        if (store.getters.isLogged) {           // and redirect him to login page
            store.commit("logOut");
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

createApp(App).use(store).use(router).mount('#app')
