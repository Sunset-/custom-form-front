<style lang="sass">
    .patient-info {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #E1E1E1;
        overflow: hidden;
        .pi-back {
            float: left;
            width: 30px;
            height: 100%;
            text-align: center;
            background: #C5C5C5;
            cursor: pointer;
            &:hover {
                background: #b5b5b5;
            }
        }
        .pi-content {
            padding-left: 40px;
            padding-top: 15px;
            &>span {
                font-size: 16px;
            }
            &>label {
                display: inline-block;
                padding-left: 5px;
            }
        }
        .patientWrap {
            font-size: 14px;
            min-height: 150px;
            .radio-group-wrap>.ivu-radio-group {
                width: 140px;
            }
            & .ivu-input,
            & .sunset-form-field .sunset-field-label {
                font-size: 14px;
            }
            .patientInfo {
                float: left;
                height: 30px;
                line-height: 30px;
                width: 25%;
                &>label {
                    font-weight: 600;
                }
            }
        }
    }
</style>
<template>
    <div class="patient-info">
        <div class="pi-back" @click="back">
            <Icon type="chevron-left" style="margin-top:8px;"></Icon>
            <br> 返
            <br>回
            <br>
        </div>
        <div class="pi-content">
            <span>{{patient.name}}</span>
            <label>{{patient.sex | enum 'SEX'}}</label>
            <label>{{age}}</label>
        </div>
        <sunset-toolbar style="padding:5px 0px 0px 10px;" :options="toolbarOptions"></sunset-toolbar>
        <visiting-modal v-ref:visitingmodal @saved="savedVisiting"></visiting-modal>
        <sunset-view-modal v-ref:infomodal :options="infoOptions">
            <ul v-show="!isEditInfo" class="patientWrap">
                <li v-for="item in patientData" class="patientInfo">
                    <label>{{item.label}}</label>
                    <span>{{item.value}}</span>
                </li>
            </ul>
            <div v-show="isEditInfo" class="patientWrap">
                <sunset-form v-ref:infoform :options="patientInfoForm"></sunset-form>
            </div>
        </sunset-view-modal>
    </div>
</template>
<script>
    import VisitingModal from './VisitingModal';
    import Store from './Store';
    export default {
        components: {
            VisitingModal
        },
        props: {
            patient: {}
        },
        data() {
            return {
                isEditInfo: false,
                infoOptions: {
                    title: '基本信息',
                    width: 1000,
                    toolbar: [{
                        label: '编辑',
                        color: 'primary',
                        premise: () => {
                            return this.isOwnHospitalPatient && !this.isEditInfo;
                        },
                        operate: () => {
                            this.isEditInfo = true;
                            this.patientInfoForm.fields = this.patientInfoForm.fields.filter(field => {
                                return field._mark;
                            });
                            this.patientData.forEach(item => {
                                if (item.name.indexOf('demographic') == 0 && item.name !=
                                    'demographic') {
                                    this.patientInfoForm.fields.splice(this.patientInfoForm.fields.length -
                                        1, 0, {
                                            label: '',
                                            name: item.name,
                                            widget: 'input',
                                            removeable: true,
                                            prepend: {
                                                style: 'width:80px',
                                                enum: 'DEMOGRAPHIC_STRECH'
                                            }
                                        })
                                }
                            });
                            this.$refs.infoform.reset(this.patient.extension);
                        }
                    }, {
                        label: '保存',
                        color: 'success',
                        premise: () => {
                            return this.isEditInfo;
                        },
                        operate: () => {
                            this.$refs.infoform.submit();
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        premise: () => {
                            return !this.isEditInfo;
                        },
                        operate: () => {
                            this.$refs.infomodal.cancel();
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        premise: () => {
                            return this.isEditInfo;
                        },
                        operate: () => {
                            this.isEditInfo = false;
                        }
                    }]
                },
                patientInfoForm: {
                    cols: 4,
                    tools: false,
                    fields: [{
                        label: '姓名',
                        name: 'name',
                        _mark: true,
                        validate: {
                            required: true,
                            maxlength: 20
                        },
                        widget: 'input'
                    }, {
                        label: '性别',
                        name: 'sex',
                        widget: 'radio',
                        _mark: true,
                        validate: {
                            required: true
                        },
                        enum: 'SEX'
                    }, {
                        label: '出生日期',
                        name: 'birthday',
                        widget: 'date',
                        _mark: true
                    }, {
                        label: '手机号码',
                        name: 'mobilePhone',
                        widget: 'input',
                        validate:{
                            phone:true
                        },
                        _mark: true
                    }, {
                        label: '身份证',
                        name: 'idCard',
                        widget: 'input',
                        validate:{
                            IdCard:true
                        },
                        _mark: true
                    }, {
                        label: '费用类别',
                        name: 'socialCard',
                        widget: 'select',
                        _mark: true,
                        enum: 'MEDICARE'
                    }, {
                        size: 'small',
                        widget: 'button',
                        text: '添加',
                        color: 'success',
                        style: 'margin-left:30px',
                        _mark: true,
                        operate(model, options, patientInfoForm) {
                            var index = 0;
                            patientInfoForm.fields.forEach(function (v) {
                                if (v._mark && v._mark == true) {
                                    return index = patientInfoForm.fields.indexOf(v)
                                }
                            });
                            patientInfoForm.fields.splice(index, 0, {
                                label: '',
                                name: 'demographic' + Date.now(),
                                widget: 'input',
                                removeable: true,
                                prepend: {
                                    style: 'width:80px',
                                    defaultFirst: true,
                                    onChange: "CLEAR",
                                    enum: 'DEMOGRAPHIC_STRECH'
                                }
                            })
                        }
                    }],
                    format: (model) => {
                        var patient = {
                            name: model.name,
                            sex: model.sex,
                            birthday: new Date(model.birthday).getTime(),
                            mobilePhone: model.mobilePhone,
                            idCard: model.idCard,
                            socialCard: model.socialCard
                        };
                        model && Object.keys(model).filter((v) => v.indexOf("demographic") == 0).forEach((v) => {
                            patient[v] = model[v]
                        });
                        var param = {};
                        param.dataId = this.patient && this.patient.cardId;
                        param.registrationRecordId = this.patient && this.patient.registrationRecordId;
                        param.extension = JSON.stringify(patient);
                        param.entity = JSON.stringify(patient);
                        param.digest = '';
                        param.viewName = 'patient';
                        param.patientId = this.patient.id;
                        param.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        var para = [];
                        para.push(param);
                        return para
                    },
                    submit: (m) => {
                        return Store.savePatient(m).then(res => {
                            this.isEditInfo = false;
                            Sunset.tip('保存成功', 'success');
                            res = res[0];
                            res.extension = JSON.parse(res.extension);
                            Object.assign(this.patient, res);
                        });
                    }
                },
                toolbarOptions: {
                    tools: [{
                        label: '基本信息',
                        color: 'ghost',
                        style: 'background:#FFF;',
                        operate: () => {
                            this.$refs.infomodal.open();
                        }
                    }, {
                        label: '新建病历',
                        icon: 'plus-round',
                        color: 'warning',
                        style: 'width:100px',
                        premise: () => {
                            return this.isOwnHospitalPatient;
                        },
                        operate: () => {
                            var patient = this.patient;
                            var now = new Date();
                            this.$refs.visitingmodal.open({
                                patientId: patient.patientId,
                                hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0]
                                    .id,
                                registeredDept: '',
                                registeredDate: now,
                                patientAge: patient.birthday ? Base.calculateAge(new Date(
                                    patient.birthday), now) : '',
                            });
                        }
                    }]
                }
            }
        },
        computed: {
            isOwnHospitalPatient() {
                return GlobalService.getCurrentUserSync().relation.hospital[0].id == this.patient.hospitalId;
            },
            patientData() {
                if (this.patient && this.patient.extension) {
                    var patient = this.patient.extension;
                    var data = [
                        ['name', '姓名'],
                        ['sex', '性别', 'SEX'],
                        ['birthday', '出生日期', 'Date'],
                        ['mobilePhone', '手机号码'],
                        ['idCard', '身份证'],
                        ['socialCard', '费用类别','MEDICARE']
                    ];
                    var patientInfo = [];
                    data.forEach((item) => {
                        var obj = {};
                        if (item[2]) {
                            if (item[2] == 'Date') {
                                obj.value = Sunset.Dates.format(patient[item[0]], 'yyyy-MM-dd')
                            } else {
                                obj.value = Sunset.Service.Dictionary.transcode(item[2], patient[item[0]])
                            }
                        } else {
                            obj.value = (patient[item[0]] != '' && patient[item[0]] != undefined) ? patient[
                                item[0]] : '';
                        }
                        obj.name = item[0];
                        obj.label = item[1] + '：';
                        patientInfo.push(obj);
                    });
                    for (let key in patient) {
                        if (key.indexOf('demographic') == 0 || key.indexOf('registration') == 0) {
                            var obj = {
                                name: key,
                                label: patient[key].split(',')[0] + '：',
                                value: patient[key].split(',')[1]
                            };
                            patientInfo.push(obj);
                        }
                    }
                    return patientInfo;
                }
            },
            age() {
                if (this.patient && this.patient.birthday) {
                    return Base.calculateAge(new Date(
                        this.patient.birthday), new Date()).replace(',', '');
                }
                return '';
            }
        },
        methods: {
            savedVisiting() {
                this.$emit('refresh-visiting');
            },
            back() {
                window.history.go(-1);
            }
        }
    }
</script>