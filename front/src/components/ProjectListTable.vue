<template>
    <div>
        <div class="project-table">
            <div class="project-table-header">
                <div class="table-row table-header">
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Дата создания</div>
                    <div class="table-cell">Последнее изменение</div>
                    <div class="table-cell">Количество файлов</div>
                </div>
                <div class="table-row" v-for="project in projects" :key="project.id">
                    <div class="table-cell"> {{project.name}} </div>
                    <div class="table-cell"> {{project.dateOfCreation}} </div>
                    <div class="table-cell"> {{project.dateOfLastChange}} </div>
                    <div class="table-cell"> {{project.files}} </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            projects: {
                type: Array
            }
        }
    })
</script>

<style lang="scss" scoped>
    .project-table {
        .table-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            height: 60px;
        }

        .table-header {
            position: sticky;
        }
    }
</style>