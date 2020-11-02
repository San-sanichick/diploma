<template>
    <div class="header">
        <div class="user">
            <span>{{ currentUser.email }}</span>
            <div class="img"></div>
            <router-link to="/auth/logout">выход</router-link>
        </div>
    </div>
    <router-view></router-view>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import { useStore }              from 'vuex';

    export default defineComponent({
        setup() {
            const 
                store       = useStore(),
                currentUser = computed(() => store.state.user);

            return { currentUser }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    .header {
        height: 60px;
        padding: 5px 10px;
        background-color: $darkPrimary;
        color: white;

        .user {
            display: grid;
            float: right;
            grid-template-columns: max-content auto auto;
            gap: 10px;
            align-items: center;
            justify-content: center;

            .img {
                width: 52px;
                height: 52px;
                background-image: url("../assets/placeholders/todd.jpg");
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