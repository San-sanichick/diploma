<template>
    <div class="search-bar-wrapper" 
        tabindex="0" 
        ref="search-bar-wrapper"
        @focus="focusInput"
        :class="{ 'focused': focused }"
        >
        <div class="search-icon"></div>
        <input
            ref="search-bar-input"
            @focus="focusBar" 
            @blur="focused = false"
            @keyup.esc="blurBar"
            v-debounce:350="emitSearch"
            type="search" 
            name="search-bar" 
            v-model="searchQueryLocal"
            placeholder="Поиск... (Ctrl+K)"
            >
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        props: {
            searchQuery: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                focused: false
            }
        },
        emits: ["update:searchQuery", "search"],
        mounted() {
            document.addEventListener("keydown", (e: KeyboardEvent) => {
                // e.preventDefault();
                if (e.ctrlKey && e.code === "KeyK") {
                    e.preventDefault();
                    this.focused = true;
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
                this.focused = true;
            },
            blurBar() {
                this.focused = false;
                (this.$refs["search-bar-input"] as HTMLInputElement).blur();
            },
            emitSearch() {
                this.$emit('search');
            },
            focusInput() {
                this.focused = true;
                (this.$refs["search-bar-input"] as HTMLInputElement).focus();
            }
        }
    })
</script>

<style lang="scss">
    @import "../assets/scss/config.scss";

    .search-bar-wrapper {
        width: 20vw;
        display: inline-flex;
        flex: 1 1 300px;
        align-items: center;
        align-self: center;
        position: relative;
        outline: none;
        border: 2px solid $middlePrimary;
        border-radius: 8px;
        overflow: hidden;
        padding: 8px 10px;

        .search-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            background-image: url("../assets/searchIcon.svg");
            background-repeat: no-repeat;
            background-size: cover;
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

    .focused {
        border-color: $darkPrimary;
    }
</style>