<template>
    <div class="page">
        <div class="page-header">
            <h3>
                Проекты
            </h3>
            <div></div>
            <div class="page-header-buttons">
                <button class="create-project" @click="openPopUp(); currentPopUp='createProject'"></button>
                <button class="table-mode" :class="{'table-mode-active': displayMode == 'ProjectListTable'}" @click="displayMode = 'ProjectListTable'"></button>
                <button class="grid-mode" :class="{'grid-mode-active': displayMode == 'ProjectListGrid'}" @click="displayMode = 'ProjectListGrid'"></button>
            </div>
        </div>

        <div class="project-list-wrapper">
            <component 
                :is="displayMode" 
                :projects="list" 
                @project-clicked="openProject" 
                @open-project="openProject"
                @setup-project="currentPopUp='setUpProject'; openPopUp()"
                @delete-project="deleteProject"
                >
            </component>
        </div>
    </div>

    
    <teleport to="body">
        <div v-if="showPopUp" class="popup" @click="closePopUp">
            <div class="popup">
                <component :is="currentPopUp" @create-project="createNewProject"></component>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import axios               from "axios";
    import Project             from "../../types/Project";
    import ProjectListGrid     from "../../components/ProjectListGrid.vue";
    import ProjectListTable    from "../../components/ProjectListTable.vue";

    import createProject from "../../components/popups/createProject.vue";
    import setUpProject  from "../../components/popups/setUpProject.vue";

    export default defineComponent({
        components: {
            ProjectListGrid,
            ProjectListTable,
            createProject,
            setUpProject
        },
        data() {
            return {
                list             : [] as Project[],
                showPopUp        : false,
                currentPopUp     : "createProject",
                displayMode      : "ProjectListGrid"
            }
        },
        created() {
            this.fetchProjects();
        },
        methods: {
            async fetchProjects(): Promise<void> {
                try {
                    const res = await axios.get("http://localhost:3000/api/projects");
                    this.list = res.data;
                } catch (err) {
                    console.error(err);
                }
            },
            createNewProject(name: string) {
                this.list.push({
                    id              : this.list[this.list.length - 1].id + 1,
                    name            : name,
                    dateOfCreation  : new Date(),
                    dateOfLastChange: new Date(),
                    files           : 0
                } as Project)

                this.showPopUp = !this.showPopUp;
            },
            openPopUp() {
                this.showPopUp = !this.showPopUp;
                document.body.style.overflowY = document.body.style.overflowY === "" ? "hidden" : "";
            },
            closePopUp(e: Event) {
                const target = e.target as HTMLElement;
                
                if (target.className === "popup") {
                    this.showPopUp = !this.showPopUp;
                    document.body.style.overflowY = document.body.style.overflowY === "" ? "hidden" : "";
                }
            },
            openProject(id: number) {
                console.log(id);
                // this.$router.push(`project/${id}`);
                this.$router.push({
                    path: `project/${id}`
                })
            },
            deleteProject(id: number) {
                console.log(id);
                this.list = this.list.filter(el => el.id !== id);
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";

    .popup {
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
                    
                    background: none;
                    background-size: contain;
                    background-repeat: no-repeat;
                    outline: none;
                    color: white;
                    appearance: none;

                    &:hover{
                        cursor: pointer;
                        background-color: rgba(235, 235, 235, 0.493);
                    }
                    &:active {
                        box-shadow: inset 0 0 0 2px $primary;
                        border-radius: 8px;
                    }
                }

                .create-project {
                    background-image: url("../../assets/addProjectButton.svg");

                    &:active {
                        background-image: url("../../assets/addProjectButton_hover.svg");
                    }
                }

                .table-mode {
                    background-image: url("../../assets/tableMode.svg");
                }

                .table-mode-active {
                    background-image: url("../../assets/tableMode_hover.svg");
                }

                .grid-mode {
                    background-image: url("../../assets/gridMode.svg");
                }

                .grid-mode-active {
                    background-image: url("../../assets/gridMode_hover.svg");
                }
            }
        }

        // .project-list-wrapper {
        //     height: 70vh;
        //     overflow-y: auto;
        // }
    }
</style>