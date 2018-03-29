<style lang="sass">
.transfer_treatment{
    margin-bottom:80px;
    overflow:hidden;
    .sunset-field-label{
        text-align:left;
    }
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
    .huifang{
        height:60px;
        padding:15px;
        width: 100%;
        background: #fff;
    }
    .transfer_wrap{
        overflow-y:auto;
        position: absolute;top: 70px;
        bottom: 0;
        right: 0;
        left: 0;
        padding-bottom:60px;
        .transfer-view{
            padding: 10px;
            background: #FFF;
            border: 1px solid #E1E1E1;
            box-shadow: 2px 2px 5px #ddd;
            margin: 0 5px 10px 5px;
            font-size: 14px;
            &>h3 {
                color: #8d8d8d;
                font-weight: 500;
                >span{
                    font-size: 1rem;
                    font-weight: normal;
                }
                padding: 15px 0px;
            }
            &>.transfer-table{
                width: 100%;
                border-collapse: collapse;
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
                        margin-right:10px;
                        cursor:pointer;
                        color:#39f;
                        &:hover{
                            color:darken(#39f,10%);
                        }
                    }
                    &.short-value {}
                }
            }
        }
        .vv-content {
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
    .has_toolbar{
        top:10px;
    }
}
</style>
<template>
    <div class="transfer_treatment">
        <div v-show="!flow.hasPassiveClosed">
            <sunset-toolbar class="huifang" v-ref:form :options="cardOperateOptions"></sunset-toolbar>
        </div>
        <div class="tool_bars" v-if="hasToolbars">
            <sunset-toolbar class="transfer_bar" v-ref:form :options="toolbarOptions"></sunset-toolbar>
        </div>
          <div :class="['transfer_wrap',flow.hasPassiveClosed?'has_toolbar':'']"> 
             <div class="transfer-view">
                <h3>转诊申请单 <span> ({{flow.applyDate | time 'yyyy/MM/dd HH:mm'}}  {{flow.applyUser.name}}提交) </span></h3>
                  <table class="transfer-table">
                    <tr>
                        <td class="label">患者信息</td>
                        <td colspan="3">{{patientData&&patientData.name}} {{patientData&&patientData.sex | enum "SEX"}} {{patientData&&patientData.patientAge&&patientData.patientAge.replace(',','')}} {{patientData&&patientData.mobilePhone}}
                            <p><span v-if="flow.patientNumber">门诊/住院号：{{flow.patientNumber}}  </span><span v-if="flow.toHospitalDate">就诊日期：{{flow.toHospitalDate | time 'yyyy/MM/dd HH:mm'}}  </span><span v-if="patientData&&patientData.socialCard">医保类型：{{patientData&&patientData.socialCard | enum 'MEDICARE'}}  </span>
                                <span v-if="flow.receiveDept">接诊科室：{{flow.receiveDept&&flow.receiveDept.name}}</span><span v-if="flow.receiveUser&&flow.receiveUser.name">  接诊医生：{{flow.receiveUser&&flow.receiveUser.name}}</span>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">所选病历</td>
                        <td colspan="3">
                            <span class="records" v-for="item in flowData.recordslist" @click="activeVisiting(item)"><Icon type="android-document" size="20"  style="color：#52687d;margin-right:5px;"></Icon>{{item.split("_")[1]}}</span>
                        </td>
                    </tr>
                    <tr v-if="!isOut">
                        <td class="label">来自医院</td>
                        <td colspan="3">{{flow.fromEntity.name}}</td>
                    </tr>
                    <tr v-if="isOut">
                        <td class="label">拟转至</td>
                        <td colspan="3">{{target}}</td>
                    </tr>
                    <tr class="colle">
                        <td class="label">转诊类型</td>
                        <td>{{transferType}}</td>
                        <td class="label">转诊日期</td>
                        <td>{{transferDate[0]}} 至 {{transferDate[1]}}</td>
                    </tr>
                    <tr>
                        <td class="label">原因及目的</td>
                        <td colspan="3">{{transferreason}}</td>
                    </tr>
                    <tr>
                        <td class="label">治疗经过</td>
                        <td colspan="3">{{flowData.experience}}</td>
                    </tr>
                    <tr>
                        <td class="label">初步诊断</td>
                        <td colspan="3">{{flowData.diagnose}}</td>
                    </tr>
                    <tr>
                        <td class="label">主管医生</td>
                        <td>{{flowData.maindoctor}}</td>
                        <td class="label">联系电话</td>
                        <td>{{flowData.doctortel}}</td>
                    </tr>
                </table>  
            </div>
            <div class="transfer-view" v-if="!isUpper">
                <h3>转出审核 <span> ({{flow.applyDate | time 'yyyy/MM/dd HH:mm'}}  {{outOperater}}提交) </span></h3>
                  <table class="transfer-table">
                    <tr v-if="flow.detailStatus==0">
                        <td class="label">审核状态</td>
                        <td style="color:#f90">待审核</td>
                    </tr>
                    <tr v-if="flow.detailStatus==0">
                        <td class="label">审核人</td>
                        <td>{{flow.currentOutReviewer&&flow.currentOutReviewer.name}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus>1">
                        <td class="label">审核状态</td>
                        <td style="color:#00cc99">审核已通过</td>
                    </tr>
                    <tr v-if="flow.detailStatus>1">
                        <td class="label">审核人</td>
                        <td>{{flow.currentOutReviewer?flow.currentOutReviewer.name:'自动审核'}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus==1">
                        <td class="label">转出回复</td>
                        <td style="color:#ffa65e">审核未通过</td>
                        <td class="label">操作人</td>
                        <td>{{flow.currentOutReviewer&&flow.currentOutReviewer.name}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus==1">
                        <td class="label">原因</td>
                        <td colspan="3">{{flowData.refuseOutReason}}</td>
                    </tr>
                </table>  
            </div>
            <div class="transfer-view" v-if="flow.detailStatus==5">
                <h3>转出撤销 <span> ({{flow.cancelDate | time 'yyyy/MM/dd HH:mm'}}  {{flow.cancelUser&&flow.cancelUser.name}}提交) </span></h3>
                  <table class="transfer-table">
                    <tr v-if="flow.detailStatus==5">
                        <td class="label">转出回复</td>
                        <td style="color:#39f">已撤销</td>
                    </tr>
                    <tr v-if="flow.detailStatus==5">
                        <td class="label">操作人</td>
                        <td>{{flow.cancelUser&&flow.cancelUser.name}}</td>
                    </tr>
                </table>  
            </div>
            <div class="transfer-view" v-if="flow.detailStatus>2 && flow.detailStatus!=5">
                <h3>转诊意见 <span> ({{flow.inReviewDate | time 'yyyy/MM/dd HH:mm'}}  {{inOperater}}提交) </span></h3>
                 <table class="transfer-table">
                    <tr>
                        <td class="label">拟转医院</td>
                        <td colspan="3">{{targetHospital}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus!=3">
                        <td class="label">转诊回复</td>
                        <td style="color:#00cc99">同意接收</td>
                        <td class="label">操作人</td>
                        <td>{{flow.inReviewer&&flow.inReviewer.name}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus!=3">
                        <td class="label">转入科室</td>
                        <td>{{flow.receiveDept&&flow.receiveDept.name}}</td>
                        <td class="label">接诊医生</td>
                        <td>{{flow.receiveUser&&flow.receiveUser.name}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus!=3&&flowData.notes">
                        <td class="label">建议</td>
                        <td colspan="3">{{flowData.notes}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus==3">
                        <td class="label">转诊回复</td>
                        <td style="color:#ffa65e">无法接收</td>
                        <td class="label">操作人</td>
                        <td>{{flow.inReviewer&&flow.inReviewer.name}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus==3">
                        <td class="label">原因</td>
                        <td colspan="3">{{flowData.refuseReason}}</td>
                    </tr>
                </table> 
            </div>
            <div class="transfer-view" v-if="flow.detailStatus==6">
                <h3>确认入院 <span> ({{flow.toHospitalDate | time 'yyyy/MM/dd HH:mm'}}  {{inOperater}}提交) </span></h3>
                 <table class="transfer-table">
                    <tr v-if="flow.detailStatus==6">
                        <td class="label">转入科室</td>
                        <td>{{flow.receiveDept&&flow.receiveDept.name}}</td>
                        <td class="label">接诊医生</td>
                        <td>{{flow.receiveUser&&flow.receiveUser.name}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus==6&&flowData.confirmNotes">
                        <td class="label">备注</td>
                        <td colspan="3">{{flowData.confirmNotes}}</td>
                    </tr>
                    <tr v-if="flow.detailStatus==6">
                        <td class="label">入院时间</td>
                        <td >{{flow.toHospitalDate | time 'yyyy/MM/dd'}}</td>
                        <td class="label">操作人</td>
                        <td >{{flow.inConfirmUser&&flow.inConfirmUser.name}}</td>
                    </tr>
                </table> 
            </div>
            <div class="vv-content">
                 <div v-for="card in cards" class="vv-card-view">
                    <component :is="'md-'+card.viewName+'-view'" :card="card" :data="card.extension" @edit-card="editCard(card)" @remove-card="removeCard(card)"></component>
                </div> 
            </div> 
         </div>  
        <sunset-view-modal v-ref:agreemodal :options="agreeOptions">
            <div style="text-align:center;height:50px;line-height:50px">同意接收</div>
        </sunset-view-modal>
        <sunset-form-modal v-ref:inrefusemodal :options="{title : '无法接收',width :600, style : 'max-height:400px', formOptions:inrefuseOptions}" @cancel="cancel">
        </sunset-form-modal>
        <sunset-form-modal v-ref:inagreemodal :options="{title : '同意接收',width :600, style : 'max-height:400px', formOptions:inAgreeOptions}" @cancel="cancel">
        </sunset-form-modal>
        <sunset-form-modal v-ref:outrefusemodal :options="{title : '无法转出',width :600, style : 'max-height:400px', formOptions:outRefuseOptions}" @cancel="cancel">
        </sunset-form-modal>
        <sunset-form-modal v-ref:confirminhospital :options="{title : '确认转诊',width :600, style : 'max-height:400px', formOptions:confirmOptions}" @cancel="cancel">
        </sunset-form-modal>
        <sunset-form-modal v-ref:confirmcheck :options="{title : '确认审核',width :600, style : 'max-height:400px', formOptions:confirmCheckOptions}" @cancel="cancel">
        </sunset-form-modal>
        <sunset-table-modal v-ref:checkmodal :options="checkOptions" @submit="submitCheck">
            <!-- <div slot="filter" style="display:inline-block;height:30px;line-height:30px;margin-left:10px;">已选专家: <span v-for="item in choosedList">{{item}}&nbsp<span></div> -->
        </sunset-table-modal>

    </div>
</template>
<script>
import Store from '../Store';
import MedicalDataStore from '../../MedicalData/MedicalDataStore.js';
export default {
    props: {
        patient: {},
        flow: {},
        card: {},
        visitings:{},
        data: {

        }
    },
    ready() {
        this.data.refresh = () => {
            this.refresh();
        }
        this.refresh();
    },
    computed: {
        flowData() {
            if (Sunset.isString(this.flow.extension)) {
                return this.flow && this.flow.extension && JSON.parse(this.flow.extension) || {};
            } else {
                return this.flow && this.flow.extension || {}
            }
        },
        isMedicalCenter(){
            return GlobalService.getCurrentUserSync().relation.isBelongToOfficeCategory(Sunset.Service.Dictionary.alias('ORG_CODE','MEDICAL_CENTER'))
        },
        inOperater(){
            var operater='';
            if(this.flow.detailStatus>2 && this.flow.detailStatus!=5){
                operater = this.flow.inReviewer&&this.flow.inReviewer.name;
            }
            return  operater;
        },
        outOperater(){
            if(this.flow.isAutoReview&&this.flow.detailStatus>1){
                return this.flow.applyUser.name;
            }
            var operater='';
            if(this.flow.detailStatus>0 && this.flow.detailStatus!=5){
                operater = this.flow.currentOutReviewer?this.flow.currentOutReviewer.name:'';
            }else if(this.flow.detailStatus==5){
                operater = this.flow.cancelUser?this.flow.cancelUser.name:'';
            }else if(this.flow.detailStatus==0){
                return this.flow.applyUser.name;
            }
            return operater;
        },
        patientData(){
            return this.patient&&this.patient.extension;
        },
        hasToolbars(){
            if(this.flow.hasPassiveClosed){
                return false
            }else{
                return this.toolbarOptions.tools.filter(item=>{
                    return item.premise();
                }).length;
            }
        },
        isUpper(){
            var hospitals = this.flow.target.uppers.filter(function (item) {
                return item.category.indexOf('04') == 0;
            });
            if(this.flow.target.category){
                return GlobalService.getCurrentUserSync().relation.hospital[0].id == (this.flow.target.category.indexOf('04') == 0&&this.flow.target.memberId || hospitals[0]&&hospitals[0].id);
            }
        },
        isOut() {
            return this.flow.fromEntityId == GlobalService.getCurrentUserSync().relation.hospital[0].id
        },
        transferType() {
            return Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_TYPE', this.flowData.transfertype);
        },
        transferreason() {
            return Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_CAUSE', this.flowData.transferreason);
        },
        transferDate() {
            var date = this.flowData.transferdate&&this.flowData.transferdate.map(v=>{
                return Sunset.Dates.format(new Date(v).getTime(), 'yyyy-MM-dd');
            });
            return date?date:[]
        },
        target() {
            var target = this.flow.target;
            if(target.category&&target.category.indexOf("04")==0){
                return target.name
            }else{
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
            }
        },
        targetHospital() {
            return this.target&&this.target.split("-")[0];
        },
        targetDept(){
            if(this.flow.target.category.indexOf("02")==0){
                return this.flow.target.id
            }else{
                var dept=[];
                this.flow.target.uppers.forEach(item=>{
                    if(item.category.indexOf("02")==0){
                        dept.push(item.id)
                    }
                });
                return dept[0]
            }
        },
        targetDoctor(){
            if(this.flow.target.category.indexOf("00")==0){
                return this.flow.target.id
            }else{

            }
        }
    },
    data() {
        return {
            nextDeptList:[],
            nextDeptMark:false,
            cards: [],
            address:'',
            isRefused: false,
            inAgreeOptions:{
                cols: 2,
                submit:(model)=>{
                    var param = {
                        isAgree: true,
                        flow: JSON.stringify({
                            id: this.flow.id,
                            extension: Object.assign(this.flow.extension,{
                                notes:model.notes,
                                operater:GlobalService.getCurrentUserSync().user
                            }),
                            receiveUserId:model.doctor,
                            receiveDeptId:model.dept&&model.dept.slice(model.dept.lastIndexOf(",")+1)
                        })
                    };
                    return $http({
                        url: '/service/business/referralflow/in_review',
                        type: 'POST',
                        data: param
                    }).then(res => {
                        Sunset.tip('操作成功');
                        this.refreshFlow();
                        this.nextDeptList=[];
                        this.$refs.inagreemodal.cancel()
                    })
                },
                fields: [{
                        label: '转入科室',
                        name: 'dept',
                        widget: 'cascader',
                        changeOnSelect : true,
                        _cascadeOffice: true,
                        validate: {
                            required: true
                        },
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
                        validate: {
                            required: true
                        },
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
                        label: '转诊建议',
                        name: 'notes',
                        widget: 'textarea',
                        monopolize: true
                    }
                ],
                tools: false
            },
            inrefuseOptions:{
                submit:(model)=>{
                    var param = {
                        isAgree: false,
                        flow: JSON.stringify({
                            id: this.flow.id,
                            extension: JSON.stringify(Object.assign(this.flow.extension,{
                                refuseReason: model.inrefusereason,
                                operater:GlobalService.getCurrentUserSync().user
                            }))
                        })
                    };
                    return $http({
                        url: '/service/business/referralflow/in_review',
                        type: 'POST',
                        data: param
                    }).then(res => {
                        Sunset.tip('提交成功', 'success');
                        this.isRefused = true;
                        this.refreshFlow();
                        $('.tool_bars').css('display','none');
                        this.$refs.inrefusemodal.cancel();
                    })
                },
                fields: [{
                    label: "原因：",
                    name: 'inrefusereason',
                    widget: 'textarea',
                    validate: {
                        required: true
                    },
                    monopolize: true
                }],
                tools: false
            },
            outRefuseOptions:{
                submit:(model)=>{
                    var param = {
                        isAgree: false,
                        flow: JSON.stringify({
                            id: this.flow.id,
                            extension: JSON.stringify(Object.assign(this.flow.extension,{
                                refuseReason: model.refuseOutReason,
                                operater:GlobalService.getCurrentUserSync().user
                            }))
                        })
                    };
                    return $http({
                        url: '/service/business/referralflow/out_review',
                        type: 'POST',
                        data: param
                    }).then(res => {
                        Sunset.tip('提交成功', 'success');
                        this.isRefused = true;
                        this.refreshFlow();
                        $('.tool_bars').css('display','none');
                        this.$refs.outrefusemodal.cancel();
                    })
                },
                fields: [{
                    label: "原因：",
                    name: 'refuseOutReason',
                    widget: 'textarea',
                    validate: {
                        required: true
                    },
                    monopolize: true
                }],
                tools: false
            },
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
                            patientNumber:model.patientNo,
                            hospitalizedNumber:model.hospitalNo,
                            receiveDeptId:receiveDeptId,
                            receiveUserId:model.doctor   
                        }),
                        patient:JSON.stringify({
                            id:this.patient.id,
                            name:model.name,
                            mobilePhone:model.mobilePhone,
                            idCard: model.idCard,
                            extension: Object.assign(this.patient.extension,{
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
                    },,{
                        label: '入院时间',
                        name: 'totime',
                        widget: 'date',
                        required: true
                    }
                ],
                tools: false
            },
            confirmCheckOptions:{
                cols: 2,
                submit:(model)=>{
                    var receiveDeptId = model.dept&&model.dept.slice(model.dept.lastIndexOf(",")+1);
                    var param = {
                        flow: JSON.stringify({
                            id: this.flow.id,
                            type:'transfertreatment',
                            toHospitalDate:model.totime,
                            receiveDeptId:receiveDeptId,
                            receiveUserId:model.doctor,
                            patientNumber:model.patientNo,
                            hospitalizedNumber:model.hospitalNo,
                            finalResult:1   
                        }),
                        patient:JSON.stringify({
                            id:this.patient.id,
                            name:model.name,
                            mobilePhone:model.mobilePhone,
                            idCard: model.idCard,
                            extension: Object.assign(this.patient.extension,{
                                name:model.name,
                                mobilePhone:model.mobilePhone,
                                idCard: model.idCard,
                                sex:model.sex,
                                [this.address]:'现住址,'+model.address,
                                socialCard:model.socialCard
                            })
                        }),
                        flowCards:JSON.stringify([
                            {
                                cardId:this.patient.cardId
                            }
                        ]),
                        registration:JSON.stringify({
                            digest:Object.assign(this.visitings[0].digest,{patientAge:model.patientAge}),
                            extension:Object.assign(this.visitings[0].extension,{patientAge:model.patientAge}),
                            patientAge:model.patientAge,
                            id:this.flow.registration.id
                        })
                    };
                    return $http({
                        url: '/service/business/referralflow/final_confirmed',
                        type: 'POST',
                        data: param
                    }).then(res => {
                        Sunset.tip('操作成功');
                        this.refreshFlow();
                        this.nextDeptList=[];
                        $('.tool_bars').css('display','none');
                        this.$refs.confirmcheck.cancel()
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
                    },{
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
                            //model[options.name] = '';
                            options.data = officeUsers && officeUsers[lastOfficeId] &&
                                officeUsers[lastOfficeId].map(item => ({
                                    value: item.userId,
                                    text: item.name
                                })) || [];
                            var arr=[];
                            options.data.forEach(doctorValue=>{
                                arr.push(doctorValue.value)
                            });
                            if(arr.indexOf(model[options.name])==-1){
                                model[options.name] = ''
                            }
                        }],
                        data: []
                    },{
                        label: '就诊时间',
                        name: 'totime',
                        widget: 'date',
                        required: true
                    }
                ],
                tools: false
            },
            agreeOptions: {
                title: '提示',
                width: 600,
                toolbar: [{
                    label: '确定',
                    color: 'success',
                    operate: () => {
                        this.$refs.agreemodal.cancel();
                    }
                }]
            },
            checkOptions: {
                title: '提交审核',
                width: 600,
                checked: {
                    multi: false,
                    label: 'name',
                },
                tableOptions: {
                    columns: [{
                        title: '头像',
                        name: 'picture',
                        style: 'width:60px;',
                        align: 'center',
                        format(v) {
                            return `<img style="width:40px;height:40px;border-radius:50px;overflow:hidden;"  onerror="this.src='/assets/img/user-default.png'" src="${Base.transformNfsFilePath(v)}" />`;
                        }
                    }, {
                        title: '姓名',
                        name: 'name',
                        align: 'center'
                    }, {
                        title: '科室',
                        name: 'dept',
                        align: 'center'
                    }, {
                        title: '职称',
                        name: 'jobTitle',
                        align: 'center',
                        enum: 'HOSPITAL_DUTY'
                    }],
                    showIndex: true,
                    pageNumberStart: 0,
                    pageSize: 5,
                    localPage: true,
                    sortable: true,
                    multiCheck: false,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    recordTools: [],
                    datasource: (filter) => {
                        return Store.getOwnHospitalDoctors()
                    }
                },
                toolbar: false
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
                },{
                    label: '转诊不成功',
                    color: 'error',
                    premise: () => {
                        return this.isMedicalCenter&&Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'InConfirmed') == this.flow.detailStatus;
                    },
                    operate: () => {
                        var param = {
                            flow: JSON.stringify({
                                id: this.flow.id,
                                type:'transfertreatment',
                                finalResult:0   
                            })
                        };
                        return $http({
                            url: '/service/business/referralflow/final_confirmed',
                            type: 'POST',
                            data: param
                        }).then(res => {
                            Sunset.tip('操作成功');
                            this.refreshFlow();
                            this.nextDeptList=[];
                            $('.tool_bars').css('display','none');
                        })
                    }
                },{
                    label: '确认审核',
                    color: 'success',
                    premise: () => {
                        return this.isMedicalCenter&&Sunset.Service.Dictionary.alias('REFERRAL_FLOW_STATUS', 'InConfirmed') == this.flow.detailStatus;
                    },
                    operate: () => {
                        var registration=this.flow.registration.digest&&JSON.parse(this.flow.registration.digest);
                        var patient= this.patient.extension;
                        var address='';
                        for(var i in patient){
                            if(i.indexOf('demographic')==0&&patient[i].split(',')[0]=="现住址"){
                                this.address= i;
                                address= patient&&patient[i]&&patient[i].split(',')[1];
                            }
                        }
                        var patientAge= this.flow.registration.digest&&(Sunset.isString(this.flow.registration.digest)?JSON.parse(this.flow.registration.digest).patientAge:this.flow.registration.digest.patientAge);
                        this.$refs.confirmcheck.open({
                            dept:this.targetDept,
                            name:patient.name,
                            totime:this.flow.toHospitalDate,
                            mobilePhone:patient.mobilePhone,
                            patientAge:patientAge&&patientAge.split(',')[0],
                            idCard:patient.idCard,
                            sex:patient.sex,
                            address:address,
                            dept:this.flow.receiveDeptId,
                            doctor:this.flow.receiveUserId,
                            hospitalNo:this.flow.hospitalizedNumber,
                            patientNo:this.flow.patientNumber,
                            medicalCare:patient.socialCard || this.patient.socialCard
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
                        var patientAge= this.flow.registration.digest&&(Sunset.isString(this.flow.registration.digest)?JSON.parse(this.flow.registration.digest).patientAge:this.flow.registration.digest.patientAge);
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
                            idCard:this.patient.extension.idCard,
                            sex:patient.sex,
                            address:address,
                            medicalCare:patient.socialCard,
                            dept:this.flow.receiveDeptId,
                            doctor:this.flow.receiveUserId
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
            }
        }
    },
    methods: {
        refresh(){
            return $http({
                url: '/service/business/baseflow/card',
                type: 'GET',
                data: {
                    flowId: this.flow.id
                }
            }).then(res => {
                this.cards = res.map(item => {
                    if (item.extension) {
                        item.extension = JSON.parse(item.extension)
                    }
                    if (item.digest) {
                        item.digest = JSON.parse(item.digest)
                    }
                    return item
                }).filter(v=>v&&!(v.viewName=='reservationcheckup' || v.viewName=='illstatedata'));
            });
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
        submitCheck(record) {
            var param = {
                flowId: this.flow.id,
                toReviewerId: record && record[0].userId
            };
            return $http({
                url: '/service/business/referralflow/submit_review',
                type: 'POST',
                data: param
            }).then(res => {
                if (res) {
                    Sunset.tip('提交成功', 'success');
                    this.refreshFlow();
                    this.$refs.checkmodal.cancel();
                    $('.tool_bars').css('display','none');
                } else {
                    throw Error(e);
                }
            })
        },
        addCard(viewName, tabName) {
            this.$emit('edit-card', {
                lastModifyDate: 0,
                viewName: viewName,
                flowId: this.flow.id,
                patientId: this.patient.patientId,
                digest: {},
                _editing: true,
                _dirty: true
            }, tabName, this.flow);
        },
        editCard(card) {
            card.visiting = this.data.visiting,
                MedicalDataStore.getCard(card.viewName).then(cardTemplate => {
                    this.$emit('edit-card', card, cardTemplate.viewLabel);
                });
        },
        removeCard(card) {
            var clear = Sunset.confirm({
                content: '确定删除此资料？',
                loading: true,
                onOk: () => {
                    MedicalDataStore.removeCards(card.id).then(res => {
                        this.$emit('refresh');
                    });
                    clear();
                }
            });
        },
        cancel(){
            console.log('cancel');
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