<template>
    <div class="page">
        <div class="page-header">
            <h3>
                Проекты
            </h3>
            <div></div>
            <div class="page-header-buttons">
                <button class="create-project" @click="showCreateProject = !showCreateProject"></button>
                <button class="table-mode" @click="displayMode = 'ProjectListTable'"></button>
                <button class="grid-mode" @click="displayMode = 'ProjectListGrid'"></button>
            </div>
        </div>

        <div class="project-list-wrapper">
            <component :is="displayMode" :projects="list" @project-clicked="openProject"></component>
        </div>
    </div>

    
    <teleport to="body">
        <div v-if="showCreateProject" class="create-project-popup" @click="closePopUp">
            <div class="popup">
                <h3>Создать</h3>
                <form @submit.prevent="createNewProject">
                    <label for="project-name">Название</label>
                    <input type="text" name="project-name" id="project-name" value="">
                    <input type="submit" class="submit-button" value="Создать">
                </form>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import Project             from "../../types/Project";
    import ProjectListGrid     from "../../components/ProjectListGrid.vue";
    import ProjectListTable    from "../../components/ProjectListTable.vue";

    export default defineComponent({
        components: {
            ProjectListGrid,
            ProjectListTable
        },
        data() {
            return {
                list: [
                    {
                        id              : 0,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 1,
                        name            : "kek2",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 2,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 3,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 4,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 5,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 6,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 7,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 8,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 9,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                    {
                        id              : 10,
                        name            : "kek",
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 45
                    },
                ] as Project[],
                showCreateProject: false,
                displayMode      : "ProjectListGrid"
            }
        },
        methods: {
            createNewProject(e: Event) {
                const form = new FormData(e.target as HTMLFormElement);
                form.forEach((el) => {
                    this.list.push({
                        id              : this.list[this.list.length - 1].id + 1,
                        name            : el,
                        dateOfCreation  : new Date(),
                        dateOfLastChange: new Date(),
                        files           : 0
                    } as Project)
                });
                this.showCreateProject = !this.showCreateProject;
            },
            closePopUp(e: Event) {
                const target = e.target as HTMLElement;
                
                if (target.className === "create-project-popup") {
                    this.showCreateProject = !this.showCreateProject;
                }
            },
            openProject(id: number) {
                this.$router.push(`project/${id}`);
            }
        }
    })
</script>

<style lang="scss">
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
        // margin-top: 90px;
        padding: 90px 7% 5% 7%;

        .page-header {
            margin: 20px 0;
            display: grid;
            grid-template-columns: max-content auto max-content;
            align-items: center;

            h3 {
                font-size: 24pt;
                margin: 10px 0;
            }

            .page-header-buttons {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;


                button {
                    height: 40px;
                    width: 40px;
                    align-self: center;

                    font-family: Open Sans, Arial, sans-serif;
                    font-size: 16pt;
                    border: none;
                    
                    background-size: contain;
                    background-repeat: no-repeat;
                    outline: none;
                    color: white;
                    appearance: none;

                    &:hover{
                        cursor: pointer;
                        border-radius: 8px;
                        box-shadow: inset 0 0 0 1px $primary;
                    }
                }

                .create-project {
                    background-image: url("../../assets/addProjectButton.svg");
                }

                .table-mode {
                    background-image: url("../../assets/tableMode.svg");
                }

                .grid-mode {
                    background-image: url("../../assets/gridMode.svg");
                }
            }
        }

        // .project-list-wrapper {
        //     height: 70vh;
        //     overflow-y: auto;
        // }
    }
</style>