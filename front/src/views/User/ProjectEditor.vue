<template>
    <div class="page-editor">
        <div class="page-header-editor">
            <div class="editor-tools">
                <Dropdown 
                    :id="0"
                    :options="toolSelectOptions"
                    :focused="focused[0]"
                    @dropdown-focused="handleFocused"
                    v-model:selected="toolSelected" />
            </div>
            <div class="editor-shapes">
                <Dropdown 
                    :id="1"
                    :focused="focused[1]"
                    :options="shapeSelectOptions"
                    @dropdown-focused="handleFocused"
                    v-model:selected="shapeSelectedTool" />
            </div>
            <div class="header-button-container">
                <button title="Группировать (Ctrl+G)" @click="engine.group()" class="editor-group"></button>
                <button title="Разгруппировать (Ctrl+Alt+G)" @click="engine.ungroup()" class="editor-ungroup"></button>
            </div>
            <div></div>
            <div class="header-button-container">
                <button title="Сохранить на сервере (Ctrl+S)" @click="saveProject" class="editor-save"></button>
                <button title="Загрузить с сервера (Ctrl+O)"  @click="loadProject" class="editor-load"></button>
                <button title="Сохранить DXF" @click="saveProjectToDXF" class="editor-save-dxf"></button>
            </div>
            <div class="header-button-container">
                <button title="Вернуться на страницу проектов" class="editor-back" @click="goBack"></button>
            </div>
        </div>
        <div class="editor">
            <splitpanes
                :push-other-panes="false">
                <pane 
                    min-size="2"
                    size="12"
                    >
                    <div class="project-tree panel">
                        <div class="panel-header">
                            <h3>Дерево проекта</h3>
                        </div>
                        <ul class="tree-container">
                            <TreeItem 
                                :depth="1"
                                :item="shapesOnScene"
                                @selected="selectElementHandler" />
                        </ul>
                    </div>
                </pane>
                <pane size="76">
                    <div class="viewport" 
                        ref="viewport" 
                        tabindex="1">
                        <canvas 
                        class="canvas-ui" ref="canvas-ui"/>
                        <canvas class="canvas" ref="canvas"/>
                    </div>
                </pane>
                <pane 
                    min-size="2"
                    size="12"
                    >
                    <splitpanes horizontal>
                        <pane min-size="20">
                            <div class="properties panel">
                                <div class="panel-header">
                                    <h3>Свойства</h3>
                                </div>
                                <Properties :item="selectedShape" />
                            </div>
                        </pane>
                        <pane min-size="20">
                            <div class="project-layers panel">
                                <div class="panel-header">
                                    <h3>Слои</h3>
                                </div>
                                <LayerView 
                                    :layers="layers" 
                                    @update-layer="updateLayers"
                                    v-model:layer-selected="currentLayer"
                                    @add="addLayer"
                                    @remove="removeLayer" />
                            </div>
                        </pane>
                    </splitpanes>
                </pane>
            </splitpanes>
        </div>
        <div class="page-footer-editor">
            <div title="Координаты курсора" class="mouse-coordinates">X: {{ mousePosition.x }}, Y: {{ mousePosition.y }}</div>
            <div></div>
            <div class="snap-controls" title="Привязка к сетке (Ctrl+B)">
                <input type="checkbox" name="snap" id="snap" v-model="isSnap">
                <label for="snap">Привязка к сетке</label>
            </div>
            <div class="slider">
                <!-- don't ask me where these numbers come from, it's magic -->
                <span title="Масштаб (Ctrl+=, Ctrl+-)">Масштаб: {{ Math.round((scale / 30) * 100) }}%</span>
                <input class="editor-scale" type="range" name="editor-scale" v-model="scale" min="3" max="200">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import { Splitpanes, Pane } from "splitpanes";
    import 'splitpanes/dist/splitpanes.css'

    import TreeItem from "@/components/TreeItem.vue";
    import Dropdown from "@/components/dropdown/Dropdown.vue";
    import Properties from "@/components/Properties.vue";
    import LayerView from "@/components/layers/LayerView.vue";

    import Engine, { EngineState, Shapes } from "@/engine/engine";
    import fileDownload from "js-file-download";
    import Drawable from '@/engine/shapes/drawable';
    import Shape from '@/engine/shapes/shape';
    import Group from '@/engine/shapes/group';

    export default defineComponent({
        components: {
            // SplitView,
            // Pane,
            Splitpanes, 
            Pane,
            TreeItem,
            Properties,
            LayerView,
            Dropdown,
        },
        data() {
            return {
                id: this.$route.params.id,
                engine: {} as Engine,
                toolSelectOptions: [
                    { id: 0, name: "Выделение",       img: "/toolIcons/select.svg",     action: EngineState.SELECT,    hotkey: "A" },
                    { id: 1, name: "Перенос вершин",  img: "/toolIcons/point_edit.svg", action: EngineState.MOVEPOINT, hotkey: "V" },
                    { id: 2, name: "Перенос",         img: "/toolIcons/move.svg",       action: EngineState.TRANSLATE, hotkey: "M" },
                    { id: 3, name: "Поворот",         img: "/toolIcons/rotate.svg",     action: EngineState.ROTATE,    hotkey: "R" },
                    { id: 4, name: "Масштабирование", img: "/toolIcons/resize.svg",     action: EngineState.SCALE,     hotkey: "S" }
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
                    // { id: 8, name: "Сплайн",        img: "/shapeIcons/polyline.svg",  action: Shapes.SPLINE,      hotkey: "" },
                ],
                shapeSelectedTool: { id: 0, name: "Линия", img: "/shapeIcons/line.svg", action: Shapes.LINE, hotkey: "" },
                toolSelected: { id: 0, name: "Выделение",       img: "/toolIcons/select.svg",     action: EngineState.SELECT,    hotkey: "A" },
                toolId: 0,
                focused: [ true, false ]
            }
        },
        computed: {
            shapesOnScene(): { name: string; objects: Array<Drawable> } {
                return {
                    name: "root",
                    objects: this.engine.shapeList
                };
            },
            layers:{
                get(): Array<{ id: number; name: string; layerColor: number; size: number }> {
                    return this.engine.layerList;
                },
                set(arr: Array<{ id: number; name: string; layerColor: number; size: number }>) {
                    this.engine.setLayerList = arr;
                }
            },
            currentLayer: {
                get(): number {
                    return this.engine.getCurLayer;
                },
                set(val: number) {
                    this.engine.setCurLayer = val;
                }
            },
            selectedShape: {
                get(): Drawable | null | Array<Drawable> {
                    if (this.engine.selectedElements) {
                        if (this.engine.selectedElements.length === 1) {
                            return this.engine.selectedElements[0];
                        } else if (this.engine.selectedElements.length > 1) {
                            return this.engine.selectedElements;
                        }
                    } else {
                        return null;
                    }
                    return null;
                },
                set(val: Drawable) {
                    this.engine.editSelected(0, val);
                }
            },
            // first time I used this, this is very noice
            // toolSelected: {
            //     get(): { id: number; name: string; img: string; action: EngineState; hotkey: string } {
            //         let option = this.toolSelectOptions.find(opt => opt.action === this.engine.engineState);

            //         // hacky solutions to modern problems
            //         if (this.engine.engineState === EngineState.DRAW) {
            //             option = this.toolSelectOptions.find(opt => opt.id === this.toolId);
            //             return option ?? this.toolSelectOptions[0];
            //         } 
            //         // console.log(this.toolSelected);
            //         return option ?? this.toolSelectOptions[0];
            //     },
            //     set(option: { id: number; name: string; img: string; action: EngineState; hotkey: string }) {
            //         this.engine.engineState = option.action;
            //     }
            // },
            mousePosition(): { x: string; y: string } {
                if (this.engine.mouseCoordinates) {
                    return {
                        x: this.engine.mouseCoordinates.x.toFixed(2),
                        y: this.engine.mouseCoordinates.y.toFixed(2)
                    }
                } else {
                    return {
                        x: "0",
                        y: "0"
                    }
                }
            },
            scale: {
                get(): number {
                    // const scale = this.engine.scaleValue()
                    let scale: number | undefined = 0;
                    if (this.engine !== ({} as Engine) && this.engine.scaleValue) {
                        scale = this.engine.scaleValue();
                    }
                    return scale !== undefined ? scale : 0;
                },
                set(val: string) {
                    // this is silly, why the fuck does range element return a STRING
                    this.engine.scaleValue(parseInt(val));
                }
            },
            isSnap: {
                get(): boolean {
                    if (this.engine && this.engine.isSnap) {
                        return this.engine.isSnap;
                    } else {
                        return false;
                    }
                },
                set(val: boolean) {
                    this.engine.isSnap = val;
                } 
            }
        },
        mounted() {
            try {
                this.engine = new Engine(this.$refs.viewport as HTMLDivElement, this.$emitter);
                if (this.engine.init()) {
                    this.engine.start();
                    this.loadProject();
                }

                this.$emitter.on("save", this.saveProject);
                this.$emitter.on("load", this.loadProject);

                this.$emitter.on("statechange", (e: unknown) => {
                    const state = e as EngineState;
                    let option = this.toolSelectOptions.find(opt => opt.action === state);
                    this.toolSelected = option ?? this.toolSelectOptions[0];

                    if (this.engine.engineState === EngineState.DRAW) {
                        option = this.toolSelectOptions.find(opt => opt.id === this.toolId);
                        this.toolSelected = option ?? this.toolSelectOptions[0];
                        return;
                    } 

                    // this.focused[0] = true;
                    this.handleFocused(0);
                })
            } catch (err) {
                console.error(err);
                this.$flashMessage.show({
                    type: 'error',
                    image"/assets/flashMessage/fail.svg",
                    text: err
                });
            }

            
            // document.body.addEventListener("")
        },
        beforeUnmount() {
            this.engine.releaseEngine();
        },
        watch: {
            shapeSelectedTool: {
                handler() {
                    this.engine.engineState = EngineState.DRAW;
                    this.engine.curTypeToDraw = this.shapeSelectedTool.action;
                }
            },
            toolSelected: {
                handler() {
                    this.toolId = this.toolSelected.id;
                }
            },
            // hacks
            focused: {
                handler(newVal: boolean[]) {
                    if (newVal[0]) {
                        this.engine.engineState = this.toolSelected.action;
                    } else if (newVal[1]) {
                        this.engine.engineState = EngineState.DRAW;
                        this.engine.curTypeToDraw = this.shapeSelectedTool.action;
                    }
                }
            }
        },
        methods: {
            goBack() {
                this.$router.push(`/users/${this.$store.getters.getUser._id}/projects`);
            },
            async saveProject() {
                try {
                    const data = this.engine.save();
                    const id = this.$route.params.id;
                    const res = await this.$axios.patch(`projects/save`, { id, data });

                    this.$flashMessage.show({
                        type: 'success',
                        image"/assets/flashMessage/success.svg",
                        text: res.data.msg
                    });
                } catch(err) {
                    this.$flashMessage.show({
                        type: 'error',
                        image"/assets/flashMessage/fail.svg",
                        text: err
                    });
                }
            },
            async loadProject() {
                const id = this.$route.params.id;

                try {
                    const res = await this.$axios.get(`projects/get/${id}`);
                    if (res.status !== 200) throw new Error(res.data.msg);
                    const data = res.data;
                    this.engine.load(data.data);

                    this.$flashMessage.show({
                        type: 'success',
                        image"/assets/flashMessage/success.svg",
                        text: res.data.msg
                    });
                } catch (err) {
                    console.error(err);
                    this.$router.push("/404");
                    this.$flashMessage.show({
                        type: 'error',
                        image"/assets/flashMessage/fail.svg",
                        text: err
                    });
                }
            },
            saveProjectToDXF() {
                fileDownload(this.engine.saveToDXF(), "file.dxf");
                this.$flashMessage.show({
                    type: 'success',
                    image:"../../assets/flashMessage/success.svg",
                    text: "Успешно сохранено в файл"
                });
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
            handleFocused(id: number) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                this.focused = this.focused.map(f => f = false);
                this.focused.splice(id, 1, true);
            },
            addLayer() {
                // TODO: Add color picker
                // TODO: Change shape color rendering
                this.engine.addLayer();
            },
            removeLayer(id: number) {
                this.engine.removeLayer(id);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateLayers(layer: any) {
                const found = this.layers.find(l => l.id === layer.id);
                if (found) {
                    const index = this.layers.indexOf(found);
                    this.engine.updateLayer(index, layer);
                }
            },
            // updateSelected(item: Drawable) {
                // this.engine.selectedElements.find(s => s.)
            // },
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
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/editorMixins.scss";

    .page-editor {
        padding: 65px 0 0 0;
        
        display: flex;
        flex-flow: column;
        align-items: center;
        width: 100%;
        height: calc(100% - 65px);
        // padding: 90px 0 0 0;
        .page-header-editor {
            width: 100%;
            background-color: $middlePrimary;
            display: grid;
            grid-template-columns: max-content max-content max-content auto max-content max-content max-content;

            .header-button-container {

                button {
                    background-color: $middlePrimary;
                    outline: none;
                    border: none;
                    width: 55px;
                    height: 55px;
                    padding: 5px;
                    @include editor-button-style;
                }

                .editor-group {
                    background-image: url("../../assets/toolIcons/group.svg");
                }

                .editor-ungroup {
                    background-image: url("../../assets/toolIcons/ungroup.svg");
                }

                .editor-save {
                    background-image: url("../../assets/toolIcons/save.svg");
                }

                .editor-load {
                    background-image: url("../../assets/toolIcons/load.svg");
                }

                .editor-save-dxf {
                    background-image: url("../../assets/toolIcons/download.svg");
                }

                .editor-back {
                    background-image: url("../../assets/toolIcons/back.svg");
                }
            }
        }

        .editor {
            align-self: flex-start;
            display: flex;
            z-index: 1000;
            width: 100%;
            height: 100%;

            .panel {
                min-width: 20px;
                display: grid;
                grid-template-rows: max-content auto;
                height: 100%;

                .panel-header {
                    background-color: $primary;
                    color: $whiteText;
                    text-align: left;
                    padding: 12px 15px;
                    user-select: none;

                    h3 {
                        font-size: 1em;
                        margin: 0;
                        font-weight: 600;
                        white-space: nowrap;
                    }
                }
            }

            .properties {
                height: 60%;
            }

            .project-tree {
                // position: relative;
                text-align: left;
                // resize: horizontal;
                overflow-x: auto;

                .tree-container {
                    padding-left: 0;
                    // line-height: 1.5em;
                    // padding: 0;
                    // margin: 10px 0;
                    list-style: none;
                }
            }

            .project-layers {
                height: 100%;
            }

            .viewport {
                position: relative;
                height: 100%;
                width: 100%;
                // width: 1500px;

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

        .page-footer-editor {
            width: calc(100% - 30px);
            background-color: $lightSecondaryGreen;
            color: $whiteText;
            font-size: 1.5ch;
            padding: 3px 15px;
            display: grid;
            grid-template-columns: max-content auto max-content max-content;
            align-items: center;
            column-gap: 20px;
            user-select: none;

            .mouse-coordinates {
                width: auto;
                text-align: left;
            }

            .snap-controls {
                display: flex;
                flex-flow: row;
                justify-content: center;

                input {
                    margin: auto 5px;
                }

                label {
                    margin-bottom: 1px;
                }
            }

            .slider {
                display: flex;
                flex-flow: row;
                justify-content: center;

                .editor-scale {
                    margin-left: 6px;
                    background-color: green;
                }
            }
        }
    }


    .splitpanes__splitter {
        background-color: $darkSecondaryGreen;
        position: relative;
    }
    .splitpanes__splitter:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        transition: opacity 0.4s; 
        background-color: $primaryTransparent;
        opacity: 0;
        z-index: 10000;
    }
    .splitpanes__splitter:hover:before {
        opacity: 1;
    }

    .splitpanes--vertical > .splitpanes__splitter:before {
        left: -5px;
        right: -5px;
        height: 100%;
    }

    .splitpanes--horizontal > .splitpanes__splitter:before {
        top: -5px;
        bottom: -5px;
        width: 100%;
    }
</style>