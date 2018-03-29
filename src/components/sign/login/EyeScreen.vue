<style lang="sass">
    .mdp-login-eyesscreen {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: #F4F4F4;

        .mdp-login-logo-wrapper {
            width: 100%;
            height: 80px;
            overflow: hidden;
            margin: 0px auto;
            background: #FFF;
            padding-left: 100px;
            box-sizing: border-box;
        }
        .mdp-login-content {
            position: relative;
            min-height: 438px;
            .mdp-login-bg {
                width: 100%;
                z-index: 0;
                min-width: 1400px;
            }
            .mdp-login-box {
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -195px;
                margin-top: -195px;
                z-index: 1;
                width: 360px;
                height: 400px;
                border-radius: 5px;
                &>.mdp-login-title {
                    font-size: 18px;
                    text-align: center;
                    height: 80px;
                    line-height: 80px;
                    font-family: 微软雅黑;
                    font-size: 18px;
                    border-bottom: 1px solid #cdcdcd;
                    background: rgba(#3399FF, 0.8);
                    color: #FFF;
                }
                .mdp-login-msg {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    color: red;
                    text-align: center;
                    background: rgba(#FFF, 0.7);
                }
                .mdp-login-form {
                    background: rgba(#FFF, 0.7);
                    padding-bottom: 10px;
                    .input-group {
                        display: table;
                        width: 275px;
                        height: 40px;
                        margin: 0px auto 25px auto;
                        border-radius: 5px;
                        background: #FFF;
                        overflow: hidden;
                        border: 1px solid #cdcdcd;
                        div {
                            display: table-cell;
                            width: 45px;
                            text-align: center;
                            color: #cdcdcd;
                            margin: 0px;
                            background: #cdcdcd;
                            i {
                                position: relative;
                                top: 4px;
                                left: 1px;
                                font-size: 24px;
                                margin-top: 5px;
                                color: #777;
                            }
                        }
                        input {
                            display: table-cell;
                            width: 100%;
                            height: 100%;
                            border: none;
                            font-size: 14px;
                            padding: 0px 5px;
                            background-color: #FFF !important;
                            outline: none;
                            vertical-align: bottom;
                        }
                        input:-webkit-autofill,
                        textarea:-webkit-autofill,
                        select:-webkit-autofill {
                            -webkit-box-shadow: 0 0 0 1000px white inset;
                        }
                        input[type=text]:focus,
                        input[type=password]:focus,
                        textarea:focus {
                            -webkit-box-shadow: 0 0 0 1000px white inset;
                        }
                    }
                }
            }
        }
        .mdp-login-other {
            width: 275px;
            margin: 15px auto;
        }
        .mdp-login-button {
            display: block;
            border: 0px;
            width: 275px;
            height: 45px;
            margin: 0px auto;
            color: #FFF;
            background: #3399FF;
            font-size: 16px;
            cursor: pointer;
        }
        .mdp-login-footer {
            height: 40px;
            text-align: center;
            line-height: 40px;
            font-size: 14px;
            color: #777;
        }
    }

    input:-webkit-autofill,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
        background-color: #FFF !important;
    }
</style>
<template>
    <div class="mdp-login-eyesscreen">
        <div class="mdp-login-logo-wrapper">
            <img class="mdp-login-logo" src="/assets/login/eyesscreen/logo.png">
        </div>
        <div class="mdp-login-content">
            <img class="mdp-login-bg" src="/assets/login/eyesscreen/banner.png">
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