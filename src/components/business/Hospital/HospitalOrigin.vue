<style lang="sass">
    .hospital-container {
        .sidebar {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            width: 300px;
            box-sizing: border-box;
            border-right: 1px solid #ccc;
            color: #222;
            &>header {
                background: #F2F2F2;
                padding: 10px;
                overflow: hidden;
                height: 50px;
                line-height: 30px;
                &>span {
                    display: inline-block;
                    font-size: 18px;
                    font-weight: bold;
                }
            }
            &>ul {
                position: absolute;
                top: 50px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                overflow: auto;
                padding: 10px;
                &>li {
                    border: 1px solid #C1D0E0;
                    border-radius: 2px;
                    background: #E7F0F5;
                    padding: 10px;
                    cursor: pointer;
                    margin-bottom: 10px;
                    &.active,
                    &:active {
                        border: 1px solid #FFCC66;
                        background: #FFF7E8;
                    }
                    h4 {
                        font-size: 16px;
                        padding-bottom: 5px;
                    }
                    p {
                        padding-top: 10px;
                        margin-bottom: 0px;
                        color: #555;
                    }
                }
            }
        }
        .major_title {
            height: 50px;
            line-height: 50px;
            position: absolute;
            top: 0;
            background: #F2F2F2;
            left: 300px;
            padding: 0 10px;
            width: 100%;
            font-size: 18px;
            font-weight: bold;
            color: #222;
            &>span {
                margin-left: 15px;
                height: 100%;
                width: 80px;
                display: inline-block;
                text-align: center;
                cursor: pointer;
            }
            .active {
                background: #fff;
            }
        }
        .major {
            position: absolute;
            top: 0px;
            left: 300px;
            right: 0px;
            bottom: 0px;
            overflow: auto;
            padding: 10px 30px;
            &>div>h4 {
                font-size: 14px;
                font-weight: bold;
                color: #222;
                padding: 10px 0px;
                margin-bottom: 10px;
                border-bottom: 1px solid #aaa;
            }
            & .ivu-modal {
                top: 70px !important;
            }
            &:before {
                content: '';
                position: absolute;
                top: 41px;
                left: 0px;
                width: 50px;
                height: 1px;
                background: #d7dde4;
            }
        }
    }
</style>
<template>
    <div class="hospital-container">
        <div class="sidebar">
            <header>
                <span>医院管理</span>
                <i-button type="success" style="float:right;" @click="addHospital(null)">添加医院</i-button>
            </header>
            <ul>
                <li :class="[selectedHospital==hospital?'active':'']" v-for="hospital in hospitals" @click="selectHospital(hospital)">
                    <h4 style="word-wrap: break-word;">{{hospital.name}}<a href="javascript:;" style="font-size:12px;margin-left:5px;" @click="addHospital(hospital)">修改</a></h4>
                    <p style="word-wrap: break-word;">{{hospital.type | enum 'HOSPITAL_TYPE'}} | {{hospital.level | enum 'HOSPITAL_LEVEL'}}</p>
                </li>
            </ul>
            <sunset-form-modal v-if="addHospitalModalOptions.formOptions" v-ref:hospitalmodal @saved="savedHospital" :options="addHospitalModalOptions"></sunset-form-modal>
        </div>
        <div class="major">
            <Tabs type="card" :animated="false" active-key="inner">
                <Tab-pane label="院内" key="inner">
                    <sunset-toolbar :options="assistantToolbar" style="margin-bottom:10px;"></sunset-toolbar>
                    <sunset-table v-ref:assistanttable :options="assistantOptions"></sunset-table>
                    <sunset-table-modal v-ref:assistantmodal v-if="addAssistantModalOptions.tableOptions" :options="addAssistantModalOptions"
                        @submit="selectAssistant"></sunset-table-modal>
                    <sunset-table-modal v-ref:innerdoctormodal v-if="addDoctorModalOptions.tableOptions" :options="addDoctorModalOptions" @submit="addInnerDoctor"></sunset-table-modal>
                </Tab-pane>
                <Tab-pane label="院外" key="outer">
                    <sunset-toolbar :options="doctorToolbar" style="margin-bottom:10px;"></sunset-toolbar>
                    <sunset-table v-ref:doctortable :options="doctorOptions"></sunset-table>
                    <sunset-table-modal v-ref:doctormodal :options="addDoctorOptions" @submit="selectDoctor"></sunset-table-modal>
                    <sunset-table-modal v-ref:teammodal :options="addTeamOptions" @submit="selectTeam"></sunset-table-modal>
                </Tab-pane>
                <Tab-pane label="设备" key="equipment">
                    <equipment v-if="selectedHospital" :hospital="selectedHospital"></equipment>
                </Tab-pane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import Equipment from '../Equipment/Equipment.vue';
    import HospitalStore from './HospitalStore.js';
    import DoctorStore from '../Doctor/DoctorStore.js';
    import DoctorTeamStore from '../DoctorTeam/DoctorTeamStore.js';
    import AssistantStore from '../Assistant/AssistantStore.js';
    export default {
        components: {
            Equipment
        },
        data() {
            return {
                currentHospital: true,
                selectedAssistants: null,
                selectedDoctors: null,
                addDoctors: null,
                selectedTeams: null,
                hospitals: [],
                selectedHospital: null,
                addHospitalModalOptions: {
                    title: '添加医院',
                    width: 800,
                    formOptions: null
                },
                doctorToolbar: {
                    tools: [{
                        label: '关联医生',
                        color: 'info',
                        icon: 'network',
                        operate: () => {
                            if (this.addDoctorOptions) {
                                this.selectedDoctors = this.$refs.doctortable.getRecords();
                                this.$refs.doctormodal.open();
                            }
                        }
                    }, {
                        label: '关联团队',
                        color: 'info',
                        icon: 'network',
                        operate: () => {
                            if (this.addTeamOptions) {
                                this.selectedTeams = this.$refs.doctortable.getRecords();
                                this.$refs.teammodal.open();
                            }
                        }
                    }]
                },
                doctorOptions: {
                    lazy: true,
                    columns: [{
                            title: '医生姓名',
                            name: 'name'
                        }, {
                            title: '类型',
                            name: 'wrapUserId',
                            format(v, record) {
                                if (v) {
                                    return "医生"
                                }
                                return "团队"
                            }
                        }, {
                            title: '联系方式',
                            name: 'wrapUserId',
                            format(v, record) {
                                if (v) {
                                    return record.contactPhone;
                                }
                                return '-';
                            }
                        }
                        // , {
                        //     title: '科室',
                        //     name: 'department'
                        // }, {
                        //     title: '职称/职称',
                        //     name: 'title'
                        // }
                    ],
                    recordTools: [{
                        label: '移除',
                        color: 'error',
                        operate: (record) => {
                            if (this.addDoctorOptions) {
                                var para = {
                                    save: [],
                                    delete: []
                                };
                                var obj = {};
                                obj.systemId = GlobalService.getCurrentUserSync().user.systemId;;
                                obj.hospitalId = this.selectedHospital.id;
                                // obj.userType = record.userType;
                                obj.teamId = record.id;
                                obj.isWrapTeam = record.wrapUserId ? true : false;
                                para.delete.push(obj);
                                return HospitalStore.relativeTeam(para).then(res => {
                                    this.$refs.doctortable.refresh();
                                });
                            }
                        }
                    }],
                    pageNumberStart: 0,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        filter.hospitalId = this.selectedHospital.id;
                        filter.property = Sunset.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY', 'Out');
                        return HospitalStore.loadDoctorInHospital(filter);
                    }
                },
                assistantToolbar: {
                    tools: [{
                        label: '添加医助',
                        color: 'info',
                        icon: 'plus',
                        operate: () => {
                            if (this.selectedHospital && this.addAssistantModalOptions) {
                                this.selectedAssistants = this.$refs.assistanttable.getRecords();
                                this.$refs.assistantmodal.open();
                            }
                        }
                    }, {
                        label: '添加医生',
                        color: 'info',
                        icon: 'plus',
                        operate: () => {
                            if (this.selectedHospital && this.addDoctorModalOptions) {
                                this.addDoctors = this.$refs.assistanttable.getRecords();
                                this.$refs.innerdoctormodal.open();
                            }
                        }
                    }]
                },
                assistantOptions: {
                    lazy: true,
                    columns: [{
                        title: '姓名',
                        name: 'name'
                    }, {
                        title: '帐号',
                        name: 'username',
                        format(v) {
                            return v.substring(0, v.indexOf('@'));
                        }
                    }, {
                        title: '类型',
                        name: 'userType',
                        format(v) {
                            return Sunset.Service.Dictionary.transcode('SYSTEM_ACCOUNT_TYPE', v)
                        }
                    }, {
                        title: '联系方式',
                        name: 'mobilePhone'
                    }],
                    recordTools: [{
                        label: '移除',
                        color: 'error',
                        operate: (record) => {
                            if (this.addAssistantModalOptions) {
                                var para = {
                                    save: [],
                                    delete: []
                                };
                                var obj = {};
                                obj.systemId = GlobalService.getCurrentUserSync().user.systemId;
                                obj.hospitalId = this.selectedHospital.id;
                                obj.userId = record.id;
                                para.delete.push(obj);
                                return HospitalStore.relativeDoctor(para).then(res => {
                                    this.$refs.assistanttable.refresh();
                                });
                            }
                        }
                    }],
                    pageNumberStart: 0,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        filter.hospitalId = this.selectedHospital.id;
                        filter.property = Sunset.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY', 'In');
                        return HospitalStore.loadAssistantInHospital(filter);
                    }
                },
                addDoctorModalOptions: {
                    title: '添加医生',
                    width: 1000,
                    checked: {
                        multi: (item) => {
                            var hospitalIdList = [];
                            item.relation.hospital.forEach(value => {
                                if (Sunset.Service.Dictionary.transcode('USER_HOSPITAL_PROPERTY',
                                        value.property) == "院内") {
                                    hospitalIdList.push(value.id)
                                }
                            })
                            return !hospitalIdList.length
                            //~(hospitalIdList.indexOf(this.selectedHospital ? this.selectedHospital.id : ''))
                            // return !(~(hospitalIdList).indexOf(this.selectedHospital ? this.selectedHospital.id : '')) && !(item.relation
                            //     .hospital && item.relation.hospital.length);
                        },
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    tableOptions: {
                        columns: [{
                        //     title: '头像',
                        //     name: 'picture',
                        //     style: 'width:60px;',
                        //     align: 'center',
                        //     format(v) {
                        //         return `<img style="width:40px;height:40px;border-radius:50px;overflow:hidden;"  onerror="this.src='/assets/img/user-default.png'" src="${Base.transformNfsFilePath(v)}" />`;
                        //     }
                        // }, {
                            title: '姓名',
                            name: 'name'
                        }, {
                            title: '职称',
                            name: 'jobTitle',
                            enum: "HOSPITAL_DUTY"
                        }, {
                            title: '科室',
                            name: 'dept'
                        }, {
                            title: '医院',
                            name: 'hospital'
                        }, {
                            title: '联系电话',
                            name: 'mobilePhone'
                        }, {
                            title: '状态',
                            name: 'relation.hospital',
                            format: (v) => {
                                if (v.length == 0) {
                                    return ''
                                }
                                var hospitalIdList = [];
                                v && v.forEach(value => {
                                    if (Sunset.Service.Dictionary.transcode(
                                            'USER_HOSPITAL_PROPERTY', value.property) ==
                                        "院内") {
                                        hospitalIdList.push(value.id)
                                    }
                                });
                                return hospitalIdList.length ? '已添加' : '';
                            }
                        }],
                        idKey: 'userId',
                        showIndex: false,
                        pageSize: 5,
                        localPage: false,
                        multiCheck: true,
                        sortable: true,
                        pageNumberStart: 0,
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: {
                            fields: [{
                                label: '',
                                name: 'keyword',
                                widget: 'search',
                                placeholder: '医生姓名'
                            }]
                        },
                        //数据条目操作
                        formatFilter(filter) {
                            filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
                            return filter;
                        },
                        store: DoctorStore
                    }
                },
                addAssistantModalOptions: {
                    title: '添加医助',
                    width: 800,
                    checked: {
                        multi: (item) => {
                            return !(item.relation.hospital && item.relation.hospital.map(v => v.id).indexOf(this.selectedHospital ?
                                this.selectedHospital.id : '') >= 0) && !(item.relation.hospital && item.relation
                                .hospital.length);
                        },
                        label: 'name'
                    },
                    tableOptions: {
                        columns: [{
                            title: '姓名',
                            name: 'name'
                        }, {
                            title: '账号',
                            name: 'username',
                            format(v) {
                                return v.substring(0, v.indexOf('@'));
                            }
                        }, {
                            title: '联系电话',
                            name: 'mobilePhone'
                        }, {
                            title: '服务医院',
                            name: 'relation.hospital',
                            format: (v) => {
                                return v && (v.map(v => v.name))[0]
                            }
                        }, {
                            title: '状态',
                            name: 'relation.hospital',
                            format: (v) => {
                                if (v.length == 0) {
                                    return ''
                                }
                                return v && (~(v.map(value => value.id)).indexOf(this.selectedHospital ?
                                    this.selectedHospital.id : '')) ? '已添加' : '已关联';
                            }
                        }],
                        idKey: 'userId',
                        showIndex: false,
                        pageSize: 5,
                        localPage: false,
                        multiCheck: true,
                        sortable: true,
                        pageNumberStart: 0,
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: {
                            fields: [{
                                label: '',
                                name: 'keyword',
                                widget: 'search',
                                placeholder: '医助姓名'
                            }]
                        },
                        //数据条目操作
                        formatFilter(filter) {
                            filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'ASSISTANT');
                            return filter;
                        },
                        store: AssistantStore
                    },
                },
                addDoctorOptions: {
                    title: '关联医生',
                    width: 1000,
                    checked: {
                        multi: (item) => {
                            var hospitalIdList = [];
                            item.relation.hospital.forEach(value => {
                                if (Sunset.Service.Dictionary.transcode('USER_HOSPITAL_PROPERTY',
                                        value.property) == "院外") {
                                    hospitalIdList.push(value.id)
                                }
                            })
                            return !~(hospitalIdList.indexOf(this.selectedHospital ? this.selectedHospital.id : ''));
                        },
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
                            name: 'name'
                        }, {
                            title: '职称',
                            name: 'jobTitle',
                            enum: "HOSPITAL_DUTY"
                        }, {
                            title: '科室',
                            name: 'dept'
                        }, {
                            title: '医院',
                            name: 'hospital'
                        }, {
                            title: '联系电话',
                            name: 'mobilePhone'
                        }, {
                            title: '状态',
                            name: 'relation.hospital',
                            format: (v) => {
                                var hospitalIdList = [];
                                v && v.forEach(value => {
                                    if (Sunset.Service.Dictionary.transcode(
                                            'USER_HOSPITAL_PROPERTY',
                                            value.property) == "院外") {
                                        hospitalIdList.push(value.id)
                                    }
                                })
                                return ~(hospitalIdList.indexOf(this.selectedHospital ? this.selectedHospital
                                    .id : '')) ? '已关联' : '';
                            }
                        }],
                        idKey: 'userId',
                        showIndex: false,
                        pageSize: 5,
                        localPage: false,
                        multiCheck: true,
                        sortable: true,
                        pageNumberStart: 0,
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        formatFilter(filter) {
                            filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
                            return filter;
                        },
                        store: DoctorStore
                    }
                },
                addTeamOptions: {
                    title: '关联医生团队',
                    width: 1000,
                    checked: {
                        multi: (item) => {
                            return !(item.relation.hospital && item.relation.hospital.map(v => v.id).indexOf(this.selectedHospital ?
                                this.selectedHospital.id : '') >= 0)
                        },
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
                            name: 'name'
                        }, {
                            title: '联系电话',
                            name: 'contactPhone'
                        }, {
                            title: '创建时间',
                            name: 'createDate',
                            format: "DATETIME"
                        }, {
                            title: '状态',
                            name: 'relation.hospital',
                            format: (v) => {
                                return v && (~(v.map(value => value.id)).indexOf(this.selectedHospital ?
                                    this.selectedHospital.id : '')) ? '已关联' : '';
                            }
                        }],
                        idKey: 'id',
                        pageSize: 5,
                        localPage: false,
                        multiCheck: true,
                        sortable: true,
                        pageNumberStart: 0,
                        format: {
                            list: 'rows',
                            count: 'totalCount',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        //表格工具栏
                        toolbar: [],
                        //表格搜索
                        filter: false,
                        //数据条目操作
                        formatFilter(filter) {
                            filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            filter.isWrapTeam = false;
                            return filter;
                        },
                        store: DoctorTeamStore
                    }
                }
            }
        },
        computed: {
            isShowOutHospital() {
                return GlobalService.getSystemModules().map(v => v.moduleNo).filter(v => v == "DoctorTeam").length != 0
            }
        },
        methods: {
            hospitalOuter() {
                this.currentHospital = false
            },
            hospitalInner() {
                this.currentHospital = true
            },
            savedHospital() {
                this.loadAllHospital();
            },
            addInnerDoctor(addDoctors) {
                var para = {
                    save: [],
                    delete: []
                };
                var arr = [];
                this.addDoctors.forEach((value, index) => {
                    addDoctors.forEach((v, i) => {
                        if (value.id == v.id) {
                            arr.push(value.id)
                        }
                    });
                });
                addDoctors.forEach((v) => {
                    if (arr.indexOf(v.id) == -1) {
                        var obj = {};
                        obj.systemId = v.systemId;
                        obj.hospitalId = this.selectedHospital.id;
                        obj.userType = v.userType;
                        obj.userId = v.userId;
                        obj.property = Sunset.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY', 'In');
                        para.save.push(obj)
                    }
                });
                return HospitalStore.relativeDoctor(para).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.innerdoctormodal.cancel();
                    this.$refs.assistanttable.refresh();
                })
            },
            selectAssistant(selectedAssistants) {
                var arr = [];
                var para = {
                    save: [],
                    delete: []
                };
                this.selectedAssistants.forEach((value, index) => {
                    selectedAssistants.forEach((v, i) => {
                        if (value.id == v.id) {
                            arr.push(value.id)
                        }
                    })
                });
                // this.selectedAssistants.forEach(value=>{
                //     if(arr.indexOf(value.id)==-1){
                //         var obj = {};
                //         obj.systemId = value.systemId;
                //         obj.hospitalId = this.selectedHospital.id;
                //         obj.userType = value.userType;
                //         obj.userId = value.userId;
                //         para.delete.push(obj)
                //     }
                // });
                selectedAssistants.forEach((v) => {
                    if (arr.indexOf(v.id) == -1) {
                        var obj = {};
                        obj.systemId = v.systemId;
                        obj.hospitalId = this.selectedHospital.id;
                        obj.userType = v.userType;
                        obj.property = Sunset.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY', 'In');
                        obj.userId = v.userId;
                        para.save.push(obj)
                    }
                });
                if (this.selectedHospital && this.selectedHospital.id) {
                    if (para.save.length) {
                        return HospitalStore.relativeDoctor(para).then(res => {
                            this.$refs.assistantmodal.cancel();
                            this.$refs.assistanttable.refresh();
                            Sunset.tip("保存成功", "success");
                        }, err => {
                            this.$refs.assistantmodal.loading(false);
                        });
                    } else {
                        Sunset.tip("请选择医助", "warning");
                        this.$refs.assistantmodal.cancel();
                    }
                } else {
                    Sunset.tip("请选择目标医院", "warning")
                }
            },
            selectDoctor(selectedDoctors) {
                var para = {
                    save: [],
                    delete: []
                };
                var arr = [];
                this.selectedDoctors.forEach((value, index) => {
                    selectedDoctors.forEach((v, i) => {
                        if (value.id == v.id) {
                            arr.push(value.id)
                        }
                    });
                });
                // this.selectedDoctors.forEach(value=>{
                //     if(arr.indexOf(value.id)==-1){
                //         var obj = {};
                //         obj.systemId = value.systemId;
                //         obj.hospitalId = this.selectedHospital.id;
                //         obj.userType = value.userType;
                //         obj.userId = value.userId;
                //         para.delete.push(obj)
                //     }
                // });
                selectedDoctors.forEach((v) => {
                    if (arr.indexOf(v.id) == -1) {
                        var obj = {};
                        obj.systemId = v.systemId;
                        obj.hospitalId = this.selectedHospital.id;
                        obj.userType = v.userType;
                        obj.userId = v.userId;
                        obj.property = Sunset.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY', 'Out');
                        para.save.push(obj)
                    }
                });
                return HospitalStore.relativeDoctor(para).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.doctormodal.cancel();
                    this.$refs.doctortable.refresh();
                });
            },
            selectTeam(selectedTeams) {
                var para = {
                    save: [],
                    delete: []
                };
                var arr = [];
                this.selectedTeams.forEach((value, index) => {
                    selectedTeams.forEach((v, i) => {
                        if (value.id == v.id) {
                            arr.push(value.id)
                        }
                    });
                });
                // this.selectedTeams.forEach(value=>{
                //     if(arr.indexOf(value.id)==-1){
                //         var obj = {};
                //         obj.systemId = GlobalService.getCurrentUserSync().user.systemId;
                //         obj.hospitalId = this.selectedHospital.id;
                //         obj.teamId = value.id;
                //         // obj.teamType = value.teamType;
                //         para.delete.push(obj)
                //     }
                // });
                selectedTeams.forEach((v) => {
                    if (arr.indexOf(v.id) == -1) {
                        var obj = {};
                        obj.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        obj.hospitalId = this.selectedHospital.id;
                        obj.teamId = v.id;
                        para.save.push(obj)
                    }
                });
                return HospitalStore.relativeTeam(para).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.teammodal.cancel();
                    this.$refs.doctortable.refresh();
                });
            },
            //医院
            loadAllHospital() {
                HospitalStore.loadHospital({
                    systemId: GlobalService.getCurrentUserSync().user.systemId
                }).then(hospitals => {
                    this.hospitals = hospitals;
                    if (hospitals.length) {
                        this.selectHospital(hospitals[0]);
                    }
                });
            },
            addHospital(model) {
                if (this.addHospitalModalOptions.formOptions) {
                    this.$refs.hospitalmodal.open(model);
                } else {
                    GlobalService.getCustomForm('HOSPITAL').then(res => {
                        res.submit = (model) => {
                            model.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            return HospitalStore.saveHospital(model).then(res => {
                                Sunset.tip('保存成功');
                            });
                        };
                        res.tools = false;
                        this.addHospitalModalOptions.formOptions = res;
                        this.$nextTick(() => {
                            this.$refs.hospitalmodal.open(model);
                        });
                    });
                }
            },
            selectHospital(hospital) {
                if (hospital) {
                    this.selectedHospital = hospital;
                    this.loadAccountOfHospital();
                }
            },
            loadAccountOfHospital() {
                this.$refs.doctortable.refresh();
                this.$refs.assistanttable.refresh();
            },
            //医助
            addAssistant(model) {
                if (this.addAssistantModalOptions.formOptions) {
                    this.$refs.assistantmodal.open(model);
                } else {
                    GlobalService.getCustomForm('ASSISTANT').then(res => {
                        res.submit = (model) => {
                            return HospitalStore.saveAssistant(model).then(res => {
                                Sunset.tip('保存成功');
                            });
                        };
                        res.tools = false;
                        this.addAssistantModalOptions.formOptions = res;
                        this.$nextTick(() => {
                            this.$refs.assistantmodal.open(model);
                        });
                    });
                }
            }
        },
        ready() {
            this.loadAllHospital();
        }
    }
</script>