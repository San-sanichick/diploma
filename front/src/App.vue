<template>
    <router-view />
    <FlashMessage position="right bottom"/>
    <ContextMenu />
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import ContextMenu from "./components/ContextMenu.vue";

    export default defineComponent({
        components: {
            ContextMenu
        },
        mounted() {
            this.$flashMessage.show({
                type: 'warning',
                image"/flashMessage/warning.svg",
                text: "Данное приложение разработано в обучающих целях, и не предназначенно для серьёзного использования. Приложение находится на стадии разработки."
            });
        }
    })
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&display=swap');
    @import "./assets/scss/config.scss";
    body {
        height: 100vh;
        margin: 0;
    }

    #app {
        font-family: "Open Sans", Arial, sans-serif;
        text-align: center;
        color: $text;
        background-color: $background;
        height: 100%;

        ._vue-flash-msg-body {
            z-index: 10000000 !important;
        }

        input {
            font-family: Open Sans, Arial, sans-serif;
        }

        // .ps {
        //     height: 100%;
        // }
    }
</style>
