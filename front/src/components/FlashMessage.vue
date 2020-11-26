<template>
    <div class="flash-message">
        <div> {{status}} </div>
        <div> {{message}} </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: ["msg", "status"],
    })
</script>

<style lang="scss" scoped>
    .flash-message {
        
    }
</style>