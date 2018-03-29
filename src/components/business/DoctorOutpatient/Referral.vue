<style lang="sass">
    .referral-container {
        width: 100%;
        min-width:1300px;
    }
</style>

<template>
    <div class="referral-container">
        <sunset-filter v-ref:leftfilter :options="leftFilterOps" @filter="leftFilter"></sunset-filter> 
        <sunset-filter v-ref:rightfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
        <sunset-table v-ref:table :options="options" style="margin-top:10px;">
            <img class="no_data" style="display:block;margin:50px auto;" slot="empty" src="/assets/img/nodata.png">
        </sunset-table>
        <visiting-modal v-ref:visitingmodal @saved="saveVisiting"></visiting-modal>
        <sunset-form-modal v-ref:formmodal :options="{title : '新增患者',width :1000, style : 'max-height:430px', formOptions:formOptions}" @cancel="stopReadIDCard"></sunset-form-modal>
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
        data() {
            return {
                patientIDCard:'',
                IDCardAutoInputTimer:'',
                newRegistrationShow: false,
                nothingData: false,
                filter: {
                    order: "DESC"
                },
                items: [],
                filterInited: false,
                options: {
                    pageNumberStart: 0,
                    pageSize: 12,
                    lazy: true,
                    columns:[{
                            title:"患者编号",
                            name:"registration.digest",
                            format:(v)=>{
                                return v?JSON.parse(v).patientNumber:''
                            }
                        },{
                            title:"患者",
                            name:"patient.name"
                        },{
                            title:"性别",
                            name:"patient.sex",
                            enum:"SEX"
                        },{
                            title:"年龄",
                            name:"registration.digest",
                            format:(v)=>{
                                var patientAge = v&&JSON.parse(v).patientAge;
                                return patientAge&&patientAge.replace(',','')||'-';
                            }
                        },{
                            title:"身份证号",
                            name:"patient.extension",
                            format:(v)=>{
                                return v?JSON.parse(v).idCard:''
                            }
                        },{
                            title:"联系电话",
                            name:"patient.extension",
                            format:(v)=>{
                                return v?JSON.parse(v).mobilePhone:''
                            }
                        },{
                            title:"提交人",
                            name:"special.flow.applyUser",
                            format:(v)=>{
                                return v&&v.name
                            }
                        },{
                            title:"提交日期",
                            name:"special.flow.applyDate",
                            format:(v)=>{
                                return v&&Sunset.Dates.format(v,'yyyy-MM-dd')
                            }
                        },{
                            title:"所在科室",
                            name:"registration.digest",
                            format:(v)=>{
                                return v&&JSON.parse(v).registeredDept
                            }
                        },{
                            title:"来自机构",
                            name:"source.name"
                        },{
                            title:"病历数",
                            name:"patient.registrationRecordCount",
                            style:'width:100px;text-align:center;'
                        }
                    ],
                    recordTools:[{
                            label:"编辑",
                            color:"primary",
                            // premise:(record)=>{
                            //     return record.flow.status != Sunset.Service.Dictionary.alias('RegistrationRecordStatus', 'Finish')
                            // },
                            operate:(record)=>{
                                this.detail(record.patient);
                            }
                        },{
                            label:"新建病历",
                            color:"ghost",
                            // premise:(record)=>{
                            //     return record.flow.status == Sunset.Service.Dictionary.alias('RegistrationRecordStatus', 'Finish')
                            // },
                            operate:(record)=>{
                                var patient = record.patient;
                                var now = new Date();
                                this.$refs.visitingmodal.open({
                                    patientId: patient.id,
                                    hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                    registeredDept: '',
                                    registeredDate: now,
                                    patientAge: patient.birthday ? Base.calculateAge(new Date(
                                        patient.birthday), now):'',
                                });
                            }
                        }
                    ],
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    // formatFilter(filter) {
                    //     if (filter.hospitalId == '') {
                    //         delete filter.hospitalId;
                    //     }
                    //     return filter;
                    // },
                    datasource: (filter) => {
                        if(GlobalService.getCurrentUserSync().relation.hospital[0].id){
                            filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        }else{
                            filter.creatorUserId = GlobalService.getCurrentUserSync().user.userId;
                        }
                        if(filter.transferType=='in'){
                            filter.searchType='4';
                        }else{
                            filter.searchType='5';
                        }
                        return DoctorPatientStore.list(filter);
                    }
                },
                leftFilterOps: {
                    fields: [{
                        name: 'transferType',
                        widget: 'radio',
                        type: 'button',
                        valuePlace: 'key',
                        textPlace: 'value',
                        defaultFirst:true,
                        changeFilter: true,
                        data: {
                            'in':'转入',
                            'out':'转出'
                        }
                    }],
                    toolbar: {
                        tools: [{
                            label: '提交时间',
                            icon: 'arrow-up-c',
                            color: 'ghost',
                            operate: () => {
                                if (this.filter.order == "DESC") {
                                    this.filter.order = "ASC";
                                    this.leftFilterOps.toolbar.tools[0].icon = "arrow-down-c";
                                } else {
                                    this.filter.order = "DESC";
                                    this.leftFilterOps.toolbar.tools[0].icon = "arrow-up-c";
                                }
                                this.leftFilter(this.filter);
                            }
                        }]
                    }
                },
                rightFilterOps: {
                    align: 'right',
                    format: (filter) => {
                        if (filter.keyword) {
                            filter.keyword = filter.keyword.trim();
                        } else {
                            filter.keyword = ""
                        };
                        if (filter.date && filter.date[0] && filter.date[1]) {
                            filter.date[0].setHours(0);
                            filter.date[0].setMinutes(0);
                            filter.date[0].setSeconds(0);
                            filter.date[1].setHours(0);
                            filter.date[1].setMinutes(0);
                            filter.date[1].setSeconds(0);
                            filter.betweenDate = filter.date[0].getTime() + ',' + (filter.date[1].getTime() + 3600 *
                                24 * 1000 - 1);
                            delete filter.date;
                        } else {
                            filter.betweenDate = '';
                            delete filter.date;
                        }
                        return filter
                    },
                    fields: [{
                        label: '',
                        name: 'date',
                        placeholder: '日期区间',
                        widget: 'date',
                        type: 'daterange'
                    }, {
                        name: 'keyword',
                        widget: 'search',
                        placeholder: '患者姓名'
                    }]
                },
                formOptions: {
                    cols: 4,
                    tools: false,
                    fields: [],
                    format(model) {
                        var dept=model.frontdept.slice(model.frontdept.lastIndexOf(",")+1);
                        var patient = {
                            name: model.name,
                            sex: model.sex,
                            birthday: new Date(model.birthday).getTime(),
                            mobilePhone: model.mobilePhone,
                            idCard: model.idCard,
                            socialCard: model.socialCard,
                            deptid: dept&&dept.split("_")[0],
                        };
                        var registration = {
                            patientType: model.patientType || null,
                            patientNumber: model.patientNumber,
                            registeredDept: dept&&dept.split("_")[1],
                            patientAge: model.patientAge,
                            registeredDate: new Date(model.registeredDate).getTime(),
                            deptid: dept&&dept.split("_")[0],
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
            confirmFinish() {
                Router.go('/DifficultConsultation');
            },
            cancel() {
                this.newRegistrationShow = false;
            },
            saveVisiting(){
                this.$refs.table.refresh();
            },
            leftFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.table.search(this.filter);
                this.filterInited = true;
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.table.search(this.filter);
                this.filterInited = true;
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
        },
        beforeDestroy(){
            this.stopReadIDCard();
        },
        watch: {
            routePatientId(v) {
                if (!v) {
                    this.$refs.table.refresh();
                }
            }
        }
    }
</script>