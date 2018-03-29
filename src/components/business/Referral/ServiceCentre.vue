<style lang="sass">
    .transfer-in-container {
        height: 100%;
        width: 100%;
        overflow:auto;
        .sunset-field-label{
            text-align:left;
        }
        .flow_list_body{
            position:absolute;
            right:0;
            left:130px;
            top:0;
            bottom:0;
            padding-top:20px;
            .left_filter{
                display:inline-block;
            }
            .patient-flows-wrapper{
                padding: 0 20px;
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
    <div class="transfer-in-container">
        <div  v-show="!flowId" style="height:100%;">
            <div class="left_sidebar">
                <ul>
                    <li v-for="item in flowBodyList" :class="[item.name=='服务中心'?'active':'']" @click="chooseBody(item)">{{item.name}}</li>
                </ul>
            </div>
            <div class="flow_list_body">
                <div style="overflow: hidden;margin-bottom: 15px;padding:0 20px">
                    <div class="left_filter">
                        <sunset-filter v-ref:leftfilter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
                    </div>
                    <sunset-filter v-ref:rightfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
                </div>
                <div class="patient-flows-wrapper">
                    <sunset-datapage  v-ref:datapage :options="options" @refresh="refresh">
                        <referral-item v-for="item in flowList" :flow="item" :actived="currentItem.name" @check="checkFlow" @transferflow="transferFlow(item)"></flow-item>
                    </sunset-datapage>
                    <div class="no_data" v-show="nothingData"></div>
                </div>
            </div>
        </div>
        <div class="patient-detail-wrap" v-if="flowId">
            <patient-detail :patient-id="patientId" :flow-id="flowId" :sidebar="patientDetailSidebar" :edit="true"></patient-detail>
        </div>
        <sunset-form-modal v-ref:transfermodal :options="{title : '转发（分诊）',width :600, style : 'max-height:400px', formOptions:transferOptions}">
        </sunset-form-modal>
    </div>
</template>

<script>
    import ReferralStore from "./ReferralStore.js";
    import PatientDetail from "../PatientDetail/PatientDetail";
    import ReferralItem from "./ReferralItem";

    export default {
        computed: {
            flowId(){
                return this.$route.params.flowId;
            },
            patientId(){
                return this.$route.params.patientId;
            },
            targetDept(){
                if(this.currentFlow.flow.target.category.indexOf("02")==0){
                    return this.currentFlow.flow.target.memberId
                }else{
                    var dept=[];
                    this.currentFlow.flow.target.uppers.forEach(item=>{
                        if(item.category.indexOf("02")==0){
                            dept.push(item.memberId)
                        }
                    });
                    return dept[0]
                }
            },
            targetDoctor(){
                if(this.currentFlow.flow.target.category.indexOf("00")==0){
                    return this.currentFlow.flow.target.memberId
                }
            }
        },
        components:{
            ReferralItem,
            PatientDetail
        },
        ready(){
            this.initMenu();
            GlobalService.ListenFlowHasNew('transfertreatment',(status)=>{
                this.currentStatus = status;
                if(this.currentStatus.in.processed){
                    $('.left_filter').addClass('waiting')
                }else{
                    $('.left_filter').removeClass('waiting')
                };    
                if(this.currentStatus.out.unprocessed){
                    $('.left_filter').addClass('finished')
                }else{
                    $('.left_filter').removeClass('finished')
                };  
                this.flowBodyList.map(item=>{
                    if(item.name=='转入'){
                        if(status.in.hasNew){
                            $('.left_sidebar li:nth-child(1)').addClass('hasNew')
                        }else{
                            $('.left_sidebar li:nth-child(1)').removeClass('hasNew')
                        }
                    }else if(item.name=='转出'){
                        if(status.out.hasNew){
                            $('.left_sidebar li:nth-child(2)').addClass('hasNew')
                        }else{
                            $('.left_sidebar li:nth-child(2)').removeClass('hasNew')
                        }
                    }else if(item.name=='服务中心'){
                        if(status.serviceCenter.hasNew){
                            $('.left_sidebar li:nth-child(3)').addClass('hasNew')
                        }else{
                            $('.left_sidebar li:nth-child(3)').removeClass('hasNew')
                        }
                    }
                });
            });
            var yewukeshi = GlobalService.getCurrentUserSync().relation.isBelongToBusinessOffice();
            var fuwuzhongxin = GlobalService.getCurrentUserSync().relation.isBelongToOfficeCategory('0203002');
            // if(yewukeshi){
            // }else{
            //     $('.left_sidebar li:nth-child(1)').hide();
            //     $('.left_sidebar li:nth-child(2)').hide();
            // }
            if(fuwuzhongxin){
            }else{
                $('.left_sidebar li:nth-child(3)').hide();
            }
        },
        data() {
            return {
                currentFlow:{},
                nothingData:false,
                flowList:[],
                currentItem: {
                    name: "转入",
                    id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                },
                flowBodyList:[{
                        name: "转入",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                    },{
                        name: "转出",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                    },{
                        name:"服务中心",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                    }
                ],
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
                        filter.type = 'transfertreatment',
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        if(filter.fromEntityId=='ALL'){
                            filter.fromEntityId =''
                        };
                        // GlobalService.getCurrentUserSync().relation.officesDesc;
                        filter.currentUserRoles = GlobalService.getCurrentUserSync().relation.adminOfficesDesc;
                        filter.queryType = Sunset.Service.Dictionary.alias('FLOW_QUERY_TYPE','REFERRAL_CENTER');
                        filter.extension= filter.extension=='ALL'?(void 0):filter.extension;
                        return ReferralStore.list(filter);
                    }
                },
                transferOptions:{
                    cols: 2,
                    submit:(model)=>{
                        var param = {
                            flowId:this.currentFlow.flow.id,
                            hospitalId:GlobalService.getCurrentUserSync().relation.hospital[0].id,
                            redirectId:model.forwarddoctor,
                            remark:model.forwardnotes
                        };
                        return ReferralStore.redirectFlow(param).then(res=>{
                            Sunset.tip("转发成功","success");        
                            this.$refs.datapage.refresh();
                        });
                    },
                    fields: [{
                            label: '目标科室',
                            name: 'forwarddept',
                            widget: 'select',
                            validate: {
                                required: true
                            },
                            data:()=>{
                                return ReferralStore.getOwnHospitalOffices(true).then(res=>{
                                    var list={};
                                    res.forEach(item=>{
                                        list[item.memberId]=item.name
                                    });
                                    return list
                                });
                            }
                        },{
                            label: '目标医生',
                            name: 'forwarddoctor',
                            widget: 'select',
                            data:()=>{
                                return ReferralStore.getOwnHospitalDoctors(false).then(res=>{
                                    var list={};
                                    res.forEach(item=>{
                                        list[item.memberId]=item.name
                                    });
                                    return list
                                });
                            }
                        }, {
                            label: '备注',
                            name: 'forwardnotes',
                            widget: 'textarea',
                            monopolize: true
                        }
                    ],
                    tools: false
                },
                leftFilterOps: {
                    fields: [{
                        name: 'extension',
                        widget: 'radio',
                        type: 'button',
                        defaultFirst: true,
                        changeFilter: true,
                        data : [
                            {
                                text:"未分诊",
                                value:'{"hasBeenTriage":'+0+'}'
                            },
                            {
                                text:"全部",
                                value:"ALL"
                            }
                        ]
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
                        name: 'fromhospital',
                        style:'width:200px',
                        placeholder: '来自医院',
                        widget: 'select',
                        premise:()=>{
                            return this.currentItem.name!='转出'
                        },
                        data:()=>{
                            var hospitalList = {'ALL':'全部'};
                            return $http({
                                url: '/service/business/scenes/partyb',
                                type: 'GET',
                                data: {
                                    // scenesId:'3201ea212fac44db972ce3adb286a3f8',
                                    partybId: this.currentItem.id
                                }
                            }).then(res=>{
                                res.forEach(item=>{
                                    if(item.partyaCategory==Sunset.Service.Dictionary.alias('ORG_CODE','HOSPITAL')){
                                        if(item.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','difficultyflow')){
                                            hospitalList[item.partyaMemberId]=item.partya.name;
                                        }
                                    }
                                });
                                this.rightFilterOps.fields[0].data = hospitalList;
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
            initMenu(){
                var targetEntityIds = GlobalService.getCurrentUserSync().relation.office.id + ',' + GlobalService.getCurrentUserSync().user.userId;
                Object.assign(this.filter, {targetEntityIds:targetEntityIds,queryType:3,fromEntityId:null});
            },
            chooseBody(item){
                if(item.name=="转出"){
                    Router.go('/Referral/TransferOut');
                    return;
                    this.flowList = [];
                    this.currentItem = item;
                    var hospitalList = {'ALL':'全部'};
                    $http({
                        url: '/service/business/scenes/partyb',
                        type: 'GET',
                        data: {
                            // scenesId:'3201ea212fac44db972ce3adb286a3f8',
                            partybId: this.currentItem.id
                        }
                    }).then(res=>{
                        res.forEach(item=>{
                            if(item.partyaCategory==Sunset.Service.Dictionary.alias('ORG_CODE','HOSPITAL')){
                                if(item.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','difficultyflow')){
                                    hospitalList[item.partyaMemberId]=item.partya.name;
                                }
                            }
                        });
                        this.rightFilterOps.fields[0].data = hospitalList;
                    });
                    this.rightFilterOps.fields[0].data={'ALL':'全部'};
                    this.filterInited && this.$refs.datapage.setFilter(this.filter);
                    this.filterInited = true;
                }else if(item.name=="转入"){
                    Router.go('/Referral/TransferIn');
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
                Router.go(`/Referral/TransferIn/${data[0]}/${data[1]}`);
            },
            transferFlow(flow){
                this.currentFlow = flow;
                this.$refs.transfermodal.open({
                    forwarddept:this.targetDept,
                    forwarddoctor:this.targetDoctor
                });
            }
        },
        watch:{
            flowId(){
                this.$refs.datapage.refresh();
            }
        }
    }
</script>