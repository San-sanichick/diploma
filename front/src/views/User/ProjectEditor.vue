<template>
    <div class="page">
        <div class="page-header">
            <button @click="goBack">back</button>
            <button :value="engineState[1]" @click="setEngineState">point edit</button>
            <button :value="shapes[1]" @click="setEngineState">draw line</button>
            <button :value="shapes[2]" @click="setEngineState">draw rectangle</button>
            <button :value="shapes[3]" @click="setEngineState">draw circle</button>
            <button :value="shapes[4]" @click="setEngineState">draw bezier curve</button>
            <button :value="shapes[5]" @click="setEngineState">draw arc</button>
        </div>
        <div>
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Engine, { EngineState, Shapes } from "../../engine/engine";

    export default defineComponent({
        data() {
            return {
                id: this.$route.params.id,
                engine: {} as Engine,
                shapes: Shapes,
                engineState: EngineState
            }
        },
        mounted(){
            try {
                this.engine = new Engine(this.$refs.canvas as HTMLCanvasElement, document.body.clientWidth - 200, 700);

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
            },
            setEngineState(e: Event) {
                const button = e.target as HTMLButtonElement;
                const state = button.value;

                switch(state) {
                    case "MOVEPOINT": 
                        this.engine.engineState = EngineState.MOVEPOINT;
                        break;
                    case "LINE":
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw = Shapes.LINE;
                        break;
                    case "RECT":
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw = Shapes.RECT;
                        break;
                    case "CIRCLE":
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw=  Shapes.CIRCLE;
                        break;
                }
                
            }
        }
    })
</script>

<style lang="scss">
    .page {
        padding: 90px 0 0 0;

    }
</style>