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
                        <label for="pass">Пароль</label>
                        <!-- <router-link to="/forgot-password">Забыли пароль?</router-link> -->
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
    import { FlashIcons } from "@/utils/images";
    import { defineComponent } from "vue";
    import { useRouter } from 'vue-router';

    export default defineComponent({
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                    remember: false
                },
                router: useRouter()
            }
        },
        methods: {
            async submitHandler() {
                 try {
                    await this.$store.dispatch("logIn", this.form);
                    this.$router.push(`/users/${this.$store.getters.getUser._id}/projects`);
                } catch (err) {
                    console.error(err);
                    this.$flashMessage.show({
                        type: 'error',
                        image: FlashIcons.Fail,
                        text: err
                    });
                }
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

            h1 {
                font-size: 36pt;
                margin: 0;
                font-weight: 600;
            }

            .form-row {
                margin-top: 15px;
                width: 100%;
                display: flex;
                flex-flow: column;

                label {
                    text-align: start;
                    font-size: 14pt;
                }
                
                .header-row {
                    width: 100%;
                    display: grid;
                    align-items: center;
                    grid-template-columns: auto max-content;
                
                    a {
                        text-decoration: none;
                        text-align: center;
                        color: $gray;
                    }
                }

                input {
                    border: 2px solid $darkPrimary;
                    border-radius: 8px;
                    height: 30px;
                }
            }

            .form-row-checkbox {
                margin-top: 15px;
                display: flex;
                flex-flow: row;
                align-items: center;
                
                a {
                    text-decoration: none;
                    color: $gray;

                    &:hover {
                        text-decoration: underline;
                    }
                }

                label {
                    font-size: 14pt;
                    text-align: start;
                }

                input {
                    // padding: 5px;
                    width:20px;
                    height: 20px;
                }

                .header-row {
                    width: 100%;
                    display: flex;
                    flex-flow: row;
                    align-content: space-between;
                    align-items: center;
                }
            }

            hr {
                width: 100%;
                border: none;
                color: $hr;
                background-color: $hr;
                height: 1px;
            }

            .button-wrapper {
                margin-top: 20px;

                .login-submit {
                    font-family: Open Sans, Arial, sans-serif;
                    font-size: 16pt;
                    width: 100%;
                    height: 38px;
                    background-color: $darkPrimary;
                    outline: none;
                    color: $whiteText;
                    border: 2px solid $darkPrimary;
                    border-radius: 8px;
                    appearance: none;

                    &:hover,
                    &:focus {
                        background: $primary;
                    }
                }
            }
        }
    }
</style>