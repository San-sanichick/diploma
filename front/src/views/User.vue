<template>
    <div class="header">
        <div class="logo">logo here</div>
        <div class="user">
            <div class="user-button">
                <span>{{ currentUser.username ?? currentUser.email }}</span>

                <div v-if="currentUser.avatar !== ''" class="img" :style="{
                        backgroundImage: 'url(' + require(`../assets/placeholders/${currentUser.avatar}`) + ')'
                    }"
                    >
                    </div>
                <div v-else class="img">
                    {{ currentUser.email[0] }}
                </div>
            </div>
            <router-link to="/auth/logout">выход</router-link>
        </div>
    </div>
    <router-view></router-view>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        computed: {
            currentUser() {
                return this.$store.getters.getUser;
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    .header {
        top: 0;
        position: fixed;
        width: 100%;
        box-sizing: border-box;
        // height: 70px;
        display: grid;
        grid-template-columns: auto max-content;
        align-items: center;
        // justify-content: center;
        padding: 0px 50px;
        background-color: $darkPrimary;
        color: white;
        z-index: 1000;

        .logo {
            justify-self: start;
        }

        .user {
            display: grid;
            // float: right;
            grid-template-columns: max-content auto;
            gap: 10px;
            align-items: center;
            justify-content: center;

            .user-button {
                display: grid;
                padding: 5px 10px;
                grid-template-columns: max-content auto;
                gap: 10px;
                align-items: center;
                justify-content: center;
                user-select: none;

                &:hover {
                    background-color: rgba($color: #000000, $alpha: 0.2);
                    cursor: pointer;
                }
            }

            .img {
                width: 52px;
                height: 52px;
                // background-image: url("../assets/placeholders/todd.jpg");
                background-size: contain;
                background-repeat: no-repeat;
                border: 4px solid $primary;
                border-radius: 50%;
            }
            a {
                text-decoration: none;
                color: white;
            }
        }
    }
</style>