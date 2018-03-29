<style lang='sass'>
.consultation_flow_info{
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
            width:45%;
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
            width:20%;
            &>p{
                text-align:center;
                line-height:30px;
                height:30px;
                & .operater{
                    word-wrap: break-word;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .flow_in{
                text-align:center;
                cursor:pointer;
                height:60px;
            }
        }
        &>.operate{
            padding:15px 20px;
            float: right;
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
                width:70px;
            }
        }
    }
}
</style>
<template>
    <div class="consultation_flow_info">
        <div class="flow_info">
            <div class="patient">
                <p class="mian_info">
                    <span>{{flow.patient.name}}</span><span>{{patientSex}}</span><span>{{patientAge}}</span></span>
                    <span v-if="suqiu">目的：{{suqiu}}</span>
                    <span>邀请会诊：<span style="color: #39f;">{{target}}</span></span>
                </p>
                <p class="visiting_info"><span>提交人：{{safeData.flow.fromEntity.name}} {{safeData.flow.applyUser.name}}</span> | <span>提交时间：{{safeData.flow.applyDate | time 'yyyy-MM-dd HH:mm'}}</span></p>
            </div>
            <div class="expert">
                <p v-if="!targetDoctor"><span style="color:#ffa65e;font-size:16px;">
                    {{flowStatus}}</span><span v-if="operaters" class="operater" :title="operaters">（<Icon type="person" size="16"></Icon> {{operaters}}）</span>
                    <span v-if="flow.imhasnew" style="position: fixed;padding-left: 5px;"> <Icon type="chatbubble-working" color="red" size="16"> </Icon>  </span>
                </p>  
                <p v-if="targetDoctor"><span style="color:#ffa65e;font-size:16px;">
                    {{flowStatus}}</span><span v-if="targetDoctor" class="operater" :title="targetDoctor">（<Icon type="person" size="16"></Icon> {{targetDoctor}}）</span>
                    <span v-if="flow.imhasnew" style="position: fixed;padding-left: 5px;"> <Icon type="chatbubble-working" color="red" size="16"> </Icon>  </span>
                </p>  
            </div>
            <div  v-if="isVideo" class="expert">
                <div class="flow_in" @click="inVideo">
                    <Icon type="videocamera" size="48" style="height:60px;line-height:60px;display:inline-block;color:#2cab8e;"></Icon>
                    <span style="height:30px;line-height:30px;display:inline-block">{{videoDate}}<br>{{videoTime}}</span>
                </div>  
            </div>
            <div class="operate" v-if="!isWaiting">
                <div class="flow_check" @click="checkFlow">查看</div>
                <div v-if="!isVideo" class="flow_check" @click="addVideo" style="margin-right:10px" >预约视频</div>   
            </div>
            <div class="operate" v-if="isWaiting">
                <div class="flow_check" @click="checkFlow">处理</div>
                <div v-if="!isVideo&&isWaiting" class="flow_check" @click="addVideo" style="margin-right:10px" >预约视频</div>     
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data (){
            return {

            }
        },
        props:{
            patient:{},
            flow:{},
            actived:''
        },
        computed:{
            safeData(){
                var f = this.flow;
                return this.flow || {}
            },
            target() {
                var target = this.flow.flow.target;
                var dept=[];
                target.uppers.forEach(item=>{
                    if(item.category.indexOf("01")==0){
                        dept.push(item.name)
                    }else if(item.category.indexOf("02")==0){
                        dept.push(item.name)
                    }else if(item.category.indexOf("03")==0){
                        dept.push(item.name)
                    }else if(item.category.indexOf("04")==0){
                        dept.push(item.name)
                    }else{
                        dept += item.name
                    }
                });
                target.name&&dept.unshift(target.name);
                return dept.reverse().join("-");
            },
            targetDoctor(){
                var target = this.flow.flow.target;
                if(target.category.indexOf("00")==0){
                    return target.name
                }else{
                    return ''
                }
            },
            operaters(){
                var operaters = this.safeData.flow.flowCards;
                if(operaters.length){
                    return this.safeData.flow.flowCards.map(item=>item.name).join(" ");
                }else{
                    return ''
                }
            },
            isVideo(){
                return this.safeData.flow.isRequestVideo;
            },
            isSelf(){
                return this.safeData.flow.target.category.indexOf("00")==0 && GlobalService.getCurrentUserSync().user.userId==this.safeData.flow.target.id;
            },
            videoDate(){
                return Sunset.Dates.format(this.flow&&this.safeData.flow.videoStartDate,'yyyy-MM-dd');
            },
            videoTime(){
                return Sunset.Dates.format(this.flow&&this.safeData.flow.videoStartDate,'HH:mm');
            },
            isWaiting(){
                return Sunset.Service.Dictionary.alias('FLOW_STATUS','WAITING')==this.safeData.flow.status;
            },
            flowStatus(){
                return Sunset.Service.Dictionary.transcode('FLOW_STATUS',this.safeData.flow.status);
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
            suqiu(){
                return this.applyData.target&&Sunset.Service.Dictionary.transcode('CONSULTATION_TARGET',this.applyData.target)
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
            }
        },
        methods:{
            checkFlow(){
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
            inVideo(){
                GlobalService.OpenVideoTalk(`/video.html?room=${this.safeData.flow.id}&target=`);
                this.checkFlow();
            },
            editDetail (){
                this.$emit('edit', this.patient.patient);
            },
            remoteReq(){
                this.$emit('remote',this.patient.patient);
            },
            addVideo(){
                this.$emit('checked',[this.flow.patient.id, this.flow.flow.id]);
            }
        }
    }
</script>