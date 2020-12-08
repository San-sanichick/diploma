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
                v-if="list.length !== 0"
                :is="displayMode" 
                :projects="list" 
                @project-clicked="openProject" 
                @open-project="openProject"
                @setup-project="currentPopUp='setUpProject'; openPopUp()"
                @delete-project="deleteProject"
                >
            </component>
            <div v-else>
                Нет проектов :(
            </div>
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
    import { useStore } from 'vuex';
    import axios               from "axios";

    import Project             from "../../types/Project";
    import ProjectListGrid     from "../../components/ProjectListGrid.vue";
    import ProjectListTable    from "../../components/ProjectListTable.vue";
    import config from "../../config/config";

    import createProject from "../../components/popups/createProject.vue";
    import setUpProject  from "../../components/popups/setUpProject.vue";

    // import CustomFlashMessage from "../../components/CustomFlashMessage.vue";

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
        computed: {
            user() {
                const store = useStore();
                return store.getters.getUser;
            }
        },
        created() {
            this.fetchProjects();
        },
        methods: {
            async fetchProjects(): Promise<void> {
                try {
                    const res = await axios.get(`http://localhost:${config.apiPort}/api/projects/${this.user.id}`);
                    this.list = res.data.data;
                } catch (err) {
                    console.error(err);
                    this.$flashMessage.show({
                        type: 'error',
                        // title: "Ошибка",
                        text: err
                    });
                }
            },
            async createNewProject(name: string) {
                try {
                    const data = {
                        name,
                        publicAccess: false
                    }

                    const dataToSend = JSON.stringify(data);

                    const res = await axios.post(`http://localhost:${config.apiPort}/api/projects/${this.user.id}`, { body: dataToSend });
                    console.log(res.data.msg);


                    this.$flashMessage.show({
                        type: 'success',
                        image: "/img/success.a5668cb3.svg",
                        text: res.data.msg
                    });
                    this.list.push(res.data.data);
                } catch (err) {
                    console.error(err);
                    this.$flashMessage.show({
                        type: 'error',
                        image: "/img/fail.4d3891d7.svg",
                        text: err
                    });
                }

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
            openProject(id: string) {
                console.log(id);
                // this.$router.push(`project/${id}`);
                this.$router.push({
                    path: `projects/${id}`
                })
            },
            async deleteProject(id: number) {
                console.log(id);
                // this.list = this.list.filter(el => el._id !== id);

                try {
                    const data = {
                        id
                    }

                    const dataToSend = JSON.stringify(data);

                    const res = await axios.delete(`http://localhost:${config.apiPort}/api/projects/${this.user.id}`);
                    console.log(res.data.msg);

                    this.$flashMessage.show({
                        type: 'success',
                        image: require("../../assets/flashMessage/success.svg"),
                        text: res.data.msg
                    });
                } catch (err) {
                    console.error(err);
                    this.$flashMessage.show({
                        type: 'error',
                        image: require("../../assets/flashMessage/fail.svg"),
                        text: err
                    });
                }
            },
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