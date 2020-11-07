<template>
    <div class="project-grid">
        <div class="project" v-for="project in projects" :key="project.id" tabindex="0">
            <div @dblclick="$emit('project-clicked', project.id)" @contextmenu.prevent="$refs['context-menu'].openMenu($event, project.id);">
                <div class="project-image"></div>
                <div class="project-info">
                    <h3> {{project.name}} </h3>
                    <p>Изменено: {{project.dateOfLastChange}} </p>
                </div>
            </div>
        </div>
    </div>
    <ContextMenu ref="context-menu">
        <template v-slot:default="slotProps">
            <ul>
                <li @click="$emit('open-project', slotProps.id)">Открыть</li>
                <li @click="$emit('setup-project', slotProps.id); $refs['context-menu'].closeMenu()">Настройки</li>
                <li @click="$emit('delete-project', slotProps.id)">Удалить</li>
            </ul>
        </template>
    </ContextMenu>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import ContextMenu from "../components/ContextMenu.vue";

    export default defineComponent({
        emits: ["project-clicked", "open-project", "setup-project", "delete-project"],
        components: {
            ContextMenu
        },
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
                    -moz-user-select: -moz-none;
                    -webkit-user-select: none;
                    user-select: none;
                    text-align: left;
                    display: grid;
                    grid-template-columns: max-content;
                    margin: 0 10px;

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