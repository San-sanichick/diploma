<template>
    <div ref="draggable-container" class="draggable-container">
        <div ref="draggable-header" class="draggable-header" @mousedown="dragMouseDown">
            <slot name="header"></slot>
            <button @click="collapse = !collapse">close</button>
        </div>
        <div class="draggable-main" v-if="!collapse">
            <slot name="main"></slot>
        </div>
        <div class="draggable-footer" v-if="!collapse">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: {
            initialPositon: {
                default: {
                    x: 500,
                    y: 500
                }
            }
        },
        data() {
            return {
                positions: {
                    clientX: undefined as number | undefined,
                    clinetY: undefined as number | undefined,
                    movementX: 0,
                    movementY: 0
                },
                collapse: false
            }
        },
        mounted() {
            const container      = this.$refs["draggable-container"] as HTMLElement;
            container.style.top  = this.initialPositon.x + "px";
            container.style.left = this.initialPositon.y + "px";
        },
        methods: {
            dragMouseDown(e: MouseEvent) {
                e.preventDefault();

                this.positions.clientX = e.clientX;
                this.positions.clinetY = e.clientY;
                document.onmousemove = this.elementDrag;
                document.onmouseup = this.closeDragElement;
            },
            elementDrag(e: MouseEvent) {
                e.preventDefault();
                this.positions.movementX = (this.positions.clientX ?? 0) - e.clientX;
                this.positions.movementY = (this.positions.clinetY ?? 0) - e.clientY;
                // I wonder if this will work 🤔
                [this.positions.clientX, this.positions.clinetY] = [e.clientX, e.clientY];
                
                const container = this.$refs["draggable-container"] as HTMLElement;
                container.style.top = (container.offsetTop - this.positions.movementY) + "px";
                container.style.left = (container.offsetLeft - this.positions.movementX) + "px";
            },
            closeDragElement() {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";

    .draggable-container {
        font-family: Open Sans, Arial, sans-serif;
        position: absolute;
        z-index: 9;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
        resize: both;
        min-height: 43px;
        max-height: 243px;
        // height: 0px;
        // width: 100%;
    }

    .draggable-main {
        padding: 10px;
        max-height: 200px;
        overflow: auto;
    }

    .draggable-header {
        display: grid;
        grid-template-columns: auto max-content;

        background-color: $darkPrimary;
        color: white;
        border-radius: 8px;
        z-index: 10;
        // width: 200px;
        padding: 10px;

        // button {
        // }
    }
</style>