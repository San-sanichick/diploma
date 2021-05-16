<template>
    <div class="layer-list-wrapper">
        <ul class="layer-list">
            <Layer v-for="layer of layers" 
                :key="layer.id"
                :layer="layer"
                @update:layer="updateLayer"
                :disable="layers.length === 1"
                :layer-selected="layerSelected"
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
    import { defineComponent } from 'vue';
    import Layer from "./Layer.vue";
    import colors from "@/engine/config/colors";

    export default defineComponent({
        components: {
            Layer
        },
        props: ["layers", "layerSelected"],
        emits: ["update:layer-selected", "update:layer", "remove", "add"],
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
                this.$emit("update:layer", layer);
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/buttonMixins.scss";

    .layer-list-wrapper {
        // height: 100%;
        display: grid;
        grid-template-rows: max-content auto max-content;

        .layer-list {
            height: 100%;
            list-style: none;
            padding: 0;
            margin: 0;
            cursor: pointer;
            user-select: none;
            // overflow-y: auto;
        }

        .spacer {
            height: 100%;
        }

        .project-layers-buttons {
            // flex: 1;
            background-color: $middlePrimary;
            padding: 5px;

            button {
                float: right;
                @include button-destyle;
                color: white;
                width: 30px;
                height: 30px;

                &:hover {
                    background-color: $primaryTransparent;
                }
            }
        }
    }
</style>