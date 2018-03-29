<style lang='sass'>
.referral_flow_info{
    margin-bottom:10px;
    .flow_info{
        height:110px;
        background:#f2f2f2;
        padding:10px 0;
        &>div{
            float:left;
            height:60px;
        }
        &>.patient{
            width:60%;
            &>p{
                line-height:30px;
                height:30px;
            }
            &>.mian_info{
                font-size:18px;
                overflow:hidden;
                &>span{
                    display:inline-block;
                    margin-left:10px;
                }
                .transefer_type{
                    padding:0 5px;
                    height:25px;
                    line-height:27px;
                    background:#ff8a42;
                    color:#fff;
                    border-radius:3px;
                    font-size:12px;
                    min-width:50px;
                }
                .current_dept{
                    padding:0 5px;
                    height:25px;
                    line-height:27px;
                    background:#39f;
                    color:#fff;
                    border-radius:3px;
                    font-size:12px;
                    min-width:30px;
                }
            }
            &>.visiting_info{
                font-size:14px;
                &>span{
                    display:inline-block;
                    margin:0 10px;
                }
                .visiting_dept{
                    display: inline-block;
                    text-align:center;
                    padding:0 5px;
                    height:25px;
                    line-height:25px;
                    background:#fff;
                    color:#666;
                    border-radius:3px;
                    font-size:12px;
                    min-width:50px;
                    border:1px solid #ccc;
                }
            }
        }
        &>.expert{
            width:20%;
            &>p{
                text-align:center;
                line-height:30px;
                height:30px;
                word-wrap: break-word;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        &>.operate{
            width:20%;
            padding:15px 20px;
            height:90px;
            &>div{
                text-align:center;
                height:30px;
                line-height:30px;
                float:right;
                border-radius:3px;
                & button{
                    cursor:pointer;
                }
            }
            &>.flow_check{
                background:#00cc99;
                color:#fff;
                width:60px;
                margin-left:10px;
                cursor:pointer;
            }
            &>.flow_time{
                width:100%;
                text-align:right;
                line-height: 0px;
                &>div{
                    display:inline-block;
                    color:red;
                }
            }
            &>.flow_print{
                line-height:28px;
                background:#fff;
                color:#00cc99;
                border:1px solid #00cc99;
                width:80px;
                margin-left:15px;
            }
            &>.flow_del{
                line-height:28px;
                background:#fff;
                color:#00cc99;
                border:1px solid #00cc99;
                width:80px;
                margin-left:15px;
            }
        }
    }
}
</style>
<template>
    <div class="referral_flow_info">
        <div v-if="actived=='转出'"  class="flow_info">
            <div class="patient">
                <p class="mian_info">
                    <span>{{flow.flow.reservationNumber}}</span><span>{{flow.patient.name}}</span><span>{{patientSex}}</span><span>{{patientAge}}</span>
                    <span>拟转：<span style="color:#39f">{{target}}</span></span>
                </p>
                <p class="mian_info" style="font-size:16px;"><span>初步诊断：{{diagnose}}</span><span class="transefer_type">{{transferType?transferType:'转诊类型'}}</span></p>
                <p class="visiting_info"><span> <Icon type="android-home"></Icon> {{safeData.flow.fromEntity.name}}</span><span v-if="registeredDept"> <Icon type="network"></Icon> {{registeredDept}}</span><span> <Icon type="person"></Icon> {{safeData.flow.applyUser.name}}</span> | <span>提交日期：{{safeData.flow.applyDate | time 'yyyy-MM-dd HH:mm'}}</span></p>
            </div>
            <div class="expert">
                <p v-if="outRefused&&!safeData.flow.hasPassiveClosed" :title="'拒绝转出'+outOperater"><span style="font-size:16px;color:#ffa65e">拒绝转出</span><span v-if="outOperater">（<Icon type="person"></Icon>{{outOperater}}）</span></p>
                <p v-if="outCancel&&!safeData.flow.hasPassiveClosed" :title="outOperater"><span style="color:#39f;font-size:16px">已撤销</span><span v-if="outOperater">（<Icon type="person" size="16"></Icon> {{outOperater}}）</span></p>  
                <p v-if="outAgreed&&!safeData.flow.hasPassiveClosed" :title="outOperater"><span style="color:#39f;font-size:16px">转出已审核</span><span v-if="outOperater">（<Icon type="person" size="16"></Icon> {{outOperater}}）</span></p> 
                <p v-if="OutReviewing&&!safeData.flow.hasPassiveClosed"><span style="color:#f90;font-size:16px">转出待审核</span><span v-if="safeData.flow.currentOutReviewer.name">（<Icon type="person" size="16"></Icon> {{safeData.flow.currentOutReviewer.name}}）</p> 
                <p v-if="inAgreed&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span style="color:#00cc99;font-size:16px">同意接收</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p> 
                <p v-if="inOutRefused&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span style="color:#ffa65e;font-size:16px">无法接收</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p>  
                <p v-if="confirmIn&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span style="color:#39f;font-size:16px">确认入院</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p>
                <div v-if="safeData.flow.hasPassiveClosed" style="color:red">转诊已失效</div>
            </div>
            <div class="operate">
                <div class="flow_time" v-show="safeData.flow.detailStatus==0">
                    <Icon type="ios-alarm-outline" size="18" style="display:inline-block;margin-right:5px;position:relative;top:2px;"></Icon>
                    <set-timer :time="initTimeOut"></set-timer>
                </div>
                <sunset-toolbar :options="toolbarOptions"></sunset-toolbar>
            </div>
        </div>
        <div v-if="actived=='转入'" class="flow_info">
            <div class="patient">
                <p class="mian_info">
                    <span>{{flow.flow.reservationNumber}}</span><span>{{flow.patient.name}}</span><span>{{patientSex}}</span><span>{{patientAge}}</span><span v-if="safeData.patient.mobilePhone"><Icon type="ios-telephone"></Icon>{{safeData.patient.mobilePhone}}</span>
                    <span v-if="currentDept">拟转：{{currentDept}}</span>
                </p>
                <p class="mian_info" style="font-size:16px;"><span>初步诊断：{{diagnose}}</span><span class="transefer_type" v-if="transferType">{{transferType}}</span></p>
                <p class="visiting_info" style="font-size:14px;"><span> <Icon type="android-home"></Icon> {{safeData.flow.fromEntity.name}}</span><span v-if="registeredDept"> <Icon type="network"></Icon> {{registeredDept}}</span><span> <Icon type="person"></Icon> {{safeData.flow.applyUser.name}}</span> | <span>提交日期：{{safeData.flow.applyDate | time 'yyyy-MM-dd HH:mm'}}</span></p>
            </div>
            <div class="expert">
                <p v-if="confirmIn&&!safeData.flow.hasPassiveClosed&&!isMedicalCenter" :title="inOperater"><span style="color:#39f;font-size:16px">确认入院</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p>
                <p v-if="confirmIn&&!safeData.flow.hasPassiveClosed&&isMedicalCenter" :title="inOperater"><span style="color:#39f;font-size:16px">待确定</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p>
                <p v-if="inRefused&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span style="color:#ffa65e;font-size:16px">无法接收</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p>
                <p v-if="inRefused&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span>{{refuseReason}}</span></p>
                <p v-if="inAgreed&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span style="color:#00cc99;font-size:16px">同意接收</span><span v-if="inOperater">（<Icon type="person" size="16"></Icon> {{inOperater}}）</span></p>  
                <p v-if="waitReceive&&!safeData.flow.hasPassiveClosed" :title="inOperater"><span style="color:#ff8a42;font-size:16px">待接收</span><span v-if="targetDoctor">（<Icon type="person" size="16"></Icon> {{targetDoctor}}）</span></p>  
                <p v-if="safeData.flow.contactCount&&!safeData.flow.hasPassiveClosed">回访{{safeData.flow.contactCount}}次<span v-if="safeData.flow.contactLatestDate">（{{safeData.flow.contactLatestDate | time 'yyyy-MM-dd HH:mm'}}）</span></p>  
                <div v-if="safeData.flow.hasPassiveClosed" style="color:red">转诊已失效</div>
                <div v-if="safeData.flow.finalResult==0" style="color:red">转诊不成功</div>
            </div>
            <div class="operate" v-if="safeData.flow.detailStatus==6 || safeData.flow.detailStatus==3 || safeData.flow.detailStatus==7 || safeData.flow.hasPassiveClosed">
                <div class="flow_check" @click="checkFlow('finish')" style="margin:15px 0;" v-if="!isMedicalCenter || safeData.flow.detailStatus==7">查看</div>
                <div class="flow_check" @click="checkFlow" v-if="isMedicalCenter&&safeData.flow.detailStatus==6">处理</div>
            </div>
            <div class="operate" v-if="safeData.flow.detailStatus!=6 && safeData.flow.detailStatus!=3 && safeData.flow.detailStatus!=7 && !safeData.flow.hasPassiveClosed">
                <div class="flow_time" v-show="safeData.flow.detailStatus==4 || safeData.flow.detailStatus==2">
                    <Icon type="ios-alarm-outline" size="18" style="display:inline-block;margin-right:5px;position:relative;top:2px;"></Icon>
                    <set-timer :time="initTimeIn"></set-timer>
                </div>
                <div class="flow_check" @click="checkFlow">处理</div>
                <div class="flow_check" v-if="safeData.flow.detailStatus==2" style="background:#39f" @click="transferFlow">转发</div>
            </div>
        </div>
    </div>
</template>
<script>
    import SetTimer from "./Timer";
    export default {
        components:{
            SetTimer
        },
        data(){
            return {
                toolbarOptions:{
                    tools:[{
                        label: '处理',
                        color: 'success',
                        premise:()=>{
                            return !this.safeData.flow.hasPassiveClosed&&(this.safeData.flow.detailStatus==0 || this.safeData.flow.detailStatus==2)
                        },
                        operate:()=>{
                            this.checkFlow()
                        }
                    },{
                        label: '查看',
                        color: 'success',
                        premise:()=>{
                            return this.safeData.flow.detailStatus!=0 && this.safeData.flow.detailStatus!=2 || this.safeData.flow.hasPassiveClosed
                        },
                        operate:()=>{
                            this.checkFlow('finish')
                        }
                    },{
                        label: '撤销',
                        color: 'warning',
                        disabled:()=>{
                            if(this.safeData.flow.hasPassiveClosed){
                                return this.safeData.flow.hasPassiveClosed
                            }else{
                                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewing')!=this.safeData.flow.detailStatus && 
                                Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewAgreed')!=this.safeData.flow.detailStatus;
                            }
                        },
                        operate: () => {
                            this.cancelFlow();
                        }
                    },{
                        label: '打印',
                        color: 'primary',
                        disabled:()=>{
                            if(this.safeData.flow.hasPassiveClosed){
                                return this.safeData.flow.hasPassiveClosed
                            }else{
                                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InReviewAgreed')!=this.safeData.flow.detailStatus&&
                                Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewAgreed')!=this.safeData.flow.detailStatus;
                            }
                        },
                        operate: () => {
                            this.printTransfer(this.flow);
                        }
                    }]
                }
            }
        },
        props:{
            patient:{},
            flow:{},
            actived:''
        },
        computed:{
            safeData(){
                return this.flow || {}
            },
            initTimeOut(){
                return this.safeData.flow.applyDate;
            },
            isMedicalCenter(){
                return GlobalService.getCurrentUserSync().relation.isBelongToOfficeCategory(Sunset.Service.Dictionary.alias('ORG_CODE','MEDICAL_CENTER'))
            },
            initTimeIn(){
                return this.safeData.flow.outReviewDate;
            },
            outOperater(){
                if(this.safeData.flow.isAutoReview){
                    return '自动'
                }else {
                    var operater='';
                    if(this.safeData.flow.detailStatus>0 && this.safeData.flow.detailStatus!=5){
                        operater = this.safeData.flow.currentOutReviewer?this.safeData.flow.currentOutReviewer.name:'';
                    }else if(this.safeData.flow.detailStatus==5){
                        operater = this.safeData.flow.cancelUser?this.safeData.flow.cancelUser.name:'';
                    }
                    return operater;
                }
            },
            inOperater(){
                var operater='';
                if(this.safeData.flow.detailStatus>2 && this.safeData.flow.detailStatus!=5){
                    operater = this.safeData.flow.inReviewer&&this.safeData.flow.inReviewer.name;
                }else if(this.safeData.flow.detailStatus==5){
                    operater = this.safeData.flow.cancelUser&&this.safeData.flow.cancelUser.name;
                }else if(this.safeData.flow.detailStatus==6){
                    operater = this.safeData.flow.inConfirmUser&&this.safeData.flow.inConfirmUser.name;
                }
                return  operater;
            },
            transferDate(){
                return `${Sunset.Dates.format(this.safeData.flow.startDate,'yyyy-MM-dd')} 至 ${Sunset.Dates.format(this.safeData.flow.endDate,'yyyy-MM-dd')}`
            },
            isWaiting(){
                return Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING')==this.safeData.flow.status;
            },
            isOut() {
                return this.flow.hospitalId == GlobalService.getCurrentUserSync().relation.hospital[0].id
            },
            OutReviewing(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewing')==this.safeData.flow.detailStatus;
            },
            refuseReason(){
                return this.safeData.flow.extension&&JSON.parse(this.safeData.flow.extension).refuseReason;
            },
            transferType(){
                return this.safeData.flow.extension&&Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_TYPE',JSON.parse(this.safeData.flow.extension).transfertype);
            },
            currentDept(){
                if(this.safeData.flow.target.category.indexOf(Sunset.Service.Dictionary.alias('ORG_GROUP_CODE','DEPT'))==0){
                    return this.safeData.flow.target.name
                }else if(this.safeData.flow.target.category.indexOf(Sunset.Service.Dictionary.alias('ORG_GROUP_CODE','HOSPITAL'))==0){
                    return ''
                }else{
                    return this.safeData.flow.target.uppers.length&&this.safeData.flow.target.uppers[0].name
                }
            },
            targetDoctor(){
                var target = this.flow.flow.target;
                if(target.category.indexOf("00")==0){
                    return target.name
                }else{
                    return ''
                }
            },
            outRefused(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewRejected')==this.safeData.flow.detailStatus;
            },
            inOutRefused(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InReviewRejected')==this.safeData.flow.detailStatus;
            },
            outAgreed(){
                return this.safeData.flow.detailStatus >= Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewAgreed')&&
                this.safeData.flow.detailStatus != Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutCancel') &&
                this.safeData.flow.detailStatus != Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InConfirmed');
            },
            waitReceive(){
                return this.safeData.flow.detailStatus == Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutReviewAgreed')
            },
            outCancel(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','OutCancel')==this.safeData.flow.detailStatus;
            },
            inRefused(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InReviewRejected')==this.safeData.flow.detailStatus;
            },
            confirmIn(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InConfirmed')==this.safeData.flow.detailStatus;
            },
            inAgreed(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InReviewAgreed')==this.safeData.flow.detailStatus;
            },
            flowStatus(){
                return Sunset.Service.Dictionary.transcode('FLOW_STATUS',this.safeData.flow.status);
            },
            transferStatus(){
                return Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_STATUS',this.safeData.flow.detailStatus);
            },
            patientAge(){
                return this.safeData.registration&&this.safeData.registration.patientAge&&this.safeData.registration.patientAge.replace(',','')
            },
            registeredDept(){
                return this.safeData.registration&&this.safeData.registration.registeredDept
            },
            applyData(){
                return this.safeData.flow.extension&&JSON.parse(this.safeData.flow.extension)
            },
            diagnose(){
                return this.applyData&&this.applyData.diagnose
            },
            hasNew(){
                if(this.patient.hasNew){
                    return this.patient.hasNew?'hasNew':''
                }
            },
            patientSex(){
                return Sunset.Service.Dictionary.transcode('SEX',this.safeData.patient.sex)
            },
            expertName(){
                if(this.patient.flow && this.patient.flow.expertUser && this.patient.flow.expertUser.name){
                    return  this.patient.flow.expertUser.name
                }else{
                    return ""
                }
            },
            creatDate(){
                if(this.patient.registration && this.patient.registration.digest){
                    return  Sunset.Dates.format(new Date(JSON.parse(this.patient.registration.digest).registeredDate),'yyyy-MM-dd HH:mm')
                }else{
                    return ""
                }
            },
            isTriaged(){
                if(this.patient.flow.expertUserId){
                    return true
                }else{
                    return false
                }
            },
            target() {
                var target = this.flow.flow.target;
                if(target.category&&target.category.indexOf("04")==0){
                    return target.name
                }else{
                    var dept=[];
                    target.uppers.forEach(item=>{
                        if(item.category&&item.category.indexOf("01")==0){
                            dept.push(item.name)
                        }else if(item.category&&item.category.indexOf("02")==0){
                            dept.push(item.name)
                        }else if(item.category&&item.category.indexOf("03")==0){
                            dept.push(item.name)
                        }else if(item.category&&item.category.indexOf("04")==0){
                            dept.push(item.name)
                        }else{
                            dept += item.name
                        }
                    });
                    target.name&&dept.unshift(target.name);
                    return dept.reverse().join("-")
                }
            }
        },
        methods:{
            checkFlow(mark){
                this.$emit('check',[this.flow.patient.id, this.flow.flow.id,mark]);
            },
            transferFlow(){
                this.$emit("transferflow")
            },
            cancelFlow(){
                var param={
                    flowId:this.safeData.flow.id,
                    extension: Object.assign(this.flow.flow.extension,{
                        operater:GlobalService.getCurrentUserSync().user
                    })
                };
                return $http({
                    url: '/service/business/referralflow/cancel',
                    type: 'POST',
                    data: param
                }).then(res=>{
                    this.$emit("refreshlist");
                    Sunset.tip("流程已撤销",'success')
                })
            },
            patientImg(img){
                return img?Base.transformNfsFilePath(img):"/assets/img/patient_image.jpg"
            },
            printTransfer(item){
                var patient=JSON.parse(this.flow.patient.extension);
                var visiting=this.flow.registration;
                //病人信息
                var printLabels= ['name', 'sex','patientAge','idCard','mobilePhone','socialCard'];
                var patientPrintInfo={};
                printLabels.map(v=>{
                    if(v=="patientAge"){
                        patientPrintInfo[v]= item.registration[v];
                    }else{
                        patientPrintInfo[v]= JSON.parse(item.patient.extension)[v];
                    }
                });
                //转诊信息
                var checkLabels=['transfertarget', 'transferreason','diagnose','maindoctor','doctortel','transferdate'];
                var transferInfoLsit={};
                checkLabels.map(v=>{
                    transferInfoLsit[v]= JSON.parse(item.flow.extension)[v];
                });
                GlobalService.CommonPrint('print-template-transferreport',{
                    hospital: GlobalService.getCurrentUserSync().relation.hospital[0].name,
                    subTitle1: '双向转诊单（存根）',
                    subTitle2: '双向转诊单',
                    patient: patientPrintInfo,
                    items: transferInfoLsit,
                    target:this.target,
                    extension:item.flow.extension&&JSON.parse(item.flow.extension),
                    applyTime: Sunset.Dates.format(new Date(),'yyyy-MM-dd')
                })
            }
        }
    }
</script>