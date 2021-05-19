<template>
    <div 
        v-click-away="clickAway" 
        v-if="show" 
        class="color-picker"
        :style="{ left: `${coord.x}px`, top: `${coord.y}px` }"
        >
        <div class="color-picker-header">
            <h5>Цвета</h5>
        </div>
        <div class="color-picker-color-container">
            <div 
                class="color-option"
                v-for="(c, index) of Array.from(colors)" 
                :key="index"
                :style="{ backgroundColor: c }"
                @click="colorClicked(index + 1)"
                ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import colors from "@/engine/config/colors";
    import { directive } from "vue3-click-away";

    export default defineComponent({
        directives: {
            ClickAway: directive
        },
        props: ["color", "coord", "show"],
        emits: ["update:color", "update:show"],
        data() {
            return {
                colors,
            }
        },
        methods: {
            colorClicked: function(color: number) {
                this.$emit("update:color", color);
                this.$emit("update:show", false);
            },
            clickAway(e: MouseEvent) {
                const target = e.target as HTMLDivElement;
                if (target.className !== "layer-color") {
                    this.$emit("update:show", false);
                }
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";

    .color-picker {
        position: fixed;
        top: 35px;
        // margin-top: 200px;
        // width: 200px;
        padding: 8px 0;
        margin: 0;
        background-color: $middlePrimary;
        color: $whiteText;
        text-align: left;
        border-radius: 5px;
        z-index: 200000;

        h5 {
            margin: 0px 5px;
            padding: 0;
        }

        

        .color-picker-color-container {
           
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(9, max-content);
            column-gap: 4px;

            .color-option {
                position: relative;
                width: 15px;
                height: 15px;
                cursor: pointer;

                &:hover::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    border: 1px solid $lightSecondaryGreen;
                }
            }
        }

        
    }
</style>