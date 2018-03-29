<style lang='sass'>
.remotereport_flow_info{
    margin-bottom:10px;
    .flow_info{
        height:80px;
        background:#f2f2f2;
        padding:10px 0;
        &>div{
            float:left;
            height:60px;
        }
        &>.patient{
            width:50%;
            &>p{
                line-height:30px;
                height:30px;
            }
            &>.mian_info{
                font-size:16px;
                overflow:hidden;
                &>span{
                    display:inline-block;
                    margin-left:10px;
                }
            }
            &>.visiting_info{
                font-size:14px;
                &>span{
                    display:inline-block;
                    margin:0 10px;
                }
            }
        }
        &>.expert{
            width:12%;
            &>p{
                text-align:center;
                line-height:30px;
                height:30px;
            }
            .flow_in{
                text-align:center;
                height: 100%;
                line-height: 30px;
                cursor:pointer;
                color:#2cab8e;
            }
             i{
                vertical-align: bottom;
            }
        }
        &>.operate{
            width:18%;
            padding:15px 15px;
            padding-left:0px;
            float:right;
            &>div{
                text-align:center;
                height:30px;
                line-height:30px;
                float:right;
                cursor:pointer;
                border-radius:3px;
            }
            &>.flow_check{
                background:#00cc99;
                color:#fff;
                width:60px;
            }
        }
    }
}
</style>
<template>
    <div class="remotereport_flow_info">
        <div class="flow_info">
            <div class="patient">
                <p class="mian_info">
                    <span>{{flow.patient.name}}</span>
                    <span>{{patientAge}}</span>
                    <span>{{patientSex}}</span>
                    <span>{{flow.dicomArchivesInfo.dicomfileInfo.deviceType}}</span>
                    <span>{{flow.dicomArchivesInfo.checkPoints}}</span>
                    <span>{{flow.dicomArchivesInfo.checkMethod}}</span>
                    <span>报告人： {{flow.flow.target.name}}</span>
                    <!-- <span>{{flow.flow.extension.huanzheyijian}}</span> -->
                    <!-- <span style="color:#09f">审核通过</span> -->
                </p>
                <!-- <p class="visiting_info"><span>患者编号：{{safeData.registration.patientNumber}}</span> | <span>提交时间：{{safeData.flow.applyDate | time 'yyyy-MM-dd HH:mm'}}</span></p> -->
                <p class="visiting_info">
                    <span >影像号：{{flow.dicomArchivesInfo.dicomfileInfo.studyNo }}</span><!--|| "未提交影像"-->
                    <!-- <span>{{flow.hospital.name | ""}}</span> -->
                    <span>{{safeData.flow.fromEntity.name}}</span>
                    <!-- <span>{{flow.dicomArchivesInfo.dicomfileInfo.studyHospital}}</span> -->
                    <span>{{flow.flow.applyUser.name}}</span>
                    <!-- <span>{{flow.dicomArchivesInfo.dicomfileInfo.patientName}}</span> -->
                    <span>提交日期：{{flow.flow.applyDate | time 'yyyy-MM-dd HH:mm'}}</span> 
                    <!-- <span>影像日期：{{flow.dicomArchivesInfo.dicomfileInfo.studyDate | time 'yyyy-MM-dd HH:mm'}}</span>  -->
                </p>
                <!-- 医院号不准，先放着 -->
            </div>
            <div class="expert">
                <!-- <p style="font-size:16px">审：严涛</p> -->
                <!-- <p style="font-size:16px" v-show="true">报告人：{{flow.flow.target.name}}</p> -->
                <p style="font-size:16px"></p>
                <p style="font-size:16px; color: #39f;line-height: 20px;" v-show="baogaoshow"><span style="vertical-align: top;"><Icon type="person" size="20"></Icon>:{{reportWriters}} </span></p>
                <!-- <p style="font-size:16px" v-show="flow.flow.isRequestVideo">预约视频时间：{{flow.flow.videoStartDate | time 'yyyy/MM/dd'}}</p> -->
            </div>
            <div v-if="isVideo" class="expert"><!-- v-if="isWaiting&&isVideo&&isSelf"-->
                <div class="flow_in" @click="inVideo">
                    <Icon type="videocamera" size="48" style="margin-top: 0px;"></Icon>
                    <div style="display:inline-block">
                        <div style="margin-bottom: -7px; color: #657180;">{{videoDate}}</div>
                        <div style="margin-top: -7px; color: #657180;">{{videoTime}}</div>
                    </div>
                </div>  
                <!-- <div style="text-align:center;line-height:30px;height:30px;">{{videoDate}}</div> -->
            </div>
            <!-- {{flow | json}} -->
            <!-- v-if="!ispost"-->
            <div class="operate" v-if="!ispost"> 
                <div class="flow_check" @click="checkFlow">查看</div>
                <div v-if="!isVideo" class="flow_check" @click="addVideo" style="margin-right:10px" >预约视频</div>     
            </div>
            <div class="operate" v-if="ispost">
                <div class="flow_check" @click="checkFlow">处理</div>
                <div v-if="!(isVideo&&isWaiting)" class="flow_check" @click="addVideo" style="margin-right:10px" >预约视频</div>                
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data (){
            return {
                baogaoshow:false,
            }
        },
        props:{
            patient:{},
            flow:{},
            hospital:{},
            actived:''
        },
        computed:{
            // isWaiting(){
            //     return Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING')==this.safeData.flow.status&&this.actived=="个人";
            // },
            isVideo(){
                return this.safeData.flow.isRequestVideo;
            },
            isSelf(){
                return GlobalService.getCurrentUserSync().user.userId==this.safeData.flow.target.memberEntityId;
            },
            videoDate(){
                return Sunset.Dates.format(this.flow&&this.safeData.flow.videoStartDate,'yyyy-MM-dd');// HH:mm
            },
            videoTime(){
                return Sunset.Dates.format(this.flow&&this.safeData.flow.videoStartDate,'HH:mm');
            },
            isWaiting(){
                return Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING')==this.safeData.flow.status&&this.actived=="我的任务";
            },
            ispost(){
                // debugger
                // var ff = this.safeData.flow
                // var uu = GlobalService.getCurrentUserSync().user;
                // var ss = this.safeData.flow.targetId;
                // var status;
                if($(".active").html()=="咨询列表"){
                    return false
                }
                if($(".ivu-radio-wrapper-checked span:last-child").html()=="已完成"){
                    return false
                }
                if(Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING')==this.safeData.flow.status){status=true}else{
                        status=false&&this.actived=="个人";
                }
                return status
            },
            flowStatus(){
                var status1=this.safeData.flow;
                return Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING')==this.safeData.flow.status;
            },
            hospital(){
                return this.safeData.hospital || {}
            },
            safeData(){
                return this.flow || {}
            },
            patientAge(){
                return this.safeData.registration.patientAge&&this.safeData.registration.patientAge.replace(',','')
            },
            registeredDept(){
                return this.safeData.registration.registeredDept
            },
            applyData(){
                return this.safeData.flow.extension&&JSON.parse(this.safeData.flow.extension)
            },
            hasNew(){
                if(this.patient.hasNew){
                    return this.patient.hasNew?'hasNew':''
                }
            },
            patientDigest(){
                return JSON.parse(this.patient.registration.digest)
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
            checkMethod(){
                // console.log(JSON.parse(this.safeData.flow.extension))
                return JSON.parse(this.safeData.flow.extension)
            },
            reportWriters(){
                var readyuser = this.flow.flow.reportWriters&&this.flow.flow.reportWriters;
                var rr = [];var result=[];
                for(var i in readyuser){
                    rr.push(readyuser[i].name);
                };
                for(var i=0; i<rr.length; i++){
                    if(result.indexOf(rr[i])==-1){
                    result.push(rr[i])
                    }
                }
                // console.log(result)
                if(result.length>0){this.baogaoshow=true}
                return result;
            }



        },
        methods:{
            checkFlow(){
                // this.$emit('edit-card');
                this.$emit('check',[this.flow.patient.id, this.flow.flow.id]);
            },
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
            editDetail (){
                this.$emit('edit', this.patient.patient);
            },
            remoteReq(){
                this.$emit('remote',this.patient.patient);
            },
            inVideo(){
                GlobalService.OpenVideoTalk(`/video.html?room=${this.safeData.flow.id}&target=`);
                this.checkFlow();
            },
            addVideo(){
                // // alert("预约视频");
                // this.$refs.advideo.open({
                //     // patientId: patient.patientId,
                //     // hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0]
                //     //     .id,
                //     // registeredDept: '',
                //     // registeredDate: now,
                //     // patientAge: patient.birthday ? Base.calculateAge(new Date(
                //     // patient.birthday), now) : '',
                // });
                this.$emit('checked',[this.flow.patient.id, this.flow.flow.id]);
            }
        }
    }
</script>