<template>
    <div>
        <table v-if="item">
            <thead>
                <tr>
                    <th>Свойство</th>
                    <th>Значение</th>
                </tr>
            </thead>
            <tbody v-if="itemCastedToShape !== null">
                <tr>
                    <td>Имя</td>
                    <td v-if="!edit" @dblclick="edit = true">{{ itemCastedToShape.name }}</td>
                    <td v-if="edit">
                        <input 
                            type="text" 
                            v-focus
                            v-model="itemCastedToShape.name" 
                            :size="itemCastedToShape.name.length" 
                            @keyup.enter="edit = false;">
                    </td>
                </tr>
                <tr>
                    <td>X</td>
                    <td>{{ itemCastedToShape.centerOfShape.x.toPrecision(4) }}</td>
                </tr>
                <tr>
                    <td>Y</td>
                    <td>{{ itemCastedToShape.centerOfShape.y.toPrecision(4) }}</td>
                </tr>
            </tbody>
            <tbody v-else-if="itemCastedToGroup !== null">
                <tr>
                    <td>Имя</td>
                    <td v-if="!edit" @dblclick="edit = true">{{ itemCastedToGroup.name }}</td>
                    <td v-if="edit">
                        <input 
                            type="text" 
                            v-focus
                            v-model="itemCastedToGroup.name" 
                            :size="itemCastedToGroup.name.length"
                            @keyup.enter="edit = false;">
                    </td>
                </tr>
                <tr>
                    <td>
                        Элементов в группе
                    </td>
                    <td>
                        {{ itemCastedToGroup.getObjects.length }}
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="Array.isArray(item)">
                <tr>
                    <td>
                        Выделено
                    </td>
                    <td>
                        {{ item.length }}
                    </td>
                </tr>
            </tbody>
        </table>
        <table v-else-if="item === null">
            <thead>
                <tr>
                    <th>Свойство</th>
                    <th>Значение</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        Выделено
                    </td>
                    <td>
                        0
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue"
    import Drawable from '../engine/shapes/drawable'
    import Group from '../engine/shapes/group';
    import Shape from '../engine/shapes/shape';
    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Drawable | null | Array<Drawable>>
            }
        },
        emits: ["update:item"],
        data() {
            return {
                edit: false
            }
        },
        computed: {
            itemCastedToGroup: {
                get(): Group | null {
                    if (this.item !== null && this.item !== undefined 
                        && !Array.isArray(this.item) && this.item.type === "Group") {
                        return this.item as Group;
                    } else {
                        return null;
                    }
                },
                set(val: Group) {
                    this.$emit("update:item", val);
                }
            },
            itemCastedToShape: {
                get(): Shape | null {
                    if (this.item !== null && this.item !== undefined 
                        && !Array.isArray(this.item) && this.item?.type !== "Group") {
                        return this.item as Shape;
                    } else {
                        return null;
                    }
                },
                set(val: Shape) {
                    this.$emit("update:item", val);
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    @import "../assets/scss/tableMixins.scss";
    @import "../assets/scss/editorMixins.scss";

    table {
        @include table-style;

        th, td {
            font-size: 1.6ch;

            input {
                width: 96%;
                font-size: 1.5ch;
                // margin-right: 15px;
                @include editor-input-style
            }
        }
    }
</style>