<template>
    <div class="user-avatar">
        <span>{{ letter }}</span>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        props: {
            name: {
                type: String,
                required: true,
                default: "John"
            }
        },
        computed: {
            letter(): string {
                return this.name[0]?.toUpperCase();
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";
    .user-avatar {
        width: 45px;
        height: 45px;
        background-color: $primary;
        border-radius: 50%;
        display: flex;
        flex-flow: row;
        align-items: center;
        span {
            margin: 0 auto;
            color: white;
            font-size: 24pt;
        }
    }
</style>