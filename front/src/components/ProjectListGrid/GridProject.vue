<template>
    <div
        @dblclick="$emit('project-clicked', project._id)">
        <div 
            v-if="project.thumbnail !== ''" 
            class="project-image" 
            :style="{ backgroundImage: 'url(' + `/static/${project.thumbnail}` + ')' }"
            ></div>
        <div v-else class="project-image"></div>
        <div class="project-info">
            <h3> {{project.name}} </h3>
            <p>Изменено: {{$filters.dateFilter(project.dateOfLastChange)}} </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import Project from '../../types/Project';

    export default defineComponent({
        props: {
            project: {
                type: Object as PropType<Project>
            }
        },
        emits: ["project-clicked"]
    })
</script>