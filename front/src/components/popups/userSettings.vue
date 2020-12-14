<template>
    <div class="user-settings-wrapper">
        <h3>Настройки пользователя</h3>
        <form @submit.prevent="submitHandler">
            <div class="form-row">
                <label for="user-name">Имя</label>
                <input type="text" name="user-name" id="user-name" v-model="form.username">
            </div>
            <div class="form-row">
                <label for="user-email">e-mail</label>
                <input type="email" name="user-email" id="user-email" v-model="form.email">
            </div>
            <input type="submit" class="submit-button" value="Сохранить">
        </form>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import axios from "axios";

    export default defineComponent({
        props: ["user"],
        data() {
            return {
                form: {
                    username: "",
                    email: ""
                }
            }
        },
        mounted() {
            this.form.username = this.user.username;
            this.form.email    = this.user.email;
        },
        methods: {
            async submitHandler() {
                if (this.form.username !== this.user.username || this.form.email !== this.user.email) {
                    try {
                        const res = await axios.patch("/users/update", this.form);
                        this.$store.dispatch("updateUser", res.data.data);

                        this.$flashMessage.show({
                            type: 'success',
                            image: require("../../assets/flashMessage/success.svg"),
                            text: res.data.msg
                        });
                    } catch (err) {
                        console.error(err);
                        this.$flashMessage.show({
                            type: 'error',
                            image: require("../../assets/flashMessage/fail.svg"),
                            text: err
                        });
                    } finally {
                        this.$emit("close-popup");
                    }
                } else {
                    this.$emit("close-popup");
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";

    .user-settings-wrapper {
        align-self: center;
        background-color: white;
        padding: 0px 20px 40px 20px;
        border-radius: 8px;
        width: 50%;

        h3 {
            font-size: 24pt;
        }

        form {
            display: flex;
            flex-flow: column;

            .form-row {
                width: 100%;
                margin-bottom: 10px;
                display: flex;
                flex-flow: column;

                label {
                    text-align: start;
                    font-size: 14pt;
                }

                input {
                    border: 2px solid $darkPrimary;
                    font-size: 12pt;
                    border-radius: 8px;
                    padding: 2px 10px;
                    height: 30px;
                }
            }

            label {
                text-align: start;
            }

            input {
                margin-top: 5px;
                border: 2px solid $darkPrimary;
                border-radius: 8px;
                height: 30px;
            }

            .submit-button {
                height: 40px;
                width: 300px;
                margin-top: 15px;
                align-self: center;

                font-family: Open Sans, Arial, sans-serif;
                font-size: 16pt;
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
</style>