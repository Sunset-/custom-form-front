<style lang="sass">
    .clinic-container {
        height:100%;
        width:100%;
        .patients {
            padding: 15px;
            padding-top: 25px;
            overflow: auto;
            width: 100%;
            height: 100%;
            .no_data{
                display:block;
                margin:140px auto;
            }
            .sunset-page.sunset-page-right .ivu-page{
                float: none;
                margin: 0 auto;
                display: table;
            }
        } 
        .patient-detail-wrap{
            width:100%;
            height:100%;
            position:relative;
        }
    }
</style>

<template>
    <div class="clinic-container">
        <div class="patients" v-show="currentPatientId?false:true">
            <sunset-filter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
            <sunset-filter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
            <sunset-table v-ref:table :options="options" style="margin-top:10px;">
                <img class="no_data" slot="empty" src="/assets/img/nodata.png">
            </sunset-table>
        </div>
        <div class="patient-detail-wrap" v-show="currentPatientId">
            <patient-detail :patient-id="currentPatientId"></patient-detail>
        </div>
    </div>
</template>

<script>
import PatientDetail from "../PatientDetail/PatientDetail";
import PatientItem from "./PatientItem";
import DoctorPatientStore from "../DoctorOutpatient/DoctorPatientStore.js";
import CloudClinicStore from "./CloudClinicStore.js"

export default {
    components: {
        PatientItem,
        PatientDetail
    },
    computed: {
        currentPatientId() {
            return this.$route.params.patientId;
        }
    },
    data() {
        return {
            nothingData: false,
            filter: {
                order: "ASC"
            },
            items: [],
            filterInited: false,
            patientList: null,
            options: {
                pageNumberStart: 0,
                pageSize: 12,
                lazy: true,
                columns:[{
                        title:"",
                        name:"hasNew",
                        style : "width:30px",
                        format:(v)=>{
                            return v?`<i class="ivu-icon ivu-icon-ios-bell" style="font-size: 24px;color:#f50;"></i>`:'';
                        }
                    },{
                        title:"患者编号",
                        name:"registration.patientNumber"
                    },{
                        title:"患者",
                        name:"patient.name"
                    },{
                        title:"性别",
                        name:"patient.sex",
                        enum:"SEX"
                    },{
                        title:"年龄",
                        name:"registration.patientAge",
                        format:(v)=>{
                            return v&&v.replace(',','')||'-';
                        }
                    },{
                        title:"就诊科室",
                        name:"registration.registeredDept"
                    },{
                        title:"来自医院",
                        name:"hospital.name"
                    },{
                        title:"咨询状态",
                        name:"flow.status",
                        style:'width:120px;text-align:center;',
                        format(v){
                            return `<span style="color:${
                                {
                                    '1' : '#ff0000',
                                    '2' : '#3399ff',
                                    '3' : '#aeaeae'
                                }[v]
                            };">${Sunset.Service.Dictionary.transcode('RegistrationRecordStatus',v)}</span>`
                        }
                    },{
                        title:"问诊时间",
                        name:"flow.applyDate",
                        format:'DATETIME',
                        style:'width:160px;text-align:center;'
                    }
                ],
                recordTools:[{
                        label:"接诊",
                        color:"primary",
                        premise:(record)=>{
                            return record.flow.status != Sunset.Service.Dictionary.alias('RegistrationRecordStatus', 'Finish')
                        },
                        operate:(record)=>{
                            if (record.flow.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus', 'Wait')) {
                                CloudClinicStore.receiveClinic({ flowId: record.flow.id }).then(res => {
                                    this.$refs.table.refresh();
                                    Router.go(`/CloudClinic/patient/${record.patient.id}/${record.flow.id}`)
                                })
                            } else {
                                   Router.go(`/CloudClinic/patient/${record.patient.id}/${record.flow.id}`)
                            }
                        }
                    },{
                        label:"查看",
                        color:"primary",
                        premise:(record)=>{
                            return record.flow.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus', 'Finish')
                        },
                        operate:(record)=>{
                            Router.go(`/CloudClinic/patient/${record.patient.id}/${record.flow.id}`)
                        }
                    }
                ],
                format: {
                    list: 'rows',
                    count: 'totalCount',
                    pageSize: 'pageSize',
                    currentPage: 'pageNumber'
                },
                formatFilter(filter) {
                    if (filter.hospitalId == '') {
                        delete filter.hospitalId;
                    }
                    return filter;
                },
                datasource: (filter) => {
                    return CloudClinicStore.list(filter).then(res => {
                        if (!res.rows.length) {
                            this.nothingData = true;
                        } else {
                            this.nothingData = false;
                        }
                        return res
                    });
                }
            },
            leftFilterOps: {
                fields: [{
                    name: 'status',
                    widget: 'radio',
                    type: 'button',
                    default: Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','Wait'),
                    valuePlace: 'key',
                    textPlace: 'value',
                    changeFilter: true,
                    data() {
                        var enums = Sunset.Service.Dictionary.getEnums('DoctorRegistrationStatus').filter(item => item.alias != 'WaitTriage' && item.alias != 'Close');
                        enums.unshift({
                            alias: 'ALL',
                            key: 'ALL',
                            value: '全部'
                        });
                        return enums;
                    }
                }],
                format(filter) {
                    if (filter.status == 'ALL') {
                        filter.status = "";
                    }
                },
                toolbar: {
                    tools: [{
                        label: '提交时间',
                        icon: 'arrow-up-c',
                        color: 'ghost',
                        operate: () => {
                            if (this.filter.order == "DESC") {
                                this.filter.order = "ASC";
                                this.leftFilterOps.toolbar.tools[0].icon = "arrow-down-c";
                            } else {
                                this.filter.order = "DESC";
                                this.leftFilterOps.toolbar.tools[0].icon = "arrow-up-c";
                            }
                            this.leftFilter(this.filter);
                        }
                    }]
                }
            },
            rightFilterOps: {
                align: 'right',
                format:(filter)=>{
                    if(filter.hospitalId=='ALL'){
                        filter.hospitalId ='';
                    };
                    if(filter.keyword){
                        filter.keyword = filter.keyword.trim();
                    }else{
                        filter.keyword = ""
                    };
                    if(filter.date && filter.date[0] && filter.date[1]){
                        filter.date[0].setHours(0);
                        filter.date[0].setMinutes(0);
                        filter.date[0].setSeconds(0);
                        filter.date[1].setHours(0);
                        filter.date[1].setMinutes(0);
                        filter.date[1].setSeconds(0);
                        filter.betweenDate = filter.date[0].getTime() + ',' + (filter.date[1].getTime()+3600*24*1000-1);
                        delete filter.date;
                    }else{
                        filter.betweenDate = '';
                        delete filter.date; 
                    }
                    return filter
                },
                fields: [{
                    label: '',
                    name: 'hospitalId',
                    widget: 'select',
                    style: {
                        width: '200px'
                    },
                    changeFilter: true,
                    defaultFirst: true,
                    textPlace: 'name',
                    valuePlace: 'id',
                    data: () => {
                        var para = {};
                        para.pageNumber = 0;
                        para.pageSize = 800;
                        para.order = 'DESC';
                        para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        para.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
                        para.userId = GlobalService.getCurrentUserSync().user.userId;
                        return CloudClinicStore.getRelationHospital(para).then(res => {
                            res.rows.unshift({
                                id: 'ALL',
                                hospitalId: 　'ALL',
                                name: '全部'
                            });
                            return res.rows
                        })
                    }
                }, {
                    label: '',
                    name: 'date',
                    placeholder: '日期区间',
                    widget: 'date',
                    type: 'daterange'
                },{
                    name: 'keyword',
                    widget: 'search',
                    placeholder: '患者姓名'
                }]
            },
        }
    },
    methods: {
        leftFilter(f) {
            Object.assign(this.filter, f);
            this.filterInited && this.$refs.table.search(this.filter);
            this.filterInited = true;
        },
        rightFilter(f) {
            Object.assign(this.filter, f);
            this.filterInited && this.$refs.table.search(this.filter);
            this.filterInited = true;
        },
        refresh(data) {
            if (data) {
                this.patientList = data;
            } else {
                this.nothingData = true;
            }
        },
        datail(data) {
            if (data.flow.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus', 'Wait')) {
                CloudClinicStore.receiveClinic({ flowId: data.flow.id }).then(res => {
                    this.$refs.table.refresh();
                    Router.go(`/CloudClinic/patient/${data.patient.id}/${data.flow.id}`)
                })
            } else {
                Router.go(`/CloudClinic/patient/${data.patient.id}/${data.flow.id}`)
            }
        }
    },
    watch: {
        currentPatientId(v) {
            if (!v) {
                this.$refs.table.refresh();
            }
        }
    }
}
</script>