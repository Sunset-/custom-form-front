<template>
    <sunset-table-modal v-ref:modal :options="options" @submit="selected"></sunset-table-modal>
</template>

<script>
    import DoctorTeamStore from './DoctorTeamStore';

    export default {
        data() {
            return {
                options: {
                    title: '关联医生团队',
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
                        columns: [{
                            title: '头像',
                            name: 'picture',
                            style: 'width:60px;',
                            align: 'center',
                            format(v) {
                                return `<img style="width:40px;height:40px;border-radius:50px;overflow:hidden;"  onerror="this.src='/assets/img/user-default.png'" src="${Base.transformNfsFilePath(v)}" />`;
                            }
                        }, {
                            title: '名称',
                            name: 'extension.name'
                        }, {
                            title: '联系电话',
                            name: 'extension.contactPhone'
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
                        datasource: function(filter){
                            return DoctorTeamStore.loadAll(filter);
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