<template>
    <div class="page-editor">
        <div class="page-header-editor">
            <button @click="goBack">back</button>
            <div>
                <button :value="engineState[0]" @click="setEngineState">select</button>
                <button :value="engineState[1]" @click="setEngineState">point edit</button>
                <button :value="engineState[2]" @click="setEngineState">translate</button>
                <button :value="engineState[3]" @click="setEngineState">rotate</button>
                <button :value="engineState[4]" @click="setEngineState">scale</button>
            </div>
            <div>
                <button :value="shapes[1]" @click="setEngineState">line </button>
                <button :value="shapes[2]" @click="setEngineState">rectangle</button>
                <button :value="shapes[3]" @click="setEngineState">circle</button>
                <button :value="shapes[4]" @click="setEngineState">ellipse</button>
                <button :value="shapes[5]" @click="setEngineState">bezier curve</button>
                <button :value="shapes[6]" @click="setEngineState">arc</button>
            </div>
            <div>
                <button @click="saveProject">save</button>
                <button @click="loadProject">load</button>
                <!-- <button @click="saveAsImage">save as image</button> -->
                <!-- TODO: STYLE THIS AS A BUTTON OR SOMETHING, IT'S BOTHERING ME -->
                <a download="file.png" @click="saveAsImage">save as png</a>
            </div>
            <div>
                <button :value="engineState[6]" @click="setEngineState">group</button>
                <button :value="engineState[7]" @click="setEngineState">ungroup</button>
            </div>
        </div>
        <div class="editor">
            <div class="project-tree">
                <ul>
                    <TreeItem 
                        :item="shapesOnScene"
                        @selected="selectElementHandler" />
                </ul>
            </div>
            <div class="viewport" 
                ref="viewport" 
                tabindex="1">
                <canvas 
                class="canvas-ui" ref="canvas-ui"/>
                <canvas class="canvas" ref="canvas"/>
            </div>
        </div>
    </div>
    <!-- <teleport to="body">
        <Properties>
            <template v-slot:header>
                Свойства
            </template>
            <template v-slot:main> 
                <div v-if="selectedShapes">
                    <div v-if="selectedShapes.length === 1">
                        <table>
                            <tr>
                                <td>Имя: </td>
                                <td>{{ selectedShapes[0].name }}</td>
                            </tr>
                            <tr>
                                <td>Тип: </td>
                                <td>{{ selectedShapes[0].type }}</td>
                            </tr>
                            <tr v-if="selectedShapes[0].type !== 'Group'">
                                <td>Узлы: </td>
                                <td>
                                    {{ castToShape(selectedShapes[0]).numberOfNodes }}
                                </td>
                            </tr>
                            <tr v-else>
                                <td>Число объектов в группе: </td>
                                <td>{{ castToGroup(selectedShapes[0]).getShapes.length }}</td>
                            </tr>
                        </table>
                    </div>
                    <div v-if="selectedShapes.length > 1">
                        Выделенно несколько объектов
                    </div>
                </div>
            </template>
        </Properties>
    </teleport> -->
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import TreeItem from "@/components/TreeItem.vue";
    // import Properties from "../../components/draggable/properties.vue";
    import Engine, { EngineState, Shapes } from "@/engine/engine";
    
    import axios from 'axios';
    import Drawable from '@/engine/shapes/drawable';
    import Shape from '@/engine/shapes/shape';
    import Group from '@/engine/shapes/group';

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
            shapesOnScene(): { name: string; objects: Array<Drawable> } {
                return {
                    name: "root",
                    objects: this.engine.shapeList
                };
            },
            selectedShapes(): Array<Drawable> {
                return this.engine.selectedElements;
            }
        },
        created() {
            this.loadProject();
        },
        mounted() {
            try {
                this.engine = new Engine(this.$refs.viewport as HTMLDivElement);
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
                // console.log(state);
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
                    case "UNGROUP":
                        this.engine.engineState = EngineState.UNGROUP;
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
                try {
                    const data = this.engine.save();
                    const id = this.$route.params.id;
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
                const id = this.$route.params.id;

                try {
                    const res = await axios.get(`projects/get/${id}`);
                    const data = res.data;
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
                }
            },
            selectElementHandler(item: Drawable) {
                if (item instanceof Shape || item instanceof Group) {
                    item.setIsSelected = !item.isSelected;
                    if (item.isSelected) {
                        this.engine.addToSelection(item);
                    } else {
                        this.engine.removeFromSelection(item);
                    }
                }
            },
            // These two are absolutely stupid,
            // but it has to be done, since Vue does not support casting in templates.
            // Well, yet, at the very least
            castToShape(item: Drawable) {
                return item as Shape;
            },
            castToGroup(item: Drawable) {
                return item as Group;
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
        width: 99%;
        height: calc(100% - 70px);
        // padding: 90px 0 0 0;
        .page-header-editor {
            width: 80%;
            margin: 20px 0;
            display: grid;
            gap: 0 2%;
            grid-template-columns: max-content auto max-content;
            align-items: center;
        }

        .editor {
            align-self: flex-start;
            display: grid;
            grid-template-columns: 0.5fr 6fr;
            width: 100%;
            height: 100%;

            .project-tree {
                width: 100%;
                // padding: 10px 20px;
                text-align: left;
                resize: horizontal;
                overflow: auto;

                ul {
                    padding-left: 20px;
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
                    width: 100%;
                    height: 100%;
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