<style lang='sass'>
    .triage_patient_box{
        float:left;
        margin:20px 10px;
        width:310px;
        height:162px;
        text-align:center;
        .patient_info{
            height:136px;
            width:100%;
            padding:0;
            overflow:hidden;
            &>div{
                float:left;
                width:20%;
            }
            .base_info1{
                height:35px;
                line-height:35px;
                width:100%;
                color:#fff;
                padding:0 15px;
                border-top-left-radius:5px;
                border-top-right-radius:5px;
                .patient_sex{
                    display:inline-block;
                    width:70px;
                    text-align:right;
                }
                .patient_name{
                    display:inline-block;
                    width:200px;
                    height:20px;
                    line-height:20px;
                    text-align:left;
                    font-size:16px;
                    font-weight:600;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    vertical-align: middle;
                }
                &.pending{
                    background:#ff0000;
                }
                &.doing{
                    background:#3399ff;
                }
                &.done{
                    background:#aeaeae;
                }
            }
            .base_info{
                width:100%;
                text-align:left;
                padding:10px 15px;
                height:101px;
                border:1px solid #ccc;
                border-top:none;
                &>p{
                    height:20px;
                    line-height:20px;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    &>img{
                        height:16px;
                        display:inline-block;
                        margin-bottom: -2px;
                        margin-right:5px;
                    }
                }
            }
            .patient_status{
                background-color:#00cc66;
                border-radius:2px;
                color:#fff;
                margin-left:25px;
                width:40px;
                height:20px;
                line-height:20px;
            }
        }
        .operate{
            cursor:pointer;
            height:40px;
            line-height:40px;
            border:1px solid #ccc;
            border-top:none;
            &>div{
                width:50%;
                float:left;
            }
            .operate_check{
                border-left:1px solid #ccc;
            }
        }
    }
</style>
<template>
    <div class="triage_patient_box">
        <div class="patient_info">
            <div class="base_info1" :class="visitingStatus">
                <span class="patient_name" :title='patient.patient.name'>{{patient.patient.name}}</span>
                <span class="patient_sex">{{patient.patient.sex | enum "SEX"}}/{{patientAge}}</span>
            </div>
            <div class="base_info">
                <p>来自{{patient.hospital.name}}</p>
                <p>{{patientDept}}</p>
                <p v-show="isTriaged"><img class="expert_icon" src='/assets/img/expert_icon.png'/><span style="display:inline-block">{{expertName}}<span></p>              
                <p>{{creatDate}}</p>
                <p style="color:#ff0000;font-size:12px;" v-show="visitingFinished">已取消问诊</p>
            </div>
            <!-- <div class="patient_status">{{patient.patient.status}}</div> -->
        </div>
        <div class="operate" v-show="triageWaitStatus">
            <div class="operate_choose" @click="chooseTriage">选择医生</div>
            <div class="operate_check" @click="triageDetail">查看</div>
        </div>
        <div class="operate" v-show="!triageWaitStatus" @click="triageDetail">查看</div>
    </div>
</template>
<script>
    export default{
        data (){
            return {

            }
        },
        props:{
            patient:""
        },
        computed:{
            patientDept(){
                return JSON.parse(this.patient.registration.digest).registeredDept
            },
            patientAge(){
                if(this.patient.registration.digest){
                var age = JSON.parse(this.patient.registration.digest).patientAge;
                    if(age){
                        return age.split(",").join("");
                    }
                }
                return ""
            },
            expertName(){
                if(this.patient.flow.expertUser){
                    return this.patient.flow.expertUser.name
                }
                return ""
            },
            visitingFinished(){
                if(this.patient.flow.status == Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','Finish') && !this.patient.flow.expertUserId){
                    return true
                }else{
                    return false
                }
            },
            isTriaged(){
                if(this.patient.flow.expertUserId){
                    return true
                }else{
                    return false
                }
            },
            visitingStatus(){
                var status="";
                if(this.patient.flow.status==Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','WaitTriage')){
                    status="pending";
                }else if(this.patient.flow.status==Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','Wait')){
                    status="doing";
                }else if(this.patient.flow.status==Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','HaveReceived')){
                    status="done";
                }else if(this.patient.flow.status==Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','Finish')){
                    status="done";
                };
                return status;
            },
            triageWaitStatus(){
                if(this.patient.flow.status != Sunset.Service.Dictionary.alias('DoctorRegistrationStatus','Finish') && !this.patient.flow.expertUserId){
                    return true
                }else{
                    return false
                }
            },
            creatDate(){
                if(this.patient.flow && this.patient.flow.applyDate){
                    return  Sunset.Dates.format(new Date(this.patient.flow.applyDate),'yyyy-MM-dd HH:mm')
                }else{
                    return ""
                }
            }
        },
        methods:{
            patientImg(img){
                return img?Base.transformNfsFilePath(img):"/assets/img/patient_image.jpg"
            },
            chooseTriage (){
                this.$emit('choose', this.patient);
            },
            triageDetail(){
                this.$emit('detail', this.patient);
            }
        }
    }
</script>