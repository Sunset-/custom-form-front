<style lang="sass">
    .dicom-archives-container {
        padding: 15px;
    }
</style>
<template>
    <div class="dicom-archives-container">
        <sunset-filter style="margin-bottom:15px;" :options="tableOptions.filter" @filter="filterData"></sunset-filter>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
    </div>
</template>
<script>
    import DicomCenterStore from './Store';

    const TASK_STATUS_BACK = '7';
    const TASK_STATUS_REPHOTO = '10';

    export default {
        methods: {
            filterData(filter) {
                this.$refs.table.search(filter);
            }
        },
        data() {
            return {
                //表格
                tableOptions: {
                    columns: [{
                        title: '影像号',
                        name: 'studyNo'
                    }, {
                        title: '患者编号',
                        name: 'patientNo'
                    }, {
                        title: '患者姓名',
                        name: 'patientName'
                    }, {
                        title: '设备类型',
                        name: 'deviceType'
                    }, {
                        title: '性别',
                        name: 'patientSex',
                        align: 'center',
                        format(v) {
                            var t = Sunset.Service.Dictionary.transcode('SEX', v);
                            return t != v ? t : '-';
                        }
                    }, {
                        title: '年龄',
                        name: 'patientAge',
                        align: 'center',
                        format(v) {
                            return v > 0 ? v : '-';
                        }
                    }, {
                        title: '检查日期',
                        name: 'studyDate',
                        format: 'DATETIME'
                    }],
                    showIndex: true,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: false,
                    sortable: true,
                    pageNumberStart: 0,
                    lazy: true,
                    format: {
                        list: 'data',
                        count: 'count',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    filter: {
                        align: 'left',
                        fields: [{
                            name: 'date',
                            widget: 'date',
                            type: 'daterange',
                            placeholder: '检查日期',
                            changeFilter: true,
                            style: 'width:130px;'
                        }, {
                            name: 'keyword',
                            widget: 'search',
                            placeholder: '影像号/患者编号/患者姓名',
                            //本地搜索
                            localFilter: function (record, v) {
                                return ~record.account.indexOf(v);
                            }
                        }],
                        format: function (filter) {
                            var f = {
                                keyword: filter.keyword,
                                startDate: void 0,
                                endDate: void 0
                            };
                            if (filter.date && filter.date[0] && filter.date[1]) {
                                f.startDate = filter.date[0].getTime();
                                f.endDate = filter.date[1].getTime();
                            }
                            return f;
                        },
                        searchButton: {
                            label: '刷新',
                            icon: 'refresh',
                            color: 'success'
                        }
                    },
                    //数据条目操作
                    recordTools: [{
                        label: '图像预览',
                        icon: 'eye',
                        color: 'info',
                        operate(record) {
                            Base.openEagleeyes(record.listId, 'STUDY');
                        }
                    }],
                    datasource: (filter) => {
                        filter.opcId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        return $http({
                            url: '/image-service/imageInfo/searchList',
                            type: 'POST',
                            data: filter
                        });
                    }
                }
            }
        }
    };
</script>