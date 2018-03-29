<style lang="sass">
    .transfer-flow-modal {
        .ivu-modal-content .ivu-select-dropdown{
            position:fixed !important;
        }
        .sunset-field-label{
            min-width:110px;
        }
        .ivu-modal-body {
            padding: 0px;
            .modal-major {
                height: 500px;
                &>div{
                    float:left;
                }
                .flow-target {
                    width:30%;
                    height:100%;
                    box-sizing: border-box;
                    border-right: 1px solid #e1e1e1;
                    &>ul{
                        overflow-y:auto;
                    }
                }
                .flow-form {
                    width:70%;
                    height:470px;
                    overflow-y:auto;
                    &>.info_table{
                        height:35px;
                        line-height:35px;
                        margin-bottom:10px;
                        background: #f2f2f2;
                        &>div{
                            float:left;
                            margin-right:30px;
                            &>label{
                                padding-left:10px;
                                display:inline-block;
                                text-align:left;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <Modal :class-name="'transfer-flow-modal'" :visible.sync="visible" title="预约转诊申请" :mask-closable="false" :width="1000" @on-cancel="afterCancel">
        <div class="modal-major">
            <div class="flow-target">
                <div style="height:30px;line-height:30px;background:#ccc;padding:0 20px">拟转至</div>
                <flow-target type="transfertreatment" check="single" @checked="checkedTargets"></flow-target>
            </div>
            <div style="width:700px;height:30px;line-height:30px;background:#ccc;padding:0 20px">会诊内容</div>
            <div class="flow-form">
                <div class="info_table">
                    <div><label>姓名：</label><span>{{patientData.name}}</span></div>
                    <div><label>电话：</label><span>{{patientData.mobilePhone}}</span></div>
                    <div><label>费用类别：</label><span>{{socialCard}}</span></div>
                </div>
                <div>
                    <sunset-form v-ref:form :options="formOptions" @signal="operateSignal"></sunset-form>
                </div>
            </div>
        </div>
        <div slot="footer">
            <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
        </div>
    </Modal>
</template>
<script>
    import FlowTarget from '../FlowTarget/FlowTarget';
    import Store from '../Store';

    export default {
        components: {
            FlowTarget
        },
        props: {
            options: {},
            patient:{},
            visitings:{}
        },
        computed:{
            patientData(){
                return this.patient&&this.patient.extension || {}
            },
            socialCard(){
                return this.patient.extension&&Sunset.Service.Dictionary.transcode('MEDICARE',this.patient.extension.socialCard);
            }
        },
        data() {
            return {
                isOther:false,
                isAutoCheck:false,
                targets: null,
                formOptions: {
                    cols: 3,
                    fields: [{
                        label:"病历",
                        name: 'records',
                        widget:'checkbox',
                        labelStyle : 'text-align:left;',
                        cols:24,
                        watch:['timestamp',(dep,options)=>{
                            var visitings={};
                            if(this.visitings.length){
                                this.visitings.forEach(item=>{
                                    visitings[item.registrationRecordId + '_' + Sunset.Dates.format(item.createDate,'yyyy/MM/dd') + '病历'] = Sunset.Dates.format(item.createDate,'yyyy/MM/dd') + '病历'
                                });
                            };
                            options.data = visitings;
                        }],
                        data: {}
                    },{
                        label:"转诊类型",
                        name: 'transfertype',
                        widget:'radio',
                        monopolize: true,
                        enum:'REFERRAL_FLOW_TYPE',
                        validate: {
                            required: true
                        }
                    },{
                        label:"转诊日期",
                        name: 'transferdate',
                        cols:10,
                        widget: 'date',
                        validate: {
                            required: true
                        },
                        disabledDate : function(d){
                            return d.getTime() < Date.now()-86400000;
                        },
                        type: 'daterange'
                    },{
                        label:"原因及目的",
                        name: 'transferreason',
                        widget:'radio',
                        monopolize: true,
                        enum:'REFERRAL_FLOW_CAUSE',
                        onChange:(m)=>{
                            if(m=="QT"){
                                this.isOther = true;
                            }else{
                                this.isOther = false;
                            }
                        }
                    },{
                        label:" ",
                        name: 'targetnote',
                        widget:'input',
                        premise:()=>{
                            return this.isOther
                        },
                        monopolize: true
                    },{
                        label:"初步诊断",
                        name: 'diagnose',
                        monopolize: true,
                        validate: {
                            required: true
                        },
                        widget:'input'
                    },{
                        label:"治疗经过",
                        name: 'experience',
                        monopolize: true,
                        widget:'textarea'
                    },{
                        label:"主管医生",
                        name: 'maindoctor',
                        cols:10,
                        widget:'input'
                    },{
                        label:"联系电话",
                        name: 'doctortel',
                        cols:10,
                        validate:{
                            phone:true
                        },
                        widget:'input'
                    },{
                        label:" ",
                        name: 'confirm',
                        widget:'checkbox',
                        monopolize: true,
                        default: '患者已确认',
                        data:()=>{
                            return {'患者已确认':'患者已确认'}
                        }
                    },{
                        label:" ",
                        name: 'autocheck',
                        widget:'checkbox',
                        newline:true,
                        default: '自动审核',
                        data:()=>{
                            return {'自动审核':'自动审核'}
                        }
                    },{
                        label:"",
                        name: 'checklist',
                        widget:'select',
                        placeholder:'请选择审核人',
                        premise:(model)=>{
                            return model.autocheck!='自动审核';
                        },
                        data:()=>{
                            return Store.getOwnHospitalDoctors(true).then(res=>{
                                var list={};
                                res.forEach(item=>{
                                    // if(item.category&&item.category.indexOf(Sunset.Service.Dictionary.alias('ORG_CODE', 'PERSONAL'))==0){
                                    //     list[item.userId]=item.name
                                    // }else{
                                    //     list[item.userId]=item.name
                                    // }
                                    if(item.userId){
                                        list[item.userId]=item.name
                                    }
                                });
                                return list
                            });
                        }
                    }],
                    validate: (model) => {
                        if (this.targets == null) {
                            throw new Error('请在左侧选择转诊目标医院');
                        }
                    },
                    tools: false
                },
                toolbarOptions: {
                    tools: [{
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.cancel();
                        }
                    },{
                        label: '提交',
                        color: 'success',
                        operate: () => {
                            var model = this.$refs.form.getModel();
                            if(!this.targets||this.targets.length==0){
                                Sunset.tip('请在左侧选择转诊目标医院','warning');
                                return;
                            }
                            if(model.autocheck!='自动审核'&&!model.checklist){
                                Sunset.tip('请选择审核医生','warning');
                                return;
                            }
                            if(model.confirm!='患者已确认'){
                                Sunset.tip('患者未确认','warning');
                                return;
                            }
                            if(!model.transfertype){
                                Sunset.tip('转诊类型不能为空','warning');
                                return;
                            }
                            if(!model.transferdate){
                                Sunset.tip('转诊日期不能为空','warning');
                                return;
                            }
                            if(!model.diagnose){
                                Sunset.tip('初步诊断不能为空','warning');
                                return;
                            }
                            if(!model.records){
                                Sunset.tip('请勾选病历','warning');
                                return;
                            }
                            var flowCaseList = [];
                            var recordslist=[];
                            this.$refs.form.getModel().records.split(',').forEach(v=>{
                                recordslist.push(v);
                                flowCaseList.push({
                                    caseId:v&&v.split('_')[0],
                                    caseType:'RegistrationRecord'
                                })
                            });
                            var packs=[];
                            var userId = GlobalService.getCurrentUserSync().user.userId;
                            this.targets&&this.targets.forEach(item=>{
                                var obj={
                                    targetId: item.id,
                                    targetType: item.category,
                                    scenesId: item.scenesId,
                                    systemId : GlobalService.getCurrentUserSync().user.systemId,
                                    hospitalId : GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                    fromEntityId:GlobalService.getCurrentUserSync().relation.hospital[0].id || userId,
                                    fromType:'0401001', 
                                    patientId : this.$route.params.patientId,
                                    applyUserId : GlobalService.getCurrentUserSync().user.userId,
                                    type : 'transfertreatment',
                                    entity : JSON.stringify({
                                        referralType:model.transfertype,
                                        startDate:model.transferdate&&model.transferdate[0].getTime(),
                                        endDate:model.transferdate&&model.transferdate[1].getTime(),
                                        referralCause:model.transferreason,
                                        referralProperty:model.confirm=='患者已确认'?1:0,
                                        isAutoReview:model.autocheck==''?false:true,
                                        currentOutReviewerId:model.checklist
                                    }),
                                    extension : JSON.stringify(Object.assign({recordslist:recordslist},this.$refs.form.getModel())),
                                    flowCaseList: flowCaseList
                                };
                                //debugger;//预约转诊的
                                packs.push(obj);
                            });
                            return $http({
                                url: '/service/business/baseflow',
                                type: 'POST',
                                json:true,
                                data:packs
                            }).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$emit('submited');
                                this.cancel();
                            })
                        }
                    }]
                },
                visible: false,
                modal_loading: false
            }
        },
        methods: {
            open(model) {
                model = model||{};
                model.confirm = "患者已确认";
                model.autocheck = "自动审核";
                model.records = this.visitings[0].registrationRecordId + '_' + Sunset.Dates.format(this.visitings[0].createDate,'yyyy/MM/dd') + '病历',
                model.timestamp = Date.now();
                model.maindoctor = GlobalService.getCurrentUserSync().user.name;
                model.doctortel = GlobalService.getCurrentUserSync().user.mobilePhone;
                this.$refs.form.reset(model);
                this.visible = true;
            },
            ok() {
                this.modal_loading = true;
                this.$refs.form.submit();
            },
            cancel() {
                this.visible = false;
                this.modal_loading = false;
                this.$emit('cancel');
            },
            afterCancel() {
                this.$emit('cancel');
            },
            operateSignal(signal, res, model) {
                switch (signal) {
                    case 'SAVED':
                        this.cancel();
                        this.$emit('saved', res, model);
                        break;
                    case 'SAVE-ERROR':
                        this.modal_loading = false;
                        this.$emit('error');
                        break;
                    case 'CANCEL':
                        this.cancel();
                        break;
                }
            },
            checkedTargets(targets) {
                this.targets = targets;
            }
        }
    }
</script>