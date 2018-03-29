<style lang="sass">
    .consult-view-container {
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
    <div class="consult-view-container">
        <div v-show="!flowId" style="height:100%;">
            <div class="left_sidebar">
                <ul>
                    <li v-for="item in flowTabs" :class="[item.name=='咨询列表'?'active':'']" @click="chooseBody(item)">{{item.name}}</li>
                </ul>
            </div>
            <div class="main_content">
                <div class="flow_list_body">
                    <div style="overflow: hidden;margin-bottom: 15px;padding:0 20px">
                        <sunset-filter v-ref:rightfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
                    </div>
                    <div class="patient-flows-wrapper">
                        <sunset-datapage  v-ref:datapage :options="options" @refresh="refresh">
                            <flow-item v-for="item in flowList" :flow="item" :actived="currentItem.name" @check="checkFlow" @checked="addVideo"></flow-item>
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
    import ConsultationStore from "./ConsultationStore.js";
    import PatientDetail from "../PatientDetail/PatientDetail";
    import FlowItem from "./FlowItem";

    export default {
        computed: {
            path(){
                return this.$route.path;
            },
            flowId(){
                return this.$route.params.flowId;
            },
            patientId(){
                return this.$route.params.patientId;
            }
        },
        components:{
            FlowItem,
            PatientDetail
        },
        ready(){
            GlobalService.ListenFlowHasNew('difficultyflow',(status)=>{
                this.currentStatus = status;
                if(this.currentStatus.toMe.unprocessed){
                    $('.left_filter').addClass('waiting')
                }else{
                    $('.left_filter').removeClass('waiting')
                };    
                if(this.currentStatus.toMe.processed){
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
            });
        },
        data() {
            return {
                myTask:{},
                flowList:[],
                currentStatus:{},
                currentItem:{
                    name: "咨询列表",
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
                    lazy : false,
                    pageNumberStart: 0,
                    pageSize: 5,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        filter.type = 'difficultyflow',
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        if(filter.hospitalId=='ALL'){
                            filter.hospitalId =''
                        };
                        filter.queryType = 2;
                        filter.status = '1,2';
                        filter.applyUserId = GlobalService.getCurrentUserSync().user.userId;
                        return ConsultationStore.list(filter);
                    }
                },
                leftFilterOps: {
                    fields: [],
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
                                type : "difficultyflow",
                            }
                            subarr.push(submsg);
                            return $http({
                                url: '/service/business/baseflow',
                                type: 'POST',
                                json:true,
                                data:subarr
                            }).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$refs.advideo.cancel();
                                this.itemrefresh();
                            })
                        }
                        
                    }
                }
            }
        },
        methods: {
            chooseBody(item){
                if(item.name=="我的任务"){
                    Router.go('/DifficultConsultation/MyTask');
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
            rightFilter1(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            refresh(data){
                var newurl = `/sw-service/im/message/room/has_new?clientId=${GlobalService.getCurrentUserSync().user.userId}&clientType=PERSONNEL`;
                return $http({
                    url: newurl,
                    type: 'GET',
                    json: true,
                }).then(res =>{
                }).catch(res =>{
                    data.forEach(item=>{
                    for(var k in res){
                        item.flow.id==k?item.imhasnew=true:item.imhasnew=false;
                    }
                })
                this.flowList = data;
                })
                if (!data.length) {
                    this.nothingData = true;
                } else {
                    this.nothingData = false;
                }
            },
            checkFlow(data){
                this.flowId = data[1];
                this.patientId = data[0];
                Router.go(`/DifficultConsultation/ConsultList/${data[0]}/${data[1]}`);
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
            itemrefresh(){
                this.$refs.datapage.refresh();
            },
        },
        watch : {
            path(){
                // var newurl = `/sw-service/im/message/room/has_new?clientId=${GlobalService.getCurrentUserSync().user.userId}&clientType=PERSONNEL`;
                // return $http({
                //     url: newurl,
                //     type: 'GET',
                //     json: true,
                // }).then(res =>{
                // }).catch(res =>{
                //     // var newlist=[];
                //     this.flowList&&this.flowList.forEach(item=>{
                //         for(var k in res){
                //             item.flow.id==k?item.imhasnew=true:item.imhasnew=false;
                //             // newlist.push(item)
                //         }
                //     })
                // this.flowList = this.flowList;
                // })
                this.$refs.datapage.refresh();
            }
        }
    }
</script>