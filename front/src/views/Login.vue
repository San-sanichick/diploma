<template>
    <div class="wrapper">
        <div class="auth-wrapper">
            <h1>Авторизация</h1>
            <hr>
            <form action="" method="post" @submit.prevent="submitHandler">
                <div class="form-row">
                    <label for="email">e-mail</label>
                    <input id="email" type="email" name="email" v-model="form.email">
                </div>
                <div class="form-row">
                    <div class="header-row">
                        <label for="pass">пароль</label>
                        <router-link to="/forgot-password">Забыли пароль</router-link>
                    </div>
                    <input id="pass" type="password" name="pass" v-model="form.password">
                </div>
                <div class="form-row-checkbox">
                    <div class="header-row">
                        <input id="remember" type="checkbox" name="remember" v-model="form.remember">
                        <label for="remember">Запомнить меня</label>
                    </div>
                    <router-link to="/auth/signup">Зарегистрироваться</router-link>
                </div>
                <div class="button-wrapper">
                    <input class="login-submit" type="submit" value="Войти">
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue';
    import { useStore } from 'vuex';
    import UserInterface from '../types/User';

    export default defineComponent({
        setup() {
            const 
                store = useStore(),
                currentUser = computed(() => store.state.user);

            const logIn = (user: UserInterface) => {
                store.commit("logIn", {user});
            }

            return { currentUser, logIn }
        },
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                    remember: false
                } as UserInterface
            }
        },
        methods: {
            submitHandler() {
                this.logIn(this.form);
                this.$router.push('/');
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";

    .wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .auth-wrapper {
            width: 40%;

            .form-row {
                margin-top: 15px;
                width: 100%;
                display: flex;
                flex-flow: column;
                
                label {
                    text-align: start;
                }

                .header-row {
                    width: 100%;
                    display: grid;

                    grid-template-columns: auto max-content;
                }

                input {
                    border: 2px solid $darkViolet;
                    border-radius: 8px;
                    height: 30px;
                }
            }

            .form-row-checkbox {
                margin-top: 15px;
                display: flex;
                flex-flow: row;
                
                label {
                    text-align: start;
                }

                .header-row {
                    width: 100%;
                    display: flex;
                    flex-flow: row;
                    align-content: space-between;
                }
            }

            hr {
                width: 100%;
                border: none;
                color: black;
                background-color: black;
                height: 1px;
            }

            .button-wrapper {
                margin-top: 20px;

                .login-submit {
                    font-family: Open Sans, Arial, sans-serif;
                    font-size: 16pt;
                    width: 100%;
                    height: 38px;
                    background-color: $darkViolet;
                    outline: none;
                    color: white;
                    border: 2px solid $darkViolet;
                    border-radius: 8px;
                    appearance: none;

                    &:hover,
                    &:focus {
                        background: $violet;
                    }
                }
            }
        }
    }
</style>