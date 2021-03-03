<template>
    <div class="page">
        <div class="page-header">
            <button @click="goBack">back</button>
            <button :value="engineState[1]" @click="setEngineState">point edit</button>
            <button :value="shapes[1]" @click="setEngineState">draw line</button>
            <button :value="shapes[2]" @click="setEngineState">draw rectangle</button>
            <button :value="shapes[3]" @click="setEngineState">draw circle</button>
            <button :value="shapes[4]" @click="setEngineState">draw ellipse</button>
            <button :value="shapes[5]" @click="setEngineState">draw bezier curve</button>
            <button :value="shapes[6]" @click="setEngineState">draw arc</button>
        </div>
        <div>
            <canvas class="canvas" ref="canvas"></canvas>
        </div>
    </div>
    <teleport to="body">
        <Properties>
            <template v-slot:header>
                Objects
            </template>
            <template v-slot:main> 
                <div v-for="shape in shapesOnScene" :key="shape.name" style="padding: 10px;">
                    {{ shape.toString() }}
                </div>
            </template>
        </Properties>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Properties from "../../components/draggable/properties.vue";

    import Engine, { EngineState, Shapes } from "../../engine/engine";
    import Shape from "../../engine/shapes/shape";

    export default defineComponent({
        components: {
            Properties,
        },
        data() {
            return {
                id: this.$route.params.id,
                engine: {} as Engine,
                shapes: Shapes,
                engineState: EngineState
            }
        },
        computed: {
            shapesOnScene(): Array<Shape> {
                return this.engine.shapeList;
            }
        },
        mounted(){
            try {
                this.engine = new Engine(this.$refs.canvas as HTMLCanvasElement, document.body.clientWidth - 600, 800);
                // this.$router.$
                 if (this.engine.init()) {
                     this.engine.start();
                 }

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
                    case "ELLIPSE":
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw = Shapes.ELLIPSE;
                        break;
                    case "BEZIER":
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw=  Shapes.BEZIER;
                        break;
                    case "ARC":
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw=  Shapes.ARC;
                        break;
                }
                
            }
        }
    })
</script>

<style lang="scss">
    .page {
        padding: 90px 0 0 0;

        .canvas {
            cursor: none;
        }
    }
</style>