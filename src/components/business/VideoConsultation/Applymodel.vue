<style lang="sass">
.video-consultation-modal {
        .ivu-modal-body {
            padding: 0px;
            .modal-major {
                position: relative;
                height: 500px;
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
                        padding-top:10px;
                        overflow-y:auto;
                        border-right: 1px solid #e1e1e1;
                    }
                }
                .flow-form {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    bottom: 0px;
                    left: 300px;
                    margin-bottom: 30px;
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
                    .ivu-row>div{
                        margin:5px 0;
                    }
                    .ivu-col{
                        font-size: 16px;
                        padding-left: 20px;
                    }
                }
                label{
                    min-width:93px;
                }
            }
        }
    }
</style>


<template>
    <Modal :class-name="'video-consultation-modal'" :visible.sync="visible" title="预约视频" :mask-closable="false" :width="1000">
        <div class="modal-major">
            <div class="flow-target">
                <div style="height:30px;line-height:30px;background:#ccc;margin:0px;padding:0 10px">预约对象</div>
                    <div class="target_wrap">
                        <flow-target :type="targetType" check="single" @checked="checkedTargets"></flow-target>
                    </div>
            </div>
            <div class="flow-form">
                <div style="height:30px;line-height:30px;background:#ccc;margin:0px;padding:0 10px;margin-bottom:20px;">预约内容</div>
                <sunset-form v-ref:form :options="formOptions"></sunset-form>
    <!-- <row>
        <i-col span="4">
            主题：
        </i-col>
        <i-col span="18">
            <i-input :value.sync="zhuti" placeholder="请输入..." style=""></i-input>
        </i-col>
    </row>
    <row>
        <i-col span="4">
            选择日期：
        </i-col>
        <i-col span="8">
            <Date-picker :value.sync="riqi" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px" :options="optionsdate"></Date-picker>
        </i-col>
        <i-col span="3">
            时段：
        </i-col>
        <i-col span="8">
            <Time-picker confirm :value.sync="shijian" format="HH:mm" type="timerange" placeholder="选择时间" style="width: 168px"></Time-picker>
        </i-col>
    </row>
    <row>
        <i-col span="4">
            备注：
        </i-col>
        <i-col span="18">
            <i-input type="textarea" :value.sync="remark" placeholder="请输入..."></i-input>
        </i-col>
    </row>-->
            </div>
        </div>
        <div slot="footer">
            <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
        </div> 
    </Modal>
</template>

<script>
    // import FlowTarget from '../FlowData/FlowTarget/FlowTarget';
        import FlowTarget from './FlowTarget';
    import Store from './Store.js';
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
                targetType : 'VideoConsultation',
                targets: null,
                checkeds:"",
                isOrder:false,

                // zhuti:"",
                // riqi:"",
                // shijian:"",
                // remark:"",
                // optionsdate: {
                //     disabledDate (date) {
                //         return date && date.valueOf() < Date.now() - 86400000;
                //     }
                // },
                formOptions:  {
                    cols: 1,
                    tools: false,
                    title: '预约视频',
                    fields: [{
                        label: '主题：',
                        name: 'zhuti',
                        labelStyle : 'text-align:left;',
                        widget: 'input',
                        validate: {
                                required: true,
                                zhuti: true,
                                maxlength:20,
                        },
                    },{
                        label:"预约日期：",
                        name: 'StartDate',
                        widget:'date',
                        type:'date',
                        placeholder:"预约日期",
                        default:Date.now(),
                        disabledDate : function(d){
                            return d.getTime() < Date.now()-86400000;
                        },
                        cols: 10,
                        disabled: false,
                        validate: {
                                required: true,
                                StartDate: true
                        },
                    },{
                        label:"预约时段： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
                        name: 'EndDate',
                        widget:'time',
                        type:'timerange',
                        format:"HH:mm",
                        default:Date.now(),
                        placeholder:"预约时段",
                        disabledDate : function(d){
                            return d.getTime() < Date.now()-86400000;
                        },
                        cols: 10,
                        disabled: false,
                        validate: {
                                required: true,
                                EndDate: true
                        },
                    },{
                        label: '&nbsp;&nbsp;&nbsp;备注：',
                        name: 'remark',
                        labelStyle : 'text-align:left;',
                        widget: 'textarea',
                    }
                    ],
                    // 下方按钮
                    format: (model) => {
                        
                    },
                    submit: (model) => {
                        console.log(model);
                        if(model.length==0){
                            Sunset.tip('请选择预约对象','warning');
                            return;
                        }
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
                            // this.$refs.form.submit();
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
            open(model) {
                this.$refs.form.reset(model);
                this.visible = true;
            },
            ok() {
                var model = this.$refs.form.getModel();
                if(!model.zhuti){Sunset.tip('请输入预约主题', 'warning');return}
                if(!model.StartDate){Sunset.tip('请选择预约日期', 'warning');return}
                if(!model.EndDate){Sunset.tip('请选择预约时段', 'warning');return}
                if(!this.targets){Sunset.tip('请选择预约对象', 'warning');return}
                // this.formOptions.format();
                const start = new Date();
                            start.setHours(0);
                            start.setMinutes(0);
                            start.setSeconds(0);
                            start.setMilliseconds(0);
                            model.StartDate.setHours(0);
                            model.StartDate.setMinutes(0);
                            model.StartDate.setSeconds(0);
                            model.StartDate.setMilliseconds(0);
                            var jintian =  new Date(start + 86399999).getTime();

                        var startTime=model.EndDate[0].getTime()-jintian+model.StartDate.getTime();
                        var endTime = model.EndDate[1].getTime()-jintian+model.StartDate.getTime();
                        var parampost={};
                            var param = {};
                            parampost.remark= model.remark;
                            parampost.topic= model.zhuti;
                            parampost.applyUserId = GlobalService.getCurrentUserSync().user.userId;
                            parampost.systemId=GlobalService.getSystemId();

                            parampost.startTime=startTime;
                            parampost.endTime=endTime;
                            parampost.createDate=Date.now();
                            parampost.hospitalId=GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            if(this.targets[0].category=="0101001"){
                                parampost.expertTeamId=this.targets[0].userid;
                            }else if(this.targets[0].category=="0000000"){
                                                                // 个人
                                var key=this.targets[0].members;
                                var kesys=[];1
                                for (var p in key){
                                    kesys.push(p);
                                }
                                parampost.expertUserId=kesys[0];
                            }else{
                                parampost.expertTeamId=this.targets[0].memberEntityId;
                            }  
                Store.submitFlow(parampost).then(res=>{
                    Sunset.tip('提交成功', 'success');
                    this.$emit('submited');
                    this.cancel();
                    this.$emit('subrefreh');
                });
            },
            cancel() {
                this.visible = false;
                this.modal_loading = false;
                this.$emit('cancel');
            },
            
            checkedTargets(targets) {
                this.targets = targets;
            },

        },
        computed:{
            
        },

}
</script>
