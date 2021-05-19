<template>
    <div>
        <!-- TODO maybe refactor into actual table but css tho :(( -->
        <div class="project-table">
            <div class="project-table-header">
                <div class="table-row table-header">
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Время создания</div>
                    <div class="table-cell">Последнее изменение</div>
                </div>
            </div>
            <div class="project-table-body">
                 <div class="table-row project" 
                    v-for="project in projects" 
                    :key="project._id" 
                    @dblclick="$emit('project-clicked', project._id)" 
                    tabindex="0"
                    >
                    
                    <div class="table-cell"> {{ project.name }} </div>
                    <div class="table-cell"> {{ $filters.dateFilter(project.dateOfCreation) }} </div>
                    <div class="table-cell"> {{ $filters.dateFilter(project.dateOfLastChange) }} </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import Project from '../types/Project';

    export default defineComponent({
        emits: ["project-clicked", "open-project", "setup-project", "delete-project"],
        props: {
            projects: {
                type: Object as PropType<Array<Project>>
            }
        },
        mounted() {
            this.contextMenuHandler();
        },
        methods: {
            contextMenuHandler() {
                const pr = this.$el.querySelectorAll(".project") as NodeList;
                if (this.projects) {
                    for (let i = 0; i < this.projects.length; i++) {
                        pr[i].addEventListener("contextmenu", (e: Event) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const data = [
                                {
                                    text: "Открыть",
                                    type: "",
                                    handler: () => {
                                        if(this.projects) {
                                            console.log(this.projects[i]);
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
                        })
                    }
                }
            },
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";

    .project-table {

        .table-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            height: 60px;
            position: relative;
            align-content: center;
            -moz-user-select: -moz-none;
            -webkit-user-select: none;
            user-select: none;
        }

        .project-table-header {
            position: sticky;
            top: 65px;
            background-color: $background;
            z-index: 2000;
            .table-header {
                border-bottom: 1px solid $darkSecondaryGreen;
            }
        }
        
        .project-table-body {
            z-index: 1000;
            .table-row {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                height: 60px;
                position: relative;
                align-content: center;
                -moz-user-select: -moz-none;
                -webkit-user-select: none;
                user-select: none;

                &:hover::after {
                    // background-color: $primaryTransparent;
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    border: 1px dashed $primary;
                }

                &:focus {
                    background-color: $primaryTransparent;
                    outline: none;
                }
            }
        }
    }
</style>