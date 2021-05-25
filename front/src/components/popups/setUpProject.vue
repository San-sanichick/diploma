<template>
    <div class="setup-wrapper">
        <h3>Настройки проекта {{ project.name }}</h3>
        <form @submit.prevent="submitHandler">
            <div class="form-row">
                <label for="name">Название</label>
                <input ref="text-input" type="text" name="name" id="name" v-model="form.name">
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
    import { defineComponent } from "vue";

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
            (this.$refs["text-input"] as HTMLInputElement).focus();
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
    @import "../../assets/scss/popupMixins.scss";

    .setup-wrapper {
        @include popup-style;
    }
</style>