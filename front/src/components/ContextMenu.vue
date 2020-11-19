<template>
    <div v-if="showMenu" class="context-menu" :style="{left: `${xPos}px`, top: `${yPos}px`}">
        <slot :id="id">

        </slot>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                xPos: 0,
                yPos: 0,
                showMenu: false,
                id: ""
            }
        },
        mounted() {
            document.addEventListener("click", this.closeMenu);
            // document.addEventListener("contextmenu", this.closeMenu);
        },
        beforeUnmount() {
            document.addEventListener("click", this.closeMenu);
            // document.addEventListener("contextmenu", this.closeMenu);
        },
        methods: {
            openMenu(e: MouseEvent, id: string): void {
                this.id = id;
                this.xPos = e.clientX,
                this.yPos = e.clientY;
                this.showMenu = !this.showMenu;
            },
            setId(id: string): void {
                this.id = id;
            },
            closeMenu(e: Event | undefined): void {
                if (e) {
                    const target = e.target as HTMLElement;
                
                    if (!this.$el.contains(target)) {
                        this.showMenu = false;
                    }
                } else {
                    this.showMenu = false;
                }
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";
    .context-menu {
        position: fixed;
        background-color: black;
        color: white;
        width: 200px;

        ul {
            list-style: none;
            padding: 0;
            margin: 0;

             li {
                 padding: 10px 5px;

                &:hover {
                    background-color: rgba($color: $lightPrimary, $alpha: 0.5);
                    cursor: pointer;
                }
             }
        }
    }
</style>