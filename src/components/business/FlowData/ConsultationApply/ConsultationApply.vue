<style lang="sass">
    .consultation_modal{
        & .ivu-modal-body{
            padding: 0px;
            .consultation{
                overflow:hidden;
                font-size:14px;
                height:500px;
                &>div{
                    float:left;
                }
                .consultation_target{
                    width:30%;
                    height:100%;
                    .target_wrap{
                        height:100%;
                        border-right: 1px solid #e1e1e1;
                        &>ul{
                            overflow-y:auto;
                        }
                    }
                }
                .consultation_content{
                    width:70%;
                    height:100%;
                    padding-right: 10px;
                    &>.info_table{
                        height:40px;
                        line-height:40px;
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
                    &>.consultation_form{
                        margin-bottom:50px;
                        & .ivu-input{
                            font-size:14px;
                        }
                        & .sunset-form-field .sunset-field-label{
                            font-size:14px;
                            text-align:left;
                            min-width:95px !important;
                        }
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="consultation_modal">
         <sunset-view-modal v-ref:formmodal :options="viewOptions" @submit="submitTeam">
            <div class="consultation">
                <div class="consultation_target">
                    <div style="height:30px;line-height:30px;background:#ccc;padding:0 20px;width: 299px;">会诊邀请</div>
                    <div class="target_wrap">
                        <flow-target type="difficultyflow" @checked="checkedTargets"></flow-target>
                    </div>
                </div>
                <div style="width:700px;height:30px;line-height:30px;background:#ccc;padding:0 20px">会诊申请</div>
                <div class="consultation_content">
                    <div class="info_table">
                        <div><label>姓名：</label><span>{{patientData.name}}</span></div>
                        <div><label>电话：</label><span>{{patientData.mobilePhone}}</span></div>
                        <div><label>费用类别：</label><span>{{socialCard}}</span></div>
                    </div>
                    <div class='consultation_form'>
                        <sunset-form v-ref:consultation :options="consultationOption"></sunset-form>
                    </div>
                </div>
            </div>
        </sunset-view-modal> 
    </div>
</template>
<script>
    import FlowTarget from '../FlowTarget/FlowTarget';

    export default {
        components: {
            FlowTarget
        },
        props:{
            checkeds:[]
        },
        computed:{
            patientData(){
                return this.patient&&this.patient.extension || {}
            },
            socialCard(){
                return this.patient.extension&&Sunset.Service.Dictionary.transcode('MEDICARE',this.patient.extension.socialCard);
            }
        },
        props:{
            patient:{},
            visitings:{}
        },
        data() {        
            return {
                teamCheckeds: [],
                doctorCheckeds:[],
                isActive:true,
                isOrder:false,
                isOther:false,
                teamParams: null,
                targets : [],
                consultationOption:{
                    cols: 3,
                    fields:[{
                        label:"选择病历",
                        name: 'records',
                        widget:'checkbox',
                        cols:24,
                        watch : ['timestamp',()=>{
                        }],
                        data: ()=>{
                            var visitings={};
                            if(this.visitings.length){
                                this.visitings.forEach(item=>{
                                    visitings[item.registrationRecordId + '_' + Sunset.Dates.format(item.createDate,'yyyy/MM/dd') + '病历'] = Sunset.Dates.format(item.createDate,'yyyy/MM/dd') + '病历'
                                });
                            };
                            return visitings
                        }
                    },{
                        label:"会诊目的",
                        name: 'target',
                        widget:'radio',
                        monopolize: true,
                        enum:'CONSULTATION_TARGET',
                        onChange:(m)=>{
                            if(m=="其他"){
                                this.isOther = true;
                            }else{
                                this.isOther = false;
                            }
                        },
                        validate: {
                            required: true,
                            target: true
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
                        label:"患者意见",
                        name: 'suggest',
                        monopolize: true,
                        widget:'input',
                    },{
                        label:"初步诊断",
                        name: 'diagnose',
                        monopolize: true,
                        widget:'input',
                        validate: {
                            required: true,
                            diagnose: true
                        }
                    },{
                        label:"治疗经过",
                        name: 'experience',
                        monopolize: true,
                        widget:'textarea'
                    },{
                        label:"预约视频",
                        name: 'order',
                        widget: 'switch',
                        disabled: false,
                        default: false,
                        monopolize: true,
                        size:'large',
                        open: '预约',
                        close: '关闭',
                        onChange:()=>{
                            if(this.isOrder){
                                this.isOrder=false
                            }else{
                                this.isOrder=true
                            }
                        },
                        premise:function(){
                            return true
                        }
                    },{
                        label:"预约时间",
                        name: 'orderdate',
                        widget:'date',
                        type:'datetime',
                        placement:"top",
                        format:"yyyy-MM-dd HH:mm",
                        cols:10,
                        validate: {
                            required: true
                        },
                        disabledDate : function(d){
                            return d.getTime() < Date.now()-86400000;
                        },
                        premise:()=>{
                            return this.isOrder
                        }
                    },{
                        label:"选择诊室",
                        name: 'orderclass',
                        newline:true,
                        widget:'select',
                        cols:10,
                        premise:()=>{
                            return false
                        }
                    }],
                    tools:[]
                },
                viewOptions:{
                    title: '疑难会诊申请',
                    width: 1000,
                    maskClosable : false,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    toolbar: [{
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.cancel();
                        }
                    },{
                        label: '提交',
                        color: 'success',
                        operate: () => {
                            if (this.targets.length) {
                                var model = this.$refs.consultation.getModel();
                                if(!model.target){Sunset.tip('会诊目的不能为空', 'warning');return}
                                if(!model.diagnose){Sunset.tip('初步诊断不能为空', 'warning');return}                                
                                var flowCaseList = [];
                                var recordslist=[];
                                this.$refs.consultation.getModel().records.split(',').forEach(v=>{
                                    recordslist.push(v);
                                    flowCaseList.push({
                                        caseId:v&&v.split('_')[0],
                                        caseType:'RegistrationRecord'
                                    })
                                });
                                var packs=[];
                                this.targets&&this.targets.forEach(item=>{
                                var obj={
                                    targetId: item.id,
                                    targetType: item.category,
                                    scenesId: item.scenesId,
                                    systemId : GlobalService.getCurrentUserSync().user.systemId,
                                    hospitalId : GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                    fromEntityId:GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                    fromType:'0401001', 
                                    patientId : this.$route.params.patientId,
                                    applyUserId : GlobalService.getCurrentUserSync().user.userId,
                                    type : 'difficultyflow',
                                    entity : JSON.stringify({
                                        consultTarget:model.target
                                    }),
                                    isRequestVideo:model.order,
                                    videoStartDate:model.orderdate&&model.orderdate.getTime(),
                                    extension : JSON.stringify(Object.assign({recordslist:recordslist},this.$refs.consultation.getModel())),
                                    flowCaseList: flowCaseList,
                                };
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
                                    var applyuserid = res[0].applyUserId;
                                    res&&res.forEach(resitem=>{
                                    // var arrjoin=[];arrjoin.push(applyuserid)
                                        var flowid = resitem.id;
                                        // if(resitem.currentTargetType!="0000000"){
                                            this.targets&&this.targets.forEach(targetitem=>{
                                                if(targetitem.id==resitem.currentTargetId){
                                                    for(var k in targetitem.members){
                                                        // arrjoin.push(k)
                                                        joinroom(k,flowid)
                                                    }
                                                }
                                            })
                                        // joinroom(arrjoin,flowid)
                                        joinroom(applyuserid,flowid)
                                    })
                                    
                                    // currentTargetType 000000 是个人
                                    function joinroom(userid,flowid){
                                        // userid=userid.join(",");
                                        $http({
                                            url: '/sw-service/im/message/join_room',
                                            type: 'POST',
                                            data: {
                                                userId:userid,
                                                roomId:flowid
                                            }
                                            }).then(res=>{
                                            }).catch(res =>{
                                        })
                                    }

                                })
                            }else{
                                Sunset.tip('请在左侧选择会诊申请目标医生','warning');
                            }
                        }
                    }]
                }
            }
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    this.$refs.formmodal.open();
                    this.$refs.consultation.reset({
                        records: this.visitings[0].registrationRecordId + '_' + Sunset.Dates.format(this.visitings[0].createDate,'yyyy/MM/dd') + '病历',
                        timestamp: Date.now()
                    });
                });
            },
            cancel() {
                this.$refs.formmodal.cancel()
            },
            checkedTargets(targets) {
                this.targets = targets;
            }
        }
    }
</script>