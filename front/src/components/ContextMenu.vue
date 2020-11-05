<template>
    <div v-if="showMenu" class="context-menu" @clickout="closeMenu" :style="{left: `${xPos}px`, top: `${yPos}px`}">
        <ul>
            <li>option 1</li>
            <li>option 2</li>
        </ul>
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
                id: 0
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
            openMenu(e: MouseEvent, id: number): void {
                this.id = id;
                this.xPos = e.clientX,
                this.yPos = e.clientY;
                this.showMenu = !this.showMenu;
            },
            setId(id: number): void {
                this.id = id;
            },
            closeMenu(e: Event): void {
                const target = e.target as HTMLElement;
                
                if (!this.$el.contains(target)) {
                    this.showMenu = false;
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
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
                    background-color: #ccc;
                    cursor: pointer;
                }
             }
        }
    }
</style>