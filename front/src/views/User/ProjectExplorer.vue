<template>
    <div>
        <div class="page-header">
            <button @click="goBack">back</button>
            <h3>
                {{ $route.params.id }}
            </h3>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';

    export default defineComponent({
        setup() {
            const  
                store = useStore(),
                router = useRouter();

            const goBack = () => {
                router.push(`/${store.getters.getUser.id}/projects`);
            }

            return { goBack }
        }
    })
</script>