<template>
    <div class="project-grid">
        <div class="project" v-for="project in projects" :key="project._id" tabindex="0">
            <!-- <perfect-scrollbar> -->
                <GridProject
                    :project="project"
                    @project-clicked="emitProject" />
            <!-- </perfect-scrollbar> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import Project from '../types/Project';
    import GridProject from "./ProjectListGrid/GridProject.vue";

    export default defineComponent({
        components: {
            GridProject,
        },
        emits: ["project-clicked", "open-project", "setup-project", "delete-project"],
        props: {
            projects: {
                type: Object as PropType<Array<Project>>
            }
        },
        mounted() {
            this.contextMenuHandler();
        },
        watch: {
            projects() {
                this.contextMenuHandler();
            }
        },
        methods: {
            contextMenuHandler() {
                const pr = this.$el.querySelectorAll(".project") as NodeList;
                if (this.projects) {
                    for (let i = 0; i < this.projects.length; i++) {
                        if (!pr[i]) return;

                        const ctxMenuHandler = (e: Event) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const data = [
                                {
                                    text: "Открыть",
                                    type: "",
                                    handler: () => {
                                        if(this.projects) {
                                            this.$emit("open-project", this.projects[i]._id);
                                        }
                                    }
                                },
                                {
                                    text: "Настроить",
                                    type: "",
                                    handler: () => {
                                        if(this.projects){
                                            this.$emit("setup-project", this.projects[i]);
                                        }
                                    }
                                },
                                {
                                    text: "Удалить",
                                    type: "",
                                    handler: () => {
                                        if(this.projects){
                                            this.$emit("delete-project", this.projects[i]._id);
                                        }
                                    }
                                },
                            ];
                            this.$emitter.emit("context-menu", {event: e, options: data});
                        }

                        pr[i].removeEventListener("contextmenu", ctxMenuHandler);
                        pr[i].addEventListener("contextmenu", ctxMenuHandler);
                    }
                }
            },
            emitProject(id: Project) {
                this.$emit("open-project", id);
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";

    .project-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        .project {
            border: 2px solid $primary;
            border-radius: 8px;
            color: $text;
            text-decoration: none;

            .project-image {
                height: 200px;
                background-repeat: no-repeat;
                background-size: cover;
                background-color: #003236;
                border-radius: 8px 8px 0 0;
            }

            .project-info {
                -moz-user-select: -moz-none;
                -webkit-user-select: none;
                user-select: none;
                text-align: left;
                display: grid;
                grid-template-columns: max-content;
                margin: 0 10px;

                h3 {
                    font-weight: 600;
                }

                p {
                    color: #ccc;
                }
            }

            &:hover,
            &:focus {                
                border: 2px solid $darkPrimary;
                outline: none;
            }
        }
    }
</style>