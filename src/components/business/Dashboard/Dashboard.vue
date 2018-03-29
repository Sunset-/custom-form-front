<style lang="sass">
    .mdp-dashboard {
        width: 1280px;
        margin: 0px auto;
        padding-top: 50px;
        text-align: center;
        &>div {
            display: inline-block;
            text-align: left;
        }
        .dashboard-item {
            display: inline-block;
            margin: 10px;
            width: 380px;
            height: 160px;
            background: #efefef;
            border-radius: 2px;
            &>div {
                display: inline-block;
            }
            .di-icon {
                width: 90px;
                height: 90px;
                border-radius: 100px;
                margin-top: 35px;
                margin-left: 25px;
                i {
                    display: block;
                    width: 48px;
                    height: 48px;
                    margin: 20px auto;
                    background-image: url('/assets/img/dashboard-icon.png');
                    background-repeat: no-repeat;
                }
                &.patient-icon {
                    background: #2AC5E3;
                }
                &.archives-icon {
                    background: #FDB740;
                    i {
                        background-position: 0 -48px;
                    }
                }
                &.diffcult-icon {
                    background: #FF7076;
                    i {
                        background-position: 0 -96px;
                    }
                }
                &.report-icon {
                    background: #FF8B42;
                    i {
                        background-position: 0 -144px;
                    }
                }
                &.refferalstatistics-icon {
                    background: #FD72AB;
                    i {
                        background-position: 0 -48px;
                    }
                }
                &.refferal-icon {
                    background: #2693FD;
                    i {
                        background-position: 0 -192px;
                    }
                }
                &.fast-icon {
                    background: #78ca60;
                    i {
                        background: url('/assets/img/icon-48.png') no-repeat 0 -288px;
                    }
                }
                &.yuyue-icon {
                    background: #00caca;
                    i {
                        background-image: url('/assets/img/icon-48.png');
                        background-position: 0 -336px;
                    }
                }
            }
            .di-body {
                vertical-align: top;
                padding-top: 35px;
                padding-left: 20px;
                h3 {
                    font-weight: bold;
                    color: #444;
                    font-size: 18px;
                }
                p {
                    padding: 10px 0px;
                }
                .ivu-btn {
                    position: relative;
                    min-width: 80px;
                    background: #FFF;
                    margin-right: 5px;
                    &.has-new:after {
                        position: absolute;
                        top: 5px;
                        right: 10px;
                        content: '';
                        width: 6px;
                        height: 6px;
                        background: red;
                        border-radius: 10px;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="mdp-dashboard">
        <div>
            <template v-for="item in items">
                <br v-if="item.newline" />
                <div class="dashboard-item">
                    <div :class="['di-icon',item.icon]">
                        <i></i>
                    </div>
                    <div class="di-body">
                        <h3>{{item.title}}</h3>
                        <p>{{{item.subTitle}}}</p>
                        <div>
                            <i-button :class="btn.hasNew?'has-new':''" :disabled="false&&!btn.enable&&!btn.hasNew" v-for="btn in item.toolbar" @click="btn.operate(btn)">{{btn.label}}</i-button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import Store from './Store';

    export default {
        ready() {
            var patientItem = this.items.find(item => item.name == 'patient'),
                referralItem = this.items.find(item => item.name == 'referral'),
                difficultItem = this.items.find(item => item.name == 'difficult'),
                reportItem = this.items.find(item => item.name == 'report');

            GlobalService.RefreshFlowHasNew();
            GlobalService.ListenFlowHasNew('ALL', (result) => {
                if (result.difficultyflow) {
                    referralItem.toolbar[0].hasNew = result.transfertreatment.in.hasNew;
                    referralItem.toolbar[1].hasNew = result.transfertreatment.out.hasNew;

                    difficultItem.toolbar[0].hasNew = result.difficultyflow.toMe.hasNew;
                    difficultItem.toolbar[1].hasNew = result.difficultyflow.fromMe.hasNew;

                    reportItem.toolbar[0].hasNew = result.remoteflow.toMe.hasNew;
                    reportItem.toolbar[1].hasNew = result.remoteflow.fromMe.hasNew;

                }
            });
            Store.getStateCount().then(res => {
                if (res) {
                    patientItem.subTitle = `共 ${res.patient.count} 位患者`;
                    referralItem.subTitle =
                        `待转入 ${res.transfertreatment.inCount} 例;共转出 ${res.transfertreatment.outCount} 例;`;
                    difficultItem.subTitle =
                        `待处理 ${res.difficultyflow.toMeCount} 例;申请数 ${res.difficultyflow.fromMeCount} 例;`;
                    reportItem.subTitle =
                        `待处理 ${res.remoteflow.toMeCount} 例;申请数 ${res.remoteflow.fromMeCount} 例;`;
                }
            });
        },
        data() {
            return {
                items: [{
                    name: 'patient',
                    title: '患者中心',
                    subTitle: '共 0 位患者',
                    icon: 'patient-icon',
                    toolbar: [{
                        label: '进入',
                        color: 'ghost',
                        enable: true,
                        operate: (options) => {
                            Router.go('/DoctorOutpatient')
                        }
                    }]
                }, {
                    title: '医技工作站',
                    subTitle: '&nbsp;',
                    icon: 'archives-icon',
                    toolbar: [{
                        label: '进入',
                        color: 'ghost',
                        enable: true,
                        operate: (btn) => {
                            var target = 'DicomCenter';
                            var url = null;
                            var routes = GlobalService.Modules.routes;
                            Object.keys(routes).forEach(key => {
                                if (routes[key].name == target) {
                                    url = `/${target}`;
                                } else if (routes[key].subRoutes) {
                                    var subRoutes = routes[key].subRoutes;
                                    Object.keys(subRoutes).forEach(k => {
                                        if (subRoutes[k].name == target) {
                                            url = `${key}/${target}`;
                                        }
                                    })
                                }
                            });
                            if (url) {
                                Router.go(url)
                            }
                        }
                    }]
                },{
                    name: 'kuaisutongdao',
                    title: '快速通道',
                    icon: 'fast-icon',
                    toolbar: [{
                        label: '进入',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`/Helpdesk`);
                        }
                    }]
                },{
                    name: 'referral',
                    title: '预约转诊',
                    subTitle: '待转入 0 例;共转出 0 例;',
                    icon: 'refferal-icon',
                    toolbar: [{
                        label: '转入',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go('/Referral/TransferIn');
                        }
                    }, {
                        label: '转出',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go('/Referral/TransferOut');
                        }
                    }]
                },  {
                    name: 'yuyuejiancha',
                    title: '预约检查',
                    icon: 'yuyue-icon',
                    toolbar: [{
                        label: '转出',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`OrderCheck/OutCheck`);
                        }
                    }, {
                        label: '转入',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`OrderCheck/InCheck`);
                        }
                    }]
                }, {
                    name: 'referralStatistics',
                    title: '转诊统计',
                    subTitle: '&nbsp;',
                    icon: 'refferalstatistics-icon',
                    toolbar: [{
                        label: '转出',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go('/ReferralStatistics/Out');
                        }
                    }, {
                        label: '转入',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go('/ReferralStatistics/In');
                        }
                    }]
                },  {
                    name: 'difficult',
                    title: '疑难会诊',
                    subTitle: '待处理 0 例;申请数 0 例;',
                    icon: 'diffcult-icon',
                    toolbar: [{
                        label: '我的任务',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`/DifficultConsultation/MyTask`);
                        }
                    }, {
                        label: '我的咨询',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`/DifficultConsultation/ConsultList`);
                        }
                    }]
                }, {
                    name: 'report',
                    title: '远程阅片',
                    subTitle: '待处理 0 例;申请数 0 例;',
                    icon: 'report-icon',
                    toolbar: [{
                        label: '我的任务',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`/RemoteReport/flowtask`);
                        }
                    }, {
                        label: '我的咨询',
                        color: 'ghost',
                        hasNew: false,
                        disabled: false,
                        operate: () => {
                            Router.go(`/RemoteReport/flowconsulting`);
                        }
                    }]
                }]
            }
        }
    }
</script>