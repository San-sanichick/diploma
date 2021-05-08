<template>
    <li class="layer" 
        :class="{'selected': layer.id === layerSelected}">
        <div 
            class="layer-color" 
            :style="{ backgroundColor: colors.get(layer.layerColor) }"
            @click="toggleMenu"
            ></div>
        <span @click.stop="$emit('update', layer.id)">{{ layer.name }}</span>
        <button :disabled="disable" @click="$emit('remove', layer.id)">-</button>
        <ColorPicker
            v-model:show="show"
            :color="layer.layerColor" 
            @update:color="updateLayer"/>
    </li>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import ColorPicker from "./ColorPicker.vue";
    import colors from "@/engine/config/colors";

    export default defineComponent({
        components: {
            ColorPicker
        },
        props: ["layer", "disable", "layer-selected"],
        emits: ["remove", "update", "update:layer"],
        data() {
            return {
                colors,
                show: false
            }
        },
        methods: {
            toggleMenu() {
                this.show = !this.show;
            },
            updateLayer(color: number) {
                console.log(color);
                this.$emit("update:layer", { 
                    id: this.layer.id,
                    layerColor: color,
                    name: this.layer.name,
                    size: this.layer.size
                });
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/buttonMixins.scss";

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
            @include button-destyle;

            &:hover {
                background-color: $lightPrimary;
            }
        }

        &:hover {
            color: white;
            background-color: $primaryTransparent;
        }
    }

    .selected {
        color: white;
        background-color: $lightPrimary;
    }
</style>