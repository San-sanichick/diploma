<template>
    <li>
        <div class="item">
            <button
                @click="toggle"
                v-if="isCollapsable"
                > 
                {{ isOpen ? "-" : "+" }}
            </button>
            <span 
                :class="{ selected: item.isSelected }"
                @click="select"
                >
                {{ item.name }} {{ item.centerOfShape }}
            </span>
        </div>
        <ul v-show="isOpen">
            <tree-item
                class="item"
                v-for="(child, index) in item.objects"
                :key="index"
                :item="child"
                @selected="$emit('selected', child)"
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
        padding-left: 40px;
        // line-height: 1.5em;
        margin: 0;
        list-style: none;
    }
</style>