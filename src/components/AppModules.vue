<style lang="sass">
    .peaimage-container {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        .major-container {
            position: absolute;
            top: 60px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }
    }
</style>
<template>
    <div class="peaimage-container">
        <peaimage-header :navs="navs" menus="UPDATE_PASSWORD,DOCTOR_OPERATE_HELP,FEEDBACK,ABOUT,LOGOUT"></peaimage-header>
        <div class="major-container">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import SignStore from './sign/SignStore';
    import PeaimageHeader from './layout/Header';
    import modules from '../app.modules';

    export default {
        components: {
            PeaimageHeader
        },
        data() {
            return {
                currentUser: null,
                navs: modules.navs,
                headerMenus: [{
                    title: '安全退出',
                    operate() {
                        SignStore.logout().then(data => {
                            Router.go('/sign');
                        });
                    }
                }],
                menus: []
            }
        },
        methods: {
        }
    }
</script>