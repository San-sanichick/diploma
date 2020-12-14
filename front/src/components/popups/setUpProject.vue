<template>
    <div class="setup-wrapper">
        <h3>Настройки проекта {{ project.name }}</h3>
        <form @submit.prevent="submitHandler">
            <div class="form-row">
                <label for="name">Название</label>
                <input type="text" name="name" id="name" v-model="form.name">
            </div>
            <div class="form-row checkbox">
                <div>
                    <input type="checkbox" name="access" id="access" v-model="form.access">
                    <label for="access">Открыть внешний доступ к проекту</label>
                </div>
            </div>
            <input class="submit-button" type="submit" value="Сохранить">
        </form>
    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: ["project"],
        data() {
            return {
                form: {
                    name: "",
                    access: false
                }
            }
        },
        mounted() {
            this.form.name = this.project.name;
            this.form.access = this.project.publicAccess;
        },
        methods: {
            submitHandler() {
                this.$emit("setup-project", {
                    id: this.project._id, 
                    name: this.form.name,
                    access: this.form.access
                    });
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";

    .setup-wrapper {
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

            .checkbox {
                margin-top: 10px;
                width: 100%;
                display: flex;
                flex-flow: column;

                div {
                    margin: 10px 0px;
                    display: flex;
                    flex-flow: row;
                    align-items: center;

                    label {
                        margin-left: 10px;
                        text-align: start;
                        font-size: 14pt;
                    }

                    input {
                        width:20px;
                        height: 20px;
                    }
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