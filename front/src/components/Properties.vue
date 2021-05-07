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
                    <td>{{ item.name }}</td>
                </tr>
                <tr>
                    <td>X</td>
                    <td>{{ item.centerOfShape.x }}</td>
                </tr>
                <tr>
                    <td>Y</td>
                    <td>{{ item.centerOfShape.y }}</td>
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
    import Drawable from '@/engine/shapes/drawable'
    import Group from '@/engine/shapes/group';
    import Shape from '@/engine/shapes/shape';
    export default defineComponent({
        props: {
            item: {
                type: Object as PropType<Drawable | null | Array<Drawable>>
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
                console.log(Array.isArray(this.item));
                if (this.item !== null && this.item !== undefined 
                    && !Array.isArray(this.item) && this.item?.type !== "Group") {
                    return this.item as Shape;
                } else {
                    return null;
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    table {
        width: 100%;
        margin: 0;
        text-align: left;
        border-collapse: collapse;
        thead {
            user-select: none;

            tr {
                border-bottom: 1px solid $darkPrimary;
            }
        }

        tr {
            padding: 5px;

            td:first-of-type {
                user-select: none;
            }

            td, th {
                padding: 5px 10px;
                width: 50%;
                
                &:first-of-type {
                    border-right: 1px solid $darkPrimary;
                }
            }
        }
    }
</style>