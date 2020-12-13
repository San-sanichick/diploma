<template>
    <div class="page">
        <div class="page-header">
            <button @click="goBack">back</button>
            <h3>
                {{ id }}
            </h3>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                id: this.$route.params.id
            }
        },
        mounted(){
            console.log(this.$route.params.id);
        },
        methods: {
            goBack() {
                this.$router.push(`/${this.$store.getters.getUser.id}/projects`);
            }
        }
    })
</script>

<style lang="scss">
    .page {
        padding: 90px 7% 5% 7%;

    }
</style>