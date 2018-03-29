<template>
    <sunset-table-modal v-ref:modal :options="options" @submit="selected"></sunset-table-modal>
</template>

<script>
    import DoctorStore from './DoctorStore';

    export default {
        data() {
            return {
                options: {
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
                        filter: {
                            fields : [{
                                widget : 'search',
                                placeholder : '医生姓名',
                                name : 'keyword'
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
                }
            };
        },
        methods: {
            open() {
                this.$refs.modal.open();
            },
            close() {
                this.$refs.modal.cancel();
            },
            selected(items) {
                this.$emit('submit', items);
            },
            cancelLoading(){
                this.$refs.modal.loading(false);
            }
        }
    }
</script>