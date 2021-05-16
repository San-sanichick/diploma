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
                        <input type="text" :value="itemCastedToShape.name" size="3" @keyup.enter="updateItemName">
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
                    <td>{{ itemCastedToGroup.name }}</td>
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
    import { defineComponent, PropType } from 'vue'
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
            itemCastedToGroup(): Group | null {
                if (this.item !== null && this.item !== undefined 
                    && !Array.isArray(this.item) && this.item.type === "Group") {
                    return this.item as Group;
                } else {
                    return null;
                }
            },
            itemCastedToShape(): Shape | null {
                if (this.item !== null && this.item !== undefined 
                    && !Array.isArray(this.item) && this.item?.type !== "Group") {
                    return this.item as Shape;
                } else {
                    return null;
                }
            }
        },
        methods: {
            updateItemName(e: InputEvent) {
                const target = e.target as HTMLInputElement;
                const val = target.value;
                this.edit = false;
                this.$emit("update:item", val);
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    @import "../assets/scss/tableMixins.scss";

    table {
        @include table-style;

        th, td {
            font-size: 1.6ch;
        }
        // width: 100%;
        // margin: 0;
        // text-align: left;
        // border-collapse: collapse;
        // thead {
        //     user-select: none;

        //     tr {
        //         border-bottom: 1px solid $darkPrimary;
        //     }
        // }

        // tr {
        //     padding: 5px;

        //     td:first-of-type {
        //         user-select: none;
        //     }

        //     td, th {
        //         padding: 5px 10px;
        //         width: 50%;
                
        //         &:first-of-type {
        //             border-right: 1px solid $darkPrimary;
        //         }
        //     }
        // }
    }
</style>