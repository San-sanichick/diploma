<template>
    <div class="search-bar-wrapper" tabindex="0" ref="search-bar-wrapper">
        <div class="search-icon"></div>
        <input
            ref="search-bar-input"
            @focus="" 
            type="search" 
            name="search-bar" 
            v-model="searchQueryLocal"
            placeholder="Поиск... (Ctrl+K)"
            >
    </div>
</template>

<script lang="ts">
    import { wrap } from 'module';
import { defineComponent } from 'vue'
    export default defineComponent({
        props: {
            searchQuery: {
                type: String,
                required: true
            }
        },
        emits: ["update:searchQuery"],
        mounted() {
            document.addEventListener("keydown", (e: KeyboardEvent) => {
                // e.preventDefault();
                if (e.ctrlKey && e.code === "KeyK") {
                    e.preventDefault();
                    (this.$refs["search-bar-input"] as HTMLInputElement).focus();
                }
            })
        },
        computed: {
            searchQueryLocal: {
                get(): string {
                    return this.searchQuery;
                },
                set(val: string) {
                    this.$emit("update:searchQuery", val);
                }
            }
        },
        methods: {
            focusBar() {
                const wrapper = this.$refs["search-bar-wrapper"] as HTMLDivElement;
                wrapper.focus();
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";

    .search-bar-wrapper {
        width: 15em;
        display: inline-flex;
        flex: 1 1 300px;
        align-items: center;
        align-self: center;
        position: relative;
        border: 2px solid $primary;
        border-radius: 8px;
        overflow: hidden;
        padding: 8px 10px;

        &:focus {
            border-color: $darkPrimary;
        }

        .search-icon {
            width: 20px;
            height: 20px;
            background-image: url("../assets/searchIcon.svg");
            background-repeat: no-repeat;
            background-size: contain;
        }

        input {
            outline: none;
            border: none;
            width: 100%;
            // color: $primary;

            &::-webkit-search-cancel-button {
                -webkit-appearance: none;
            }
        }
    }
</style>