<style lang="sass">
    .patient_edit_page {
        height: 100%;
        color: #333;
        .patient_card_bar {
            width: 302px;
            height: 100%;
            background-color: #f2f2f2;
            border-right: 2px solid #eee;
            position: relative;
            overflow: hidden;
            .detail_base_info {
                padding: 10px 0;
                text-align: center;
                height: 100px;
                width: 302px;
                border-bottom: 1px solid #ccc;
                .base_info1 {
                    height: 30px;
                    line-height: 30px;
                    .patient_name {
                        display: inline-block;
                        margin-right: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        vertical-align: middle;
                        width: 130px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                .tel_id {
                    font-size: 12px;
                    height: 25px;
                    line-height: 25px;
                }
                .base_edit {
                    cursor: pointer;
                    text-decoration: underline;
                    color: #09f;
                }
            }
            .visiting_records_box {
                overflow: auto;
                position: absolute;
                padding: 10px 15px 0 10px;
                top: 100px;
                bottom: 78px;
                width: 302px;
            }
            .detail_content_info {
                position: absolute;
                top: 78px;
                left: 0;
                bottom: 78px;
                overflow-y: scroll;
                width: 302px;
                padding: 10px 15px;
                text-align: center;
                .detail_content_title {
                    background-color: #0099ff;
                    width: 270px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 40px;
                    color: #fff;
                }
                .content_footer {
                    background-color: #e4e4e4;
                    color: #666;
                    padding: 5px 0;
                    p {
                        height: 15px;
                        line-height: 15px;
                        font-size: 12px;
                    }
                }
                .detail_content_status {
                    position: absolute;
                    top: 0;
                    left: 15px;
                    width: 40px;
                    height: 18px;
                    line-height: 18px;
                    background-color: #4bb6fe;
                    border-radius: 3px;
                    color: #fff;
                }
                .status_footer {
                    background-color: #999;
                }
                .btn_info {
                    height: 30px;
                    width: 225px;
                    padding-left: 10px;
                    cursor: pointer;
                    &>div {
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        float: left;
                        text-align: center;
                        border-radius: 5px;
                        background-color: #fff;
                        border: 1px solid #999;
                    }
                    .history_info {
                        margin-right: 15px;
                    }
                    .body_check {}
                }
            }
        }
        .btn_list {
            background: #f2f2f2;
            position: absolute;
            left: 302px;
            right: 82px;
            z-index: 1;
            top: 0;
            &>div {
                float: left;
                text-align: center;
            }
            .illness_data {
                height: 56px;
                line-height: 32px;
                width: 100px;
                padding: 12px;
                background: #e4e4e4;
            }
            &>.btn_List {
                margin-left: 10px;
                height: 56px;
                padding: 12px;
                float: left;
                margin-right: 0px;
            }
        }
        .doctor_patient_content {
            padding: 10px 20px;
            overflow: hidden;
            position: absolute;
            left: 302px;
            right: 80px;
            top: 55px;
            bottom:0;
            &.no-sidebar{
                right: 0px;
            }
            &.no-toolbar{
                .info_table{
                    margin-top: 0px;
                }
            }
            .info_table {
                position: relative;
                background-color: #fff;
                z-index: 3;
                &:after {
                    content: "";
                    width: 100%;
                    position: absolute;
                    bottom: 15px;
                    border-bottom: 1px solid #ccc;
                    z-index: 4;
                }
                p {
                    height: 30px;
                    line-height: 30px;
                    color: #999;
                }
                .table_field {
                    overflow: hidden;
                    div {
                        height: 25px;
                        line-height: 25px;
                        width: 25%;
                        float: left;
                        overflow: hidden;
                        label {
                            font-weight: 600;
                        }
                    }
                }
                .info_table_more {
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                    position: relative;
                    left: 50%;
                    z-index: 5;
                    margin-left: -50px;
                    text-align: center;
                    background-color: #fff;
                    cursor: pointer;
                    color: #999;
                }
            }
            &>.card_page {
                padding: 0 20px 80px 20px;
                overflow-y: auto;
                position: absolute;
                top: 115px;
                bottom: 0;
                right: 0;
                left: 0;
                .group-title .sunset-toolbar {
                    display: none;
                }
                .auto_recognise{
                    display:none;
                }
            }
        }
    }
</style>
<template>
    <div class="patient_edit_page" v-show="inited">
         <expert-selector v-ref:selector @submit="submitTeams"></expert-selector> 
         <expert-submit v-ref:selectortable @submit="submitTeams"></expert-submit> 
        <sunset-view-modal v-ref:savemodal :options="modalOptions">
            <p style='font-size:14px;'>您有未保存的就诊信息，请保存！</p>
        </sunset-view-modal>
        <Modal :visible.sync="newRegistrationShow" title="提示" ok-text="去关闭" @on-ok="confirmFinish" @on-cancel="cancel">
            <p style='font-size:14px;'>问诊还在进行中, 请先关闭问诊！</p>
        </Modal>
        <sunset-form-modal v-ref:formmodal :options="{title : '新建就诊',width :1000, style : 'max-height:400px', formOptions:formOptions}"></sunset-form-modal>
        <div class="patient_card_bar">
            <slot name="lefttitle"></slot>
            <div class="detail_base_info">
                <div class="base_info1">
                    <span class="patient_name" :title='patientData.name'>{{patientData.name}}</span>
                    <span>{{patientData.sex | enum 'SEX'}} / {{patientAge}}</span>
                    <a class="base_edit" v-show="currentUser" @click="showDetail(patientCardData)">编辑</a>
                </div>
                <div class="tel_id">Tel：{{patientData.mobilePhone}}</div>
                <div class="tel_id">ID：{{patientData.idCard}}</div>
            </div>
            <!--visit doctor组件  -->
            <div class="visiting_records_box">
                <visiting-records v-ref:records :patient="patientCardData.extension" @detail="showDetail" @visiting="getVistingData"></visiting-records>
            </div>
        </div>
        <!-- 上方操作栏 -->
        <div v-if="!hideTopToolbar" class="btn_list">
            <div class="illness_data">病历资料</div>
            <div class="btn_List">
                <medicaldata-toolbar @new-card="newCard"></medicaldata-toolbar>
            </div>
        </div>
        <!-- 患者资料详情 -->
        <div :class="['doctor_patient_content',hideSideToolbar?'no-sidebar':'',hideTopToolbar?'no-toolbar':'']">
            <div class="info_table">
                <p>基本信息</p>
                <div class="table_field">
                    <div v-for="item in getPatientData">
                        <label>{{item[0]}}：</label>
                        <span>{{item[1]}}</span>
                    </div>
                </div>
                <div class="info_table_more" @click="showMore">查看更多 +</div>
            </div>
            <div v-show="current == null" class="card_page">
                <medicaldata-detail v-ref:detail :flow="{flowId : $route.params.flowId}" @add-card="addCard" :patient-info="patientCardData" :edit="edit"
                    @new-card="newCard" @refresh="showMore" @signal="operateSignal"></medicaldata-detail>
            </div>
        </div>
        <side-toolbar v-if="!hideSideToolbar" :options="sidebarOptions[0]" @signal="sidebarOperate"></side-toolbar>
    </div>
</template>
<script>
    import DoctorPatientStore from "../DoctorOutpatient/DoctorPatientStore.js";
    import MedicalDataStore from "../MedicalData/MedicalDataStore.js";
    import VisitingRecord from "../MedicalData/VisitingRecord";
    import ExpertSelector from "../TeamDoctorSelector/TeamDoctorSelector";
    import ExpertSubmit from "../TeamDoctorSelector/SubmitExpert";
    import SideToolbar from './SideToolbar';
    import PatientDetailStore from "./Store.js";
    export default {
        components: {
            VisitingRecord,
            ExpertSelector,
            ExpertSubmit,
            SideToolbar
        },
        props: {
            patientId: "",
            sidebar: {},
            toolbar : {},
            edit :{}
        },
        data() {
            return {
                inited: false,
                teamParams:null,
                cacheChoosedStatus:null,
                hospitalData: null,
                newRegistrationShow: false,
                dataSaveTipShow: false,
                current: null,
                patientCardData: {},
                visitingData: {},
                isShowMore: false,
                modalOptions:{
                    title: '提示',
                    width: 500,
                    height:500,
                    toolbar:[{
                        label:"确定",
                        color:"warning",
                        operate:()=>{
                            this.$refs.savemodal.cancel()
                        }
                    }]
                },
                formOptions: {
                    cols: 4,
                    tools: false,
                    fields: [],
                    format: (model) => {
                        var registration = {
                            patientType: model.patientType || null,
                            patientNumber: model.patientNumber,
                            registeredDept: model.registeredDept.split('_')[1],
                            deptid: model.registeredDept.split('_')[0],
                            patientAge: model.patientAge,
                            registeredDate: new Date(model.registeredDate).getTime()
                        };
                        var param = {};
                        param.patientId = this.patientId;
                        param.viewName = "registration";
                        param.viewType = "StandardForm";
                        param.entity = JSON.stringify(registration);
                        param.digest = param.extension = JSON.stringify(Object.assign({}, registration));
                        param.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        var parameter = [];
                        parameter.push(param);
                        return parameter
                    },
                    submit: (m) => {
                        return DoctorPatientStore.newRegistration(m).then(res => {
                            Sunset.tip('添加成功', 'success');
                            this.$refs.records.refresh(this.patientId);
                        })
                    }
                },
                Teamoptions: {
                    title: '选团队 | 专家',
                    width: 1000,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
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
                        }, {
                            title: '就职医院',
                            name: 'hospital',
                            align: 'center'
                        }, {
                            title: '状态',
                            name: 'isChoosed',
                            align: 'center',
                            format(v){
                                return v?'已选择':'';
                            }
                        }],
                        showIndex: false,
                        pageNumberStart: 0,
                        pageSize: 5,
                        localPage: true,
                        sortable: true,
                        multiCheck: true,
                        idKey: 'uniqueId',
                        format: {
                            list: '',
                            count: 'length',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        recordTools: [],
                        datasource: (filter) => {
                            var para = {};
                            para.pageNumber = 0;
                            para.pageSize = 999;
                            para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            para.isWrapTeam = true;
                            if(this.patientId){
                                return Promise.all([PatientDetailStore.getTeams(para),Promise.resolve().then(()=>{
                                    if(this.cacheChoosedStatus && this.cacheChoosedStatus.length){
                                        return this.cacheChoosedStatus
                                    }else{
                                        return PatientDetailStore.doctorInFlow(this.patientId).then(res=>{
                                            return this.cacheChoosedStatus = res;
                                        });
                                    }
                                })]).then(res => {
                                    if(res[1].length&&res[0].rows.length){
                                        res[1].map(v=>{
                                            res[0].rows.map(item=>{
                                                if(item.wrapUserId==v){
                                                    item.isChoosed = true;
                                                }
                                            })
                                        })
                                    }
                                    return res[0]
                                }).then(res => {
                                    return res.rows.map(v => {
                                        var obj = {};
                                        obj.name = v.name;
                                        obj.userId = v.wrapUserId;
                                        obj.teamId = v.id;
                                        obj.dept = v.dept;
                                        obj.picture = v.picture;
                                        obj.jobTitle = v.jobTitle;
                                        obj.hospital = v.hospital;
                                        obj.uniqueId =obj.teamId + '_' + obj.userId;
                                        obj.isChoosed = v.isChoosed;
                                        return obj
                                    });
                                })
                            }
                        }
                    },
                    toolbar: [
                    //     {
                    //     label: '提交分诊平台',
                    //     color: 'warning',
                    //     premise: () => {
                    //         return this.teamParams.userType != "Triage"&&this.hasTriage;
                    //     },
                    //     disabled:()=>{
                    //         return this.isTriaged
                    //     },
                    //     operate: () => {
                    //         var para = {};
                    //         this.$emit("submit", para);
                    //     }
                    // }, 
                    {
                        label: '确定',
                        color: 'success',
                        operate: () => {
                            this.$refs.tablemodal.ok();
                        },
                        premise: () => {
                            return this.teamParams.userType != "Triage";
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        },
                        premise: () => {
                            return this.teamParams.userType != "Triage";
                        }
                    }, {
                        label: '关闭',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        },
                        premise: () => {
                            return this.teamParams.userType == "Triage";
                        }
                    }]
                }
            }
        },
        ready() {
            this.patientId && this.init(this.patientId);
            if( this.$route.params.flowId&& this.$route.path.indexOf('DifficultConsultation')>=0){
                this.$refs.records.filter(this.$route.params.flowId);
            }
            window.onbeforeunload = (event) => {
                if (this.$refs.records.haveEditing()) {
                    return '您有未保存的就诊信息，是否继续？';
                }
            };
        },
        computed: {
            currentUser(){
                return GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE','ASSISTANT')
            },
            hideSideToolbar(){
                return this.sidebar===false;
            },
            hideTopToolbar(){
                return this.toolbar===false;
            },
            sidebarOptions() {
                var options = this.sidebar || [];
                options[0] = Sunset.isArray(options[0]) && options[0].filter(item => {
                    return !Sunset.isFunction(item.premise) || Sunset.isFunction(item.premise) && item.premise();
                }) || [{
                    label: '返回',
                    color: '',
                    bg: 'backbg',
                    icon: 'ios-undo-outline',
                    signal: 'BACK'
                }];
                options[1] = options[1] || [];
                return options;
            },
            infoShowMore() {
                var infoShowMore = [
                    ['name', '姓名', 'patientData'],
                    ['sex', '性别', 'patientData', 'SEX'],
                    ['patientAge', '年龄', 'visitingData', 'AGE'],
                    ['mobilePhone', '电话', 'patientData'],
                    ['patientNumber', '患者编号', 'visitingData'],
                    ['registeredDate', '就诊日期', 'visitingData', 'DATE'],
                    ['registeredDept', '科室', 'visitingData'],
                    ['idCard', '身份证号码', 'patientData'],
                    ['birthday', '出生日期', 'patientData', 'BIRTHDAY'],
                    ['socialCard', '医保', 'patientData', 'MEDICARE'],
                    ['patientType', '患者类型', 'visitingData', 'PATIENT_TYPE']
                ];
                var patientData = this.patientCardData.extension || {};
                var demographic = Object.keys(patientData).filter(value => value.indexOf("demographic") == 0);
                if (demographic.length) {
                    demographic.map(v => {
                        infoShowMore.push([v, patientData[v].split(",")[0], "patientData", "extension"])
                    })
                };
                var visitingData = this.visitingData.digest || {};
                var registration = Object.keys(visitingData).filter(value => value.indexOf("registration") == 0);
                if (registration.length) {
                    registration.map(v => {
                        if (infoShowMore.filter(item => item[0] == v).length == 0) {
                            infoShowMore.push([v, visitingData[v].split(",")[0], "visitingData", "extension"])
                        }
                    })
                };
                return infoShowMore
            },
            safePatient() {
                return this.patient || {};
            },
            patientData() {
                return this.patientCardData.extension || {};
            },
            patientAge() {
                if (this.visitingData.digest && this.visitingData.digest.patientAge) {
                    return this.visitingData.digest.patientAge.replace(",", "");
                }
            },
            getPatientData() {
                // 请求左边卡片页
                var patientInfoList = this.isShowMore ? this.infoShowMore : [
                    ['name', '姓名', 'patientData'],
                    ['sex', '性别', 'patientData', 'SEX'],
                    ['patientAge', '年龄', 'visitingData', 'AGE'],
                    ['mobilePhone', '电话', 'patientData'],
                    ['patientNumber', '患者编号', 'visitingData'],
                    ['registeredDate', '就诊日期', 'visitingData', 'DATE'],
                    ['registeredDept', '科室', 'visitingData'],
                    ['idCard', '身份证号码', 'patientData']
                ];

                var patientData = this.patientCardData.extension || {};
                var visitingData = this.visitingData.digest || {};
                var allData = [];
                patientInfoList.forEach((item) => {
                    if (item[2] == 'patientData') {
                        var data = [];
                        data.push(item[1]);
                        if (item[3] && item[3] == 'SEX') {
                            data.push(Sunset.Service.Dictionary.transcode(item[3], patientData[item[0]]))
                        } else if (item[3] && item[3] == 'BIRTHDAY') {
                            if (patientData[item[0]]) {
                                var birthday = Sunset.Dates.format(new Date(patientData[item[0]]), 'yyyy-MM-dd');
                                data.push(birthday)
                            } else {
                                data.push('')
                            }
                        } else if (item[3] && item[3] == 'MEDICARE') {
                            data.push(Sunset.Service.Dictionary.transcode(item[3], patientData[item[0]]));
                        } else if (item[3] && item[3] == 'extension') {
                            if (patientData[item[0]]) {
                                data.push(patientData[item[0]].split(",")[1])
                            }
                        } else {
                            data.push(patientData[item[0]])
                        }
                        allData.push(data)
                    } else if (item[2] == 'visitingData') {
                        var data = [];
                        data.push(item[1]);
                        if (item[3] && item[3] == 'PATIENT_TYPE') {
                            data.push(Sunset.Service.Dictionary.transcode(item[3], visitingData[item[0]]))
                        } else if (item[3] && item[3] == 'DATE') {
                            if (visitingData[item[0]]) {
                                var visitingDate = Sunset.Dates.format(new Date(visitingData[item[0]]),
                                    'yyyy-MM-dd');
                                data.push(visitingDate);
                            }
                        } else if (item[3] && item[3] == 'AGE') {
                            var age = Object.keys(visitingData).length ? visitingData[item[0]].split(",").join(
                                "") : '';
                            data.push(age)
                        } else if (item[3] && item[3] == 'extension') {
                            if (visitingData[item[0]]) {
                                data.push(visitingData[item[0]].split(",")[1])
                            }
                        } else {
                            data.push(visitingData[item[0]]);
                        }
                        allData.push(data);
                    }
                });
                return allData
            }
        },
        methods: {
            init(patientId) {
                this.inited = false;
                this.patientId = patientId;
                this.$refs.records.refresh(patientId);
                MedicalDataStore.getCardsDetailData(patientId).then((res) => {
                    this.patientCardData = res[0];
                    this.inited = true;
                });
            },
            chooseExpertBtn() {
                if (this.$refs.records.haveEditing()) {
                    this.submitExpertTip();
                } else {
                    this.chooseExpert();
                }
            },
            chooseExpert() {
                var para = {};
                para.pageNumber = 0;
                para.pageSize = 999;
                para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                // para.order="";
                // para.type="";
                // para.keyword="";
                if(GlobalService.getSystemModules().map(v=>v.moduleNo).indexOf("TriageCenter")!=-1){
                    return DoctorPatientStore.isTriaged(this.patientCardData.patientId).then(res => {
                        this.$refs.selector.open(para, this.patientCardData.patientId, res)
                    })
                }else{
                    this.isTriaged = false;
                    this.cacheChoosedStatus=null;
                    this.patientId = this.patientCardData.patientId;
                    this.teamParams = null;
                    this.$nextTick(() => {
                        this.teamParams = Object.assign({}, para);
                        this.Teamoptions.checked.multi = this.teamParams.userType != "Triage"?(function(item){
                            return !item.isChoosed;
                        }):false;
                        this.$nextTick(() => {
                            this.$refs.selectortable.open(para, this.patientCardData.patientId);
                        });
                    });
                }
            },
            submitTeams(para) {
                para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                para.systemId = GlobalService.getCurrentUserSync().user.systemId;
                para.patientId = this.patientCardData.patientId;
                para.applyUserId = GlobalService.getCurrentUserSync().user.userId;
                para.registrationRecordId = this.patientCardData.registrationRecordId;
                return DoctorPatientStore.getDate().then(res => {
                    if (res) {
                        para.applyDate = res;
                        DoctorPatientStore.saveExperts(para).then(res => {
                            Sunset.tip('提交成功', 'success');
                            this.$refs.selector&&this.$refs.selector.cancel();
                            this.$refs.selectortable&&this.$refs.selectortable.cancel();
                        })
                    }
                })
            },
            submitExpertTip() {
                this.$refs.savemodal.open()
            },
            saveTip(mark) {
                var clear = Sunset.confirm({
                    content: '您有未保存的就诊信息，是否继续？',
                    loading: true,
                    onOk: () => {
                        if (mark == "chooseExpert") {
                            this.chooseExpert();
                        } else if (mark == "newRegistration") {
                            this.newRegistration();
                        } else if (mark == "back") {
                            window.history.back(-1);
                        }
                        clear();
                    }
                });
            },
            newRegistrationBtn() {
                if (this.$refs.records.haveEditing()) {
                    this.saveTip("newRegistration");
                } else {
                    this.newRegistration();
                }
            },
            newRegistration() {
                var para = {};
                para.patientId = this.patientCardData.patientId;
                para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                return DoctorPatientStore.isRegistrationExist(para).then(res => {
                    if (res) {
                        this.newRegistrationShow = true;
                    } else {
                        Promise.resolve().then(() => {
                            return GlobalService.getCustomForm('REGISTRATION_INFO')
                        }).then(res => {
                            this.formOptions.fields = res.fields;
                            this.$refs.formmodal.open();
                        })
                    }
                });
            },
            confirmFinish() {
                var data = this.patientCardData;
                Router.go(`${this.$route.path.replace("/patient","/remote")}`);
            },
            cancel() {
                this.newRegistrationShow = false;
            },
            getVistingData(data) {
                this.visitingData = data;
            },
            showMore(mark) {
                if (mark == true && this.isShowMore != false) {
                    var h = 110;
                    this.$nextTick(() => {
                        h = parseInt($('.info_table').height()) + 5;
                        $('.card_page').css('top', h);
                    });
                } else {
                    if (this.isShowMore == false) {
                        this.isShowMore = true;
                        var h = 110;
                        this.$nextTick(() => {
                            h = parseInt($('.info_table').height()) + 5;
                            $('.card_page').css('top', h);
                            $('.info_table_more').text('收 起')
                        });
                    } else {
                        this.isShowMore = false;
                        $('.card_page').css('top', '115px');
                        $('.info_table_more').text('查看更多 +')
                    }
                }
            },
            newCard(viewName, id, digest) {
                this.$refs.records.newCard(viewName, id, digest);
            },
            addCard(card) {
                this.$refs.records.addCard(card);
            },
            showDetail(card) {
                this.$nextTick(() => {
                    this.$refs.detail.set(card);
                })
            },
            sidebarOperate(item) {
                switch (item.signal) {
                    case 'BACK':
                        this.back();
                        break;
                    case 'SUBMIT_DOCTOR':
                        this.chooseExpertBtn();
                        break;
                }
            },
            back() {
                if (this.$refs.records.haveEditing()) {
                    this.saveTip("back");
                } else {
                    window.history.back(-1);
                }
            },
            operateSignal(signal, v) {
                if (signal == 'SAVED') {
                    if (v == 'patient') {
                        this.$refs.records.home();
                    }
                } else if (signal == 'HOME') {
                    this.$refs.records.home();
                }
            }
        },
        watch: {
            patientId(v) {
                v && this.init(v);
            }
        }
    }
</script>