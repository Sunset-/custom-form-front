<style lang="sass">
    .doctor-outpatient-container {
        .sunset-field-label{
            text-align:left;
        }
        height: 100%;
        width: 100%;
        overflow: auto;
        .left_sidebar{
            width:130px;
            height:100%;
            overflow:hidden;
            background:#f2f2f2;
            & li{
                height:50px;
                line-height:50px;
                font-size:14px;
                font-weight:600;
                text-align:center;
                cursor:pointer;
                position:relative;
                border-left:5px solid #f2f2f2;
                &.active{
                    background:#fff;
                    border-left:5px solid #2cab8e;
                }
            }
        }
        .patients {
            position:absolute;
            right:0;
            left:130px;
            top:0;
            bottom:0;
            padding: 25px 15px 15px 15px;
            overflow: auto;
            .patient_list {
                width: 1320px;
                height: 100%;
                margin: auto;
                overflow: hidden;
                .no_data {
                    margin: 140px auto;
                    height: 400px;
                    width: 400px;
                    background: url(/assets/img/nodata.png) no-repeat;
                }
            }
            .sunset-page.sunset-page-right .ivu-page {
                float: none;
                margin: 0 auto;
                display: table;
            }
            .ivu-modal-content .ivu-modal-body>div {
                overflow-y: visible !important;
            }
        } // 测试资料卡
        .patient-detail-wrap {
            width: 100%;
            height: 100%;
        }
        .patient_edit {
            height: 100%;
            width: 100%;
        }
        .test-md-card {
            border: 1px solid #ccc;
            overflow: hidden;
            .cards-container {
                box-sizing: border-box;
                float: left;
                width: 250px;
                border: 1px solid yellowgreen;
                min-height: 100px;
            }
            .card-detail-container {
                margin-left: 250px;
                border: 1px solid orange;
                min-height: 100px;
            }
        }
    }
</style>

<template>
    <div class="doctor-outpatient-container">
        <Modal :visible.sync="newRegistrationShow" title="提示" ok-text="去关闭" @on-ok="confirmFinish" @on-cancel="cancel">
            <p class="new_tip">问诊还在进行中, 请先关闭问诊！</p>
        </Modal>
        <div class="left_sidebar">
            <ul>
                <li v-for="item in flowBodyList" :class="[item.key==currentItem.key?'active':'']" @click="chooseBody(item)">{{item.name}}</li>
            </ul>
        </div>
        <div class="patients" v-show="!routePatientId">
            <router-view></router-view>
        </div>
        <div class="patient-detail-wrap" v-if="routePatientId">
            <patient-detail :patient-id="routePatientId" :flow-id="''" :sidebar="patientDetailSidebar" :edit="true"></patient-detail>
        </div>
        <sunset-form-modal v-ref:formmodal :options="{title : '新增患者',width :1000, style : 'max-height:430px', formOptions:formOptions}" @cancel="stopReadIDCard"></sunset-form-modal>
        <sunset-form-modal v-ref:videoqueuemodal :options="{title : '视频登记',width :600, style : 'max-height:400px', formOptions:videoQueueOptions}"></sunset-form-modal>
        <visiting-modal v-ref:visitingmodal></visiting-modal>
    </div>
</template>

<script>
    import PatientDetail from "../PatientDetail/PatientDetail";
    import PatientItem from "./PatientItem";
    import DoctorPatientStore from "./DoctorPatientStore.js";
    import MedicalDataStore from '../MedicalData/MedicalDataStore.js';
    import EquipmentStore from '../Equipment/Store.js';
    import VisitingModal from '../PatientDetail/VisitingModal';

    export default {
        components: {
            PatientItem,
            PatientDetail,
            VisitingModal
        },
        computed: {
            path(){
                return this.$route.path;
            },
            isShowReport() {
                return this.$route.path.endsWith('/report');
            },
            routePatientId() {
                return this.$route.params.patientId;
            },
            currentPatientId() {
                return this.patient && this.patient.id;
            }
        },
        watch : {
            path(){
                if(this.$route.path.endsWith('/DoctorOutpatient')){
                    Router.go('/DoctorOutpatient/CurrentHospital');
                }else{
                    this.flowBodyList.forEach(item=>{
                        if(item.key==this.$route.path.substr(this.$route.path.lastIndexOf('/')+1)){
                            this.currentItem=item;
                        }
                    })
                }
            }
        },
        ready(){
            $('.doctor-outpatient-container').append('<div style="display:none"><audio id="tipMusic" src="/assets/img/readIDCard.mp3" controls>123</audio></div>');
            if(this.$route.path.endsWith('/DoctorOutpatient')){
                Router.go('/DoctorOutpatient/CurrentHospital');
            }else{
                this.flowBodyList.forEach(item=>{
                    if(item.key==this.$route.path.substr(this.$route.path.lastIndexOf('/')+1)){
                        this.currentItem=item;
                    }
                })
            }
        },
        beforeDestroy(){
            this.stopReadIDCard();
        },
        data() {
            return {
                currentItem:{
                    name: "本院",
                    id: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                    key:'CurrentHospital'
                },
                flowBodyList:[{
                        name: "本院",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                        key:'CurrentHospital'
                    },{
                        name: "本科室",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                        key:'CurrentDept'
                    },{
                        name: "我创建的",
                        id: GlobalService.getCurrentUserSync().user.userId,
                        key:'MyCreation'
                    },{
                        name: "我参与的",
                        id: GlobalService.getCurrentUserSync().user.userId,
                        key:'MyJoin'
                    }
                    ,{
                        name: "转诊患者",
                        id: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                        key:'Referral'
                    }
                ],
                patientIDCard:'',
                IDCardAutoInputTimer:'',
                newRegistrationShow: false,
                nothingData: false,
                filter: {
                    order: "DESC"
                },
                items: [],
                filterInited: false,
                formOptions: {
                    cols: 4,
                    tools: false,
                    fields: [],
                    format(model) {
                        var patient = {
                            name: model.name,
                            sex: model.sex,
                            birthday: new Date(model.birthday).getTime(),
                            mobilePhone: model.mobilePhone,
                            idCard: model.idCard,
                            socialCard: model.socialCard,
                            deptid: model.registeredDept.split("_")[0],
                        };
                        var registration = {
                            patientType: model.patientType || null,
                            patientNumber: model.patientNumber,
                            registeredDept: model.registeredDept.split("_")[1],
                            patientAge: model.patientAge,
                            registeredDate: new Date(model.registeredDate).getTime(),
                            deptid: model.registeredDept.split("_")[0],
                        };
                        model && Object.keys(model).filter((v) => v.indexOf("demographic") == 0).forEach((v) => {
                            patient[v] = model[v]
                        });
                        model && Object.keys(model).filter((v) => v.indexOf("registration") == 0).forEach((v) => {
                            registration[v] = model[v]
                        });
                        patient.extension = JSON.stringify(Object.assign(patient,registration));
                        patient.viewName = 'patient';
                        patient.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        registration.digest = registration.extension = JSON.stringify(registration);
                        registration.viewName = 'registration';
                        registration.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        return {
                            patient: JSON.stringify(patient),
                            registration: JSON.stringify(registration)
                        }
                    },
                    submit: (m) => {
                        return DoctorPatientStore.newPatient(m).then(res => {
                            this.$refs.formmodal.cancel();
                            Sunset.tip('添加成功', 'success');
                            this.$refs.table.refresh();
                        });
                    }
                },
                patientList: "",
                patient: "",
                currentPatient: "",
                detailContent: "",
                currentMedicaldataDetailType: null,
                testCards: [{
                    type: 'checkapplicationform',
                    id: '111',
                    data: 'aaa'
                }, {
                    type: 'inspectionapplicationform',
                    id: '222',
                    data: 'bbb'
                }, {
                    type: 'checkapplicationform',
                    id: '333',
                    data: 'ccc'
                }],
                // 视频登记 ，model
                videoQueueOptions: {
                    cols: 2,
                    tools: false,
                    fields: [{
                        label: '预约时间',
                        name: 'applyDate',
                        widget: 'date',
                        type: 'date',
                        premise :()=>{
                            return false;
                        },
                        disabledDate(date) {
                            return (date.getTime() + 86400000) < Date.now();
                        },
                        validate: {
                            required: true
                        }
                    }, {
                        label: '专家',
                        name: 'expertUserId',
                        widget: 'select',
                        textPlace: 'name',
                        valuePlace: 'id',
                        data: () => {
                            //  这个方法 会一上来就发送请求。。。，，，。。。
                            return $http({
                                url: '/service/business/relation/hospital/user',
                                type: 'GET',
                                data: {
                                    hospitalId: GlobalService.getCurrentUserSync().relation.hospital[
                                        0].id,
                                    userType: Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE',
                                        'DOCTOR'),
                                    pageNumber: 0,
                                    pageSize: 100
                                }
                            }).then(res => {
                                return res && res.rows || [];
                            })
                        },
                        validate: {
                            required: true
                        }
                    }, {
                        label: '诊室',
                        name: 'deptId',
                        widget: 'select',
                        textPlace: 'equipName',
                        valuePlace: 'id',
                        defaultFirst: true,
                        data: () => {
                            return EquipmentStore.loadAll(GlobalService.getCurrentUserSync().relation.hospital[
                                0].id);
                        },
                        validate: {
                            required: true
                        }
                    }],
                    cast(model) {
                        model.applyDate = new Date();
                    },
                    format(model) {
                        if (model.applyDate && Sunset.isDate(model.applyDate)) {
                            model.applyDate = model.applyDate.getTime();
                        }
                        model.applyUserId = GlobalService.getCurrentUserSync().user.userId;
                        // model.hospitalId = ;
                        // model.patientId = ;
                    },
                    submit(model) {
                        return $http({
                            url: '/service/business/videoQueue/push',
                            type: 'POST',
                            data: model
                        }).then(res => {
                            Sunset.tip('排队成功', 'success');
                        })
                    }
                },
                patientDetailSidebar: [
                    [{
                        label: '返回',
                        color:'',
                        bg: 'backbg',
                        icon: 'ios-undo-outline',
                        signal: 'BACK',
                    }, {
                        label: '提交专家',
                        color: '',
                        icon:'paper-airplane',
                        signal: 'SUBMIT_DOCTOR'
                    }, {
                        label: '视频登记',
                        color: '',
                        icon:'ios-videocam-outline',
                        operate: () => {
                            this.submitVideoQueue({
                                id: this.routePatientId,
                                hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0]
                                    .id,
                            });
                        }
                    }]
                ]
            }
        },
        methods: {
            chooseBody(item){
                this.currentItem = item;
                if(item.key=="CurrentHospital"){
                    Router.go('/DoctorOutpatient/CurrentHospital');
                }else if(item.key=="CurrentDept"){
                    Router.go('/DoctorOutpatient/CurrentDept');
                }else if(item.key=="MyCreation"){
                    Router.go('/DoctorOutpatient/MyCreation');
                }else if(item.key=="MyJoin"){
                    Router.go('/DoctorOutpatient/MyJoin');
                }else if(item.key=="Referral"){
                    Router.go('/DoctorOutpatient/Referral');
                }
            },
            confirmFinish() {
                Router.go('/DifficultConsultation');
            },
            cancel() {
                this.newRegistrationShow = false;
            },
            refresh(data) {
                this.patientList = data;
                if (!data.length) {
                    this.nothingData = true;
                } else {
                    this.nothingData = false;
                }
            },
            activeCard(card) {
                this.currentMedicaldataDetailType = card.type;
            },
            detail(data) {
                this.patient = data;
                this.currentPatientId = this.patient.id;
                Router.go(`/DoctorOutpatient/patient/${data.id}`);
            },
            remoteRequest(data) {
                Router.go(`${this.$route.path}/remote/${data.id}`);
            },
            submitVideoQueue(patient) {
                // 视频登记
                this.$refs.videoqueuemodal.open({
                    patientId: patient.id,
                    hospitalId: patient.hospitalId
                });
            },
            startReadIDCard(){
                this.stopReadIDCard();
                this.IDCardAutoInputTimer = setInterval(()=>{
                    Base.getIDCardInfo().then((res)=>{
                        if(res){
                            var audio = document.getElementById("tipMusic");
                            audio.play();
                            if(!this.patientIDCard || this.patientIDCard != res.number){
                                var IDCardInfo = Object.assign({},res);
                                this.$nextTick(() => {
                                    Object.assign(this.$refs.formmodal.$refs.form.getModel(true),
                                    {
                                        name: IDCardInfo.name,
                                        sex: IDCardInfo.sex,
                                        age: IDCardInfo.age,
                                        idCard: IDCardInfo.number,
                                        birthday: IDCardInfo.birthday,
                                        medicalCare: 'village_cooper',
                                        address: IDCardInfo.addr
                                    })
                                })
                            };
                            this.patientIDCard = res.number;
                        }
                    })
                },2000);
            },
            stopReadIDCard(){
                this.patientIDCard= null; 
                clearInterval(this.IDCardAutoInputTimer);
            }
        }
    }
</script>