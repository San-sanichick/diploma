<template>
    <div class="project-grid">
        <div class="project" v-for="project in projects" :key="project._id" tabindex="0">
            <div
                @dblclick="$emit('project-clicked', project._id)">
                <div 
                    v-if="project.thumbnail !== ''" 
                    class="project-image" 
                    :style="{ backgroundImage: 'url(' + `http://localhost:5000/${project.thumbnail}` + ')' }"
                    ></div>
                <div v-else class="project-image"></div>
                <div class="project-info">
                    <h3> {{project.name}} </h3>
                    <p>Изменено: {{$filters.dateFilter(project.dateOfLastChange)}} </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
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

<style lang="scss">
    @import "../assets/scss/config.scss";

    .project-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;

        .project {
            border: 2px solid $primary;
            border-radius: 8px;
                color: black;
                text-decoration: none;

                .project-image {
                    height: 200px;
                    background-repeat: no-repeat;
                    background-size: cover;
                    // background-color: #ccc;
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