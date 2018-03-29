<style lang="sass">
    .dicom-flow-modal {
        .ivu-modal-body {
            padding: 0px;
            .modal-major {
                position: relative;
                height: 520px;
                .flow-target {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    bottom: 0px;
                    width: 300px;
                    box-sizing: border-box;
                    border-right: 1px solid #e1e1e1;
                    .ztree{
                        margin-top:10px;
                        overflow-y:auto;
                    }
                    .target_wrap{
                        padding-top:5px;
                        border-right: 1px solid #e1e1e1;
                    }
                }
                .flow-form {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    bottom: 0px;
                    left: 300px;
                    overflow: overlay;
                    .disableul{
                        margin-bottom:35px;
                        margin-left: 10px;
                        margin-top:10px;
                        width:100%;
                       >li{
                        min-width:30%;
                        float:left;
                        } 
                    } 
                    .sunset-form .ivu-col {
                        height:41px;
                    }
                }
            }
        }
    }
</style>

<template>
    <Modal :class-name="'dicom-flow-modal'" :visible.sync="visible" title="远程阅片" :mask-closable="false" :width="1000" @on-cancel="afterCancel">
        <!-- <div class="padtop"> 111111</div> -->
        <div class="modal-major">
            <div class="flow-target">
                <div style="height:30px;line-height:30px;background:#ccc;margin:0px;padding:0 10px">阅片邀请</div>
                    <div class="target_wrap">
                        <flow-target :type="targetType" @checked="checkedTargets"></flow-target>
                    </div>
            </div>
            <div class="flow-form">
                <div style="height:30px;line-height:30px;background:#ccc;margin:0px;padding:0 10px">阅片申请</div>
                <!-- <dicom-card :size="180" :data="dicomfile" viewable></dicom-card> -->
                <ul class="disableul">
                    <li style="float:left;">患者：{{patientData.name}}</li>
                    <!-- <li v-show="patientData.mobilePhone">电话：{{patientData.mobilePhone}} </li> -->
                    <li>费用类别：{{socialCard}} </li>
                </ul>
                <div style="margin:10px;overflow:hidden;">
                    <div style="float:left;width:86px;">影像文件：</div>
                    <dicom-card :size="150" :data="dicomfile" viewable style="float:left"></dicom-card>
                </div>
                <sunset-form v-ref:form :options="formOptions"></sunset-form>
                <!-- dicomfile: {{dicomfile | json}} -->
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
            visitings:{},
            dicomfile:{}
        },
        data() {
            return {
                patient : null,
                targetType : Sunset.Service.Dictionary.alias('SCENES_CATEGORY','remoteflow'),
                targets: null,
                isOrder:false,
                formOptions:  {
                    cols: 1,
                    tools: false,
                    title: '申请报告',
                    fields: [{
                        // group: '患者意见',
                        label: '患者意见：',
                        name: 'huanzheyijian',
                        labelStyle : 'text-align:left;',
                        widget: 'input',
                        monopolize: true
                    },
                    {
                        label:" 选择病历： ",
                        name: 'records',
                        widget:'checkbox',
                        labelStyle : 'text-align:left;',
                        cols:24,
                        defaultFirst: true,                                             
                        watch : ['timestamp',(dep,options,model)=>{
                            var data = {};
                            if(this.visitings&&this.visitings.length){
                                this.visitings.forEach(item=>{
                                    data[item.registrationRecordId] = Sunset.Dates.format(item.createDate,'yyyy/MM/dd') + '病历'
                                });
                            };
                            options.data = data;
                            // $(".ivu-checkbox-group").find("label").first().attr("checked", true);
                            // $(".ivu-checkbox-group .ivu-checkbox-input:first-child").attr("checked", true);
                            // console.log($(".ivu-checkbox-group>label:first-child span input"));
                        }],
                        data: {},
                    },{
                        label:"预约视频：",
                        name: 'isRequestVideo',
                        widget: 'switch',
                        type:'datetime',
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
                        label:"预约时间：",
                        name: 'videoStartDate',
                        widget:'date',
                        type:'datetime',
                        placement:"top",
                        format:"yyyy-MM-dd HH:mm",
                        pickerPosition: 'top-right',
                        cols:10,
                        default:Date.now(),
                        disabledDate : function(d){
                            return d.getTime() < Date.now()-86400000;
                        },
                        premise:()=>{
                            return this.isOrder
                        }
                    }
                    ],
                    // 下方按钮
                    format: (model) => {
                        var packs=[];
                        var checkedRecords = model.records||[];
                        this.targets&&this.targets.forEach(item=>{
                            var param = {};
                            var binglilist = [];
                            var linshi={};
                            var flowCaseList=[];
                            if(this.visitings&&this.visitings.length){
                                this.visitings.filter(item=>checkedRecords.indexOf(item.registrationRecordId)>=0).forEach(item=>{
                                    var bingli = linshi[item.registrationRecordId] = Sunset.Dates.format(item.createDate,'yyyy/MM/dd') + '病历'+'_'+item.registrationRecordId;
                                    var caselist = {
                                        caseId:item.registrationRecordId,
                                        caseType:"RegistrationRecord",
                                    }
                                    flowCaseList.push(caselist)
                                    binglilist.push(bingli)
                                });
                            };
                            model.records=binglilist;
                            param.targetId= item.id;
                            param.targetType= item.category;
                            param.scenesId= item.scenesId;
                            param.applyUserId = GlobalService.getCurrentUserSync().user.userId;
                            param.systemId=GlobalService.getSystemId();
                            param.patientId= model.patientId;
                            param.targetType= "remoteflow";
                            param.type = "remoteflow";
                            param.entity= "";
                            param.extension= JSON.stringify(model);
                            param.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            param.fromType = "0401001";
                            param.fromEntityId =  GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            // param.flowCaseList=[{
                            //     // 卡片ID 和 病历资料管理类型（字典	FLOW_CASE_TYPE）
                            //     caseId:model.registrationRecordId,
                            //     caseType:"RegistrationRecord"
                            // }];
                            param.flowCaseList=flowCaseList;
                            param.records=model.records;
                            param.isRequestVideo=model.isRequestVideo;
                            param.videoStartDate=model.videoStartDate&&model.videoStartDate.getTime();
                                                        //  patientData.name  sex   patientAge

                            // debugger
                            packs.push(param);

                        });
                        console.log(packs);
                        return packs;
                    },
                    submit: (model) => {
                        console.log(model);
                        if(model.length==0){
                            Sunset.tip('请选择咨询目标','warning');
                            return;
                        }
                        // debugger
                        return Store.submitFlow(model).then(res=>{
                            Sunset.tip('提交成功', 'success');
                            this.$emit('submited');
                            this.cancel();
                        });
                    }
                },
                toolbarOptions: {
                    tools: [{
                        label: '确定',
                        color: 'success',
                        operate: () => {
                            this.ok();
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.cancel();
                        }
                    }]
                },
                visible: false,
                modal_loading: false
            }
        },
        methods: {
            open(model,visitings,patient,dicomfile) {
                this.visitings = visitings;
                this.patient = patient;
                this.dicomfile=JSON.parse(dicomfile);
                model.timestamp = Date.now();
                this.$refs.form.reset(model);
                this.visible = true;
                // records: this.visitings[0].registrationRecordId + '_' + Sunset.Dates.format(this.visitings[0].createDate,'yyyy/MM/dd') + '病历',
            },
            ok() {
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
            checkedTargets(targets) {
                this.targets = targets;
            },

        },
        computed:{
            patientData(){
                return this.patient&&this.patient.extension || {}
            },
            socialCard(){
                return this.patient&&this.patient.extension&&Sunset.Service.Dictionary.transcode('MEDICARE',this.patient.extension.socialCard);
            }
        },
    }
</script>
