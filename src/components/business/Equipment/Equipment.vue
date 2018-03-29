<template>
    <div>
        <sunset-toolbar :options="toolbarOptions" style="margin-bottom:10px;"></sunset-toolbar>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
        <sunset-form-modal v-ref:modal :options="modalOptions"></sunset-form-modal>
    </div>
</template>
<script>
    import Store from './Store.js';

    export default {
        props: {
            hospital: {}
        },
        data() {
            return {
                toolbarOptions: {
                    tools: [{
                        label: '新增设备',
                        color: 'info',
                        icon: 'network',
                        operate: () => {
                            this.$refs.modal.open({
                                hospitalId: this.hospital.id
                            });
                        }
                    }]
                },
                modalOptions: {
                    width: 600,
                    title: '设备管理',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '设备名称',
                            name: 'equipName',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 30
                            }
                        }, {
                            label: '设备类型',
                            name: 'equipType',
                            enum: 'HOSPITAL_QUIPMENT_TYPE',
                            widget: 'select',
                            validate: {
                                required: true
                            }
                        }, {
                            label: '备注',
                            name: 'remark',
                            monopolize: true,
                            widget: 'textarea',
                            validate: {
                                maxlength: 50
                            }
                        }],
                        tools: false,
                        submit: (model) => {
                            return Store.save(model).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.table.refresh(1, true);
                                return res;
                            });
                        }

                    }
                },
                tableOptions: {
                    columns: [{
                        title: '设备名称',
                        name: 'equipName'
                    }, {
                        title: '设备类型',
                        name: 'equipType',
                        enum: 'HOSPITAL_QUIPMENT_TYPE'
                    }, {
                        title: '更新时间',
                        name: 'modifiedDate',
                        format: 'DATETIME'
                    }],
                    recordTools: [{
                        label: '下载脚本',
                        type: 'download',
                        color: 'info',
                        name: (record) => {
                            return `${record.equipName}.sh`;
                        },
                        data: (record) => {
                            return `data:text/plain,echo "nohup /opt/google/chrome/chrome --kiosk ${GlobalService.getSystemConfig().videoPageUrl}?equipmentId=${record.id}&close=false> ~/peami.log 2>&1 &" >> ~/.profile`;
                        }
                    }, {
                        label: '修改',
                        color: 'warning',
                        operate: (record) => {
                            this.$refs.modal.open(record);
                        }
                    }, {
                        label: '移除',
                        color: 'error',
                        confirm: '确定移除此设备？',
                        operate: (record) => {
                            return Store.remove(record.id).then(res => {
                                this.$refs.table.refresh(1, true);
                            });
                        }
                    }],
                    pageNumberStart: 0,
                    lazy: false,
                    localPage: true,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        return Store.loadAll(this.hospital.id);
                    }
                }
            }
        },
        watch: {
            hospital() {
                this.$refs.table.refresh(1, true);
            }
        }
    }
</script>