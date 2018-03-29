<style lang="sass">
    .current-hospital-container {
        width: 100%;
        min-width:1300px;
    }
</style>

<template>
    <div class="current-hospital-container">
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
    import DoctorPatientStore from "./DoctorPatientStore.js";
    import EquipmentStore from '../Equipment/Store.js';
    import VisitingModal from '../PatientDetail/VisitingModal';

    export default {
        components: {
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
                            style:'width:90px;text-align:center;',
                            format:(v)=>{
                                return v?JSON.parse(v).patientNumber:''
                            }
                        },{
                            title:"患者",
                            name:"patient.name",
                            style:'width:100px;text-align:center;'
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
                            title:"所在科室",
                            name:"registration.digest",
                            format:(v)=>{
                                return v&&JSON.parse(v).registeredDept
                            }
                        },{
                            title:"来自机构",
                            name:"source.name",
                            format:(v)=>{
                                if(!v){
                                    return GlobalService.getCurrentUserSync().relation.hospital[0].name
                                }else{
                                    return v
                                }
                            }
                        },{
                            title:"建档人",
                            name:"firstRegistration.creatorName"
                        },{
                            title:"建档科室",
                            name:"firstRegistration.digest",
                            format:(v)=>{
                                return v&&v.registeredDept
                            }
                        },{
                            title:"建档时间",
                            name:"firstRegistration.createDate",
                            format:'DATETIME',
                            style:'width:160px;text-align:center;'
                        },{
                            title:"病历数",
                            name:"patient.registrationRecordCount",
                            style:'text-align:center;'
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
                        filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        filter.searchType='1';
                        // return DoctorPatientStore[filter.status=='1'?'list':'listLinkMe'](filter);
                        return DoctorPatientStore.list(filter);

                    }
                },
                leftFilterOps: {
                    fields: [],
                    toolbar: {
                        tools: [{
                            label: '新增患者',
                            color: 'success',
                            operate: () => {
                                // 打开两个组件框
                                Promise.all([GlobalService.getCustomForm('PATIENT_DEMOGRAPHIC_INFO'),
                                    GlobalService.getCustomForm('REGISTRATION_INFO')
                                ]).then(res => {
                                    var index = 0;
                                    res[1].fields.forEach(function(v){
                                        if(v._sign && v._sign == true){
                                            return index = res[1].fields.indexOf(v)
                                        }
                                    });
                                    res[1].fields.splice(index,0,{
                                        label: '科室',
                                        name: 'frontdept',
                                        widget: 'cascader',
                                        changeOnSelect : true,
                                        _cascadeOffice: true,
                                        data: function (a, b, c) {
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
                                                            value: id+'_'+name
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
                                    });
                                    this.formOptions.fields = res[0].fields.concat(res[1].fields);
                                    this.formOptions.fields.forEach(v => {
                                        if (v.name == 'patientAge') {
                                            v.watch = ['birthday,registeredDate', (
                                                a, b, model) => {
                                                if(model.birthday){
                                                    model.patientAge = Base.calculateAge(
                                                        new Date(model.birthday), new Date(model.registeredDate)
                                                    );
                                                }
                                            }]
                                        }
                                    });
                                    var office = GlobalService.getCurrentUserSync().relation.office;
                                    this.$refs.formmodal.open({
                                        registeredDept:GlobalService.getCurrentUserSync().relation.office.id,
                                        name: '',
                                        sex: '',
                                        birthday: '',
                                        patientAge: '',
                                        idCard: '',
                                        frontdept : `${office.id}_${office.name}`,
                                        registeredDate: new Date()
                                    });
                                    this.startReadIDCard();
                                })
                            }
                        }]
                    }
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
                patientList: "",
                patient: "",
                currentPatient: "",
                detailContent: "",
                currentMedicaldataDetailType: null
            }
        },
        methods: {
            confirmFinish() {
                Router.go('/DifficultConsultation');
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
            detail(data) {
                this.patient = data;
                this.currentPatientId = this.patient.id;
                Router.go(`/DoctorOutpatient/patient/${data.id}`);
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