<template>
    <li>
        <div class="item" 
            :class="{ selected: item.isSelected }"
            :style="{ paddingLeft: `${15 * +depth}px` }"
            >
            <button
                @click="toggle"
                v-if="isCollapsable"
                class="arrow"
                :class="{ 'opened': isOpen }"
                > 
            </button>
            <div 
                class="item-content"
                @click="select"
                >
                <div v-if="item.icon" class="item-image"
                    :style="{ backgroundImage: 'url(' + item.icon + ')' }"></div>
                <span class="item-text">
                    {{ item.name }}
                </span>
            </div>
        </div>
        <ul v-show="isOpen" class="item-container">
            <tree-item
                :depth="depth + 1"
                v-for="(child, index) in item.objects"
                :key="index"
                :item="child"
                @selected="$emit('selected', child)"
            ></tree-item>
        </ul>
    </li>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    
    export default defineComponent({
        name: "tree-item",
        props: {
            item: {
                type: Object,
                required: true
            },
            depth: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                isOpen: true,
            }
        },
        computed: {
            isCollapsable: function(): boolean {
                return this.item.objects && this.item.objects.length;
            }
        },
        methods: {
            toggle() {
                if (this.isCollapsable) {
                    this.isOpen = !this.isOpen;
                }
            },
            select() {
                this.$emit("selected", this.item);
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    @import "../assets/scss/buttonMixins.scss";

    .item {
        white-space: nowrap;
        user-select: none;
        display: flex;
        flex-flow: row;
        height: 30px;
        box-sizing: border-box;
        // -moz-background-clip: padding;
        // -webkit-background-clip: padding;
        background-clip: padding-box;
        border: 1px solid $background;

        &:hover {
            border: 1px dashed $primary;
        }

        .arrow {
            @include button-destyle;
            position: relative;
            border: 5px solid black;
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: transparent;
            width: 0px;
            height: 0px;
            padding: 0;
            margin: 13px 10px 0px 5px;
            cursor: pointer;
            top: -2px;
            left: 5px;
        }

        .opened {
            top: 0px;
            left: 2px;
            transform: rotateZ(90deg);
        }
        
        .item-content {
            cursor: pointer;
            display: flex;
            flex-flow: row;
            align-items: center;
            // padding-right: 10px;

            .item-image {
                width: 30px;
                height: 30px;
                // cause I don't wanna waste time recoloring
                // bloody icons in Figma
                filter: brightness(0) saturate(100%);
                background-size: contain;
                background-repeat: no-repeat;
            }
        }

    }

    .selected {
        background-color: $primaryTransparent;
        // background-color: rgba();
        color: $whiteText;
        border: 1px solid $primaryTransparent;

        .arrow {
            border-color: white;
            border-top-color: transparent;
            border-right-color: transparent;
            border-bottom-color: transparent;
        }

        .item-content {
            .item-image {
                filter: brightness(100) saturate(100%);
            }
        }

    }
    

    .bold {
        font-weight: bold;
    }
    ul {
        margin: 0;
        list-style: none;
        // padding-left: 15px;
        padding-left: 0;
    }
</style>