<template>
    <li class="layer" 
        @click.stop="$emit('update', layer.id)"
        :class="{'selected': layer.id === layerSelected}">
        <div 
            class="layer-color" 
            :style="{ backgroundColor: colors.get(layer.layerColor) }"
            @click="toggleMenu"
            ></div>
        <div class="layer-name-wrapper">
            <span v-if="!edit" @dblclick="edit = true" >{{ layer.name }}</span>
            <!-- FOR THE LOVE OF GOD -->
            <!-- WHY IS THE WIDTH FOR INPUT -->
            <!-- DETRMINED BY ITS SIZE VALUE -->
            <!-- THAT IS ACTUALLY RETARDED -->
            <input
                class="layer-name-edit" 
                v-click-away="closeEdit"
                v-focus
                v-if="edit" 
                type="text" 
                size="3"
                :value="layer.name" 
                @keyup.enter="updateLayerName">
        </div>
        <button :disabled="disable" @click.stop="$emit('remove', layer.id)">–</button>
        <teleport to="#app">
            <ColorPicker
                v-model:show="show"
                :color="layer.layerColor" 
                :coord="coord"
                @update:color="updateLayer"/>
        </teleport>
    </li>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import ColorPicker from "./ColorPicker.vue";
    import colors from "@/engine/config/colors";
    import { directive } from "vue3-click-away";

    export default defineComponent({
        directives: {
            ClickAway: directive
        },
        components: {
            ColorPicker
        },
        props: ["layer", "disable", "layer-selected"],
        emits: ["remove", "update", "update:layer"],
        data() {
            return {
                colors,
                show: false,
                edit: false,
                coord: {
                    x: 0,
                    y: 0,
                }
            }
        },
        methods: {
            toggleMenu(e: MouseEvent) {
                this.show = !this.show;
                // [this.coord.x, this.coord.y] = [e.clientX, e.clientY];
                this.coord.x = e.pageX;
                this.coord.y = e.pageY;
            },
            updateLayer(color: number) {
                this.$emit("update:layer", { 
                    id: this.layer.id,
                    layerColor: color,
                    name: this.layer.name,
                    size: this.layer.size
                });
            },
            updateLayerName(e: InputEvent) {
                // console.log(e.target?);
                const target = e.target as HTMLInputElement;
                const name = target.value;
                this.edit = false;

                this.$emit("update:layer", { 
                    id: this.layer.id,
                    layerColor: this.layer.layerColor,
                    name,
                    size: this.layer.size
                });
            },
            closeEdit(e: MouseEvent) {
                const target = e.target as HTMLInputElement;
                console.log(target.className);
                if (target.className !== "layer-name-edit") {
                    this.edit = false;
                }
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/buttonMixins.scss";

    .layer {
        position: relative;
        // width: 180px;
        margin: 0;
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

        .layer-name-wrapper {
            width: 50%;
            white-space: nowrap;
            
            input {
                display: inline;
                // width: 40%;
                color: $whiteText;
                
                margin: 0;
                padding: 2px 5px;
                background-color: $darkPrimary;
                border: 1px solid $lightSecondaryGreen;
                border-radius: 2px;
                outline: none;
            }
        }


        button {
            width: 25px;
            height: 25px;
            color: $whiteText;
            @include button-destyle;

            &:hover {
                background-color: $lightPrimary;
            }
        }

        &:hover {
            color: $whiteText;
            background-color: $primaryTransparent;
        }
    }

    .selected {
        color: $whiteText;
        background-color: $lightPrimary;
    }
</style>