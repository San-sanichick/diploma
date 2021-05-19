<template>
    <div class="wrapper">
        <div>
            <h1>404</h1>
            <p>Страница не найдена</p>
            <button @click.prevent="$router.back()">Назад</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";

    .wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div {
            color: $darkPrimary;
            width: 100%;
            h1 {
                font-size: 144pt;
                margin: 0;
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                
                &::after {
                    content: "";
                    display: block;
                    width: 400px;
                    height: 2px;
                    background-color: $darkPrimary;
                }
            }

            button {
                font-family: Open Sans, Arial, sans-serif;
                font-size: 16pt;
                width: 450px;
                height: 38px;
                background-color: $darkPrimary;
                outline: none;
                color: $whiteText;
                border: 2px solid $darkPrimary;
                border-radius: 8px;
                appearance: none;

                &:hover,
                &:focus {
                    background: $primary;
                }
            }
        }
    }
</style>