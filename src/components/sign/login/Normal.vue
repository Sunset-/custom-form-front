<style lang="sass">
    .mdp-login-normal {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: #2cab8e;

        .mdp-login-logo {
            position: absolute;
            top: 50px;
            left: 40px;
        }

        .mdp-login-bg {
            position: absolute;
            width: 100%;
            bottom: 0px;
            z-index: 0;
            margin: 0px auto;
        }

        .mdp-login-content {
            position: relative;
            z-index: 1;
            max-width: 1280px;
            max-height: 1000px;
            margin: 100px auto 0px auto;
            background-size: contain;
            background-repeat: no-repeat;
            background-position-y: 100px;
            background-position-x: center;
            overflow: hidden;
        }

        .mdp-login-box {
            width: 390px;
            height: 390px;
            margin: 4% auto 0px auto;
            background: #EBEBEB;
            border-radius: 20px;
        }

        .mdp-login-box>.mdp-login-title {
            font-size: 18px;
            text-align: center;
            height: 80px;
            line-height: 80px;
            font-family: 微软雅黑;
            font-size: 18px;
            border-bottom: 1px solid #cdcdcd;
        }

        .mdp-login-msg {
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: red;
            text-align: center;
        }

        .mdp-login-form .input-group {
            display: table;
            width: 275px;
            height: 45px;
            margin: 0px auto 25px auto;
            border-radius: 50px;
            background: #FFF;
            overflow: hidden;
            border: 1px solid #cdcdcd;
        }

        .mdp-login-form .input-group div {
            display: table-cell;
            width: 45px;
            text-align: center;
            color: #cdcdcd;
            margin: 0px;
        }

        .mdp-login-form .input-group div i {
            position: relative;
            top: 6px;
            left: 5px;
            font-size: 24px;
            margin-top: 5px;
        }

        .mdp-login-form .input-group input {
            display: table-cell;
            width: 100%;
            height: 100%;
            border: none;
            font-size: 14px;
            padding: 0px 5px;
            background-color: #FFF !important;
            outline: none;
        }

        .mdp-login-other {
            width: 275px;
            margin: 15px auto;
        }

        .mdp-login-button {
            display: block;
            border: 0px;
            width: 275px;
            height: 55px;
            margin: 0px auto;
            color: #FFF;
            background: #2cab8e;
            font-size: 16px;
        }

        input:-webkit-autofill,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
            background-color: #FFF !important;
        }

        .mdp-login-footer {
            position: absolute;
            left: 0px;
            right: 0px;
            bottom: 0px;
            height: 40px;
            background: #088e6f;
            text-align: center;
            line-height: 40px;
            font-size: 14px;
            color: #FFF;
        }
    }
</style>
<template>
    <div class="mdp-login-normal">
        <img class="mdp-login-logo" src="/assets/img/mdds/logo.png">
        <img class="mdp-login-bg" src="/assets/img/mdds/bg.png">
        <div class="mdp-login-content">
            <div class="mdp-login-box">
                <div class="mdp-login-title">用户登录</div>
                <div class="mdp-login-msg">{{message}}</div>
                <div class="mdp-login-form">
                    <form @submit.prevent="login();return false;">
                        <div class="input-group">
                            <div>
                                <i class="fa fa-user"></i>
                            </div>
                            <input type="text" @input="message=''" placeholder="用户名" v-model="model.loginName" required />
                        </div>
                        <div class="input-group" style="margin-bottom:0px;">
                            <div>
                                <i class="fa fa-lock"></i>
                            </div>
                            <input type="password" @input="message=''" placeholder="密码" v-model="model.password" required />
                        </div>
                        <div class="mdp-login-other">
                            <label><input type="checkbox" style="position:relative;top:2px;"  v-model="model.autoLogin"> 一月内自动登录</label>
                        </div>
                        <button type="submit" class="mdp-login-button">登 录</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="mdp-login-footer">
            {{{loginFootTip}}}
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                model: {
                    loginName: '',
                    password: ''
                },
                message: ''
            }
        },
        computed: {
            loginFootTip() {
                return GlobalService.getSystemConfig() && GlobalService.getSystemConfig().loginFootTip ||
                    '售后电话：029-88151360&nbsp;&nbsp;&nbsp;&nbsp;技术支持：西安诸子信息技术有限责任公司';
            }
        },
        methods: {
            login() {
                this.$emit('login', this.model);
            },
            showMessage(msg) {
                this.message = msg;
            }
        }
    }
</script>