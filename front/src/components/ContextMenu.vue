<template>
    <div v-click-away="closeMenu"> v-if="showMenu" class="context-menu" :style="{left: `${xPos}px`, top: `${yPos}px`}">
        <slot :project="project">

        </slot>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { directive } from "vue3-click-away";

    export default defineComponent({
        directives: {
            ClickAway: directive
        },
        data() {
            return {
                xPos: 0,
                yPos: 0,
                showMenu: false,
                project: {}
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
            openMenu(e: MouseEvent, project: object): void {
                this.project = project;
                this.xPos = e.clientX,
                this.yPos = e.clientY;
                this.showMenu = !this.showMenu;
            },
            closeMenu(): void {
                this.showMenu = false;
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