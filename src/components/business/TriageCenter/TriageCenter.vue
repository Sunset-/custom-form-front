<style lang="sass">
    .triage-container {
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
    }
</style>

<template>
    <div class="triage-container">
        <expert-selector v-ref:selector @submit="submitDoctors"></expert-selector>
        <div class="patients" v-show="currentPatientId?false:true">
            <sunset-filter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
            <sunset-filter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
            <sunset-table v-ref:table :options="options" style="margin-top:10px">
                <img class="no_data" slot="empty" src="/assets/img/nodata.png">
            </sunset-table>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import TriageItem from "./TriageItem";
import DoctorPatientStore from "../DoctorOutpatient/DoctorPatientStore.js";
import TriageCenterStore from "./TriageCenterStore.js";
import ExpertSelector from "../TeamDoctorSelector/TeamDoctorSelector";

export default {
    components: {
        TriageItem,
        ExpertSelector
    },
    computed: {
        currentPatientId() {
            return this.$route.params.patientId;
        }
    },
    data() {
        return {
            triageItemData:null,
            nothingData:false,
            filter: {
                order:"ASC"
            },
            items: [],
            filterInited: false,
            patientList:null,
            options: {
                pageNumberStart: 0,
                pageSize: 12,
                lazy: true,
                columns:[
                    {
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
                        title:"咨询专家/团队",
                        name:"flow.expertUser.name"
                    },{
                        title:"咨询状态",
                        name:"flow.status",
                        style:'width:120px;text-align:center;',
                        format(v){
                            if(v==-1){
                                return '<span style="color:#ff0000">待分诊</span>'
                            }else{
                                return '<span style="color:#aeaeae">已分诊</span>'
                            }
                        }
                    },{
                        title:"就诊时间",
                        name:"registration.registeredDate",
                        format:'DATETIME',
                        style:'width:160px;text-align:center;'
                    }
                ],
                recordTools:[{
                        label:"选择医生",
                        color:"primary",
                        premise:(record)=>{
                            return record.flow.status==-1
                        },
                        operate:(record)=>{
                            this.chooseTriage(record);
                        }   
                    },{
                        label:"查看",
                        color:"primary",
                        operate:(record)=>{
                            Router.go(`/TriageCenter/patient/${record.patient.id}/${record.flow.id}`)
                        }
                    }
                ],
                format: {
                    list: 'rows',
                    count: 'totalCount',
                    pageSize: 'pageSize',
                    currentPage: 'pageNumber'
                },
                datasource: (filter) => {
                    if(filter.hasExpertUser=="All"){
                        delete filter.hasExpertUser;
                    }
                    if(filter.hospitalId==""){
                        delete filter.hospitalId;
                    }
                    var para = Object.assign({},filter);
                    para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                    return TriageCenterStore.list(para).then(res=>{
                        if(!res.rows.length){
                            this.nothingData=true;
                        }else{
                            this.nothingData=false;
                        }
                        return res
                    });
                }
            },
            leftFilterOps: {
                fields: [{
                    name: 'hasExpertUser',
                    widget: 'radio',
                    type: 'button',
                    default :Sunset.Service.Dictionary.alias('TriageStatus','Wait'),
                    valuePlace : 'key',
                    textPlace : 'value',
                    changeFilter : true,
                    data(){
                        return [{
                            key : 'All',
                            value : '全部'
                        }].concat(Sunset.Service.Dictionary.getEnums('TriageStatus'));
                    }
                }],
                toolbar: {
                    tools: [{
                        label: '就诊时间',
                        icon: 'arrow-up-c',
                        color: 'ghost',
                        operate: () => {
                            if(this.filter.order == "DESC"){
                                this.filter.order = "ASC";
                                this.leftFilterOps.toolbar.tools[0].icon = "arrow-down-c";
                            }else{
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
                        width: '150px'
                    },
                    changeFilter: true,
                    defaultFirst: true,
                    textPlace : 'name',
                    valuePlace : 'id',
                    data: () => {
                        var para={};
                        para.pageNumber = 0;
                        para.pageSize = 800;
                        para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        return TriageCenterStore.getHospitalList(para).then(res=>{
                            res.rows.unshift({
                                id : 'ALL',
                                hospitalId :　'ALL',
                                name : '全部'
                            });
                            return res.rows
                        })
                    }
                },{
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
            if(data){
                this.patientList = data;
            }else{
                this.nothingData=true;
            }
        },
        chooseTriage(data) {
            var para={};
            para.pageNumber=0;
            para.pageSize=999;
            para.systemId = GlobalService.getCurrentUserSync().user.systemId;
            para.userType = "Triage";
            // para.order="";
            // para.type="";
            // para.keyword="";
            this.triageItemData = data;
            this.$refs.selector.open(para,data.patient.patientId)
        },
        submitDoctors(data){
            var para={};
            para.flowId = this.triageItemData.flow.id;
            para.expertUserId = data.expertUserId;
            para.expertTeamId = data.expertTeamId;
            TriageCenterStore.saveExperts(para).then(res=>{
                Sunset.tip('提交成功', 'success');
                this.leftFilter();
                this.$refs.selector.cancel();
            })
        },
        detail(data){
            Router.go(`/TriageCenter/patient/${data.patient.id}/${data.flow.id}`)
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