<template>
    <div>
        <h3>
            Проекты
        </h3>

        <button @click="createNewProject">Создать проект</button>

        <table>
            <tr>
                <td>Имя проекта</td>
                <td>Дата создания</td>
                <td>Последние изменения</td>
                <td>Количество файлов</td>
            </tr>
            <tr v-for="el in list" :key="el.id">
                <td> {{el.name}} </td>
                <td> {{el.dateOfCreation}} </td>
                <td> {{el.dateOfLastChange}} </td>
                <td> {{el.files}} </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Project from "../types/Project";

    export default defineComponent({
        data() {
            return {
                list: [
                    {
                        id: 0,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 1,
                        name: "kek2",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 3,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                ] as Project[]
            }
        },
        methods: {
            createNewProject() {
                console.log("да да да дааа");
            }
        }
    })
</script>

<style lang="scss" scoped>
    table {
        width: 100%;
        tr {
            width: 100%;
        }
    }
</style>