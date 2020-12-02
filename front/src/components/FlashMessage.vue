<template>
    <transition name="flash-slide">
        <div v-if="data != null" class="flash-message">
            <div class="flash-container">
                <div> {{data.status}} </div>
                <div> {{data.message}} </div>
                <div class='flash-mes-close' @click="closeMessage">close</div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: ["data"],
        methods: {
            closeMessage() {
                this.$emit("close-flash");
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";

    .flash-message {
        font-family: Open Sans, Arial, sans-serif;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: white;
        border: 1px solid $darkPrimary;
        border-radius: 8px;

        .flash-container {
            padding: 8px;
            display: flex;
            flex-flow: row;

            .flash-mes-close {
                cursor: pointer;
            }
        }
    }

    .flash-slide-enter-active, .flash-slide-leave-active {
        transition: right .3s;
    }

    .flash-slide-enter-from, .flash-slide-leave-to {
        right: -1200px;
    }
</style>