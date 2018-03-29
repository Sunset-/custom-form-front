<style lang="sass">
    .peaimage-header {
        position: relative;
        width: 100%;
        height: 60px;
        background: #2cab8e;
        font-size:16px;
        .peaimage-logo {
            float: left;
            width: 120px;
            text-align: center;
            img {
                width: 88px;
                margin-top: 7px;
            }
        }
        .peaimage-nav {
            background:#2cab8e;
            margin-left: 120px;
            margin-right: 270px;
            .ivu-menu-item-active{
                background:#165648;
            }
            .ivu-menu-item-selected{
                background:#259279;
            }
            .ivu-menu-item:hover{
                background:#165648;
            }
            .ivu-menu-item{
                font-size:16px;
                padding:0 15px;
            }
            .top-nav-item-span{
                display:inline-block;
                position:relative;
                &.has-new:after{
                    content : '';
                    position:absolute;
                    width:5px;
                    height:5px;
                    top:20px;
                    right:-5px;
                    background:red;
                    border-radius:10px;
                    line-height:12px;
                    font-size:12px;
                    padding:2px;
                }
            }
        }
        
        .header-right-menu {
            position: absolute;
            top: 0px;
            right: 0px;
            .avator-link {
                display: inline-block;
                min-width: 100px;
                color: #FFF;
                cursor: pointer;
                margin-top: 10px;
                margin-right: 10px;
                img {
                    vertical-align: middle;
                    border-radius: 50px;
                    width: 40px;
                    height: 40px;
                }
                span {
                    padding: 0px 5px;
                }
            }
        }
    }

</style>
<template>
    <div class="peaimage-header">
        <div class="peaimage-logo" :style="logoStyle">
            <img :src="logo" :style="logoStyle" />
        </div>
        <Menu class="peaimage-nav" mode="horizontal" theme="primary" :style="navStyle" :active-key="activeNav">
            <template v-for="nav in navs">
                <div v-mdp-permission="nav.name">
                    <Menu-item :key="nav.name" @click="go(nav)">
                        <Icon :type="nav.icon||'ios-paper'"></Icon>
                        <span :id="'top-nav-item-span-'+nav.name" tip="3" class="top-nav-item-span">{{nav.title}}</span>
                    </Menu-item>
                </div>
            </template>
            <!-- <Menu-item v-if="!IS_OPC" @click="download()" key="123">
                <Icon type="archive"></Icon>
                下载到桌面
            </Menu-item> -->
        </Menu>
        <div class="header-right-menu">
            <div style="margin-right:10px;display: inline-block;color:#fff;font-size:14px;vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" :title="hospitalName">{{hospitalName}}</div>
            <Dropdown @on-click="operate">
                <div class="avator-link">
                    <img :src="'/assets/img/user-default.png'" onerror="this.src='/assets/img/user-default.png'" alt="用户头像" class="img-circle img-inline userpic-32"
                        width="28" />
                    <span>{{userEntity.name}}</span>
                    <Icon type="arrow-down-b"></Icon>
                </div>
                <Dropdown-menu slot="list">
                    <Dropdown-item v-for="menu in showMenus" :divided="menu.divided" :key="$index">{{menu.title}}</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
        </div>
        <sunset-form-modal v-ref:passwordmodal :options="updatePasswordFormModal"></sunset-form-modal>
        <sunset-form-modal v-ref:feedbackmodal :options="feedbackFormModal"></sunset-form-modal>
        <sunset-view-modal v-ref:aboutmodal :options="{title:'关于Peaimage'}">
            <peaimage-about></peaimage-about>
        </sunset-view-modal>
        <sunset-view-modal v-ref:helpmodal :options="{title:'操作指南'}">
            <peaimage-help></peaimage-help>
        </sunset-view-modal>
        <sunset-view-modal v-ref:hospitalhelpmodal :options="{title:'操作指南'}">
            <peaimage-hospitalhelp></peaimage-hospitalhelp>
        </sunset-view-modal>
    </div>
</template>

<script>
    import SignStore from '../sign/SignStore';
    import PeaimageAbout from './About.vue';
    import PeaimageHelp from './Help.vue';
    import PeaimageHospitalhelp from './HospitalHelp';


    export default {
        components: {
            PeaimageAbout,
            PeaimageHelp,
            PeaimageHospitalhelp
        },
        props: {
            navs: {},
            menus: {}
        },
        data() {
            return {
                IS_OPC: true,
                logo: '',
                logoStyle: {},
                navStyle: {},
                userObject: {},
                allMenus: [{
                        title: '修改密码',
                        name: 'UPDATE_PASSWORD',
                        premise: () => {
                            return !this.userEntity.isVisitor;
                        },
                        operate: () => {
                            this.$refs.passwordmodal.open({});
                        }
                    },
                    /* {
                        title: '操作指南',
                        name: 'DOCTOR_OPERATE_HELP',
                        operate: () => {
                            this.$refs.helpmodal.open();
                        }
                    }, {
                        title: '操作指南',
                        name: 'HOSPITAL_OPERATE_HELP',
                        operate: () => {
                            this.$refs.hospitalhelpmodal.open();
                        }
                    }, {
                        title: '反馈意见',
                        name: 'FEEDBACK',
                        operate: () => {
                            this.$refs.feedbackmodal.open({});
                        }
                    }, {
                        title: '关于我们',
                        name: 'ABOUT',
                        operate: () => {
                            this.$refs.aboutmodal.open();
                        }
                    },
                    */
                    {
                        title: '安全退出',
                        name: 'LOGOUT',
                        operate() {
                            SignStore.logout().then(res => {
                                Router.go('/sign');
                            });
                        },
                        divided: true
                    }
                ],
                updatePasswordFormModal: {
                    title: '修改密码',
                    width: '800',
                    formOptions: {
                        cols: 2,
                        store: SignStore,
                        fields: [{
                            label: '旧密码',
                            name: 'oldPwd',
                            widget: 'input',
                            validate: {
                                required: true,
                                password: true
                            }
                        }, {
                            label: '新密码',
                            name: 'newPwd',
                            widget: 'input',
                            type: 'password',
                            validate: {
                                required: true,
                                password: true
                            }
                        }, {
                            label: '重复密码',
                            name: 'pwdAgain',
                            widget: 'input',
                            type: 'password',
                            validate: {
                                required: true,
                                password: true

                            }
                        }],
                        method: 'updatePassword',
                        format: (model) => {
                            return model;
                        },
                        validate: (model) => {
                            if (model.newPwd != model.pwdAgain) {
                                Sunset.tip('两次密码输入不一致', 'warning');
                                throw new Error();
                                return false;
                            }
                            return true;
                        },
                        tools: false
                    }
                },
                feedbackFormModal: {
                    title: '反馈意见',
                    formOptions: {
                        cols: 2,
                        store: SignStore,
                        fields: [{
                            label: '联系电话',
                            name: 'phone',
                            widget: 'input',
                            validate: {
                                required: true,
                                phone: true
                            }
                        }, {
                            label: '意见建议',
                            name: 'content',
                            widget: 'textarea',
                            monopolize: true,
                            validate: {
                                required: true,
                                maxlength: 200
                            }
                        }],
                        method: 'feedback',
                        format: (model) => {
                            return model;
                        },
                        validate: (model) => {
                            return true;
                        },
                        tools: false
                    }
                }
            }
        },
        computed: {
            hospitalName(){
                return GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital.length==1?GlobalService.getCurrentUserSync().relation.hospital[0].name:'';
            },
            activeNav() {
                var path = this.$route.path;
                path = path.substr(path.indexOf('/') + 1);
                path = ~path.indexOf('/')?path.substr(0, path.indexOf('/')):path;
                return path;
            },
            userEntity() {
                return this.userObject.user || {
                    isVisitor: true,
                    name: '游客'
                };
            },
            showMenus() {
                var menus = this.menus && this.menus.split(',') || [];
                var a = this.allMenus.filter(m => {
                    if (~menus.indexOf(m.name)) {
                        if (m.premise) {
                            return m.premise();
                        } else {
                            return true;
                        }
                    }
                    return false;
                });
                return a;
            }

        },
        methods: {
            go(nav) {
                this.$emit('change', nav.menus);
                Router.go(nav.path);
            },
            operate(v) {
                this.showMenus[v].operate();
            },
            refreshUser() {
                SignStore.currentUser().then(res => {
                    this.userObject = res;
                });
            },
            download() {
                window.open(`${window.location.origin}/assets/download/peaimage.url`)
            }
        },
        ready() {
            this.logo = Base.IS_OPC ? '/assets/img/mdds_logo.png' : '/assets/img/logo.png';
            if (Base.IS_OPC) {
                this.logoStyle = {
                    width: '130px',
                    'margin-top': '0px'
                };
                this.navStyle = {
                    'margin-left': '130px'
                }
            } else {
                this.IS_OPC = false
            }
            this.refreshUser();
        }
    }
</script>