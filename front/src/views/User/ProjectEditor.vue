<template>
    <div class="page-editor">
        <div class="page-header-editor">
            <button @click="goBack">back</button>
            <div class="editor-tools">
                <Dropdown 
                    :options="toolSelectOptions"
                    :focused="true"
                    v-model:selected="toolSelected" />
            </div>
            <div class="editor-shapes">
                <Dropdown 
                :focused="false"
                    :options="shapeSelectOptions"
                    v-model:selected="shapeSelected" />
            </div>
            <div></div>
            <div class="editor-save"></div>
            <div class="editor-load"></div>
            <!-- <div>
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
                <a download="file.png" @click="saveAsImage">save as png</a>
            </div>
            <div>
                <button :value="engineState[6]" @click="setEngineState">group</button>
                <button :value="engineState[7]" @click="setEngineState">ungroup</button>
            </div> -->
        </div>
        <div class="editor">
            <SplitView>
                <Pane>
                    <div class="project-tree">
                        <ul>
                            <TreeItem 
                                :item="shapesOnScene"
                                @selected="selectElementHandler" />
                        </ul>
                    </div>
                </Pane>
                <Pane style="flex: 20 1 auto">
                    <div class="viewport" 
                        ref="viewport" 
                        tabindex="1">
                        <canvas 
                        class="canvas-ui" ref="canvas-ui"/>
                        <canvas class="canvas" ref="canvas"/>
                    </div>
                </Pane>
                <Pane>
                    <div class="properties"></div>
                </Pane>
            </SplitView>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import TreeItem from "@/components/TreeItem.vue";
    import Dropdown from "@/components/dropdown/Dropdown.vue";
    import SplitView from "@/components/panes/SplitView.vue";
    import Pane from "@/components/panes/Pane.vue";

    import Engine, { EngineState, Shapes } from "@/engine/engine";
    import axios from 'axios';
    import Drawable from '@/engine/shapes/drawable';
    import Shape from '@/engine/shapes/shape';
    import Group from '@/engine/shapes/group';

    export default defineComponent({
        components: {
            SplitView,
            Pane,
            TreeItem,
            Dropdown
        },
        data() {
            return {
                id: this.$route.params.id,
                engine: {} as Engine,
                shapes: Shapes,
                engineState: EngineState,
                toolSelectOptions: [
                    { id: 0, name: "Выделение", img: "/toolIcons/select.svg", action: EngineState.SELECT, hotkey: "A" },
                    { id: 1, name: "Перенос вершин", img: "/toolIcons/point_edit.svg", action: EngineState.MOVEPOINT, hotkey: "V" },
                    { id: 2, name: "Перенос", img: "/toolIcons/move.svg", action: EngineState.TRANSLATE, hotkey: "M" },
                    { id: 3, name: "Поворот", img: "/toolIcons/rotate.svg", action: EngineState.ROTATE, hotkey: "R" },
                    { id: 4, name: "Масштабирование", img: "/toolIcons/resize.svg", action: EngineState.SCALE, hotkey: "S" }
                ],
                shapeSelectOptions: [
                    { id: 0, name: "Линия"        , img: "/shapeIcons/line.svg",      action: Shapes.LINE,        hotkey: "" },
                    { id: 1, name: "Прямоугольник", img: "/shapeIcons/rect.svg",      action: Shapes.RECT,        hotkey: "" },
                    { id: 2, name: "Окружность",    img: "/shapeIcons/circle.svg",    action: Shapes.CIRCLE,      hotkey: "" },
                    { id: 3, name: "Эллипс",        img: "/shapeIcons/ellipse.svg",   action: Shapes.ELLIPSE,     hotkey: "" },
                    { id: 4, name: "Кривая Безье",  img: "/shapeIcons/bezier.svg",    action: Shapes.BEZIER,      hotkey: "" },
                    { id: 5, name: "Дуга",          img: "/shapeIcons/arc.svg",       action: Shapes.ARC,         hotkey: "" },
                    { id: 6, name: "Полилиния",     img: "/shapeIcons/polyline.svg",  action: Shapes.POLYLINE,    hotkey: "" },
                    { id: 7, name: "Многоугольник", img: "/shapeIcons/polygon.svg",   action: Shapes.POLYGON,     hotkey: "" },
                ],
                toolSelected: { id: 0, name: "Выделение", img: "/toolIcons/select.svg", action: EngineState.SELECT, hotkey: "A" },
                shapeSelected: { id: 0, name: "Линия"        , img: "/shapeIcons/line.svg",       action: Shapes.LINE,        hotkey: "" },
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
        watch: {
            toolSelected: {
                handler() {
                    console.log("WATCHIN");
                    this.engine.engineState = this.toolSelected.action;
                }
            },
            shapeSelected: {
                handler() {
                    this.engine.engineState = EngineState.DRAW;
                    this.engine.curTypeToDraw = this.shapeSelected.action;
                }
            }
        },
        methods: {
            goBack() {
                this.$router.push(`/${this.$store.getters.getUser._id}/projects`);
            },
            setEngineState() {
                // console.log(state);
                // switch(state) {
                //     case EngineState.MOVEPOINT: 
                //         this.engine.engineState = EngineState.MOVEPOINT;
                //         break;
                //     case "SELECT": 
                //         this.engine.engineState = EngineState.SELECT;
                //         break;
                //     case "TRANSLATE": 
                //         this.engine.engineState = EngineState.TRANSLATE;
                //         break;
                //     case "ROTATE": 
                //         this.engine.engineState = EngineState.ROTATE;
                //         break;
                //     case "SCALE": 
                //         this.engine.engineState = EngineState.SCALE;
                //         break;
                //     case "GROUP":
                //         this.engine.engineState = EngineState.GROUP;
                //         break;
                //     case "UNGROUP":
                //         this.engine.engineState = EngineState.UNGROUP;
                //         break;
                //     case "LINE":
                //         this.engine.engineState = EngineState.DRAW;
                //         this.engine.curTypeToDraw = Shapes.LINE;
                //         break;
                //     case "RECT":
                //         this.engine.engineState = EngineState.DRAW;
                //         this.engine.curTypeToDraw = Shapes.RECT;
                //         break;
                //     case "CIRCLE":
                //         this.engine.engineState = EngineState.DRAW;
                //         this.engine.curTypeToDraw=  Shapes.CIRCLE;
                //         break;
                //     case "ELLIPSE":
                //         this.engine.engineState = EngineState.DRAW;
                //         this.engine.curTypeToDraw = Shapes.ELLIPSE;
                //         break;
                //     case "BEZIER":
                //         this.engine.engineState = EngineState.DRAW;
                //         this.engine.curTypeToDraw=  Shapes.BEZIER;
                //         break;
                //     case "ARC":
                //         this.engine.engineState = EngineState.DRAW;
                //         this.engine.curTypeToDraw = Shapes.ARC;
                //         break;
                // }
                
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
        height: calc(100% - 65px);
        // padding: 90px 0 0 0;
        .page-header-editor {
            width: 80%;
            margin: 20px 0;
            display: grid;
            gap: 0 2%;
            grid-template-columns: 1fr 1fr auto 1fr 1fr;
        }

        .editor {
            align-self: flex-start;
            display: flex;
            z-index: 1000;
            width: 100%;
            height: 100%;

            .project-tree {
                // width: 100%;
                min-width: 200px;
                // padding: 10px 20px;
                // position: relative;
                text-align: left;
                // resize: horizontal;
                overflow-x: auto;

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
                // min-width: 800px;

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

            .properties {
                // position: relative;
                min-width: 150px;
                // width: 100%;
                // max-width: 300px;
            }
        }
    }
</style>