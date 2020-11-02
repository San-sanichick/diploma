<template>
    <div class="project-grid">
        <div class="project" v-for="project in projects" :key="project.id" tabindex="0">
            <div @dblclick="$router.push(`project/${project.id}`)">
                <div class="project-image"></div>
                <div class="project-info">
                    <h3> {{project.name}} </h3>
                    <div>s</div>
                    <p>Изменено: {{project.dateOfLastChange}} </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        props: {
            projects: {
                type: Array
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
                color: black;
                text-decoration: none;

                .project-image {
                    height: 200px;
                    background-color: #ccc;
                    border-radius: 8px 8px 0 0;
                }

                .project-info {
                    text-align: left;
                    display: grid;
                    grid-template-columns: max-content max-content;
                    margin: 0 10px;
                }
            &:hover,
            &:focus {                
                border: 2px solid $darkPrimary;
                outline: none;
            }
        }
    }
</style>