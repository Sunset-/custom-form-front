<style lang="sass">
    .video-reportcard-view {
        font-size: 14px;
        color: #333;
        padding: 10px 0px;
        width: 100%;
        margin: 20px auto;
        text-align: -webkit-center;
        padding-bottom: 10px;
        &>h3 {
            font-weight: bold;
            padding: 15px 0px;
        }
        &>table {
            tr{
                border-bottom: 1px solid #CCC;  
                border-top: 1px solid #CCC;              
            }
            width: 100%;
            border-collapse: collapse;
            td {
                padding: 10px;
                &.label {
                    background: #F2F2F2;
                    font-weight: bold;
                    width: 100px;
                    padding: 15px 0px;
                    text-align: center;
                }
                &>.records{
                    cursor:pointer;
                    color:#39f;
                    &:hover{
                        color:darken(#39f,10%);
                    }
                }
            }
        }
    }


</style>
<template>
    <div class="video-card-view">
        <!-- {{card | json}}
        {{data | json}}
        {{flow | json}} -->
        <h3>影像检查 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <sunset-toolbar class="viewbtn"  v-ref:form style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
        <table class="history-table">
            <!-- <tr>
                <td class="label">检查影像</td>
                <td>
                    <dicom-card :size="180" :data="study" viewable></dicom-card>
                </td>
            </tr>
            <tr>
                <td class="label">检查项目</td>
                <td>{{study.deviceType}}</td>
            </tr>
            <tr>
                <td class="label">检查时间</td>
                <td>{{study.studyDate | time}}</td>
            </tr>
            <tr v-if="checkPoints">
                <td class="label">检查部位</td>
                <td>{{checkPoints}}</td>
            </tr>
            <tr v-if="checkMethod">
                <td class="label">检查方法</td>
                <td>{{checkMethod}}</td>
            </tr>
            <tr v-if="position">
                <td class="label">方位</td>
                <td>{{position}}</td>
            </tr>
            <tr v-if="series">
                <td class="label">序列</td>
                <td>{{series}}</td>
            </tr>
            <tr v-if="attachments">
                <td class="label">原始报告</td>
                <td>
                    <attachmentfile-card v-for="attachment in attachments" :data="attachment"></attachmentfile-card>
                </td>
            </tr>
            <tr>
                <td class="label">请求诊断建议</td>
                <td>{{safeData.property?'是':'否'}}</td>
            </tr> -->

<!-- 新版table -->

            <tr v-if="flow">
                <td class="label">
                    提交医院
                </td>
                <td colspan="4">
                    {{flow.fromEntity.name}}
                    {{flow.applyUser.name}} 
                </td>
            </tr>
            <tr v-if="flow">
                <td class="label">
                    患者信息
                </td>
                <td colspan="4">
                    {{patient.name}}
                    {{cardsex}}
                    {{patientAge}}
                </td>
            </tr>
            <tr v-if="flow">
                <td class="label">
                    所选病历
                </td>
                <td colspan="4">
                    <span style="cursor:pointer;color:#39f;" @click="activeVisiting(bingli)"  v-for="bingli in flow.extension.records">
                            <Icon type="android-document" size="20"  style="color：#52687d;"></Icon>
                        {{bingli.split("_")[0]}}
                    </span>
                </td>
            </tr>
            <tr>
                <td class="label" rowspan="4">影像文件</td>
                <td rowspan="4" width="40%">
                    <dicom-card :size="180" :data="study" viewable>

                    </dicom-card>
                    </td>
                <td class="label">检查部位</td>
                <td>{{checkPoints}}</td>
            </tr>
            <tr>
                <td class="label">检查方法</td>
                <td>{{checkMethod}}</td>
            </tr>
            <tr>
                <td class="label">方位</td>
                <td>{{position}}</td>
            </tr>
            <tr>
                <td class="label">序列</td>
                <td>{{series}}</td>
            </tr>
            <tr>
                <td class="label">原始报告</td>
                <td colspan="3"><attachmentfile-card v-for="attachment in attachments" :data="attachment"></attachmentfile-card></td>
            </tr>
            <!-- <tr>
                <td class="label">请求诊断建议</td>
                <td colspan="3">{{safeData.property?'是':'否'}}</td>
            </tr> -->
        </table>
        <dicom-modal v-ref:remotereport @submited="refreshFlows">
            </dicom-modal><!-- @saved="savedVisiting"-->
        <!-- 编辑报告 -->
        <!-- <sunset-toolbar style="padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar> -->
    <!-- {{patient | json}} -->
    </div>
</template>
<script>
    // import PatientInfo from '../../PatientDetail/PatientInfo';
    // import PatientFlow from '../../PatientDetail/PatientFlow';
    import DicomModal from '../../FlowData/ApplyDicomReport/ApplyModal';
    import MedicalDataStore from '../MedicalDataStore.js';

    export default {
        components: {
            DicomModal
        },
        props: {
            card: {},
            data: {},
            flow:{},
            patient: {},
            visitings:{},
            bingli:{}
        },
        methods: {
            refreshFlows(){
                this.$emit('refresh-flows');
            },
            activeVisiting(bingliid){
                var visitingId = bingliid.split("_")[1];
                this.$emit('visiting',visitingId);

                // alert(visitingId);
                // return
                // MedicalDataStore.getVisitingcardsByRecordids(visitingId).then(res=>{
                //     res&&res.length&&this.$emit('visiting', res[0]);
                // });
            }
        },
        computed: {
            safeData() {
                var d = this.data;
                var f= this.flow;
                var c = this.card;
                var p = this.patient;
                var v =this.visitings;
                var b =this.bingli;
                return this.data || {};
            },
            videos() {
                var videos = this.safeData.videos;
                return videos ? JSON.parse(videos) : [];
            },
            checkMethod() {
                var v = this.safeData.checkMethod;
                if (v) {
                    return v.split(';').map(item => item.split(',')[1] || item.split(',')[0]).join(',');
                } else {
                    return '';
                }
            },
            checkPoints() {
                var v = this.safeData.checkPoints;
                if (v) {
                    return v.split(';').map(item => item.split(',')[1] || item.split(',')[0]).join(',');
                } else {
                    return '';
                }
            },
            position() {
                var v = this.safeData.position;
                if (v) {
                    return v.split(';').map(item => item.split(',')[1] || item.split(',')[0]).join(',');
                } else {
                    return '';
                }
            },
            series() {
                var v = this.safeData.series;
                if (v) {
                    return v.split(';').map(item => item.split(',')[1] || item.split(',')[0]).join(',');
                } else {
                    return '';
                }
            },
            study() {
                return this.safeData.dicomfile ? JSON.parse(this.safeData.dicomfile) : {};
            },
            attachments() {
                var accessories = this.safeData.accessories;
                console.log(this.safeData);
                if (accessories) {
                    try {
                        return JSON.parse(accessories);
                    } catch (e) {
                        return [];
                    }
                }
            },
            cardsex(){
                return Sunset.Service.Dictionary.transcode('SEX',this.patient.sex)
            },
             patientAge(){
                var age = this.patient.extension.patientAge&&this.patient.extension.patientAge.split(",");
                age = age[0] + age[1];
                return age;
            },
        },
        data() {
            return {
                chronicDisease:123,
                newHistoryFields:[],
                newCheckFields:[],
                toolbarOptions: {
                    tools: [
                    {
                        label: '申请报告',
                        color : 'success',
                        icon:'fork-repo',
                        // operate: () => {
                        //     console.log(this.data);
                        //     this.$emit('new-card','dicomreport',null,{
                        //        dicomArchivesId:this.data.id,
                        //        checkMethod:this.data.checkMethod,
                        //        checkPoints:this.data.checkPoints,
                        //        dicomfile:this.data.dicomfile,
                        //        position:this.data.position,
                        //        series:this.data.series,
                        //     });
                        // }  
                        premise: () => {
                            // var c=this.card.creatorId;
                            // var u=GlobalService.getCurrentUserSync().user.userId;
                            // debugger
                            if(this.$route.path.startsWith('/RemoteReport')){
                                return false;
                            }
                            // return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
                            return true
						},                      
                        operate:(record)=>{
                            // debugger
                                var now = new Date();
                                console.log(this.data);
                                console.log(this.card);
                                this.$refs.remotereport.open({
                                    patientId: this.card.patientId,
                                    registrationRecordId:this.card.registrationRecordId,
                                    cardId : this.card.id,
                                    extension : this.card.extension
                                },this.visitings,this.patient,this.data.dicomfile);//this.data.dicomfile
                            }
                    },{
						label: '编辑',
                        color: 'info',
                        icon: 'edit',
                        //  配置的权限可见
                        premise: () => {
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
					}]
                }
            }
        },

    }
</script>