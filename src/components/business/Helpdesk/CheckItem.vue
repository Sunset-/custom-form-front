<style lang='sass'>
.help_desk_info{
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
                    background:#78ca60;
                    color:#fff;
                    border-radius:3px;
                    font-size:12px;
                    min-width:50px;
                    text-align:center;
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
    <div class="help_desk_info">
        <div class="flow_info">
            <div class="patient">
                <p class="mian_info">
                    <span>{{flow.flow.reservationNumber}}</span><span>{{flow.patient.name}}</span><span>{{patientSex}}</span><span>{{patientAge}}</span>
                    <span v-if="safeData.patient.mobilePhone"><Icon type="ios-telephone"></Icon>{{safeData.patient.mobilePhone}}</span>
                    <span class="transefer_type" :style="transferType!='检查'?'background:#f9c':''">{{transferType?transferType:'转诊类型'}}</span>
                </p>
                <p class="mian_info" style="font-size:16px;"><span>初步诊断：{{diagnose}}</span><span v-if="checkNo">检查项目：{{checkNo}}</span></p>
                <p class="visiting_info"><span> <Icon type="android-home"></Icon> {{safeData.flow.fromEntity.name}}</span><span v-if="safeData.registration&&safeData.registration.registeredDept"> <Icon type="network"></Icon> {{safeData.registration&&safeData.registration.registeredDept}}</span><span> <Icon type="person"></Icon> {{safeData.flow.applyUser.name}}</span> | <span>提交日期：{{safeData.flow.applyDate | time 'yyyy-MM-dd HH:mm'}}</span></p>
            </div>
            <div class="expert">
                <p v-if="isPending"><span style="font-size:16px;color:#ffa65e">待登记</span></p>
                <p v-if="isInHospital&&!safeData.flow.hasPassiveClosed"><span style="font-size:16px;color:#ffa65e">已入院</span></p>
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
                            this.checkFlow(this.transferType=='检查')
                        }
                    },{
                        label: '确认转诊',
                        color: 'primary',
                        premise:()=>{
                            return this.isPending
                        },
                        operate: () => {
                            this.confirmInHospital(this.flow);
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
            checkNo(){
               var checkType= this.safeData.flow.extension&&JSON.parse(this.safeData.flow.extension).checkType;
               return checkType&&checkType.split(",").length
            },
            initTimeOut(){
                return this.safeData.flow.applyDate;
            },
            initTimeIn(){
                return this.safeData.flow.outReviewDate;
            },
            patientAge(){
                return this.safeData.registration&&this.safeData.registration.digest&&JSON.parse(this.safeData.registration.digest).patientAge.replace(',','')
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
            transferType(){
                if(this.safeData.flow.type&&this.safeData.flow.type=='ordercheck'){
                    return '检查'
                }else{
                    return this.safeData.flow.extension&&Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_TYPE',JSON.parse(this.safeData.flow.extension).transfertype)
                }
            },
            isPending(){
                return Sunset.Service.Dictionary.alias('HELP_CHECK','pending')==this.safeData.flow.detailStatus;
            },
            isInHospital(){
                return Sunset.Service.Dictionary.alias('HELP_CHECK','inhospital')==this.safeData.flow.detailStatus;
            },
            confirmIn(){
                return Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS','InConfirmed')==this.safeData.flow.detailStatus;
            },
            applyData(){
                return this.safeData.flow.extension&&JSON.parse(this.safeData.flow.extension)
            },
            diagnose(){
                return this.applyData.diagnose
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
            confirmInHospital(mark){
                this.$emit('confirm',this.flow);
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
            }
        }
    }
</script>