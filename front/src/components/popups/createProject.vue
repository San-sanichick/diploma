<template>
    <div class="create-wrapper">
        <h3>Создать</h3>
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
            <input type="submit" class="submit-button" value="Создать">
        </form>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        data() {
            return {
                form: {
                    name: "New Project",
                    access: false
                }
            }
        },
        mounted() {
            (this.$refs["text-input"] as HTMLInputElement).focus();
        },
        methods: {
            submitHandler() {
                this.$emit("create-project", this.form);
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/popupMixins.scss";

    .create-wrapper {
        @include popup-style;
    }
</style>