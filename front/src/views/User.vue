<template>
    <div class="header" v-if="currentUser !== null">
        <div class="logo"></div>
        <div class="user">
            <div class="user-button" @click="openPopUp">
                <span>{{ (currentUser.username !== "" && currentUser.username !== null) ? currentUser.username : currentUser.email }}</span>

                <UserAvatar :name="(currentUser.username !== '' && currentUser.username !== null) ? currentUser.username : currentUser.email" />
            </div>
            <router-link to="/auth/logout">
                <div class="user-logout"></div>
            </router-link>
        </div>
    </div>
    <router-view></router-view>

    <teleport to="body">
        <div class="popup" v-if="showPopUp" @click="closePopUp">
            <UserSettings :user="currentUser" @close-popup="showPopUp = !showPopUp"/>
        </div>
    </teleport>
</template>

<script lang="ts">
    import { defineComponent } from "vue";
    import UserAvatar from "../components/user/userAvatar.vue";
    import UserSettings from "../components/popups/userSettings.vue";
    import UserInterface from "../types/User";

    export default defineComponent({
        components: {
            UserAvatar,
            UserSettings
        },
        data() {
            return {
                showPopUp: false
            }
        },
        computed: {
            currentUser(): UserInterface | null {
                return this.$store.getters.getUser;
            }
        },
        created() {
            const id = this.$route.params.userId;
            if (id !== this.$store.getters.getUser._id) {
                this.$router.push("/");
            }
        },
        methods: {
            openPopUp() {
                this.showPopUp = !this.showPopUp;
                document.body.style.overflowY = document.body.style.overflowY === "" ? "hidden" : "";
            },
            closePopUp(e: Event) {
                const target = e.target as HTMLElement;
                
                if (target.className === "popup") {
                    this.showPopUp = !this.showPopUp;
                    document.body.style.overflowY = document.body.style.overflowY === "" ? "hidden" : "";
                }
            },
        }
    })
</script>

<style lang="scss" scoped>
    @import "../assets/scss/config.scss";
    .header {
        top: 0;
        position: fixed;
        width: 100%;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: auto max-content;
        align-items: center;
        padding: 0px 30px;
        background-color: $darkPrimary;
        color: white;
        z-index: 1000;

        .logo {
            justify-self: start;
            background-image: url("../assets/logo.svg");
            background-repeat: no-repeat;
            background-size: cover;
            width: 50px;
            height: 50px;
        }

        .user {
            display: grid;
            grid-template-columns: max-content auto;
            gap: 10px;
            align-items: center;
            justify-content: center;

            .user-button {
                display: grid;
                padding: 10px 10px;
                grid-template-columns: max-content auto;
                gap: 10px;
                align-items: center;
                justify-content: center;
                user-select: none;

                &:hover {
                    background-color: rgba($color: #000000, $alpha: 0.2);
                    cursor: pointer;
                }
            }
            a {
                text-decoration: none;
                color: white;

                .user-logout {
                    background-image: url("../assets/logOut.svg");
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 30px;
                    height: 30px;
                }
            }
        }
    }

    .popup {
        font-family: Open Sans, Arial, sans-serif;
        position: fixed;
        height: 100vh;
        width: 100vw;
        background-color: rgba($color: #000000, $alpha: 0.5);
        top: 0;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        z-index: 9000;
    }
</style>