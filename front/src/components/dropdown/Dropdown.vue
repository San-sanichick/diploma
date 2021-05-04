<template>
    <div 
        class="dropdown-container"
        v-click-away="onClickAway">
        <div class="dropdown-trigger-container"
            :class="[{ 'triggered': isOpen }, { 'focused': focused }]"
            @click="$emit('dropdown-focused', id)"
            >
            <div
                class="dropdown-trigger"
                :title="selected.name"
                :style="{ backgroundImage: 'url(' + require('@/assets' + selected.img) + ')' }">
            </div>
            <div class="dropdown-trigger-triangle"
                @click="triggered"></div>
        </div>
        <div class="dropdown-options-container" v-if="isOpen">
            <div class="dropdown-options-triangle"></div>
            <ul class="dropdown-options">
                <li v-for="option in options" 
                    :key="option.id"
                    @click="onClickHandler(option)">
                    <div class="selected-option">
                        <div :class="{ 'checkmark': (selected.id === option.id && focused) }"></div>
                    </div>
                    <div :style="{ backgroundImage: 'url(' + require('@/assets' + option.img) + ')' }"></div>
                    <span>{{ option.name }}</span>
                    <span class="dropdown-option-hotkey" v-if="option.hotkey !== ''"> {{ option.hotkey }} </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    import { directive } from "vue3-click-away";

    export default defineComponent({
        directives: {
            ClickAway: directive
        },
        emits: ["update:selected", "dropdown-focused"],
        props: {
            id: Number,
            focused: Boolean,
            options: Array,
            selected: Object
        },
        data() {
            return {
                isOpen: false
            }
        },
        methods: {
            onClickHandler(option: { id: number; name: string; img: string; action: any; hotkey: string }) {
                // this.selected = option;
                this.isOpen = !this.isOpen;
                this.$emit("update:selected", option);
            },
            onClickAway() {
                this.isOpen = false;
            },
            triggered() {
                this.isOpen = !this.isOpen;
                this.$emit("dropdown-focused", this.id);
            }
        }
    })
</script>

<style lang="scss">
    @import "../../assets/scss/config.scss";
    @import "../../assets/scss/editorMixins.scss";

    .dropdown-container {
        z-index: 20000;
        user-select: none;

        .dropdown-trigger-container {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: center;
            background-color: $middlePrimary;
            width: 45px;
            height: 45px;
            padding: 5px;

            &:hover {
                background-color: $primary;
            }

            .dropdown-trigger {
                width: 35px;
                height: 35px;
                @include editor-dropdown-button-style;
            }
            

            .dropdown-trigger-triangle {
                border: 5px solid white;
                border-left-color: transparent;
                border-right-color: transparent;
                border-bottom-color: transparent;
                width: 0;
                height: 0;
                cursor: pointer;
            }

            
        }

        .focused {
            background-color: $lightPrimary;
        }

        .triggered {
            background-color: $primary;
        }

        .dropdown-options-container {
            z-index: 2000;
            margin-left: 5px;
            position: absolute;
            top: 110px;

            .dropdown-options-triangle {
                border: 10px solid $middlePrimary;
                border-left-color: transparent;
                border-right-color: transparent;
                border-top-color: transparent;
                width: 0;
                margin-left: 10px;
            }

            .dropdown-options {
                list-style: none;
                padding: 8px 0;
                margin: 0;
                background-color: $middlePrimary;
                color: white;
                text-align: left;

                li {
                    padding: 2px 20px 2px 2px;
                    display: grid;
                    grid-template-columns: max-content max-content auto max-content;
                    align-items: center;
                    column-gap: 3px;
                    cursor: pointer;
                    font-size: 1.5ch;

                    .selected-option {
                        text-align: center;
                        padding-left: 2px;

                        .checkmark {
                            display: inline-block;
                            transform: rotate(45deg);
                            width: 3px;
                            height: 6px;
                            border-bottom: 2px solid white;
                            border-right: 2px solid white;
                        }
                    }

                    &:hover {
                        background-color: $primary;
                    }

                    div {
                        width: 25px;
                        height: 25px;
                        background-repeat: no-repeat;
                        background-size: contain;
                    }

                    .dropdown-option-hotkey {
                        width: 20px;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>