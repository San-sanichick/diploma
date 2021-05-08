<template>
    <div>
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
            updateLayer(layer: any) {
                this.$emit("update:layer", layer);
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";

    .layer-list {
        list-style: none;
        padding: 0;
        cursor: pointer;
        user-select: none;

        .layer {
            position: relative;
            display: grid;
            grid-template-columns: max-content auto max-content;
            align-items: center;
            text-align: left;
            column-gap: 10px;
            padding: 5px 10px;

            .layer-color {
                width: 25px;
                height: 25px;
                border: 1px solid $darkSecondaryGreen;
            }
            button {
                width: 25px;
                height: 25px;
            }

            &:hover {
                color: white;
                background-color: $primaryTransparent;
            }
        }

        .selected {
            color: white;
            background-color: $primaryTransparent;
        }
    }
</style>