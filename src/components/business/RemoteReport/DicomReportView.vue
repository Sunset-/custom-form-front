<style lang="sass">
    .doctor-reportv-container {
        height: 100%;
        width: 100%;
        overflow:auto;
        .flow_list_filter{
            widtg:100%;
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
                &.hasNew:before{
                    content:'';
                    position: absolute;
                    top:10px;
                    right:10px;
                    border-radius:50%;
                    height:5px;
                    width:5px;
                    background:red;
                }
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
</style>

<template>
    <div class="doctor-reportv-container">
        <div  v-if="!currentFlowId">
            <div class="flow_list_filter">
                <ul>
                    <li v-for="item in flowBodyList" :class="[currentItem.name==item.name?'active':'',item.hasNew?'hasNew':'']" @click="chooseBody(item)">{{item.name}}</li>
                </ul>
                <!-- ,item.hasNew?'hasnew':'' -->
            </div>
            <div class="flow_list_body">
                <div style="overflow: hidden;margin-bottom: 15px;padding:0 20px">
                    <sunset-filter v-show="!wodezixun" v-ref:leftfilter :options="leftFilterOps" @filter="leftFilter" class="left_filter"></sunset-filter>
                    <sunset-filter v-ref:rightfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
                </div>
                <div class="patient-flows-wrapper">
                    <sunset-datapage  v-ref:datapage :options="options" @refresh="refresh">
                        <flow-item v-for="item in flowList" :flow="item" :actived="activedTab" @check="checkFlow"></flow-item>
                        <div class="no_data" v-show="nothingData"></div>
                    </sunset-datapage>
                </div>
            </div>
        </div>
        <div class="patient-detail-wrap" v-if="currentFlowId">
            <patient-detail :patient-id="currentPatientId" :flow-id="currentFlowId" :sidebar="patientDetailSidebar" :edit="true"></patient-detail>
        </div>
    </div>
</template>

<script>
    import ConsultationStore from "./Store.js";
    import PatientDetail from "../PatientDetail/PatientDetail";
    import FlowItem from "./DicomItem";
    import MedicalDataStore from '../MedicalData/MedicalDataStore';

    export default {
        computed: {
            currentPatientId() {
                return this.$route.params.patientId;
            },
            currentFlowId() {
                return this.$route.params.flowId;
            }
        },
        props:{
            flow:{},
        },
        components:{
            FlowItem,
            PatientDetail
        },
        ready(){
            this.initMenu();                                                
            GlobalService.ListenFlowHasNew('remoteflow',(status)=>{
                this.currentStatus = status;
                if(this.currentStatus.toMe.processed){
                    // alert("tome");
                    $('.left_filter').addClass('waiting')
                }else{
                    $('.left_filter').removeClass('waiting')
                };    
                if(this.currentStatus.toMe.unprocessed){
                    $('.left_filter').addClass('finished')
                }else{
                    $('.left_filter').removeClass('finished')
                };  
                this.flowBodyList = this.flowBodyList.map(item=>{
                    if(item.name=='个人'){
                        item.hasNew = status.toMe.hasNew;
                    }else if(item.name=='我的咨询'){
                        item.hasNew = status.fromMe.hasNew
                    }else if(status.toEntities[item.id]){
                        item.hasNew = status.toEntities[item.id].hasNew;
                    }else{
                        item.hasNew = false
                    };
                    if(item.hasNew){
                        $(`.${item.id}`).addClass('hasNew')
                    }; 
                    // $("."+item.id+"").removeClass("hasNew");
                    // if(item.name=="个人"){
                    //     if(status.toMe.hasNew)$("."+item.id+"").addClass("hasNew");
                    // }else if(item.name=='我的咨询'){
                    //     if(status.fromMe.hasNew)$("."+item.id+"").addClass("hasNew");
                    // }else if(status.toEntities[item.id].hasNew){
                    //     $("."+item.id+"").addClass("hasNew");
                    // }else{
                    //     // $("."+item.id+"").removeClass("hasNew");
                    // };
                   
                    
                    return item  
                });
            });
            
            
        },
        data() {
            return {
                flowList:[],
                wodezixun:false,
                currentStatus:{},
                currentItem:{
                    name: "个人",
                    id: GlobalService.getCurrentUserSync().user.userId,
                    category: ''
                },
                hospitalList:{'ALL':'全部'},
                flowBodyList:[{
                        name: "个人",
                        id: GlobalService.getCurrentUserSync().user.userId,
                        category: ''
                    },{
                        name: "我的咨询",
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
                    lazy:true,
                    pageNumberStart: 0,
                    pageSize: 5,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        // debugger
                        filter.type = 'remoteflow',//remoteflow  difficultyflow
                        // filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        console.log(GlobalService.getCurrentUserSync().user.userId);
                        if(filter.hospitalId=='ALL'){
                            filter.hospitalId =''
                        };
                        return ConsultationStore.list(filter).then(res=>{
                            this.flowList=res.rows;
                            return res
                        })
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
                        data() {
                            var enums = Sunset.Service.Dictionary.getEnums('FLOW_STATUS');
                            return enums;
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
                        name: 'hospitalId',
                        style:'width:200px',
                        placeholder: '来自医院',
                        widget: 'select',
                        data:()=>{
                            return $http({
                                url: '/service/business/scenes/partyb',
                                type: 'GET',
                                data: {
                                    // scenesId:'3201ea212fac44db972ce3adb286a3f8',
                                    partybId: this.currentItem.id
                                }
                            }).then(res=>{
                                // debugger
                                res.forEach(item=>{
                                    if(item.partyaCategory==Sunset.Service.Dictionary.alias('ORG_CODE','HOSPITAL')){
                                        if(item.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','remoteflow')){
                                            this.hospitalList[item.partyaMemberId]=item.partya.name;
                                        }
                                    }
                                });
                                this.rightFilterOps.fields[0].data = this.hospitalList;
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
            }
        },
        methods: {
            initMenu(status){
                var flowArr=[];
                var pusharr=[];
                var list = GlobalService.getCurrentUserSync().relation;
                // debugger;
                flowArr.push({
                    name:list.hospital[0].name,
                    id:list.hospital[0].id,
                    category:list.hospital[0].category
                });
                list.teams.forEach(item=>{
                    // if(item.toEntities=="个人"&&this.allnew.toMe.hasNew=="true"){isnew=true;alert("true")}
                    flowArr.push({
                        name:item.name,
                        id:item.id,
                        category:item.category
                    })
                });
                flowArr.unshift(this.flowBodyList[0]);
                flowArr.push(this.flowBodyList[1]);
                // if(Object.keys(this.allnew).length>0){
                //     // flowArr.forEach(item=>{
                //     //     debugger
                //     //     var ii = item;
                //     // if(item.name=="个人"){
                //     //     debugger
                //     //     if(this.allnew.toMe.hasNew){item.hasNew=true;}
                //     // }
                //     // flowArr=[]
                //     // flowArr.push(item);                                                
                //     // // if(Entitiesitem.name=="我的咨询"&&this.allnew.toMe.hasNew=="true"){isnew=true;alert("true")}
                //     // })
                //     for(var k in flowArr){
                //         if(flowArr[k].name=="个人"&&this.allnew.toMe.hasNew){flowArr[k].hasNew=true;console.log(flowArr[k])}
                //         if(flowArr[k].name=="我的咨询"){flowArr[k].hasNew=true;console.log(flowArr[k])}
                //     }
                // }
                

                // this.flowBodyList = flowArr;
                this.flowBodyList = Sunset.clone(flowArr);
                Object.assign(this.filter, {targetEntityId:GlobalService.getCurrentUserSync().user.userId,queryType:0,applyUserId:null});
            },
            initFilter(){

            },
            chooseBody(item){
                this.currentItem = item;
                this.flowList = [];
                // debugger
                $http({
                    url: '/service/business/scenes/partyb',
                    type: 'GET',
                    data: {
                        // scenesId:'3201ea212fac44db972ce3adb286a3f8',
                        partybId: this.currentItem.id
                    }
                }).then(res=>{
                    var hospitalList = {'ALL':'全部'};
                    res.forEach(item=>{
                        if(item.partyaCategory==Sunset.Service.Dictionary.alias('ORG_CODE','HOSPITAL')){
                            if(item.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','difficultyflow')){
                                hospitalList[item.partyaMemberId]=item.partya.name;
                            }
                        }
                    });
                    this.rightFilterOps.fields[0].data = hospitalList;
                });
                // this.rightFilterOps.fields[0].data={'ALL':'全部'};
                if(item.name=="我的咨询"){
                    Object.assign(this.filter, {applyUserId:item.id,queryType:null,targetEntityId:null,status:null});
                    this.wodezixun=true;
                }else if(item.name=="个人"){
                    Object.assign(this.filter, {targetEntityId:item.id,queryType:0,applyUserId:null});
                    this.wodezixun=false;
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
                }else{
                    Object.assign(this.filter, {targetEntityId:item.id,queryType:1,applyUserId:null});
                    this.wodezixun=false;
                    if(this.currentStatus.toEntities[item.id]&&this.currentStatus.toEntities[item.id].processed){
                        $('.left_filter').addClass('waiting')
                    }else{
                        $('.left_filter').removeClass('waiting')
                    };    
                    if(this.currentStatus.toEntities[item.id]&&this.currentStatus.toEntities[item.id].unprocessed){
                        $('.left_filter').addClass('finished')
                    }else{
                        $('.left_filter').removeClass('finished')
                    }; 
                }
                this.filterInited && this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
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
                Router.go(`/RemoteReport/flow/${data[0]}/${data[1]}`);
                // Router.go(`/RemoteReport/flowgeren/${data[0]}/${data[1]}`);
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
            }
        },
        
    }
</script>