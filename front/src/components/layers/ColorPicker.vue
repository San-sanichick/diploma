<template>
    <div v-if="show" class="color-picker">
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
    import { defineComponent } from 'vue';
    import colors from "@/engine/config/colors";
    import { directive } from "vue3-click-away";

    export default defineComponent({
        directives: {
            ClickAway: directive
        },
        props: ["color", "show"],
        emits: ["update:color", "update:show"],
        data() {
            return {
                colors,
            }
        },
        methods: {
            colorClicked: function(color: number) {
                console.log(color);
                this.$emit("update:color", color);
                // this.$emit("update:show", false);
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";

    .color-picker {
        position: absolute;
        top: 35px;
        // margin-top: 200px;
        // width: 200px;
        padding: 8px 0;
        margin: 0;
        background-color: $middlePrimary;
        color: white;
        text-align: left;
        border-radius: 5px;
        z-index: 2000;

        h5 {
            margin: 0px 5px;
            padding: 0;
        }

        

        .color-picker-color-container {
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(9, max-content);
            column-gap: 5px;
            // height: 100%;

            .color-option {
                width: 10px;
                height: 10px;

                border: 1px solid black;
            }
        }

        
    }
</style>