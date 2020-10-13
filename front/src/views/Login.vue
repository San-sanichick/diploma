<template>
    <div>
        <h1>Авторизация</h1>
        <hr>
        <form action="" method="post" @submit.prevent="submitHandler">
            <div>
                <label for="email">e-mail</label>
                <input id="email" type="email" name="email" v-model="form.email">
            </div>
            <div>
                <label for="pass">пароль</label>
                <a href="">Забыли пароль?</a>
                <input id="pass" type="password" name="pass" v-model="form.password">
            </div>
            <div>
                <input id="remember" type="checkbox" name="remember" v-model="form.remember">
                <label for="remember">Запомнить меня</label>
                <router-link to="/signup">Зарегистрироваться</router-link>
            </div>
            <div>
                <input type="submit" value="Войти">
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                form: {
                    email: "",
                    password: "",
                    remember: false
                }
            }
        },
        methods: {
            async submitHandler() {
                const dataToSend = JSON.stringify(this.form);
                console.log(dataToSend);
            }
        }
    })
</script>