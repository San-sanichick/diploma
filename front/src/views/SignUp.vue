<template>
    <div>
        <h1>Регистрация</h1>
        <hr>
        <form action="" method="post" @submit.prevent="submitHandler">
            <div>
                <label for="email">e-mail</label>
                <input id="email" type="email" name="email" v-model="form.email">
            </div>
            <div>
                <label for="pass">Пароль</label>
                <input id="pass" type="password" name="pass" v-model="form.password">
            </div>
            <div>
                <label for="pass-repeat">Повторите пароль</label>
                <input id="pass-repeat" type="password" name="pass-repeat" v-model="form.passwordRepeat">
            </div>
            <div>
                <input type="submit" value="Зарегистрироваться">
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
                    passwordRepeat: ""
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