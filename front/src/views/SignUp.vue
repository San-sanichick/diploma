<template>
    <div class="wrapper">
        <div class="auth-wrapper">
            <h1>Регистрация</h1>
            <hr>
            <form action="" method="post" @submit.prevent="submitHandler">
                <div class="form-row">
                    <label for="email">e-mail</label>
                    <input id="email" type="email" name="email" v-model="form.email">
                </div>
                <div class="form-row">
                    <label for="pass">Пароль</label>
                    <input id="pass" type="password" name="pass" v-model="form.password">
                </div>
                <div class="form-row">
                    <label for="pass-repeat">Повторите пароль</label>
                    <input id="pass-repeat" type="password" name="pass-repeat" v-model="form.passwordRepeat">
                </div>
                <div class="button-wrapper">
                    <input class="signup-submit"  type="submit" value="Зарегистрироваться">
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import axios from "axios";
    import config from "../config/config";

    export default defineComponent({
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                    passwordRepeat: ""
                }
            }
        },
        methods: {
            async submitHandler() {
                try {
                    if (this.IsCorrectPassword()) {
                        const data = {
                            email   : this.form.email, 
                            password: this.form.password
                        }
                        const dataToSend = JSON.stringify(data);
                        console.log("hahah");

                        const res = await axios.post(`http://localhost:${config.apiPort}/api/users/signUp`, { body: dataToSend });
                        console.log(res.data);
                        this.$router.push('/auth/login');
                    } else {
                        throw new Error("Пароли не совпадают");
                    }
                } catch (err) {
                    console.error(err);
                    this.$flashMessage.show({
                        type: 'error',
                        image: require("../assets/flashMessage/success.svg"),
                        text: err
                    });
                }
            },
            IsCorrectPassword(): boolean {
                return this.form.password === this.form.passwordRepeat;
            }
        }
    })
</script>

<style lang="scss" scoped>
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
            }

            .form-row {
                margin-top: 15px;
                width: 100%;
                display: flex;
                flex-flow: column;
                
                label {
                    text-align: start;
                }

                input {
                    border: 2px solid $darkPrimary;
                    border-radius: 8px;
                    height: 30px;
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

                .signup-submit {
                    font-family: Open Sans, Arial, sans-serif;
                    font-size: 16pt;
                    width: 100%;
                    height: 38px;
                    background-color: $darkPrimary;
                    outline: none;
                    color: white;
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