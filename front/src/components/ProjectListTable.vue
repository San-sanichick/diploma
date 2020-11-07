<template>
    <div>
        <!-- TODO maybe refactor into actual table but css tho :(( -->
        <div class="project-table">
            <div class="project-table-header">
                <div class="table-row table-header">
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Дата создания</div>
                    <div class="table-cell">Последнее изменение</div>
                    <div class="table-cell">Количество файлов</div>
                </div>
            </div>
            <div class="project-table-body">
                 <div class="table-row" 
                    v-for="project in projects" 
                    :key="project.id" 
                    @dblclick="$emit('project-clicked', project.id)"
                    @contextmenu.prevent="$refs['context-menu'].openMenu($event, project.id);" 
                    tabindex="0"
                    >
                    
                    <div class="table-cell"> {{project.name}} </div>
                    <div class="table-cell"> {{project.dateOfCreation}} </div>
                    <div class="table-cell"> {{project.dateOfLastChange}} </div>
                    <div class="table-cell"> {{project.files}} </div>
                </div>
            </div>
        </div>
    </div>

    <ContextMenu ref="context-menu">
        <template v-slot:default="slotProps">
            <ul>
                <li @click="$emit('open-project', slotProps.id)">Открыть</li>
                <li @click="$emit('setup-project', slotProps.id)">Настройки</li>
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

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";

    .project-table {
        .project-table-header {
            position: sticky;
            
            top: 70px;

            .table-header {
                // padding-top: 70px;
                background-color: white;
                
                &:hover {
                    background-color: white;
                }
            }
        }
        .table-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
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