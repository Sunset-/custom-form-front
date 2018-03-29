<style lang="sass">
    .mdp-login-container {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: #199fcf;
    }
</style>
<template>
    <div class="mdp-login-container">
        <component :is="loginTemplate" @login="login" v-ref:loginbox></component>
    </div>
</template>
<script>
    import SignStore from './SignStore';
    import modules from '../../app.modules';
    import './login/index.js';

    export default {
        data() {
            return {
                lock: false
            }
        },
        computed: {
            loginTemplate() {
                return GlobalService.getSystemConfig() && GlobalService.getSystemConfig().loginTemplate ||
                    'system-login-normal';
            }
        },
        methods: {
            login(model) {
                if (this.lock) {
                    return;
                }
                this.lock = true;
                SignStore.login(model).then((data) => {
                    this.lock = false;
                    Router.go(modules.navs.filter(nav => Base.permissions[nav.name])[0].path);
                    this.$dispatch('USER_LOGINED', data);
                }).catch(e => {
                    this.$refs.loginbox.showMessage(e && e.message || '登录失败');
                    this.lock = false;
                });
                return false;
            }
        },
        ready() {}
    }
</script>