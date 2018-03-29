<style lang="sass">
    .settlement-container {
        padding: 15px;
    }
</style>
<template>
    <div class="settlement-container">
        <!-- <sunset-filter style="margin-bottom:15px;" :options="tableOptions.filter" @filter="filterData"></sunset-filter> -->
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
    </div>
</template>
<script>
    import Store from './Store';

    // const TASK_STATUS_BACK = '7';
    // const TASK_STATUS_REPHOTO = '10';

    export default {

        ready() {
            this.$refs.table.search(); 
            $(this.$el).on('click','.duihuan-trigger',function(ev){
                //  console.log($(ev.target).data('endDay'))
                Router.go('/PointManage/seetlement?'+$(ev.target).data('id')+'/'+$(ev.target).data('startday')+'/'+$(ev.target).data('endday')+'/'+'0');
            })
        },
        methods: {
            filterData(filter) {
                this.$refs.table.search(filter);
            },
        },
        data() {
            return {
                //表格
                tableOptions: {
                    columns: [{
                        title: '报表',
                        name: 'reporttime',
                        format(v,record) {
                            return `<span>${record.startDay.substr(0,4)}/${record.startDay.substr(4,2)}/${record.startDay.substr(6,2)}至${record.endDay.substr(0,4)}/${record.endDay.substr(4,2)}/${record.endDay.substr(6,2)}结算报表</span>`
                        }
                    }, {
                        title: '状态',
                        name: 'howcont',
                        format(v,record) {
                            if(record.userTotalCount==0){
                                return '<span>无可兑换积分</span>'
                            }
                            if(record.userTotalCount>0&&record.exchangedUserCount==0){
                                return '<span>未兑换</span>'
                            }
                            return record.userTotalCount==record.exchangedUserCount?'<span>已全部兑换</span>':`<span style="color:#f90">部分兑换；已兑换${record.exchangedUserCount}位；<span class="duihuan-trigger" data-id="${record.id}" data-startday="${record.startDay}" data-endday="${record.endDay}" style="text-decoration-line: underline;cursor: pointer;">待兑换${record.userTotalCount-record.exchangedUserCount}位</span></span>`
                        }
                    }, {
                        title: '未兑换 / 全部积分',
                        name: 'stats',
                        style:"text-align:center;",
                        format(v,record) {
                            return `<span>${record.stats.totalSettledCount-record.stats.totalExchangedCount} / ${record.stats.totalSettledCount}</span>`
                        },
                    },{
                        title: '报表生成时间',
                        name: 'createTime',
                        format: 'DATETIME'
                    },{
                        title: '结算人',
                        name: 'operator.name',
                        // format: 'DATETIME'
                    },],
                    showIndex: true,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: false,
                    sortable: true,
                    pageNumberStart: 0,
                    lazy: true,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    // filter: {
                    //     align: 'left',
                    //     fields: [ {
                    //         name: 'date',
                    //         widget: 'date',
                    //         type: 'daterange',
                    //         placeholder: '检查日期',
                    //         changeFilter: true,
                    //         style: 'width:130px;',
                    //         placement: 'bottom-start',
                    //         shortcuts: [{
                    //                 text: '今天',
                    //                 value() {
                    //                     const start = new Date();
                    //                     start.setHours(0);
                    //                     start.setMinutes(0);
                    //                     start.setSeconds(0);
                    //                     start.setMilliseconds(0);
                    //                     return [start, new Date(start + 86399999)];
                    //                 }
                    //             }, {
                    //                 text: '昨天',
                    //                 value() {
                    //                     const start = new Date();
                    //                     start.setHours(0);
                    //                     start.setMinutes(0);
                    //                     start.setSeconds(0);
                    //                     start.setMilliseconds(0);
                    //                     return [new Date(start - 86400000), new Date(start - 1)];
                    //                 }
                    //             }, {
                    //                 text: '最近三天',
                    //                 value() {
                    //                     const start = new Date();
                    //                     start.setHours(0);
                    //                     start.setMinutes(0);
                    //                     start.setSeconds(0);
                    //                     start.setMilliseconds(0);
                    //                     return [new Date(start - 86400000 * 2), new Date(start +
                    //                         86399999)];
                    //                 }
                    //             }, {
                    //                 text: '最近一周',
                    //                 value() {
                    //                     const start = new Date();
                    //                     start.setHours(0);
                    //                     start.setMinutes(0);
                    //                     start.setSeconds(0);
                    //                     start.setMilliseconds(0);
                    //                     return [new Date(start - 86400000 * 6), new Date(start +
                    //                         86399999)];
                    //                 }
                    //             },
                    //             {
                    //                 text: '全部',
                    //                 value() {

                    //                     return [0, 0];
                    //                 }
                    //             }
                    //         ]
                    //     }],
                    //     format: function (filter) {
                    //         var f = {
                    //             keyword: filter.keyword,
                    //             deviceType: filter.deviceType,
                    //             startDate: void 0,
                    //             endDate: void 0
                    //         };
                    //         if (filter.date && filter.date[0] && filter.date[1]) {
                    //             f.startDate = filter.date[0].getTime();
                    //             f.endDate = filter.date[1].getTime();
                    //         }
                    //         return f;
                    //     },
                    //     searchButton: {
                    //         label: '刷新',
                    //         icon: 'refresh',
                    //         color: 'success'
                    //     }
                    // },
                    //数据条目操作
                    recordTools: [{
                        label: '查看',
                        color: 'ghost',
                        operate(record) {
                            Router.go('/PointManage/seetlement?'+record.id+'/'+record.startDay+'/'+record.endDay);
                        }
                    },{
                        label: '导出',
                        color: 'ghost',
                        // name: () => {
                        //     debugger
                        //     return 'v.excel';
                        // },
                        // data: () => {
                        //     debugger
                        //     return Store.export({id:record.id});
                        // },
                        operate(record) {
                            var excelhttp = GlobalService.getSystemConfig().getexcel;
                            // window.open(`http://192.168.0.143:7000/business/workcoin/hospital/report/export?id=${record.id}`);
                            window.open(`${excelhttp}/business/workcoin/hospital/report/export?id=${record.id}`);
                        }
                    }
                    ,{
                        label: '一键兑换',
                        color: 'warning',
                        premise:() => { return false },
                        operate: (record) => {
                            var clear = Sunset.confirm({
                                content: '确定一键兑换所有积分？',
                                loading: true,
                                onOk: () => {
                                    // MedicalDataStore.removeCards(card.id).then(res => {
                                    //     this.$emit('refresh');
                                    // });
                                    clear();
                                }
                            });
                        },
                    }
                    ],
                    datasource: (filter) => {
                        filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        // return $http({
                        //     url: '/dicom-service/dcmInfo/searchList',
                        //     type: 'POST',
                        //     data: filter
                        // });
                        return Store.TLEMENT(filter);
                    }
                }
            }
        },

    };
</script>