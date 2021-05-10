<template>
    <router-view />
    <FlashMessage position="right bottom"/>
    <ContextMenu />
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import ContextMenu from "@/components/ContextMenu.vue";

    export default defineComponent({
        components: {
            ContextMenu
        }
    })
</script>

<style lang="scss">
    body {
        height: 100vh;
        margin: 0;
    }

    #app {
        font-family: Open Sans, Arial, sans-serif;
        text-align: center;
        color: black;
        height: 100%;

        ._vue-flash-msg-body {
            z-index: 10000000 !important;
        }

        input {
            font-family: Open Sans, Arial, sans-serif;
        }
    }
</style>
