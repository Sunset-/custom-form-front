<style lang='sass'>
    .patient_info_box{
        float:left;
        margin:10px;
        width:310px;
        height:150px;
        border-radius:5px;
        text-align:center;
        .patient_info{
            height:115px;
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
                background:#3399ff;
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
            }
             .base_info{
                width:100%;
                text-align:left;
                padding:10px 15px;
                height:80px;
                border:1px solid #ccc;
                border-top:none;
                position:relative;
                &>p{
                    height:20px;
                    line-height:20px;
                    white-space:nowrap;
                    overflow:hidden;
                    text-overflow:ellipsis;
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
            border: 1px solid #ccc;
            border-top:0;
            width:100%;
            height:35px;
            line-height:35px;
            border-bottom-right-radius:5px;
            border-bottom-left-radius:5px;
            &>div{
                float:left;
                width:102px;
                height:35px;
                line-height:35px;
                box-sizing:border-box;
                cursor:pointer;
            }
            .edit_info{
            } 
            .new_registration,.vision{
                position:relative;
                border-left:1px solid #ccc;
            }
            .vision{
                
            }
        }
    }

</style>
<template>
    <div class="patient_info_box">
        <div class="patient_info">
            <div class="base_info1">
                <span class="patient_name" :title='patient.patient.name'>{{patient.patient.name}}</span>
                <span class="patient_sex">{{patient.patient.sex | enum "SEX"}}/{{patientAge}}</span>
            </div>
            <div class="base_info">
                <p>患者编号：{{patientDigest.patientNumber||""}}</p>
                <p>科室：{{patientDigest.registeredDept||""}}</p>
                <p class="creat_date">就诊：{{creatDate}}</p>
            </div>
            <!-- <div class="patient_status">{{patient.patient.status}}</div> -->
        </div>
        <div class="operate"> 
            <div class="edit_info"@click="editDetail">编辑资料</div>
            <div class="new_registration" @click="newRegistration">新建就诊</div>
            <div class="vision" @click="submitVideoQueue">视频登记</div>
        </div>
        <div class="operate" v-show='false'> 
            <div class="edit_info"@click="editDetail">编辑资料</div>
            <div class="new_registration" @click="newRegistration">新建就诊</div>
            <div class="vision" @click="remoteReq">预约视频咨询</div>
        </div>
    </div>
</template>
<script>
    import DoctorPatientStore from "./DoctorPatientStore.js";
    export default{
        data (){
            return {
                
            }
        },
        props:{
            patient:{},
        },
        computed:{
            hasNew(){
                if(this.patient.hasNew){
                    return this.patient.hasNew?'hasNew':''
                }
            },
            patientDigest(){
                // debugger; 日过有数据， 数据转JSON
                return this.patient.registration.digest?JSON.parse(this.patient.registration.digest):{}
            },
            patientAge(){
                // debugger;创建年龄
                if(this.patient.registration.digest){
                var age = JSON.parse(this.patient.registration.digest).patientAge;
                    if(age){
                        return age.split(",").join("");
                    }
                }
                return ""
            },
            creatDate(){
                // debugger; 创建日期
                if(this.patient.registration && this.patient.registration.digest){
                    var registeredDate = JSON.parse(this.patient.registration.digest).registeredDate;
                    return  Sunset.Dates.format(new Date(registeredDate),'yyyy-MM-dd HH:mm')
                }else{
                    return ""
                }
            }
        },
        methods:{
            newRegistration(){
                this.$emit("registration", this.patient.patient);
            },
            patientImg(img){
                return img?Base.transformNfsFilePath(img):"/assets/img/patient_image.jpg"
            },
            editDetail (){
                // debugger // 以编辑为例，，看看属性。  patient: 该病人的 属性。。。其父元素包括flow/hainew 等属性
                console.log(this.$emit);
                this.$emit('edit', this.patient.patient);
            },
            remoteReq(){
                this.$emit('remote',this.patient.patient);
            },
            submitVideoQueue(){
                this.$emit("videoqueue", this.patient.patient);
            }
        }
    }
</script>