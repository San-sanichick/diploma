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
    import { defineComponent, PropType } from 'vue';
    import Project from '@/types/Project';

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
        .project-table-header {
            position: sticky;
            
            top: 70px;

            .table-header {
                background-color: white;
                
                &:hover {
                    background-color: white;
                }
            }
        }
        .table-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            height: 60px;
            align-content: center;
            -moz-user-select: -moz-none;
            -webkit-user-select: none;
            user-select: none;

            &:hover {
                background-color: #ccc;
            }

            &:focus {
                background-color: rgba($color: $lightPrimary, $alpha: 0.2);
                outline: none;
            }
        }
    }
</style>