<style lang="sass">
.order_check{
    &>.tool_bars{
        position:fixed;
        bottom:0;
        left:250px;
        width: 100%;
        z-index:100;
        background: rgba(0,0,0,0.7);
        text-align: center;
        &>.transfer_bar{
            height:60px;
            padding:15px 0;
            text-align: center;
            margin-right: 125px
        }
    }
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
    <div class="order_check">
        <sunset-toolbar  v-if="isApplyUser" class="consultation_bar" v-ref:form :options="cardOperateOptions" ></sunset-toolbar>
        <div class="tool_bars" v-if="hasToolbars&&!isOut">
            <sunset-toolbar class="transfer_bar" v-ref:form :options="toolbarOptions"></sunset-toolbar>
        </div>
        <div class="consultation-view">
            <h3>预约检查 <span> ({{flow.applyDate | time 'yyyy/MM/dd HH:mm'}}  {{flow.applyUser.name}}提交) </span></h3>
            <table class="consultation-table">
                <tr>
                    <td class="label">患者信息</td>
                    <td colspan="3">{{patientData&&patientData.name}} {{patientData&&patientData.sex | enum "SEX"}} {{patientData&&patientData.patientAge&&patientData.patientAge.replace(',','')}} {{patientData&&patientData.mobilePhone}}
                            <p><span v-if="flow.patientNumber">门诊/住院号：{{flow.patientNumber}}  </span><span v-if="flow.toHospitalDate">就诊日期：{{flow.toHospitalDate | time 'yyyy/MM/dd HH:mm'}}  </span><span v-if="patientData&&patientData.socialCard">医保类型：{{patientData&&patientData.socialCard | enum 'MEDICARE'}}  </span>
                                <span v-if="flow.receiveDept&&flow.receiveDept.name">接诊科室：{{flow.receiveDept&&flow.receiveDept.name}}</span><span v-if="flow.receiveUser&&flow.receiveUser.name">  接诊医生：{{flow.receiveUser&&flow.receiveUser.name}}</span>
                            </p>
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
                    <td>{{fromHospital}}</td>
                </tr>
                <tr>
                    <td class="label">初步诊断</td>
                    <td colspan="3">{{flowData.diagnose}}</td>
                </tr>
                <tr>
                    <td class="label">检查项目</td>
                    <td>
                        <div v-for="item in checkType" style="border:1px dashed #ccc;border-radius:5px;padding:15px 10px;display:inline-block;margin-right:10px;min-width:200px;">
                            <div>类型：<span style="color:#39f;">{{item.value.categoryA}}</span></div>
                            <div>{{item.value.categoryB}}</div>
                            <div>{{item.value.item}}</div>
                            <div v-if="!item.status&&flow.detailStatus>=6&&isMedicalCenter" style="border:1px dashed #ccc;border-radius:5px;padding:5px;color:#39f;text-align:center;cursor:pointer;width:100px;" @click="finalConfirm(item.cardId)">确认检查</div>
                            <div v-if="item.status&&flow.detailStatus>=6&&isMedicalCenter" style="color:#00cc99">检查已确认</div>
                        </div>
                    </td>
                </tr>
                <tr v-if="flow.isRequestVideo">
                    <td class="label">预约视频</td>
                    <td v-if="flow.isRequestVideo">{{orderdate }}<i-button type="primary" style="margin-left:20px;" @click="inVideo">进入视频</i-button></td>
                    <td v-if="!flow.isRequestVideo">未预约</td>
                </tr>
            </table>
        </div>
        <div class="consultation-view" v-for="item in checkItemData">
            <h3>检查审核 <span> ({{flow.applyDate | time 'yyyy/MM/dd HH:mm'}}  {{flow.applyUser.name}}提交) </span></h3>
            <table class="consultation-table">
                <tr>
                    <td class="label">检查项目</td>
                    <td colspan="3">{{item.checkItem.categoryA}}/{{item.checkItem.categoryB}}/{{item.checkItem.item}}</td>
                </tr>
                <tr>
                    <td class="label">确认时间</td>
                    <td>{{item.confirmDate | time 'yyyy/MM/dd HH:mm'}}</td>
                    <td class="label">审核人</td>
                    <td>{{item.operator.name}}</td>
                </tr>
            </table>
        </div>
        <sunset-form-modal v-ref:confirminhospital :options="{title : '确认入院',width :600, style : 'max-height:400px', formOptions:confirmOptions}" @cancel="cancel">
        </sunset-form-modal>
        <div class="vv-content">
            <div v-for="card in cards" class="vv-card-view">
                <component :is="'md-'+card.viewName+'-view'" :card="card" :data="card.extension" @edit-card="editCard(card)" @remove-card="removeCard(card)"></component>
            </div>
        </div>
    </div>
        <!-- <consultation-im :roomid="flow.id" :roomname="'疑难会诊'"></consultation-im> -->
</template>
<script>
    import ConsultationStore from './ConsultationStore.js';
    import MedicalDataStore from '../../MedicalData/MedicalDataStore.js';
    import Store from '../Store';
    // import ConsultationIm from '../ConsultationIm/Im.vue';

    export default {
        components: {
            // ConsultationIm
        },
        props: {
            patient : {},
            flow : {},
            card: {},
            visitings:{},
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
            hasToolbars(){
                if(this.flow.hasPassiveClosed){
                    return false
                }else{
                    return this.toolbarOptions.tools.filter(item=>{
                        return item.premise();
                    }).length;
                }
            },
            fromHospital(){
                if(this.flow&&this.flow.fromEntity.category&&this.flow.fromEntity.category==Sunset.Service.Dictionary.alias('ORG_CODE','PERSONAL')){
                    return this.flow.fromEntity.hospital;
                }else{
                    return this.flow.fromEntity.name;
                }
            },
            isOut() {
                return this.flow.fromEntityId == GlobalService.getCurrentUserSync().relation.hospital[0].id
            },
            checkItemData(){
                var data=[];
                this.flow.applyCheckItems.forEach(item=>{
                    if(item.operator){
                        data.push(item);
                    }
                });
                return data
            },
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
            isMedicalCenter(){
                return GlobalService.getCurrentUserSync().relation.isBelongToOfficeCategory(Sunset.Service.Dictionary.alias('ORG_CODE','MEDICAL_CENTER'))
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
            checkType(){
                var checkType=[];
                this.flow.applyCheckItems.forEach(value=>{
                    checkType.push({value:value.checkItem,id:value.checkItem.id,status:value.status,cardId:value.cardId})
                });
                return checkType
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
                address:'',
                confirmOptions:{
                    cols: 2,
                    submit:(model)=>{
                        var receiveDeptId = model.dept&&model.dept.slice(model.dept.lastIndexOf(",")+1);
                        var param = {
                            flow: JSON.stringify({
                                id: this.flow.id,
                                extension: Object.assign(this.flow.extension,{
                                    idCard:model.idCard,
                                    receiveUserId:model.doctor,
                                    receiveDeptId:receiveDeptId,
                                    confirmNotes:model.notesIn,
                                    operater:GlobalService.getCurrentUserSync().user
                                }),
                                toHospitalDate:model.totime,
                                receiveDeptId:receiveDeptId,
                                receiveUserId:model.doctor   
                            }),
                            patient:JSON.stringify({
                                id:this.patient.id,
                                name:model.name,
                                mobilePhone:model.mobilePhone,
                                idCard: model.idCard,
                                extension: Object.assign(Sunset.isString(this.patient.extension)?JSON.parse(this.patient.extension):this.patient.extension,{
                                    name:model.name,
                                    mobilePhone:model.mobilePhone,
                                    idCard: model.idCard,
                                    sex:model.sex,
                                    [this.address]:'现住址,'+model.address,
                                    socialCard:model.socialCard
                                })
                            }),
                            registration:JSON.stringify({
                                digest:Object.assign(this.visitings[0].digest,{patientAge:model.patientAge}),
                                extension:Object.assign(this.visitings[0].extension,{patientAge:model.patientAge}),
                                patientAge:model.patientAge,
                                id:this.visitings[0].id
                            })
                        };
                        return $http({
                            url: '/service/business/referralflow/in_confirmed',
                            type: 'POST',
                            data: param
                        }).then(res => {
                            Sunset.tip('操作成功');
                            this.refreshFlow();
                            this.nextDeptList=[];
                            $('.tool_bars').css('display','none');
                            this.$refs.confirminhospital.cancel()
                        })
                    },
                    fields: [{
                            label: '患者姓名',
                            name: 'name',
                            widget: 'input',
                            validate:{
                                required: true
                            }
                        },{
                            label:'性别',
                            name:'sex',
                            widget:'radio',
                            enum:'SEX',
                            validate:{
                                required: true
                            }
                        },{
                            label: '年龄',
                            name: 'patientAge',
                            widget: 'number',
                            append: {
                                style: 'width:50px',
                                data: [{
                                    text: '岁',
                                    value: '岁'
                                }, {
                                    text: '月',
                                    value: '月'
                                }, {
                                    text: '天',
                                    value: '天'
                                }]
                            },
                            validate:{
                                required: true
                            }
                        },{
                            label: '电话',
                            name: 'mobilePhone',
                            widget: 'input',
                            validate:{
                                required: true,
                                phone:true
                            }
                        },{
                            label: '患者身份证',
                            name: 'idCard',
                            widget: 'input',
                            validate:{
                                required: true,
                                IdCard:true
                            }
                        },{
                            label: '家庭住址',
                            name: 'address',
                            widget: 'input'
                        },{
                            label: '医保类型',
                            name: 'medicalCare',
                            widget: 'select',
                            enum:'MEDICARE'
                        },{
                            label: '住院号',
                            name: 'hospitalNo',
                            widget: 'input',
                            validate:{
                                uniqueNumber: true
                            }
                        }, {
                        label: '门诊号',
                        name: 'patientNo',
                        widget: 'input',
                        validate:{
                            uniqueNumber: true
                        }
                        }, {
                            label: '转入科室',
                            name: 'dept',
                            widget: 'cascader',
                            changeOnSelect : true,
                            _cascadeOffice: true,
                            required: true,
                            data:function(a,b,c){
                                var options = this;
                                return $http({
                                    url: '/service/business/group/tree/{organizationId}'.replace(
                                        /\{organizationId\}/, GlobalService.getCurrentUserSync()
                                        .relation.hospital[0].id),
                                    type: 'GET'
                                }).then(res => {
                                    var Dictionary = Sunset.Service.Dictionary;
                                    var offices = [],
                                        officeMap = {},
                                        officeUsers = {};
                                    function isBusinessOffice(category) {
                                        return category == Dictionary.alias('ORG_CODE',
                                            'CLINICAL') || category == Dictionary.alias(
                                            'ORG_CODE', 'RADIOLOGY');
                                    }

                                    function isDoctor(category) {
                                        return category == Dictionary.alias('ORG_CODE',
                                            'PERSONAL');
                                    }

                                    function addMembers(office, parentId,parentIds) {
                                        var id = office.id;
                                        var name = office.name;
                                        var category = office.category;
                                        if (isBusinessOffice(category)) {
                                            var officeObj = {
                                                label: name,
                                                value: id
                                            };
                                            if (parentId && officeMap[parentId]) {
                                                officeMap[parentId].children = officeMap[
                                                    parentId].children || [];
                                                officeMap[parentId].children.push(officeObj);
                                            } else {
                                                offices.push(officeObj)
                                            }
                                            officeMap[id] = officeObj;
                                        }
                                        parentIds = parentIds.concat([id]);
                                        if (office.members) {
                                            office.members.forEach(m => {
                                                if (isBusinessOffice(m.memberCategory)) {
                                                    addMembers(m.entity, id,parentIds);
                                                } else if (isDoctor(m.memberCategory)) {
                                                    m.entity.memberId = m.id;
                                                    parentIds.forEach(pId=>{
                                                        officeUsers[pId] = officeUsers[pId] ||
                                                            [];
                                                        officeUsers[pId].push(m.entity);
                                                    })
                                                }
                                            })
                                        }
                                    }
                                    if (res) {
                                        res.members && res.members.forEach(function (item) {
                                            if (isBusinessOffice(item.memberCategory)) {
                                                addMembers(item.entity,null,[]);
                                            }
                                        });
                                    }
                                    options.officeUsers = officeUsers;
                                    return offices;
                                })
                            }
                        },{
                            label: '接诊医生',
                            name: 'doctor',
                            widget: 'select',
                            required: true,
                            watch: ['dept', (dep, options, model, formOptions) => {
                                var officeUsers = formOptions.fields.filter(item => item._cascadeOffice)[
                                    0].officeUsers;
                                var s = dep.dept&&dep.dept.split(',')||[];
                                var lastOfficeId = s[s.length-1];
                                model[options.name] = '';
                                options.data = officeUsers && officeUsers[lastOfficeId] &&
                                    officeUsers[lastOfficeId].map(item => ({
                                        value: item.userId,
                                        text: item.name
                                    })) || [];
                            }],
                            data: []
                        }, {
                            label: '入院时间',
                            name: 'totime',
                            widget: 'date',
                            required: true
                        }
                    ],
                    tools: false
                },
                cardOperateOptions:{
                    tools:[{
                        label: '患者沟通记录',
                        color: 'ghost',
                        icon: 'android-add',
                        premise: () => {
                            return true
                        },
                        operate: () => {
                            this.addCard('referralpatientcontact','患者沟通记录');
                        }
                    }]
                },
                toolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '无法接收',
                        color: 'error',
                        premise: () => {
                            var isWaiting = Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'OutReviewAgreed') == this.flow.detailStatus;
                            var isSelf = this.flow.currentOutReviewerId != GlobalService.getCurrentUserSync().user.userId;
                            return !this.isOut&&(isWaiting && isSelf || this.isRefused)
                        },
                        operate: () => {
                            this.$refs.inrefusemodal.open()
                        }
                    }, {
                        label: '同意接收',
                        color: 'success',
                        premise: () => {
                            var isWaiting = Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'OutReviewAgreed') == this.flow.detailStatus;
                            var isSelf = this.flow.currentOutReviewerId != GlobalService.getCurrentUserSync().user.userId;
                            return !this.isOut&&(isWaiting && isSelf || this.isRefused)
                        },
                        operate: () => {
                            this.$refs.inagreemodal.open({
                                dept:this.targetDept
                            });
                        }
                    }, {
                        label: '确认转诊',
                        color: 'primary',
                        premise: () => {
                            var isAgreed = Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'InReviewAgreed') == this.flow.detailStatus;
                            var isSelf = this.flow.currentOutReviewerId != GlobalService.getCurrentUserSync().user.userId;
                            return !this.isOut&&(isAgreed && isSelf)
                        },
                        operate: () => {
                            var patientAge= this.visitings&&this.visitings[0].patientAge;
                            var patient= this.flow.patient.extension&&JSON.parse(this.flow.patient.extension);
                            var address='';
                            for(var i in patient){
                                if(i.indexOf('demographic')==0&&patient[i].split(',')[0]=="现住址"){
                                    this.address= i;
                                    address= patient&&patient[i]&&patient[i].split(',')[1];
                                }
                            }
                            this.$refs.confirminhospital.open({
                                name:patient.name,
                                patientAge:patientAge&&patientAge.split(',')[0],
                                mobilePhone:patient.mobilePhone,
                                totime:Date.now(),
                                idCard:patient.idCard,
                                sex:patient.sex,
                                address:address,
                                medicalCare:patient.socialCard,
                                dept:this.flow.receiveDeptId,
                                doctor:this.flow.receiveUserId,
                                hospitalNo:this.flow.hospitalizedNumber,
                                patientNo:this.flow.patientNumber
                            });
                        }
                    },{
                        label: '无法转出',
                        color: 'error',
                        premise: () => {
                            var isWaiting = Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'OutReviewing') == this.flow.detailStatus;
                            var isSelf = this.flow.currentOutReviewerId == GlobalService.getCurrentUserSync().user.userId;
                            return this.isOut&&(isWaiting && isSelf || this.isRefused)
                        },
                        operate: () => {
                            this.$refs.outrefusemodal.open()
                        }
                    }, {
                        label: '同意转出',
                        color: 'success',
                        confirm: '同意转出',
                        premise: () => {
                            var isWaiting = Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'OutReviewing') == this.flow.detailStatus;
                            var isSelf = this.flow.currentOutReviewerId == GlobalService.getCurrentUserSync().user.userId;
                            return this.isOut&&(isWaiting && isSelf || this.isRefused)
                        },
                        operate: () => {
                            var param = {
                                isAgree: true,
                                flow: JSON.stringify({
                                    id: this.flow.id,
                                    extension: Object.assign(this.flow.extension,{
                                        operater:GlobalService.getCurrentUserSync().user
                                    })
                                })
                            };
                            return $http({
                                url: '/service/business/referralflow/out_review',
                                type: 'POST',
                                data: param
                            }).then(res => {
                                Sunset.tip('操作成功');
                                this.refreshFlow();
                                $('.tool_bars').css('display','none');
                            })
                        }
                    }, {
                        label: '提交审核',
                        color: 'primary',
                        premise: () => {
                            var isWaiting = Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'OutReviewing') == this.flow.detailStatus;
                            var isSelf = this.flow.currentOutReviewerId == GlobalService.getCurrentUserSync().user.userId;
                            return this.isOut&&(isWaiting && isSelf || this.isRefused)
                        },
                        operate: () => {
                            this.$refs.checkmodal.open()
                        }
                    }]
                },
                cardToolbarOptions: {
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
            finalConfirm(cardId){
                var param={};
                param.flow=JSON.stringify({
                    id:this.$route.params.flowId,
                    type:'ordercheck'
                });
                param.flowCards=JSON.stringify([{cardId:cardId,status:1}]);
                ConsultationStore.finalConfirm(param).then(res=>{
                    Sunset.tip('操作成功');
                    this.refreshFlow();
                })
            },
            refreshFlow(){
                Store.getFlowById(this.flow.id).then(res=>{
                    this.flow = res;
                });
            },
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
                    }).filter(v=>v&&v.viewName!='reservationcheckup');
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