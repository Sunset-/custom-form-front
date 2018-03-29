<style lang="sass">
    .help-desk-container {
        height: 100%;
        width: 100%;
        overflow:auto;
        .sunset-field-label{
            text-align:left;
        }
        .flow_list_body{
            position:absolute;
            right:0;
            left:0;
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
    <div class="help-desk-container">
        <div  v-show="!flowId" style="height:100%;">
            <div class="flow_list_body">
                <div style="overflow: hidden;margin-bottom: 15px;padding:0 20px">
                    <div class="left_filter">
                        <sunset-filter v-ref:leftfilter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
                    </div>
                    <sunset-filter v-ref:rightfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
                </div>
                <div class="patient-flows-wrapper">
                    <sunset-datapage  v-ref:datapage :options="options" @refresh="refresh">
                        <check-item v-for="item in flowList" :flow="item" :actived="currentItem.name" @check="checkFlow" @confirm="confirminhospital" @transferflow="transferFlow(item)"></check-item>
                    </sunset-datapage>
                    <div class="no_data" v-show="nothingData"></div>
                </div>
            </div>
        </div>
        <div class="patient-detail-wrap" v-if="flowId">
            <patient-detail :patient-id="patientId" :flow-id="flowId" :sidebar="patientDetailSidebar" :edit="true"></patient-detail>
        </div>
        <sunset-form-modal v-ref:confirminhospital :options="{title : '确认转诊',width :600, style : 'max-height:400px', formOptions:confirmOptions}" @cancel="cancel">
        </sunset-form-modal>
        <sunset-view-modal v-ref:tipmodal :options="tipModalOptions">
            <p style='font-size:14px;text-align:center'>患者已转出，此转诊申请失效</p>
        </sunset-view-modal>
    </div>
</template>

<script>
    import HelpStore from "./HelpStore.js";
    import PatientDetail from "../PatientDetail/PatientDetail";
    import CheckItem from "./CheckItem";

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
            CheckItem,
            PatientDetail
        },
        ready(){
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
                address:'',
                confirmOptions:{
                    cols: 2,
                    submit:(model)=>{
                        var receiveDeptId = model.dept&&model.dept.slice(model.dept.lastIndexOf(",")+1);
                        var param = {
                            flow: JSON.stringify({
                                id: this.currentFlow.flow.id,
                                extension: Object.assign(this.currentFlow.flow.extension,{
                                    idCard:model.idCard,
                                    receiveUserId:model.doctor,
                                    receiveDeptId:receiveDeptId,
                                    confirmNotes:model.notesIn,
                                    operater:GlobalService.getCurrentUserSync().user
                                }),
                                toHospitalDate:model.totime,
                                receiveDeptId:receiveDeptId,
                                patientNumber:model.patientNo,
                                hospitalizedNumber:model.hospitalNo,
                                receiveUserId:model.doctor   
                            }),
                            patient:JSON.stringify({
                                id:this.currentFlow.patient.id,
                                name:model.name,
                                mobilePhone:model.mobilePhone,
                                idCard: model.idCard,
                                extension: Object.assign(JSON.parse(this.currentFlow.patient.extension),{
                                    name:model.name,
                                    mobilePhone:model.mobilePhone,
                                    idCard: model.idCard,
                                    sex:model.sex,
                                    [this.address]:'现住址,'+model.address,
                                    socialCard:model.socialCard
                                })
                            }),
                            registration:JSON.stringify({
                                digest:this.currentFlow.registration.digest&&Sunset.isString(this.currentFlow.registration.digest)&&Object.assign(JSON.parse(this.currentFlow.registration.digest),{patientAge:model.patientAge}),
                                extension:this.currentFlow.registration.extension&&Sunset.isString(this.currentFlow.registration.extension)&&Object.assign(JSON.parse(this.currentFlow.registration.extension),{patientAge:model.patientAge}),
                                patientAge:model.patientAge,
                                id:this.currentFlow.registration.id
                            })
                        };
                        return $http({
                            url: '/service/business/referralflow/in_confirmed',
                            type: 'POST',
                            data: param
                        }).then(res => {
                            Sunset.tip('操作成功');
                            this.$refs.datapage.refresh();
                            this.nextDeptList=[];
                            $('.tool_bars').css('display','none');
                            this.$refs.confirminhospital.cancel()
                        })
                    },
                    fields: [{
                            label: '患者姓名',
                            name: 'name',
                            widget: 'input',
                            validate:{
                                required: true
                            }
                        },{
                            label:'性别',
                            name:'sex',
                            widget:'radio',
                            enum:'SEX',
                            validate:{
                                required: true
                            }
                        },{
                            label: '年龄',
                            name: 'patientAge',
                            widget: 'number',
                            append: {
                                style: 'width:50px',
                                data: [{
                                    text: '岁',
                                    value: '岁'
                                }, {
                                    text: '月',
                                    value: '月'
                                }, {
                                    text: '天',
                                    value: '天'
                                }]
                            },
                            validate:{
                                required: true,
                                maxlength:5
                            }
                        },{
                            label: '电话',
                            name: 'mobilePhone',
                            widget: 'input',
                            validate:{
                                required: true,
                                phone:true
                            }
                        },{
                            label: '患者身份证',
                            name: 'idCard',
                            widget: 'input',
                            validate:{
                                required: true,
                                IdCard:true
                            }
                        },{
                            label: '家庭住址',
                            name: 'address',
                            widget: 'input'
                        },{
                            label: '医保类型',
                            name: 'medicalCare',
                            widget: 'select',
                            enum:'MEDICARE'
                        },{
                            label: '住院号',
                            name: 'hospitalNo',
                            widget: 'input',
                            validate:{
                                uniqueNumber: true
                            }
                        },{
                            label: '门诊号',
                            name: 'patientNo',
                            widget: 'input',
                            validate:{
                                uniqueNumber: true
                            }
                        },{
                            label: '转入科室',
                            name: 'dept',
                            widget: 'cascader',
                            changeOnSelect : true,
                            _cascadeOffice: true,
                            required: true,
                            data:function(a,b,c){
                                var options = this;
                                return $http({
                                    url: '/service/business/group/tree/{organizationId}'.replace(
                                        /\{organizationId\}/, GlobalService.getCurrentUserSync()
                                        .relation.hospital[0].id),
                                    type: 'GET'
                                }).then(res => {
                                    var Dictionary = Sunset.Service.Dictionary;
                                    var offices = [],
                                        officeMap = {},
                                        officeUsers = {};
                                    function isBusinessOffice(category) {
                                        return category == Dictionary.alias('ORG_CODE',
                                            'CLINICAL') || category == Dictionary.alias(
                                            'ORG_CODE', 'RADIOLOGY');
                                    }

                                    function isDoctor(category) {
                                        return category == Dictionary.alias('ORG_CODE',
                                            'PERSONAL');
                                    }

                                    function addMembers(office, parentId,parentIds) {
                                        var id = office.id;
                                        var name = office.name;
                                        var category = office.category;
                                        if (isBusinessOffice(category)) {
                                            var officeObj = {
                                                label: name,
                                                value: id
                                            };
                                            if (parentId && officeMap[parentId]) {
                                                officeMap[parentId].children = officeMap[
                                                    parentId].children || [];
                                                officeMap[parentId].children.push(officeObj);
                                            } else {
                                                offices.push(officeObj)
                                            }
                                            officeMap[id] = officeObj;
                                        }
                                        parentIds = parentIds.concat([id]);
                                        if (office.members) {
                                            office.members.forEach(m => {
                                                if (isBusinessOffice(m.memberCategory)) {
                                                    addMembers(m.entity, id,parentIds);
                                                } else if (isDoctor(m.memberCategory)) {
                                                    m.entity.memberId = m.id;
                                                    parentIds.forEach(pId=>{
                                                        officeUsers[pId] = officeUsers[pId] ||
                                                            [];
                                                        officeUsers[pId].push(m.entity);
                                                    })
                                                }
                                            })
                                        }
                                    }
                                    if (res) {
                                        res.members && res.members.forEach(function (item) {
                                            if (isBusinessOffice(item.memberCategory)) {
                                                addMembers(item.entity,null,[]);
                                            }
                                        });
                                    }
                                    options.officeUsers = officeUsers;
                                    return offices;
                                })
                            }
                        },{
                            label: '接诊医生',
                            name: 'doctor',
                            widget: 'select',
                            required: true,
                            watch: ['dept', (dep, options, model, formOptions) => {
                                var officeUsers = formOptions.fields.filter(item => item._cascadeOffice)[
                                    0].officeUsers;
                                var s = dep.dept&&dep.dept.split(',')||[];
                                var lastOfficeId = s[s.length-1];
                                model[options.name] = '';
                                options.data = officeUsers && officeUsers[lastOfficeId] &&
                                    officeUsers[lastOfficeId].map(item => ({
                                        value: item.userId,
                                        text: item.name
                                    })) || [];
                            }],
                            data: []
                        },{
                            label: '入院时间',
                            name: 'totime',
                            widget: 'date',
                            required: true
                        }
                    ],
                    tools: false
                },
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
                        filter.hospitalId=GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        filter.type = 'ordercheck';
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        if(filter.fromEntityId=='ALL'){
                            filter.fromEntityId =''
                        };
                        filter.detailStatus = filter.status;
                        return HelpStore.list(filter);
                    }
                },
                leftFilterOps: {
                    fields: [{
                        name: 'status',
                        widget: 'radio',
                        type: 'button',
                        default: Sunset.Service.Dictionary.alias('HELP_CHECK','pending'),
                        valuePlace: 'key',
                        textPlace: 'value',
                        changeFilter: true,
                        data() {
                            var enums = Sunset.Service.Dictionary.getEnums('HELP_CHECK');
                            return enums;
                        }
                    }],
                    // toolbar: {
                    //     tools: [{
                    //         label: '提交时间',
                    //         icon: 'arrow-up-c',
                    //         color: 'ghost',
                    //         operate: () => {
                    //             if (this.filter.order == "DESC") {
                    //                 this.filter.order = "ASC";
                    //                 this.leftFilterOps.toolbar.tools[0].icon = "arrow-down-c";
                    //             } else {
                    //                 this.filter.order = "DESC";
                    //                 this.leftFilterOps.toolbar.tools[0].icon = "arrow-up-c";
                    //             }
                    //             this.leftFilter(this.filter);
                    //         }
                    //     }]
                    // }
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
                                        if(item.scenesType & Sunset.Service.Dictionary.alias('SCENES_CATEGORY','ordercheck')){
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
            confirminhospital(flow){
                var patientAge= flow.registration.digest&&Sunset.isString(flow.registration.digest)&&JSON.parse(flow.registration.digest).patientAge;
                var patient= flow.patient.extension&&JSON.parse(flow.patient.extension);
                this.currentFlow = flow;
                this.$refs.confirminhospital.open({
                    name:patient.name,
                    patientAge:patientAge&&patientAge.split(',')[0],
                    mobilePhone:patient.mobilePhone,
                    totime:Date.now(),
                    idCard:patient.idCard,
                    sex:patient.sex,
                    address:this.getAddress(patient),
                    medicalCare:patient.socialCard,
                    dept:flow.flow.receiveDeptId,
                    doctor:flow.flow.receiveUserId
                });
            },
            getAddress(patient){
                for(var i in patient){
                    if(i.indexOf('demographic')==0&&patient[i].split(',')[0]=="现住址"){
                        this.address=i;
                        return patient[i]&&patient[i].split(',')[1]
                    }
                }
            },
            refreshList(){
                this.$refs.datapage.refresh();
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
                return $http({
                    url: `/service/business/baseflow/${data[1]}`,
                    type: 'GET',
                }).then(res=>{
                    if(res&&res.hasPassiveClosed){
                        this.$refs.tipmodal.open();
                    }else{
                        this.flowId = data[1];
                        this.patientId = data[0];
                        if(!data[2]){
                            Router.go(`/Helpdesk/TransferIn/${data[0]}/${data[1]}`);
                        }else{
                            Router.go(`/Helpdesk/detail/${data[0]}/${data[1]}`);
                        }
                    }
                })
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