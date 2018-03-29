<style lang="sass">
    .task-remotetask-container {
        height: 100%;
        width: 100%;
        overflow:auto;
        .main_content{
            position:absolute;
            right:0;
            left:130px;
            top:0;
            bottom:0;
            .flow_list_filter{
                width:100%;
                height:58px;
                background:#f2f2f2;
                padding:10px 20px;
                & ul>li{
                    float:left;
                    border:1px solid #ccc;
                    background:#fff;
                    height:40px;
                    line-height:38px;
                    padding: 0 16px;
                    font-size:14px;
                    cursor:pointer;
                    position:relative;
                    &:hover{
                        color:#39f;
                    }
                }
                .active{
                    color:#39f;
                    border-color:#39f;
                }
                & ul>li:first-child{
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }
                & ul>li:last-child{
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            }
            .flow_list_body{
                padding-top:20px;
                .left_filter{
                    display:inline-block;
                    &.waiting{
                        .sunset-field-wrap .ivu-radio-group-button>label:first-child{
                            position:relative;
                            &:after{
                                content:'';
                                position: absolute;
                                top:6px;
                                right:10px;
                                border-radius:50%;
                                height:5px;
                                width:5px;
                                background:red;
                            }
                        }
                    }
                    &.finished{
                        .sunset-field-wrap .ivu-radio-group-button>label:last-child{
                            position:relative;
                            &:after{
                                content:'';
                                position: absolute;
                                top:6px;
                                right:10px;
                                border-radius:50%;
                                height:5px;
                                width:5px;
                                background:red;
                            }
                        }
                    }
                }
                .patient-flows-wrapper{
                    padding:0 20px;     
                    .no_data {
                        margin: 140px auto;
                        height: 400px;
                        width: 400px;
                        background: url(/assets/img/nodata.png) no-repeat;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="task-remotetask-container">
        <div v-show="!flowId" style="height:100%;">
            <div class="left_sidebar">
                <ul>
                    <li v-for="item in flowTabs" :class="[item.name=='我的任务'?'active':'']" @click="chooseBody(item)">{{item.name}}</li>
                </ul>
            </div>
            <div class="main_content">
                <div class="flow_list_body">
                    <div style="overflow: hidden;margin-bottom: 15px;padding:0 20px">
                        <div style="display:inline-block;" class="left_filter">
                            <sunset-filter v-ref:leftfilter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
                        </div>
                        <sunset-filter v-ref:rightfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
                    </div>
                    <div class="patient-flows-wrapper">
                        <sunset-datapage  v-ref:datapage :options="options" @refresh="refresh">
                            <remote-item v-for="item in flowList" :flow="item" :actived="currentItem.name" @check="checkFlow" @checked="addVideo"></remote-item>
                            <div class="no_data" v-show="nothingData"></div>
                        </sunset-datapage>
                    </div>
                </div>
            </div>
        </div>
        <sunset-form-modal v-ref:advideo :options="modeloptions"></sunset-form-modal>
        <div class="patient-detail-wrap" v-if="flowId">
            <patient-detail :patient-id="patientId" :flow-id="flowId" :sidebar="patientDetailSidebar" :edit="true"></patient-detail>
        </div>
    </div>
</template>

<script>
    import ConsultationStore from "./Store.js";
    import PatientDetail from "../PatientDetail/PatientDetail";
    import RemoteItem from "./DicomItem";
    import Store from '../FlowData/Store';

    export default {
        computed: {
            flowId(){
                return this.$route.params.flowId;
            },
            patientId(){
                return this.$route.params.patientId;
            }
        },
        components:{
            RemoteItem,
            PatientDetail
        },
        ready(){
            this.getOrganizeList();
            GlobalService.ListenFlowHasNew('remoteflow',(status)=>{
                this.currentStatus = status;
                if(this.currentStatus.toMe.processed){
                    $('.left_filter').addClass('waiting')
                }else{
                    $('.left_filter').removeClass('waiting')
                };    
                if(this.currentStatus.toMe.unprocessed){
                    $('.left_filter').addClass('finished')
                }else{
                    $('.left_filter').removeClass('finished')
                };  
                this.flowTabs.map(item=>{
                    if(item.name=='我的任务'){
                        if(status.toMe.hasNew){
                            $('.left_sidebar li:first-child').addClass('hasNew')
                        }else{
                            $('.left_sidebar li:first-child').removeClass('hasNew')
                        }
                    }else if(item.name=='咨询列表'){
                        if(status.fromMe.hasNew){
                            $('.left_sidebar li:last-child').addClass('hasNew')
                        }else{
                            $('.left_sidebar li:last-child').removeClass('hasNew')
                        }
                    }
                });
            })
        },
        data() {
            return {
                myTask:{},
                flowList:[],
                currentStatus:{},
                currentItem:{
                    name: "我的任务",
                    id: GlobalService.getCurrentUserSync().user.userId,
                    category: '0000000'
                },
                flowTabs:[{
                        name: "我的任务",
                        id: GlobalService.getCurrentUserSync().user.userId,
                        category: '0000000'
                    },{
                        name:"咨询列表",
                        id: GlobalService.getCurrentUserSync().user.userId,
                        category: ''
                    }
                ],
                nothingData:false,
                filter: {
                    order:"DESC"
                },
                filterInited: false,
                options: {
                    lazy : true,
                    pageNumberStart: 0,
                    pageSize: 5,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        filter.type = 'remoteflow',
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        // filter.fromType = "0401001";
                        if(filter.fromEntityId=='ALL'){
                            // filter.fromEntityId =GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            filter.fromEntityId ="";
                        };
                        if(filter.targetEntityIds=='ALL'){
                            filter.targetEntityIds = Object.keys(this.myTask).filter(v=>v!='ALL').join(',');

                            var ss = GlobalService.getCurrentUserSync().relation.office.id;
                            filter.targetEntityIds +=","+ss;
                        };
                        return ConsultationStore.list(filter);
                    }
                },
                leftFilterOps: {
                    fields: [{
                        name: 'status',
                        widget: 'radio',
                        type: 'button',
                        default: Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING'),
                        valuePlace: 'key',
                        textPlace: 'value',
                        changeFilter: true,
                        data:()=>{
                            var enums = Sunset.Service.Dictionary.getEnums('FLOW_STATUS');
                            return enums;
                            // return enums.map(item=>{
                            //     item.value = `<span id=${item.alias}>${item.value}</span>`;
                            //     return item
                            // });
                        }
                    }],
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
                    format: (filter) => {
                        if (filter.keyword) {
                            filter.keyword = filter.keyword.trim();
                        } else {
                            filter.keyword = ""
                        };
                        if (filter.date && filter.date[0] && filter.date[1]) {
                            filter.date[0].setHours(0);
                            filter.date[0].setMinutes(0);
                            filter.date[0].setSeconds(0);
                            filter.date[1].setHours(0);
                            filter.date[1].setMinutes(0);
                            filter.date[1].setSeconds(0);
                            filter.betweenDate = filter.date[0].getTime() + ',' + (filter.date[1].getTime() + 3600 *
                                24 * 1000 - 1);
                            delete filter.date;
                        } else {
                            filter.betweenDate = '';
                            delete filter.date;
                        }
                        return filter
                    },
                    fields: [{
                        label: '',
                        name: 'targetEntityIds',
                        style:'width:130px',
                        default: 'ALL',
                        // clearable:true,
                        widget: 'select',
                        data:()=>{
                            return this.myTask
                        }
                    },{
                        label: '',
                        name: 'fromEntityId',
                        style:'width:130px',
                        placeholder: '来自医院',
                        default: 'ALL',
                        widget: 'select',
                        data:()=>{
                            var hospitalList = {'ALL':'全部'};
                            Promise.all(
                                Object.keys(this.myTask).filter(v=>v!='ALL').map(id=>{
                                return ConsultationStore.getHospitals(id);
                            })).then(res=>{
                                res.forEach(item=>{
                                    item.forEach(value=>{
                                        if(value.partyaCategory==Sunset.Service.Dictionary.alias('ORG_CODE','HOSPITAL')){
                                            if(value.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','remoteflow')){
                                                hospitalList[value.partyaMemberId]=value.partya&&value.partya.name;
                                            }
                                        }
                                    });
                                });
                                this.rightFilterOps.fields[1].data = hospitalList;
                            });
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
                modeloptions: {
                    title: '预约视频',
                    width: 1000,
                    style: 'max-height:400px;text-align:left;',
                    formOptions: {
                        cols: 2,
                        tools: false,
                        title:"预约视频",
                        fields: [{
                            label:"预约时间：",
                            name: 'videoStartDate',
                            widget:'date',
                            type : 'datetime',
                            format:"yyyy-MM-dd HH:mm",
                            cols:10,
                            disabledDate : function(d){
                                return d.getTime() < Date.now()-86400000;
                            },                            
                            default:Date.now(),
                            validate: {
                                required: true,
                                videoStartDate: true
                            },
                            }
                        ],
                        format: (model) => {
                            var subarr=[]
                           
                            var submsg={
                                videoStartDate:model.videoStartDate && model.videoStartDate.getTime(),
                                isRequestVideo:true,
                                patientid:model.subdata[0],
                                flowId:model.subdata[1],
                                type : "remoteflow",
                            }
                            subarr.push(submsg);
                            return subarr;
                        },
                        submit: (m) => {
                            return Store.submitFlow(m).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$emit('submited');
                                this.$refs.advideo.cancel();
                                this.itemrefresh();
                            });
                        }
                    }
                }
            }
        },
        methods: {
            getOrganizeList(){
                this.myTask.ALL = '全部任务';
                var list = GlobalService.getCurrentUserSync().relation;
                this.myTask[GlobalService.getCurrentUserSync().user.userId]='个人';
                this.myTask[list.hospital[0].id]=list.hospital[0].name;
                list.teams.forEach(item=>{
                    this.myTask[item.id]=item.name;
                });
                var targetEntityIds = Object.keys(this.myTask).slice(1).join(',');
                Object.assign(this.filter, {targetEntityIds:targetEntityIds,queryType:1,applyUserId:null});
                return this.myTask;
            },
            chooseBody(item){
                if(item.name=="咨询列表"){
                    Router.go('/RemoteReport/flowconsulting');
                }else if(item.name=="我的任务"){
                }
            },
            leftFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            refresh(data){
                // if(data==undefined){
                //     this.$refs.datapage.refresh();
                //     return
                // }
                this.flowList = data;
                if (!data.length) {
                    this.nothingData = true;
                } else {
                    this.nothingData = false;
                }
            },
            checkFlow(data){
                this.flowId = data[1];
                this.patientId = data[0];
                Router.go(`/RemoteReport/flowtask/${data[0]}/${data[1]}`);
            },
            finishClinic(flowId) {
                var clear = Sunset.confirm({
                    content: '是否要结束问诊？',
                    loading: true,
                    onOk: () => {
                        return ConsultationStore.finishClinic(flowId).then(res => {
                            clear();
                            this.$refs.table.refresh();
                        }).catch(e=>{
                            clear();
                        })
                    }
                });
            },
            addVideo(data){
                this.$refs.advideo.open({
                    subdata:data,
                });
            },
            // addVideo(data){
            //     this.$emit('checked',[data[0], data[1]]);
            // },
            itemrefresh(){
                this.$refs.datapage.refresh();
                // this.$refs.flowtask.refresh();
                // Router.go('/RemoteReport/flowtask');
            },

        }
    }
</script>