<style lang="sass">
.consultation{
    .consultation_bar{
        height:60px;
        padding:15px;
        width: 100%;
        background: #fff;
        .sunset-toolbar-item>button{
            border:1px dashed #ccc;
        }
    }
    .consultation-view{
        padding: 10px;
        background: #FFF;
        border: 1px solid #E1E1E1;
        box-shadow: 2px 2px 5px #ddd;
        margin: 10px 5px 0 5px;
        font-size: 14px;
        &>h3 {
            padding: 15px 0px;
            color: #8d8d8d;
            font-weight: 500;
            >span{
                font-size: 1rem;
                font-weight: normal;
            }
        }
        &>.consultation-table{
            width: 100%;
            border-collapse: collapse;
            .video_entrance{
                display:inline-block;
                border:1px solid #39f;
                border-radius:3px;
                height:25px;
                line-height:23px;
                text-align:center;
                width:80px;
                background:#39f;
                color:#fff;
                margin-left:50px;
            }
            td {
                padding: 10px;
                border: 1px solid #CCC;
                &.label {
                    background: #F2F2F2;
                    font-weight: bold;
                    width: 100px;
                    padding: 15px 5px;
                    text-align: left;
                }
                & .records{
                    cursor:pointer;
                    color:#39f;
                    margin-right:10px;
                    &:hover{
                        color:darken(#39f,10%);
                    }
                }
                &.short-value {}
            }
        }
    }
    & .vv-content {
        border: 5px solid transparent;
        overflow: auto;
        .vv-card-view {
            width: 100%;
            padding: 10PX;
            background: #FFF;
            border: 1px solid #E1E1E1;
            box-shadow: 2px 2px 5px #ddd;
            margin-bottom: 5px;
        }
    } 
}
</style>
<template>
    <div class="consultation">
        <sunset-toolbar  v-if="isApplyUser" class="consultation_bar" v-ref:form :options="toolbarOptions" ></sunset-toolbar>
        <div class="consultation-view">
            <h3>会诊诉求 <span> ({{flow.applyDate | time 'yyyy/MM/dd HH:mm'}}  {{flow.applyUser.name}}提交) </span></h3>
            <table class="consultation-table">
                <tr>
                    <td class="label">患者信息</td>
                    <td colspan="3">{{patientData&&patientData.name}} {{patientData&&patientData.sex | enum "SEX"}} {{patientData&&patientData.patientAge&&patientData.patientAge.replace(',','')}} {{patientData&&patientData.mobilePhone}}
                    </td>
                </tr>
                <tr>
                    <td class="label">所选病历</td>
                    <td colspan="3">
                        <span class="records" v-for="item in flowData.recordslist" @click="activeVisiting(item)"><Icon type="android-document" size="20"  style="color：#52687d;margin-right:5px;"></Icon>{{item.split("_")[1]}}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">来自医院</td>
                    <td>{{flow.fromEntity.name}}</td>
                </tr>
                <tr>
                    <td class="label">邀请会诊</td>
                    <td>{{target}}</td>
                </tr>
                <tr>
                    <td class="label">会诊目的</td>
                    <td>{{consultationTtarget}}</td>
                </tr>
                <tr>
                    <td class="label">患者意见</td>
                    <td>{{flowData.suggest}}</td>
                </tr>
                <tr>
                    <td class="label">初步诊断</td>
                    <td colspan="3">{{flowData.diagnose}}</td>
                </tr>
                <tr>
                    <td class="label">治疗经过</td>
                    <td>{{flowData.experience}}</td>
                </tr>
                <tr v-if="flow.isRequestVideo">
                    <td class="label">预约视频</td>
                    <td v-if="flow.isRequestVideo">{{orderdate }}<i-button type="primary" style="margin-left:20px;" @click="inVideo">进入视频</i-button></td>
                    <td v-if="!flow.isRequestVideo">未预约</td>
                </tr>
            </table>
        </div>
        <div class="vv-content">
            <div v-for="card in cards" :class="['vv-card-view',card.viewName]">
                <component :is="'md-'+card.viewName+'-view'" :card="card" :data="card.extension" @edit-card="editCard(card)" @remove-card="removeCard(card)"></component>
            </div>
        </div>
    </div>
        <!-- <consultation-im :roomid="flow.id" :roomname="'疑难会诊'"></consultation-im> -->
</template>
<script>
    import ConsultationStore from './ConsultationStore.js';
    import MedicalDataStore from '../../MedicalData/MedicalDataStore.js';
    // import ConsultationIm from '../ConsultationIm/Im.vue';

    export default {
        components: {
            // ConsultationIm
        },
        props: {
            patient : {},
            flow : {},
            card: {},
            data: {

            }
        },
        ready(){
            this.data.refresh = () => {
                this.refresh();
            }
            this.refresh();
        },
        computed: {
            safeData() {
                return this.data || {};
            },
            target() {
                var target = this.flow.target;
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
                dept.unshift(target.name);
                return dept.reverse().join("-")
            },
            patientData(){
                return this.patient&&this.patient.extension;
            },
            orderdate(){
                return Sunset.Dates.format(this.flow&&new Date(this.flow.extension.orderdate).getTime(),'yyyy-MM-dd HH:mm');
            },
            flowData() {
                if(Sunset.isString(this.flow.extension)){
                    return this.flow&&this.flow.extension&&JSON.parse(this.flow.extension) || {};
                }else{
                    return this.flow&&this.flow.extension || {}
                }
            },
            isApplyUser(){
                return this.flow.applyUserId != GlobalService.getCurrentUserSync().user.userId;
            },
            consultationTtarget(){
                return this.flowData.target?Sunset.Service.Dictionary.transcode('CONSULTATION_TARGET',this.flowData.target):''
            }
        },
        data() {
            return {
                cards: [],
                toolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '会诊意见',
                        color: 'ghost',
                        icon: 'android-add',
						operate: () => {
                            this.addCard('consultationsuggest','会诊意见')
						}
					},{
						label: '诊断及治疗方案',
                        color: 'ghost',
                        icon: 'android-add',
						operate: () => {
                            this.addCard('cure','诊断及治疗方案')
						}
					},{
						label: '检查申请单',
                        color: 'ghost',
                        icon: 'android-add',
						operate: () => {
                            this.addCard('checkapply','检查申请单')
						}
					},{
						label: '化验申请单',
                        color: 'ghost',
                        icon: 'android-add',
                        operate: () => {
                            this.addCard('laboratoryapply','化验申请单')
						}
					},{
						label: '处方',
                        color: 'ghost',
                        icon: 'android-add',
						operate: () => {
                            this.addCard('prescription','处方')
						}
					}]
                }
            }
        },
        methods: {
            addCard(viewName,tabName){
                console.log(this.flow)
                this.$emit('edit-card', {
                    lastModifyDate: 0,
                    viewName: viewName,
                    flowId : this.flow.id,
                    patientId: this.patient.patientId,
                    digest: {},
                    _editing: true,
                    _dirty: true
                }, tabName,this.flow);
            },
            refresh(){
                ConsultationStore.getCards(this.flow.id).then(res=>{
                    this.cards=res.map(item=>{
                        if(item.extension){
                            item.extension = JSON.parse(item.extension)
                        }
                        if(item.digest){
                            item.digest = JSON.parse(item.digest)
                        }
                        item.patient = this.patient;
                        return item
                    });
                });
            },
            inVideo(){
                GlobalService.OpenVideoTalk(`/video.html?room=${this.flow.id}&target=`);
            },
            editCard(card){
                card.visiting = this.data.visiting,
                MedicalDataStore.getCard(card.viewName).then(cardTemplate=>{
                    this.$emit('edit-card',card, cardTemplate.viewLabel);
                });
            },
            removeCard(card){
                var clear = Sunset.confirm({
                    content: '确定删除此资料？',
                    loading: true,
                    onOk: () => {
                        MedicalDataStore.removeCards(card.id).then(res=>{
                            this.$emit('refresh');
                        });
                        clear();
                    }
                });
            },
            activeVisiting(visiting){
                var visitingId = visiting.split("_")[0];
                MedicalDataStore.getVisitingcardsByRecordids(visitingId).then(res=>{
                    res&&res.length&&this.$emit('visiting', res[0]);
                });
            }
        }
    }
</script>