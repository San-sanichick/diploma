<script lang="ts">
    import { defineComponent, h } from 'vue';
    import Divider from "@/components/panes/Divider.vue";

    export default defineComponent({
        components: {
            Divider
        },
        mounted() {
            for (const divider of this.dividers) {
                divider.addEventListener("mousedown", (e: MouseEvent) => {
                    const x = e.clientX;
                    const prevPane = divider.previousElementSibling;
                    const nextPane = divider.nextElementSibling;

                    divider.addEventListener("mousemove", (e: MouseEvent) => {
                        const dx = e.clientX - x;


                    })
                })
            }
        },
        computed: {
            panes() {
                return Array.from(this.$el.children as HTMLCollection).filter((node) => node.className !== "pane-divider") as HTMLElement[];
            },
            dividers() {
                return Array.from(this.$el.children as HTMLCollection).filter(node => node.className === "pane-divider") as HTMLElement[];
            }
        },
        render() {
            if (this.$slots.default) {
                const items = this.$slots.default();
                const children = [];

                for (const item of items) {
                    children.push(item);
                    children.push(h(Divider));
                }
                
                children.pop();

                return h("div", { class: "split-view" }, children);
            }
            return h("div", "nothing");
        }
    })
</script>

<style lang="scss">
    .split-view {
        position: relative;
        display: flex;
        flex-flow: row;
        width: 100%;
        height: 100%;
    }
</style>