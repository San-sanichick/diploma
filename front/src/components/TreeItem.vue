<template>
    <li>
        <div
            class="item"
            :class="{ selected: item.isSelected }"
            @click="toggle">
            <button v-if="isCollapsable"> {{ isOpen ? "-" : "+" }} </button>
            {{ item.name }}
        </div>
        <ul v-show="isOpen">
            <tree-item
                class="item"
                v-for="(child, index) in item.shapes"
                :key="index"
                :item="child"
            ></tree-item>
        </ul>
    </li>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: "tree-item",
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                isOpen: true,
            }
        },
        computed: {
            isCollapsable: function(): boolean {
                return this.item.shapes && this.item.shapes.length;
            }
        },
        methods: {
            toggle() {
                if (this.isCollapsable) {
                    this.isOpen = !this.isOpen;
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    .item {
        cursor: pointer;
    }

    .selected {
        background-color: #ccc;
    }

    .bold {
        font-weight: bold;
    }
    ul {
        padding-left: 5%;
        // line-height: 1.5em;
        margin: 0;
        list-style: none;
    }
</style>