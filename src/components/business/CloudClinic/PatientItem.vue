<style lang='sass'>
    .patient_box{
        float:left;
        margin:20px 10px;
        width:310px;
        height:150px;
        text-align:center;
        .patient_info{
            height:124px;
            width:100%;
            padding:0;
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
                    width:170px;
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
                height:89px;
                border:1px solid #ccc;
                border-top:none;
                position:relative;
                &>p{
                    height:23px;
                    line-height:23px;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
                }
                .notice_tip{
                    width:30px;
                    position:absolute;
                    height: 35px;
                    display: inline-block;
                    top: 5px;
                    right: 5px;
                }
                .notice_tip:after{
                    content:'';
                    width:10px;
                    height:10px;
                    background:#ff0000;
                    border:1px solid #ff0000;
                    border-radius:50%;
                    position: absolute;
                    bottom: 10px;
                    right: 8px;
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
        .patient_status{
            background-color:#00cc66;
            border-radius:2px;
            color:#fff;
            margin-left:25px;
            width:40px;
            height:20px;
            line-height:20px;
        }
        .operate{
            cursor:pointer;
            height:40px;
            line-height:40px;
            border:1px solid #ccc;
            border-top:none;
            position:relative;
        }
        .hasNew:after{
            content: "";
            width: 10px;
            height: 10px; 
            background: red;
            border-radius: 50%;
            position: absolute;
            bottom:20px;
            right:120px;
            z-index:1;
        }
    }
</style>
<template>
    <div class="patient_box">
        <div class="patient_info">
            <div class="base_info1" :class="visitingStatus(patient.flow.status)">
                <span class="patient_name" :title='patient.patient.name'>{{patient.patient.name}}</span>
                <span class="patient_sex">{{patient.patient.sex | enum "SEX"}}/{{patientAge}}</span>
            </div>
            <div class="base_info">
                <p class="creat_date">来自{{patient.hospital.name}}</p>
                <p>{{patientDept}}</p>
                <p class="creat_date">{{creatDate}}</p>
                <span @click="receive" v-show="hasNew" class="notice_tip"><Icon size="25" type="ios-bell-outline"></Icon></span>
            </div>
            <!-- <div class="patient_status">{{patient.patient.status}}</div> -->
        </div>
        <div class="operate" v-show="!flowSatus"@click="receive">接诊</div>
        <div class="operate" v-show="flowSatus" @click="receive">查看</div>
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
            hasNew(){
                if(this.patient.hasNew){
                    return this.patient.hasNew?'hasNew':''
                }
            },
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
            flowSatus(){
                return this.patient.flow.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus','Finsih')
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
            visitingStatus(data){
                var status="";
                if(data==Sunset.Service.Dictionary.alias('RegistrationRecordStatus','Wait')){
                    status="pending";
                }else if(data==Sunset.Service.Dictionary.alias('RegistrationRecordStatus','HaveReceived')){
                    status="doing";
                }else if(data==Sunset.Service.Dictionary.alias('RegistrationRecordStatus','Finsih')){
                    status="done";
                };
                return status;
            },
            receive (){
                this.$emit('receive', this.patient);
            }
        }
    }
</script>