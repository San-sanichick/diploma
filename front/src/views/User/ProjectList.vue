<template>
    <div class="page">
        <div class="page-header">
            <h3>
                Проекты
            </h3>
            <div></div>
            <button @click="showCreateProject = !showCreateProject">Создать проект</button>
        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr class="table-head">
                        <th>Имя проекта</th>
                        <th>Дата создания</th>
                        <th>Последние изменения</th>
                        <th>Количество файлов</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="el in list" :key="el.id" class="table-row">
                        <td> <router-link :to="`project/${el.id}`">{{el.name}}</router-link> </td>
                        <td> {{el.dateOfCreation}} </td>
                        <td> {{el.dateOfLastChange}} </td>
                        <td> {{el.files}} </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <teleport to="body">
            <div v-if="showCreateProject" class="create-project-popup" @click="closePopUp">
                <div class="popup">
                    <h3>Создать</h3>
                    <form @submit.prevent="createNewProject">
                        <label for="project-name">Название</label>
                        <input type="text" name="project-name" id="project-name">
                        <input type="submit" class="submit-button" value="Создать">
                    </form>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Project from "../../types/Project";

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
                        id: 2,
                        name: "kek",
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
                    {
                        id: 4,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 5,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 6,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 7,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 8,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 9,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                    {
                        id: 10,
                        name: "kek",
                        dateOfCreation: new Date(),
                        dateOfLastChange: new Date(),
                        files: 45
                    },
                ] as Project[],
                showCreateProject: false
            }
        },
        methods: {
            createNewProject() {
                console.log("да да да дааа");
                this.showCreateProject = !this.showCreateProject;
            },
            closePopUp(e: Event) {
                const target = e.target as HTMLElement;
                
                if (target.className === "create-project-popup") {
                    this.showCreateProject = !this.showCreateProject;
                }
            }
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/config.scss";

    .create-project-popup {
        font-family: Open Sans, Arial, sans-serif;
        position: fixed;
        height: 100vh;
        width: 100vw;
        background-color: rgba($color: #000000, $alpha: 0.5);
        top: 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        z-index: 9000;

        div {
            align-self: center;
            background-color: white;
            padding: 0px 20px 40px 20px;
            border-radius: 8px;
            width: 35%;

            h3 {
                font-size: 24pt;
            }

            form {
                display: flex;
                flex-flow: column;

                label {
                    text-align: start;
                }

                input {
                    margin-top: 5px;
                    border: 2px solid $darkPrimary;
                    border-radius: 8px;
                    height: 30px;
                }

                .submit-button {
                    height: 40px;
                    width: 300px;
                    margin-top: 15px;
                    align-self: center;

                    font-family: Open Sans, Arial, sans-serif;
                    font-size: 16pt;
                    background-color: $darkPrimary;
                    outline: none;
                    color: white;
                    border: 2px solid $darkPrimary;
                    border-radius: 8px;
                    appearance: none;

                    &:hover,
                    &:focus {
                        background: $primary;
                    }
                }
            }
        }
    }

    .page {
        padding: 0 10%;

        .page-header {
            margin: 20px 0;
            display: grid;
            grid-template-columns: max-content auto max-content;

            h3 {
                font-size: 24pt;
            }

            button {
                height: 40px;
                width: 300px;
                align-self: center;

                font-family: Open Sans, Arial, sans-serif;
                font-size: 16pt;
                background-color: $darkPrimary;
                outline: none;
                color: white;
                border: 2px solid $darkPrimary;
                border-radius: 8px;
                appearance: none;

                &:hover,
                &:focus {
                    background: $primary;
                }
            }
        }

        .table-wrapper {
            height: 65vh;
            overflow: auto;

            table {
                width: 100%;
                height: 500px;
                // border: 1px solid $darkPrimary;
                // border-radius: 8px 8px 0 0;
                border-spacing: 0;

                td {
                    padding: 0;
                    
                }

                .table-head {
                    border: 1px solid $darkPrimary;
                    border-radius: 8px 8px 0 0;
                    background-color: $darkPrimary;
                    height: max-content;
                    color: white;
                    font-weight: 600;

                    th {
                        position: sticky;
                        top: 0;
                        z-index: 2000;
                        background-color: $darkPrimary;
                        border: 1px solid $darkPrimary;
                        padding-top:20px;
                        padding-bottom:20px;
                        padding-right:0px;  
                    }

                    th:first-child {
                        border-radius: 8px 0 0 0;
                        padding-left:20px;
                        padding-right:0;
                    }

                    th:last-child {
                        border-radius: 0 8px 0 0;
                        padding-left:0px;
                        padding-right:20px;
                    }
                }

                tbody {
                    .table-row {
                        width: 100%;
                        height: max-content;
                        font-weight: 600;

                        td {
                            padding-top:20px;
                            padding-bottom:20px;
                            padding-right:0px;  
                            border-bottom: 1px solid $darkPrimary;
                        }

                        td:first-child {
                            padding-left:20px;
                            padding-right:0;
                            border-left: 1px solid $darkPrimary;
                        }

                        td:last-child {
                            padding-left:0px;
                            padding-right:20px;
                            border-right: 1px solid $darkPrimary;
                        }
                    }
                }
            }
        }
    }
</style>