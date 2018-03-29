<style lang="sass">
    .videoclinic-hospital-container {
        margin: 10px;
        .no_data{
            display:block;
            margin:140px auto;
        }
        .videoclinic-tip-wrap {
            text-align: center;
            .videoclinic-tip {
                display: inline-block;
                border: 2px solid green;
                margin: 10px auto;
                min-width: 200px;
                &>:first-child {
                    background: green;
                    color: #FFF;
                    text-align: center;
                    padding: 5px;
                }
                &>:last-child {
                    padding: 10px 10px;
                    font-size: 24px;
                    color: #111;
                    font-weight: bold;
                }
            }
        }
    }
</style>
<template>
    <div class="videoclinic-hospital-container">
        <div v-show="!currentPatientId">
            <div class="videoclinic-tip-wrap">
                <div class="videoclinic-tip" v-if="currentQueuePatient">
                    <div>当前</div>
                    <div>
                        {{currentQueuePatient.queueNo}}&nbsp;&nbsp;{{currentQueuePatient.name}}&nbsp;
                        <Icon v-show="currentHospitalId==currentQueuePatient.hospitalId" type="speakerphone" @click="tipSpeak(currentQueuePatient)"
                            style="color:orange;cursor:pointer;font-size:28px;" title="语音叫号"></Icon>
                        <i></i>
                    </div>
                </div>
            </div>
            <div>
                <sunset-filter :options="filterOptions" @filter="filterData" style="margin-bottom:10px;"></sunset-filter>
                <sunset-toolbar :options="toolbarOptions" style="float:right;"></sunset-toolbar>
            </div>
            <sunset-table v-ref:table :options="tableOptions">
                <img class="no_data" slot="empty" src="/assets/img/nodata.png">
            </sunset-table>
        </div>
        <div v-show="currentPatientId" class="video-patientinfo-container">
            <patient-detail v-if="currentPatientId" :patient-id="currentPatientId">
            </patient-detail>
        </div>
    </div>
</template>
<script>
    import PatientDetail from '../PatientDetail/PatientDetail';
    import Store from './Store.js';

    export default {
        components: {
            PatientDetail
        },
        computed: {
            currentHospitalId() {
                return GlobalService.getCurrentUserSync().relation.hospital[0].id;
            },
            currentPatientId() {
                return this.$route.params.patientId;
            }
        },
        data() {
            return {
                currentQueuePatient: null,
                filterOptions: {
                    fields: [{
                        widget: 'radio',
                        name: 'status',
                        type: 'button',
                        enum: 'VIDEOCLINICI_FLOW_STATUS',
                        defaultFirst: true,
                        changeFilter: true,
                        data: () => {
                            return [{
                                value: ['LINEUP', 'PROCESSING', 'RELINEUP'].map(item => Sunset.Service
                                    .Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', item)).join(
                                    ','),
                                text: '排队中'
                            }, {
                                value: Sunset.Service.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS',
                                    'PROCESSED'),
                                text: '已完成'
                            }];
                        }
                    }]
                },
                toolbarOptions: {
                    tools: [{
                        label: '打开公示屏',
                        color: 'info',
                        operate: () => {
                            GlobalService.OpenVideoClinicTipView(this.currentHospitalId);
                        }
                    }, {
                        label: '刷新',
                        color: 'success',
                        operate: () => {
                            this.$refs.table.refresh();
                        }
                    }]
                },
                tableOptions: {
                    columns: [{
                        title: '序号',
                        name: 'no',
                        align: 'center'
                    }, {
                        title: '患者编号',
                        name: 'patientNumber'
                    }, {
                        title: '姓名',
                        name: 'patient.name'
                    }, {
                        title: '来自医院',
                        name: 'hospital.name'
                    }, {
                        title: '诊室',
                        name: 'dept.equipName'
                    }, {
                        title: '所选专家',
                        name: 'expert.name'
                    }, {
                        title: '状态',
                        name: 'status',
                        format(v) {
                            var Dictionary = Sunset.Service.Dictionary;
                            if (v == Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', 'PROCESSING')) {
                                return `<span style="color:#39f">${Dictionary.transcode('VIDEOCLINICI_FLOW_STATUS',v)}</span>`;
                            } else {
                                return Dictionary.transcode('VIDEOCLINICI_FLOW_STATUS', v);
                            }
                        }
                    }, {
                        title: '登记时间',
                        name: 'joinTime',
                        format: 'DATETIME'
                    }],
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    lazy: true,
                    pageNumberStart: 0,
                    datasource: (filter) => {
                        if (filter.status == Sunset.Service.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS',
                                'PROCESSED') || filter.status ==
                            Sunset.Service.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS',
                                'CANCELLINEUP')) {
                            filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            return Store.queue(filter).then(res => {
                                res.rows.forEach(item => {
                                    item.patient.queueNo = item.no;
                                })
                                return res;
                            });
                        } else {
                            return Store.todayExpert({
                                hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0].id
                            }).then(res => {
                                if (res && res.length) {
                                    delete filter.hospitalId;
                                    filter.expertUserId = res.join(',');
                                } else {
                                    filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[
                                        0].id;
                                }
                                return Store.queue(filter).then(res => {
                                    res.rows.forEach(item => {
                                        item.patient.queueNo = item.no;
                                    })
                                    var first = res.rows[0];
                                    if (first && first.status == Sunset.Service.Dictionary.alias(
                                            'VIDEOCLINICI_FLOW_STATUS',
                                            'PROCESSING')) {
                                        this.currentQueuePatient = first.patient;
                                    }
                                    if (!first) {
                                        this.currentQueuePatient = null;
                                    }
                                    return res;
                                });
                            })
                        }

                    },
                    recordTools: {
                        length: 1,
                        size: 'small',
                        tools: [{
                            label: '查看',
                            color: 'info',
                            icon: 'eye',
                            premise(model) {
                                if (model.hospitalId != GlobalService.getCurrentUserSync().relation.hospital[0]
                                    .id) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            operate: (model) => {
                                var path = this.$route.path;
                                if (path.endsWith('/detail')) {
                                    path = path.substring(0, path.indexOf('VideoClinicHospital') +
                                        'VideoClinicHospital'.length)
                                }
                                path = path + `/${model.patientId}/detail`;
                                Router.go(path);
                            }
                        }, {
                            label: '取消',
                            icon: 'trash-a',
                            color: 'error',
                            confirm: '确定取消排队？',
                            disabled(model) {
                                if (model.hospitalId != GlobalService.getCurrentUserSync().relation.hospital[0]
                                    .id) {
                                    return true;
                                }
                                return model.status != Sunset.Service.Dictionary.alias(
                                        'VIDEOCLINICI_FLOW_STATUS', 'LINEUP') && model.status != Sunset.Service
                                    .Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', 'RELINEUP');
                            },
                            operate: (model) => {
                                Store.cancel(model.id).then(res => {
                                    Sunset.tip('操作成功', 'success');
                                    this.$refs.table.refresh();
                                });
                            }
                        }, {
                            label: '重新排队',
                            icon: 'trash-a',
                            color: 'warning',
                            confirm: '确定重新排队？',
                            premise(model) {
                                if (model.hospitalId != GlobalService.getCurrentUserSync().relation.hospital[0]
                                    .id) {
                                    return false;
                                }
                                return model.status == Sunset.Service.Dictionary.alias(
                                        'VIDEOCLINICI_FLOW_STATUS', 'CANCELLINEUP') || model.status == Sunset.Service
                                    .Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', 'PROCESSED');
                            },
                            operate: (model) => {
                                Store.requeue(model.id).then(res => {
                                    Sunset.tip('操作成功', 'success');
                                    this.$refs.table.refresh();
                                });
                            }
                        }]
                    }
                }
            };
        },
        methods: {
            init() {
                if (GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias(
                        'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT')) {
                    this.initWebSocket();
                }
            },
            initWebSocket() {
                var self = this;
                GlobalService.AddVideoClinicTipViewCallback('VIDEO_CLINIC_HOSPITAL', function (content) {
                    if (content.messageType == 'MESSAGE' && content.nextOne) {
                        var nextOne = content.nextOne;
                        var patient = nextOne.patient;
                        patient.queueNo = nextOne.no;
                        self.refreshQueueFirst(patient);
                        self.$refs.table.refresh();
                    } else if (content.messageType == 'ACTION') {
                        self.$refs.table.refresh();
                    }
                });
                GlobalService.InitVideoClinicTipView();
            },
            filterData(filter) {
                this.$refs.table.search(filter);
            },
            refreshQueueFirst(next) {
                this.currentQueuePatient = next;
                // if (next && next.hospitalId == this.currentHospitalId) {
                //     this.tipSpeak(next);
                // }
            },
            tipSpeak(patient) {
                GlobalService.BroadcastSpeek(`${patient.queueNo}号，${patient.name}，请到远程诊室就诊。`);
            }
        },
        ready() {
            this.init();
        },
        beforeDestroy() {
            GlobalService.removeVideoClinicTipViewCallback('VIDEO_CLINIC_HOSPITAL');
        }
    }
</script>