<style lang="sass">
    .integral-modal {
        .ivu-modal-body {
            padding: 0px;
            .modal-major {
                position: relative;
                height: 350px;
                padding: 10px;
                .firstcon{
                    margin-bottom:20px;
                    .yearpick{
                        display: inline-block;
                        margin-right: 20px;
                    }
                }
                .overycontant{
                    height: 270px;
                    overflow: overlay;
                    .secondcon{
                    border-bottom:1px dashed #ccc;
                    height: 40px;
                    line-height: 40px;
                    span{
                        display:inline-block;
                        button{
                            padding: 0px 15px;
                            border-radius: 5px;
                            background: #fff;
                            border-color: #9a9a9a;
                            line-height: 25px;
                            width:70px;
                        }
                        .choseitem{
                            color:#fff;
                            background:#0c9;
                            border-color:#999;
                        }
                    }
                }
                }
            }
        }
    }
</style>
<template>
    <Modal :class-name="'integral-modal'" :visible.sync="visible" title="积分结算" :mask-closable="false" :width="500" @on-cancel="afterCancel">
        <!-- <div class="padtop"> 111111</div> -->
        <div class="modal-major">
            <!-- {{record | json}} -->
            <!-- {{value1}} -->
            <!-- {{chosehow}} -->
            <div class="firstcon">
                <span class="yearpick">
                    <Date-picker type="year" @on-change="selpro" :value="value1" placeholder="选择年" style="width: 200px"></Date-picker>
                </span>
                <span>结算积分：{{choseAmount}}</span>
            </div>
            <div class="overycontant">
                <div class="secondcon" v-for="item in listarr">
                    <span style="width:40%">{{item.startDay}} ~ {{item.endDay}}</span>
                    <span style="width:19%">{{item.stagedAmount}}</span>
                    <span style="width:19%">{{item.isExchanged?"已兑换":"待兑换"}}</span>
                    <span style="width:19%" v-if="!(item.isExchanged||item.stagedAmount==0)"> <button @click="choses(item)" class="{{chosehow.indexOf(item.settlementReportId)>=0?'choseitem':''}}">{{chosehow.indexOf(item.settlementReportId)>=0?"已选择":"选择"}}</button> </span>
                </div>
                <!-- <div class="secondcon">
                    <span style="width:40%">2017/12/01 ~ 2018/02/23</span>
                    <span style="width:19%">200积分</span>
                    <span style="width:19%">待结算</span>
                    <span style="width:19%"> <button @click="choses('1')">{{chosehow==1?"已选择":"选择"}}</button> </span>
                </div>
                <div class="secondcon">
                    <span style="width:40%">2017/12/01 ~ 2018/02/23</span>
                    <span style="width:19%">200积分</span>
                    <span style="width:19%">待结算</span>
                    <span style="width:19%"> <button @click="choses('2')">{{chosehow==2?"已选择":"选择"}}</button> </span>
                </div>
                    <div class="secondcon">
                    <span style="width:40%">2017/12/01 ~ 2018/02/23</span>
                    <span style="width:19%">200积分</span>
                    <span style="width:19%">待结算</span>
                    <span style="width:19%"> <button @click="choses('3')">{{chosehow==3?"已选择":"选择"}}</button> </span>
                </div> -->
                <div class="secondcon" v-show="listarr.length==0" style="text-align:center;border:none;color:#f60;"> 无可兑换积分</div>
            </div>
        </div>
        <div slot="footer">
            <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
        </div>
    </Modal>
</template>

<script>

    import Store from './Store';
    export default {
        ready() {
            // 查询那个啥列表

        },
        data() {
            return {
                record:"",
                choseAmount:0,//选择的积分
                // Amount:"",// 待结算积分
                chosehow:[],
                arrlist:[],
                // getlistdata:{
                //     pageSize:1000,
                //     keyword:this.value1,
                //     hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                //     userId:this.record.userId,
                // },
                value1:new Date().getFullYear().toString(),
                listarr:[],
                listarr1:[
                    {
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"200",
                        status:"1",
                        settlementReportId:"1"
                    },
                    {
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"300",
                        status:"1",
                        settlementReportId:"2"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"400",
                        status:"1",
                        settlementReportId:"3"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"500",
                        status:"2",
                        settlementReportId:"4"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"600",
                        status:"1",
                        settlementReportId:"5"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"700",
                        status:"1",
                        settlementReportId:"6"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"800",
                        status:"1",
                        settlementReportId:"7"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"900",
                        status:"1",
                        settlementReportId:"8"
                    },{
                        date:"2015/01/01 ~ 2017/01/01",
                        stagedAmount:"1000",
                        status:"1",
                        settlementReportId:"9"
                    }
                ],
                toolbarOptions: {
                    tools: [{
                        label: '兑换',
                        color: 'success',
                        operate: () => {
                            // this.ok();
                            var ReportIds = this.chosehow.join(",");
                            var somemodel={
                                userId:this.record.userId,
                                hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                settlementReportIds:ReportIds,
                            }
                            return Store.submitintegralFlow(somemodel).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$emit('submited');
                                this.cancel();
                                this.$emit('refresh');
                            });
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
            open(record) {
                this.record=record;
                this.visible = true;

                var getlistdata={
                pageSize:1000,
                keyword:this.value1,
                hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                userId:this.record.userId,
                // 加上 pagesize
                }
                Store.GETlistarr(getlistdata).then(res => {
                    res&&res.rows&&res.rows.forEach(element => {
                        element.startDay=element.startDay.substr(0,4)+'/'+element.startDay.substr(4,2)+'/'+element.startDay.substr(6,2);
                        element.endDay=element.endDay.substr(0,4)+'/'+element.endDay.substr(4,2)+'/'+element.endDay.substr(6,2);
                    });
                    this.listarr = res.rows;
                });
            },
            selpro(v){
                var getlistdata={
                    pageSize:1000,
                    keyword:v,
                    hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                    userId:this.record.userId,
                    // 加上 pagesize
                }
                Store.GETlistarr(getlistdata).then(res => {
                    res&&res.rows&&res.rows.forEach(element => {
                        element.startDay=element.startDay.substr(0,4)+'/'+element.startDay.substr(4,2)+'/'+element.startDay.substr(6,2);
                        element.endDay=element.endDay.substr(0,4)+'/'+element.endDay.substr(4,2)+'/'+element.endDay.substr(6,2);
                    });
                    this.listarr = res.rows;
                });
            },
            ok() {
                this.$refs.form.submit();
            },
            cancel() {
                this.visible = false;
                this.modal_loading = false;
                this.choseAmount=0;
                // Amount:"",// 待结算积分
                this.chosehow=[];
                this.arrlist=[];
                this.$emit('cancel');
            },
            afterCancel() {
                this.choseAmount=0;
                this.chosehow=[];
                this.arrlist=[];
                this.$emit('cancel');
            },
            choses(some){
                var has = this.chosehow.indexOf(some.settlementReportId);
                if(has>=0){
                    this.chosehow.splice(has,1)
                    this.choseAmount-=Number(some.stagedAmount);
                }else{
                    this.chosehow.push(some.settlementReportId)
                    this.choseAmount+=Number(some.stagedAmount);
                }
                
                // this.chosehow = some;
            }
        },
        computed:{
            patientData(){
                return this.patient&&this.patient.extension || {}
            },
            socialCard(){
                return this.patient&&this.patient.extension&&Sunset.Service.Dictionary.transcode('MEDICARE',this.patient.extension.socialCard);
            }
        },
        destroyed(){
            //  这里生命钩子 不起作用, 找取消
        }
    }
</script>
