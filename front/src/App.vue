<template>
    <router-view />
    <FlashMessage position="right bottom"/>
</template>

<style lang="scss">
    body {
        height: 100vh;
        margin: 0;
    }

    #app {
        font-family: Open Sans, Arial, sans-serif;
        text-align: center;
        color: black;
        height: 100%;
    }
</style>
