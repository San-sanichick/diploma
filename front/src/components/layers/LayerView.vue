<template>
    <div class="layer-list-wrapper">
        <ul class="layer-list" v-if="layers">
            <Layer v-for="layer of layers" 
                :key="layer.id"
                :layer="layer"
                @update-layer="updateLayer"
                :disable="layers.length === 1"
                :layerselected="layerSelected"
                @remove="remove"
                @update="update" />
        </ul>
        <div class="spacer"></div>
        <div class="project-layers-buttons">
            <button @click="$emit('add')">+</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import Layer from "./Layer.vue";
    import colors from "@/engine/config/colors";

    export default defineComponent({
        components: {
            Layer
        },
        props: {
            layers: {
                type: Object as PropType<Array<{ id: number; name: string; layerColor: number; size: number }>>,
                required: true
            },
            layerSelected: {
                type: Number
            }
        },
        emits: ["update:layer-selected", "update-layer", "remove", "add"],
        data() {
            return {
                colors
            }
        },
        methods: {
            remove(id: number) {
                this.$emit("remove", id);
            },
            update(id: number) {
                this.$emit('update:layer-selected', id);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateLayer(layer: any) {
                this.$emit("update-layer", layer);
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/buttonMixins.scss";

    .layer-list-wrapper {
        display: grid;
        grid-template-rows: auto auto max-content;
        overflow: hidden;

        .layer-list {
            height: 100%;
            list-style: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            user-select: none;
            z-index: 50;
            overflow-y: auto;
        }

        .spacer {
            height: 100%;
        }

        .project-layers-buttons {
            background-color: $middlePrimary;
            padding: 5px;
            z-index: 100;

            button {
                float: right;
                @include button-destyle;
                color: $whiteText;
                width: 30px;
                height: 30px;

                &:hover {
                    background-color: $primaryTransparent;
                }
            }
        }
    }
</style>