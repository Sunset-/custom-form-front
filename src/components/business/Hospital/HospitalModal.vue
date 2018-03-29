<template>
    <sunset-table-modal v-ref:modal :options="options" @submit="selected"></sunset-table-modal>
</template>

<script>
    import HospitalStore from './HospitalStore';

    export default {
        data() {
            return {
                options: {
                    title: '关联医院',
                    width: 1000,
                    checked: {
                        multi: (item) => {
                            return true;
                        },
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    tableOptions: {
                        columns: [ {
                            title: '名称',
                            name: 'extension.name'
                        }, {
                            title: '类型',
                            name: 'extension.type',
                            enum: "HOSPITAL_TYPE"
                        },  {
                            title: '等级',
                            name: 'extension.level',
                            enum: "HOSPITAL_LEVEL"
                        }, {
                            title: '地址',
                            name: 'extension.location'
                        }],
                        idKey: 'id',
                        showIndex: false,
                        pageSize: 5,
                        localPage: true,
                        multiCheck: true,
                        sortable: true,
                        pageNumberStart: 0,
                        format: {
                            list: '',
                            count: 'length',
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
                        datasource: (filter)=>{
                            return HospitalStore.loadHospital(filter);
                        }
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
            }
        }
    }
</script>