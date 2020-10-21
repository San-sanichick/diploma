<template>
    <div class="wrapper">
        <div>
            <h1>404</h1>
            <p>Not Found, go fuck yourself</p>
            <router-link to="/">На главную</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div {
            h1 {
                font-size: 75pt;
            }
        }
    }
</style>