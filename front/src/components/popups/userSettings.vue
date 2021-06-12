<template>
    <div class="user-settings-wrapper">
        <h3>Настройки пользователя</h3>
        <form @submit.prevent="submitHandler">
            <div class="form-row">
                <label for="user-name">Имя</label>
                <input ref="text-input" type="text" name="user-name" id="user-name" v-model="form.username">
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
    import { defineComponent } from "vue";
    import axios from "axios";
    import { FlashIcons } from "@/utils/images";

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
            (this.$refs["text-input"] as HTMLInputElement).focus();
        },
        methods: {
            async submitHandler() {
                if (this.form.username !== this.user.username || this.form.email !== this.user.email) {
                    try {
                        const res = await this.$axios.patch("/users/update", this.form);
                        this.$store.dispatch("updateUser", res.data.data);

                        this.$flashMessage.show({
                            type: 'success',
                            image: FlashIcons.Success,
                            text: res.data.msg
                        });
                    } catch (err) {
                        console.error(err);
                        this.$flashMessage.show({
                            type: 'error',
                            image: FlashIcons.Fail,
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
    @import "../../assets/scss/popupMixins.scss";

    .user-settings-wrapper {
        @include popup-style;
    }
</style>