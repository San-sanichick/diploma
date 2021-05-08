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

</style>