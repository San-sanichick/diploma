<template>
    <div>
        <h3>Настройки проекта</h3>
        <form @submit.prevent="">
            <label for="access">Доступ</label>
            <input type="checkbox" name="access" id="access" v-model="form.access">
            <input type="submit" value="Сохранить">
        </form>
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                form: {
                    access: ""
                }
            }
        },
        methods: {
            submitHandler() {
                this.$emit("create-project", this.form.access);
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";

    div {
        align-self: center;
        background-color: white;
        padding: 0px 20px 40px 20px;
        border-radius: 8px;
        width: 35%;

        h3 {
            font-size: 24pt;
        }

        form {
            display: flex;
            flex-flow: column;

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