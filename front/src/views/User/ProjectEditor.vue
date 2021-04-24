<template>
    <div class="page-editor">
        <div class="page-header-editor">
            <button @click="goBack">back</button>
            <div>
                <button :value="engineState[0]" @click="setEngineState">select shape</button>
                <button :value="engineState[1]" @click="setEngineState">point edit</button>
                <button :value="engineState[6]" @click="setEngineState">group</button>
                <button :value="engineState[7]">ungroup</button>
                <button :value="engineState[2]" @click="setEngineState">translate shape</button>
                <button :value="engineState[3]" @click="setEngineState">rotate shape</button>
                <button :value="engineState[4]" @click="setEngineState">scale shape</button>
            </div>
            <div>
                <button :value="shapes[1]" @click="setEngineState">draw line</button>
                <button :value="shapes[2]" @click="setEngineState">draw rectangle</button>
                <button :value="shapes[3]" @click="setEngineState">draw circle</button>
                <button :value="shapes[4]" @click="setEngineState">draw ellipse</button>
                <button :value="shapes[5]" @click="setEngineState">draw bezier curve</button>
                <button :value="shapes[6]" @click="setEngineState">draw arc</button>
            </div>
            <div>
                <button @click="saveProject">save</button>
                <button @click="loadProject">load</button>
                <!-- <button @click="saveAsImage">save as image</button> -->
                <!-- TODO: STYLE THIS AS A BUTTON OR SOMETHING, IT'S BOTHERING ME -->
                <a download="file.png" @click="saveAsImage">save as png</a>
            </div>
        </div>
        <div class="editor">
            <div class="project-tree">
                <ul>
                    <TreeItem :item="shapesOnScene" />
                </ul>
            </div>
            <div class="viewport" ref="viewport" tabindex="1">
                <canvas class="canvas-ui" ref="canvas-ui"></canvas>
                <canvas class="canvas" ref="canvas"></canvas>
            </div>
        </div>
    </div>
    <!-- <teleport to="body">
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
    </teleport> -->
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import TreeItem from "../../components/TreeItem.vue"
    // import Properties from "../../components/draggable/properties.vue";

    import Engine, { EngineState, Shapes } from "../../engine/engine";
    // import Shape from "../../engine/shapes/shape";
    import axios from 'axios';
    import Drawable from '@/engine/shapes/drawable';
    // import Serializer from '@/engine/shapes/serializer';

    export default defineComponent({
        components: {
            // Properties,
            TreeItem
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
            shapesOnScene(): { name: string; shapes: Array<Drawable> } {
                return {
                    name: "root",
                    shapes: this.engine.shapeList
                };
            }
        },
        created() {
            this.loadProject();
        },
        mounted() {
            try {
                const viewport = this.$refs.viewport as HTMLDivElement;
                viewport.style.width = (document.body.clientWidth - 600) + "px";
                viewport.style.height = "800px";

                this.engine = new Engine(this.$refs.viewport as HTMLDivElement, document.body.clientWidth - 600, 800);
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
                console.log(state);
                switch(state) {
                    case "MOVEPOINT": 
                        this.engine.engineState = EngineState.MOVEPOINT;
                        break;
                    case "SELECT": 
                        this.engine.engineState = EngineState.SELECT;
                        break;
                    case "TRANSLATE": 
                        this.engine.engineState = EngineState.TRANSLATE;
                        break;
                    case "ROTATE": 
                        this.engine.engineState = EngineState.ROTATE;
                        break;
                    case "SCALE": 
                        this.engine.engineState = EngineState.SCALE;
                        break;
                    case "GROUP":
                        this.engine.engineState = EngineState.GROUP;
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
                        this.engine.curTypeToDraw = Shapes.ARC;
                        break;
                }
                
            },
            async saveProject() {
                const data = this.engine.save();
                const id = this.$route.params.id;

                try {
                    const res = await axios.patch(`projects/save`, { id, data });

                    this.$flashMessage.show({
                        type: 'success',
                        image: require("../../assets/flashMessage/success.svg"),
                        text: res.data.msg
                    });
                } catch(err) {
                    this.$flashMessage.show({
                        type: 'error',
                        image: require("../../assets/flashMessage/fail.svg"),
                        text: err
                    });
                }
            },
            async loadProject() {
                // try {
                //     this.engine.load(this.str);
                // } catch (e) {
                //     console.error(e);
                // }
                const id = this.$route.params.id;

                try {
                    const res = await axios.get(`projects/get/${id}`);
                    const data = res.data;
                    // console.log(data.data);
                    this.engine.load(data.data);

                    this.$flashMessage.show({
                        type: 'success',
                        image: require("../../assets/flashMessage/success.svg"),
                        text: res.data.msg
                    });
                } catch (err) {
                    this.$flashMessage.show({
                        type: 'error',
                        image: require("../../assets/flashMessage/fail.svg"),
                        text: err
                    });
                }
            },
            saveAsImage(e: Event) {
                const target = e.target as HTMLAnchorElement;
                const filePath = this.engine.saveImage();

                if (target !== null && filePath !== undefined) {
                    target.href = filePath;
                    // target.click();
                }
            }
        }
    })
</script>

<style lang="scss">
    .page-editor {
        padding: 65px 0 0 0;
        
        display: flex;
        flex-flow: column;
        align-items: center;
        // padding: 90px 0 0 0;
        .page-header-editor {
            margin: 20px 0;
            display: grid;
            grid-template-columns: max-content auto max-content;
            align-items: center;
        }

        .editor {
            align-self: flex-start;
            display: grid;
            grid-template-columns: 15% auto;
            width: 100%;

            .project-tree {
                // width: 100%;
                padding: 0 20px;
                text-align: left;

                ul {
                    padding-left: 5%;
                    // line-height: 1.5em;
                    margin: 0;
                    list-style: none;
                }
            }

            .viewport {
                position: relative;
                height: 100%;
                width: 100%;

                canvas {
                    cursor: none;
                    position: absolute;
                    margin-left: auto;
                    margin-right: auto;
                    left: 0;
                    right: 0;
                    text-align: center;
                }

                .canvas {
                    left: 0; 
                    top: 0;
                    z-index: 0;
                }

                .canvas-ui {
                    left: 0; 
                    top: 0;
                    z-index: 1;
                }
            }
        }
    }
</style>