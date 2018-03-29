<style lang="sass">
    .video-card-view{
        .print_btn{
            display:inline-block;
            height:32px;
            line-height:32px;
            width:56px;
            font-size:12px;
            color:#fff;
            text-align:center;
            background:#2db7f5;
            border-radius:3px;
            float:right;
            margin-top:-10px
        }
        .report-table{
            .viewer-image{
                width:100px;
                height:100px;
            }
        }
    }
</style>
<template>
    <div class="video-card-view">
        <h3>阅片报告 <a v-if="currentUserType" class="print_btn" @click="printReport">打印</a></h3>
        <table class="report-table">
            <tr>
                <td style="height:30px"></td>
                <td style="height:30px;text-align:center;width:50%">右眼</td>
                <td style="height:30px;text-align:center">左眼</td>
            </tr>
            <tr>
                <td class="label">检查图片</td>
                <td style="width:50%">
                    <div v-if="images.right.length==0">未上传</div>
                    <div v-if="images.right.length!=0">
                        <div style="display:inline-block;margin-right:5px;" v-for="image in images.right" track-by="$index">
                            <img class="viewer-image" style="height:100px;width:auto;" :src="image | upload-image" />
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="images.left.length==0">未上传</div>
                    <div v-if="images.left.length!=0">
                        <div style="display:inline-block;margin-right:5px;" v-for="image in images.left" track-by="$index">
                            <img class="viewer-image" style="height:100px;width:auto;" :src="image | upload-image" />
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="label">图像所见</td>
                <td style="width:50%">{{{safeData.rightimg}}}</td>
                <td>{{{safeData.leftimg}}}</td>
            </tr>
            <tr>
                <td class="label">诊断结论</td>
                <td style="width:50%">{{{safeData.righteye}}}</td>
                <td>{{{safeData.lefteye}}}</td>
            </tr>
            <tr>
                <td class="label">DR分级</td>
                <td style="width:50%">{{rightDR}}</td>
                <td>{{leftDR}}</td>
            </tr>
            <tr>
                <td class="label">DME分级</td>
                <td style="width:50%">{{rightDME}}</td>
                <td>{{leftDME}}</td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        props: {
            card: {},
            data: {
            }
        },
        data() {
            return {
                editing:false,
                chronicDisease:123,
                newHistoryFields:[],
                newCheckFields:[],
            }
        },
        computed: {
            safeData() {
                return this.data || {};
            },
            rightDR(){
                return Sunset.Service.Dictionary.transcode('DR',this.safeData.DRright)
            },
            leftDR(){
                return Sunset.Service.Dictionary.transcode('DR',this.safeData.DRleft)
            },
            rightDME(){
                return Sunset.Service.Dictionary.transcode('DME',this.safeData.DMEright)
            },
            leftDME(){
                return Sunset.Service.Dictionary.transcode('DME',this.safeData.DMEleft)
            },
            images() {
                return this.safeData.checkimage?{'left':JSON.parse(this.safeData.checkimage).left,'right':JSON.parse(this.safeData.checkimage).right}:{'left':[],'right':[]}
            },
            currentUserType(){
                return Sunset.Service.Dictionary.transcode('SYSTEM_ACCOUNT_TYPE',GlobalService.getCurrentUserSync().user.userType)=="医助"
            }
        },
        methods: {
            printReport(){
                GlobalService.CommonPrint('print-template-tangreport',{
                    hospitalName: GlobalService.getCurrentUserSync().relation.hospital[0].name,
                    patientName: this.card.patient.name,
                    patientSex: Sunset.Service.Dictionary.transcode('SEX',this.card.patient.sex),
                    patientAge: this.card.visiting.patientAge.replace(',',""),
                    hospitalName: GlobalService.getCurrentUserSync().relation.hospital[0].name,
                    patientNumber: this.card.visiting.patientNumber,
                    idCard: this.card.patient.idCard,
                    registeredDept: this.card.visiting.registeredDept,
                    registeredDate: this.card.visiting.registeredDate,
                    mobilePhone: this.card.patient.mobilePhone,
                    images: this.images,
                    rightDR: this.rightDR,
                    leftDR: this. leftDR,
                    rightDME: this.rightDME,
                    leftDME: this.leftDME,
                    rightimg: this.safeData.rightimg,
                    leftimg: this.safeData.leftimg,
                    righteye: this.safeData.righteye,
                    lefteye: this.safeData.lefteye,
                    date:this.card.createDate,
                    doctor:this.card.digest.userName
                })
            }
        }
    }
</script>