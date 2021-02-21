<template>
    <div class="page">
        <div class="page-header">
            <button @click="goBack">back</button>
        </div>
        <div>
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Engine from "../../engine/engine";

    export default defineComponent({
        data() {
            return {
                id: this.$route.params.id,
                engine: {} as Engine
            }
        },
        mounted(){
            try {
                this.engine = new Engine(this.$refs.canvas as HTMLCanvasElement, 800, 700);

                this.engine.init();

                const renderer = () => {
                try {
                    this.engine.update();
                    requestAnimationFrame(renderer);
                } catch(e) {
                    console.error(e);
                    return;
                }
            }

            requestAnimationFrame(renderer);
            } catch (err) {
                console.error(err);
            }
        },
        methods: {
            goBack() {
                this.$router.push(`/${this.$store.getters.getUser._id}/projects`);
            }
        }
    })
</script>

<style lang="scss">
    .page {
        padding: 90px 0 0 0;

    }
</style>