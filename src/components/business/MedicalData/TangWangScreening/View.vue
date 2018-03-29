<style lang="sass">
    .history-table{
        .eye_image_box{
            display:inline-block;margin-left:5px;
            width: 100px;
            height: 100px;
            overflow: hidden;
            .eye_image{
                height:100px;
                transform: translate(-50%);
                margin-left: 50px;
            }
        }
    }
</style>
<template>
    <div class="video-card-view">
        <h3>病史信息 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn" v-ref:form style="float:right;padding:10px 0px;" :options="toolbarOptions" ></sunset-toolbar>
        <table class="history-table">
            <tr>
                <td class="label">主诉</td>
                <td>{{safeData.zhusu}}</td>
            </tr>
            <tr>
                <td class="label">相关病史</td>
                <td><span v-if='noDisease'>{{noDisease}}</span><span v-if='relateDisease'>{{relateDisease}}；</span><span v-if='bloodpre'>{{bloodpre}}；</span><span v-if='heartdisease'>{{heartdisease}}</span></td>
            </tr>
            <tr>
                <td class="label">现病史</td>
                <td>{{safeData.currentdisease}}</td>
            </tr>
            <tr>
                <td class="label">既往史</td>
                <td>{{safeData.pasthistory}}</td>
            </tr>
            <tr v-for=" item in newHistoryFields">
                    <td class="label">{{item[0]}}</td>
                    <td>{{item[1]}}</td>
            </tr>
        </table>
        <h3>查体信息</h3>
        <table class="history-table">
            <tr>
                <td class="label">血压</td>
                <td>{{{bloodpressure}}}</td>
                <td class="label">血糖</td>
                <td>{{bloodsugar}}</td>
            </tr>
            <tr>
                <td class="label">视力</td>
                <td>{{{vision}}}</td>
                <td class="label">眼压</td>
                <td>{{{pressure}}}</td>
            </tr>
            <tr v-for=" item in newCheckFields" class="extend_box">
                <td v-if="item[0]" class="label">{{item[0][0]}}</td>
                <td v-if="item[0]" >{{item[0][1]}}</td>
                <td v-if="item[1]" class="label">{{item[1][0]}}</td>
                <td v-if="item[1]" >{{item[1][1]}}</td>
            </tr>
        </table>
        <h3 style="float:left;">检查文件</h3>
        <table class="history-table">
            <tr>
                <td class="label">检查图片</td>
                <td>
                    <div v-if="images.right.length==0&&images.left.length==0&&images.other.length==0">未上传</div>
                    <div v-if="images.right.length!=0">
                        <div style="display:inline-block;vertical-align:top;width:50px">右眼</div>
                        <div  class="eye_image_box" v-for="image in images.right" track-by="$index">
                            <img @click="checkImage" class="eye_image" style="" onerror="this.src='/assets/img/nopic.png'" :src="image | upload-image" />
                        </div>
                    </div>
                    <div v-if="images.left.length!=0" style="border-top: 1px solid #ccc;padding-top:5px;">
                        <div style="display:inline-block;vertical-align:top;width:50px;">左眼</div>
                        <div class="eye_image_box" v-for="image in images.left" track-by="$index">
                            <img @click="checkImage" class="eye_image"  onerror="this.src='/assets/img/nopic.png'" :src="image | upload-image" />
                        </div>
                    </div>
                    <div v-if="images.other.length!=0" style="border-top: 1px solid #ccc;padding-top:5px;">
                        <div style="display:inline-block;vertical-align:top;width:50px;">未分类</div>
                        <div class="eye_image_box" v-for="image in images.other" track-by="$index">
                            <img @click="checkImage" class="eye_image"  onerror="this.src='/assets/img/nopic.png'" :src="image | upload-image" />
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="label">检查时间</td>
                <td>{{checkdate}}</td>
            </tr>
            <tr>
                <td class="label">报告文件</td>
                <td>
                    <div v-if="reportfile.length==0">未上传</div>
                    <attachmentfile-card v-for="attachment in reportfile" :data="attachment"></attachmentfile-card>
                    <!-- <div style="display:inline-block;margin-left:5px;" v-for="image in reportfile">
                        <img class="viewer-image" style="height:100px;width:auto;" :src="image.md5 | upload-image" />
                        <div :title="image.fileName" style="width:130px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" >{{image.fileName}}</div>
                    </div> -->
                </td>
            </tr>
            <tr>
                <td class="label">请求目的</td>
                <td>{{requesttarget}}</td>
            </tr>
        </table>
        <dicom-modal v-ref:remotereport>
            </dicom-modal>
    </div>
</template>
<script>
    import DicomModal from '../../FlowData/ApplyDicomReport/ApplyModal';
    export default {
        components: {
            DicomModal
        },
        props: {
            card: {},
            data: {},
            visitings:{},
            patient:{},
        },
        data() {
            return {
                chronicDisease:123,
                newHistoryFields:[],
                newCheckFields:[],
                toolbarOptions: {
                    align: 'center',
                    tools: [
                    //     {
                    //     label: '质量反馈',
                    //     color: 'error',
                    //     premise:()=>{
                    //         // return Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE',"DOCTOR")==GlobalService.getCurrentUserSync().user.userType;
                    //         return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
                    //     },
                    //     operate: () => {
                    //         this.$emit('edit-card','eyesqualitycontrol',null,{tangscreeningId:this.card.id})
                    //     }
                    // },{
                    //     label: '写报告',
                    //     color: 'info',
                    //     premise:()=>{
                    //         // return Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE',"DOCTOR")==GlobalService.getCurrentUserSync().user.userType;
                    //         return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
                    //     },
                    //     // operate: () => {
                    //     //     this.$emit('edit-card','tangwangreport',null,{tangscreeningId:this.card.id})
                    //     //     // this.editing = true;
                    //     //     // Router.go(`${this.$route.path}/${this.card.id}/report`);
                    //     // }
                    //     operate:(record)=>{
                    //         // debugger
                    //             var now = new Date();
                    //             console.log(this.data);
                    //             console.log(this.card);
                    //             this.$refs.remotereport.open({
                    //                 patientId: this.card.patientId,
                    //                 registrationRecordId:this.card.registrationRecordId,
                    //                 cardId : this.card.id,
                    //                 extension : this.card.extension
                    //             },this.visitings,this.patient);
                    //         }
                    // },
                    {
						label: '编辑',
                        color: 'info',
                        icon: 'edit',
                        //  配置的权限可见
						premise: () => {
							// return (GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias(
                            // 	'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT'));
                            return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
						},
						operate: () => {
                            this.$emit('edit-card');
						}
					},{
						label: '删除',
                        color: 'info',
                        icon: 'android-delete',
						premise: () => {
							return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
						},
						operate: () => {
                            this.$emit('remove-card');
						}
                    }
                    ]
                }
            }
        },
        computed: {
            safeData() {
                return this.data || {};
            },
            reportfile(){
                if(this.safeData.reportfile){
                    return JSON.parse(this.safeData.reportfile);
                }else{
                    return []
                }
            },
            checkdate(){
                return this.safeData.checkdate&&Sunset.Dates.format(new Date(this.safeData.checkdate),'yyyy-MM-dd');
            },
            newCheckFields(){
                var arr=[];
                for(var i in this.safeData){
                    i.indexOf("check_")==0&&arr.push(this.safeData[i].split("::"))
                };
                var b=[];
                do{b.push(arr.splice(0,2))}
                while(arr.length>=2);
                b.push(arr);
                return b
            },
            newHistoryFields(){
                var arr=[];
                for(var i in this.safeData){
                    i.indexOf("history_")==0&&arr.push(this.safeData[i].split("::"))
                };
                return arr
            },
            requesttarget(){
                return Sunset.Service.Dictionary.transcode('TANG_SCREEN_TARGET',this.safeData.requesttarget)
            },
            bloodsugar(){
                if(this.safeData.bloodsugar){
                    var bloodsugar=JSON.parse(this.safeData.bloodsugar);
                    if(bloodsugar.empty&&!bloodsugar.random){
                        return '空腹(' + bloodsugar.empty + 'mmol/L)';
                    }else if(!bloodsugar.empty&&bloodsugar.random){
                        return '随机(' + bloodsugar.random + 'mmol/L)';
                    }else if(bloodsugar.empty&&bloodsugar.random){
                        return '空腹(' + bloodsugar.empty + 'mmol/L) , 随机(' +  bloodsugar.random + 'mmol/L)';
                    }
                }else{
                    return "未填写"
                }
            },
            pressure(){
                if(this.safeData.eyepressure){
                    var eyepressure=JSON.parse(this.safeData.eyepressure);
                    return '右眼(' + (eyepressure.r2?eyepressure.r2 + 'mmHg':"未填写") + ') , 左眼(' + (eyepressure.l2?eyepressure.l2 + 'mmHg':"未填写") + ')';
                }else{
                    return "未填写"
                }
            },
            vision(){
                if(this.safeData.view){
                        var right=JSON.parse(this.safeData.view).right;
                        var left=JSON.parse(this.safeData.view).left;
                    if(left||right){
                        return '右眼(' + (right?(right=="-1"?"未知":right):"未填写") + ') , 左眼(' + (left?(left=="-1"?"未知":left):"未填写") + ')';
                    }else{
                        return "未填写"
                    }
                }
            },
            allCheck() {
                return this.card.visiting.checks && this.card.visiting.checks[0] && this.card.visiting.checks[0].value ||
                    0;
            },
            checkImg(){
                this.safeData.checkpicture;
            },
            noDisease(){
                if(this.safeData.otherdisease==""&&this.safeData.bloodpre==""&&this.safeData.heartdisease==""){
                    return '无'
                }
            },
            relateDisease() {
                var otherdisease,time1;
                if(this.safeData.otherdisease&&this.safeData.otherdisease!='0'){
                    otherdisease = this.safeData.otherdisease.split(',').join('，');
                }else{
                    otherdisease = ''
                }
                if(this.safeData.time1&&otherdisease){
                    time1 = this.safeData.time1.replace(',','');
                }else{
                    time1 = ''
                }
                return otherdisease + time1;
            },
            bloodpre() {
                var bloodpre,time2;
                if(this.safeData.bloodpre&&this.safeData.bloodpre!='0'){
                    bloodpre = this.safeData.bloodpre.split(',').join('，');
                }else{
                    bloodpre = ''
                }
                if(this.safeData.time2&&bloodpre){
                    time2 = this.safeData.time2.replace(',','');
                }else{
                    time2 = ''
                }
                return bloodpre + time2;
            },
            heartdisease() {
                var heartdisease;
                if(this.safeData.heartdisease&&this.safeData.heartdisease!='0'){
                    heartdisease = this.safeData.heartdisease.split(',').join('，');
                }else{
                    heartdisease = ''
                }
                return heartdisease;
            },
            bloodpressure() {
                if(this.safeData.bloodpressure){
                    var bloodpressure=JSON.parse(this.safeData.bloodpressure);
                    return '收缩压(' + (bloodpressure.low?bloodpressure.low + 'mmHg':"未填写") + ') , 舒张压(' + (bloodpressure.high?bloodpressure.high + 'mmHg':"未填写") + ')';
                }else{
                    return "未填写"
                }
            },
            images() {
                if(this.safeData.checkpicture){
                    var images = JSON.parse(this.safeData.checkpicture);
                }else{
                    return {'left':[],'right':[],'other':[]}
                }
                var right=[];
                var left=[];
                var other=[];
                    images.OS.map(v=>{
                        left.push(v.value)
                    });
                    images.OD.map(v=>{
                        right.push(v.value)
                    });
                    images.OU.map(v=>{
                        other.push(v.value)
                    });
                return {'left':left,'right':right,'other':other}
            }
        },
        methods: {
            checkImage(){
                Base.openEagleeyes(this.card.id,"EYEGROUND");
            },
            showCheckItem(alias) {
                return (this.allCheck & Sunset.Service.Dictionary.alias('SCREENING_EYES_DEPT', alias)) == Sunset.Service
                    .Dictionary.alias('SCREENING_EYES_DEPT', alias);
            }
        }
    }
</script>