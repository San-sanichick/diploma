<template>
    <div>
        <ul class="layer-list">
            <li class="layer" 
                v-for="layer of layers" 
                :key="layer.id"
                :class="{'selected': layer.id === layerSelected}">
                <div class="layer-color" :style="{ backgroundColor: layer.layerColor }"></div>
                <span @click.stop="$emit('update:layer-selected', layer.id)">{{ layer.name }}</span>
                <button :disabled="layers.length === 1" @click="remove(layer.id)">-</button>
            </li>
        </ul>

        <div class="project-layers-buttons">
            <button @click="$emit('add')">+</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: ["layers", "layerSelected"],
        emits: ["update:layer-selected", "remove", "add"],
        methods: {
            remove(id: number) {
                // this.$emit("update:layer-selected", 0);
                this.$emit("remove", id);
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";

    .layer-list {
        list-style: none;
        padding: 0;
        cursor: pointer;
        user-select: none;

        .layer {
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