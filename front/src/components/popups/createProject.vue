<template>
    <div>
        <h3>Создать</h3>
        <form @submit.prevent="submitHandler">
            <label for="project-name">Название</label>
            <input type="text" name="project-name" id="project-name" v-model="form.name">
            <input type="submit" class="submit-button" value="Создать">
        </form>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Project from "../../types/Project";

    export default defineComponent({
        data() {
            return {
                form: {
                    name: ""
                }
            }
        },
        methods: {
            submitHandler() {
                this.$emit("create-project", this.form.name);
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