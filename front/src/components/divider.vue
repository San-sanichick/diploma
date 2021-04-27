<template>
    <div ref="divider" class="divider"></div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                divider: null as HTMLDivElement | null,
                leftEl: null as HTMLElement | null,
                rightEl: null as HTMLElement | null,
                x: 0,
                y: 0,
                leftWidth: 0 as number | undefined
            }
        },
        mounted() {
            this.divider = this.$refs.divider as HTMLDivElement;

            this.leftEl = this.divider.previousElementSibling as HTMLElement;
            this.rightEl = this.divider.nextElementSibling as HTMLElement;

            if (this.rightEl !== null) {
                this.rightEl.style.flex = "1 1 0%";
            }

            this.divider.addEventListener("mousedown", this.mouseDownHandler);
        },
        methods: {
            mouseDownHandler(e: MouseEvent) {
                this.x = e.clientX;
                this.y = e.clientY;
                this.leftWidth = this.leftEl?.getBoundingClientRect().width;
                this.divider?.classList.toggle("selected");
                document.body.style.cursor = "col-resize";
                document.addEventListener("mousemove", this.mouseMoveHandler);
                document.addEventListener("mouseup", this.mouseUpHandler);
            },
            mouseMoveHandler(e: MouseEvent) {
                if (this.leftWidth !== undefined && this.divider !== null && this.divider.parentNode !== null
                    && this.leftEl !== null && this.rightEl !== null) {
                    // this.leftEl.style.userSelect     = "none";
                    // this.leftEl.style.pointerEvents  = "none";
                    // this.rightEl.style.userSelect    = "none";
                    // this.rightEl.style.pointerEvents = "none";

                    const 
                        dx = e.clientX - this.x;

                    const parentNode =  this.divider.parentNode as HTMLElement;

                    const newLeftWidth = (this.leftWidth + dx) * 100 / parentNode.getBoundingClientRect().width;
                    this.leftEl.style.width = `${newLeftWidth}%`;
                }
            },
            mouseUpHandler() {
                if (this.leftWidth !== undefined && this.divider !== null && this.divider.parentNode !== null
                    && this.leftEl !== null && this.rightEl !== null) {
                    
                    // this.divider.style.removeProperty("cursor");
                    document.body.style.removeProperty("cursor");
                    this.divider?.classList.toggle("selected");

                    // this.leftEl.style.removeProperty("userSelect");
                    // this.leftEl.style.removeProperty("pointerEvents");
                    // this.rightEl.style.removeProperty("userSelect");
                    // this.rightEl.style.removeProperty("pointerEvents");

                    document.removeEventListener("mousemove", this.mouseMoveHandler);
                    document.removeEventListener("mouseup", this.mouseUpHandler);
                }
            }
        }
    });
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";

    .divider {
        width: 5px;
        background-color: $darkPrimary;
        cursor: ew-resize;
    }

    .selected {
        background-color: $primary;
    }
</style>