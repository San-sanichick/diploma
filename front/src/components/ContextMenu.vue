<template>
    <div v-click-away="closeMenu" v-if="showMenu" class="context-menu" :style="{left: `${xPos}px`, top: `${yPos}px`}">
        <ul>
            <li v-for="(value, index) of options" 
                :key="index" 
                @click="invokeHandler(value)"
                :ref="'ctx_' + index"
                > {{value.text}} </li>
        </ul>
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
                options: null as Array<{ text: string; type: string; handler: Function }> | null
            }
        },
        mounted() {
            this.$emitter.on("context-menu", (e: any) => {
                if (e.options === null) this.closeMenu();
                this.openMenu(e.event, e.options);
            })
        },
        beforeUnmount() {
            this.$emitter.off("context-menu", (e: any) => {
                if (e.options === null) this.closeMenu();
                this.openMenu(e.event, e.options);
            });
        },
        methods: {
            invokeHandler(val: { text: string; type: string; handler: Function }) {
                val.handler(); 
                this.closeMenu();
            },
            openMenu(e: MouseEvent, options: Array<{ text: string; type: string; handler: Function }>): void {
                e.preventDefault();
                e.stopPropagation();

                this.options = options;

                this.xPos = e.clientX,
                this.yPos = e.clientY;
                this.showMenu = !this.showMenu;
            },
            closeMenu(): void {
                this.options = null;
                this.showMenu = !this.showMenu;
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";
    .context-menu {
        position: fixed;
        width: 200px;

        ul {
            list-style: none;
            padding: 8px 0;
            margin: 0;
            background-color: $middlePrimary;
            color: white;
            text-align: left;
            border-radius: 5px;

            li {
                // margin-left: 10px;
                padding: 2px 20px;
                cursor: pointer;
                font-size: 1.6ch;

                &:hover {
                    background-color: $primary;
                    
                }
            }
        }
    }
</style>