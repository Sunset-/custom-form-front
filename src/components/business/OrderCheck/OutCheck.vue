<style lang="sass">
    .transfer-out-container {
        height: 100%;
        width: 100%;
        overflow:auto;
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
    <div class="transfer-out-container">
        <div  v-show="!flowId" style="height:100%;">
            <div class="left_sidebar">
                <ul>
                    <li v-for="item in flowBodyList" :class="[item.name=='转出'?'active':'']" @click="chooseBody(item)">{{item.name}}</li>
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
                        <check-item v-for="item in flowList" :flow="item" :actived="currentItem.name" @check="checkFlow" @refreshlist="refreshList"></check-item>
                    </sunset-datapage>
                    <div class="no_data" v-show="nothingData"></div>
                </div>
            </div>
        </div>
        <div class="patient-detail-wrap" v-if="flowId">
            <patient-detail :patient-id="patientId" :flow-id="flowId" :sidebar="patientDetailSidebar" :edit="true"></patient-detail>
        </div>
        <sunset-view-modal v-ref:tipmodal :options="tipModalOptions">
            <p style='font-size:14px;text-align:center'>患者已转出，此转诊申请失效</p>
        </sunset-view-modal>
    </div>
</template>

<script>
    import ReferralStore from "./ReferralStore.js";
    import PatientDetail from "../PatientDetail/PatientDetail";
    import CheckItem from "./CheckItem";

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
            CheckItem,
            PatientDetail
        },
        ready(){
            this.initMenu();
            this.getHasNew();
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
                nothingData:false,
                flowList:[],
                tipModalOptions:{
                    title: '提示',
                    width: 500,
                    height:500,
                    toolbar:[{
                        label:"确定",
                        color:"warning",
                        operate:()=>{
                            this.$refs.tipmodal.cancel();
                            this.$refs.datapage.refresh();
                        }
                    }]
                },
                currentItem: {
                    name: "转出",
                    id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                },
                flowBodyList:[{
                        name: "转入",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                    },{
                        name: "转出",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                    }
                    // ,{
                    //     name: "服务中心",
                    //     id: GlobalService.getCurrentUserSync().relation.hospital[0].id
                    // }
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
                        filter.type = 'ordercheck',
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        filter.fromEntityId = GlobalService.getCurrentUserSync().relation.hospital[0].id || GlobalService.getCurrentUserSync().user.userId;
                        if(filter.fromEntityId=='ALL'){
                            filter.fromEntityId =''
                        };
                        filter.queryType = 4;
                        if(filter.status==Sunset.Service.Dictionary.alias('REFERRAL_OUT_STATUS','FINISHED')){
                            filter.extension= JSON.stringify({detailStatus:filter.status,reservationType:Sunset.Service.Dictionary.alias('RESERVATION_TYPE','CHECKUP'),isIncludePassiveClosed:true});
                        }else{
                            filter.extension= JSON.stringify({detailStatus:filter.status});
                        };
                        return ReferralStore.list(filter);
                    }
                },
                leftFilterOps: {
                    fields: [{
                        name: 'status',
                        widget: 'radio',
                        type: 'button',
                        default: Sunset.Service.Dictionary.alias('ORDER_CHECK','pending'),
                        valuePlace: 'key',
                        textPlace: 'value',
                        changeFilter: true,
                        data() {
                            var enums = Sunset.Service.Dictionary.getEnums('ORDER_CHECK');
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
                        };
                        if(filter.operatetype!=="ALL"){
                            // filter.status = filter.operatetype;
                        }
                        return filter
                    },
                    fields: [{
                        label: '',
                        name: 'operatetype',
                        style:'width:200px',
                        default: 'ALL',
                        widget: 'select',
                        premise:()=>{
                            return false
                        },
                        data:()=>{
                            return {
                                "ALL":"全部",
                                "1":"未审核通过",
                                "4":"同意接收",
                                "3":"无法接收",
                                "5":"已撤销"
                            }
                        }
                    },{
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
            getHasNew(){
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
                        }
                        else if(item.name=='服务中心'){
                            if(status.serviceCenter.hasNew){
                                $('.left_sidebar li:nth-child(3)').addClass('hasNew')
                            }else{
                                $('.left_sidebar li:nth-child(3)').removeClass('hasNew')
                            }
                        }
                    });
                });
            },
            initMenu(){
                Object.assign(this.filter, {fromEntityId:GlobalService.getCurrentUserSync().relation.hospital[0].id,queryType:4,targetEntityIds:null});
            },
            chooseBody(item){
                if(item.name=="转入"){
                    Router.go('/OrderCheck/InCheck');
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
                                if(item.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','ordercheck')){
                                    hospitalList[item.partyaMemberId]=item.partya.name;
                                }
                            }
                        });
                        this.rightFilterOps.fields[0].data = hospitalList;
                    });
                    this.rightFilterOps.fields[0].data={'ALL':'全部'};
                    this.filterInited && this.$refs.datapage.setFilter(this.filter);
                    this.filterInited = true;
                }else if(item.name=="服务中心"){
                    Router.go('/Referral/ServiceCentre');
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
            refreshList(){
                this.$refs.datapage.refresh();
            },
            refresh(data){
                if(data){
                    this.flowList = data;
                };
                if (!data.length) {
                    this.nothingData = true;
                } else {
                    this.nothingData = false;
                }
            },
            checkFlow(data){
                return $http({
                    url: `/service/business/baseflow/${data[1]}`,
                    type: 'GET',
                }).then(res=>{
                    if(res&&res.hasPassiveClosed&&data[2]!='finish'){
                        this.$refs.tipmodal.open();
                    }else{
                        this.flowId = data[1];
                        this.patientId = data[0];
                        Router.go(`/OrderCheck/OutCheck/${data[0]}/${data[1]}`);
                    }
                })
            }
        },
        watch:{
            flowId(){
                this.refreshList();
            }
        }
    }
</script>