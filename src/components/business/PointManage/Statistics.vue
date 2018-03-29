<style lang="sass">
    .Statistics-container {
        padding: 15px;
    }
</style>
<template>
    <div class="Statistics-container">
        <sunset-filter style="margin-bottom:15px;" :options="tableOptions.filter" @filter="filterData"></sunset-filter>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
    </div>
</template>
<script>
    import Store from './Store';

    // const TASK_STATUS_BACK = '7';
    // const TASK_STATUS_REPHOTO = '10';

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
                        title: '医生',
                        name: 'user.name'
                    }, {
                        title: '联系电话',
                        name: 'user.mobilePhone'
                    }, {
                        title: '所属医院',
                        name: 'user.hospital'
                    }, {
                        title: '所有积分',
                        name: 'totalInSumAmount'
                    }, {
                        title: '待兑换积分',
                        name: 'endDayWaitExchangeAmount',
                        format(v,record) {
                            return `<span>${v+record.endDayWaitSettleAmount}</span>`
                        }
                    }, {
                        title: '已兑换积分',
                        name: 'totalOutSumAmount'
                    }, {
                        title: '预约转诊',
                        name: 'referralSumAmount',
                    }, {
                        title: '预约检查',
                        name: 'checkupSumAmount',
                    }],
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
                    filter: {
                        align: 'left',
                        fields: [ {
                            name: 'date',
                            widget: 'date',
                            type: 'daterange',
                            placeholder: '检查日期',
                            changeFilter: true,
                            style: 'width:130px;',
                            placement: 'bottom-start',
                            shortcuts: [{
                                    text: '今天',
                                    value() {
                                        const start = new Date();
                                        start.setHours(0);
                                        start.setMinutes(0);
                                        start.setSeconds(0);
                                        start.setMilliseconds(0);
                                        return [start, new Date(start + 86399999)];
                                    }
                                }, {
                                    text: '昨天',
                                    value() {
                                        const start = new Date();
                                        start.setHours(0);
                                        start.setMinutes(0);
                                        start.setSeconds(0);
                                        start.setMilliseconds(0);
                                        return [new Date(start - 86400000), new Date(start - 1)];
                                    }
                                }, {
                                    text: '最近三天',
                                    value() {
                                        const start = new Date();
                                        start.setHours(0);
                                        start.setMinutes(0);
                                        start.setSeconds(0);
                                        start.setMilliseconds(0);
                                        return [new Date(start - 86400000 * 2), new Date(start +
                                            86399999)];
                                    }
                                }, {
                                    text: '最近一周',
                                    value() {
                                        const start = new Date();
                                        start.setHours(0);
                                        start.setMinutes(0);
                                        start.setSeconds(0);
                                        start.setMilliseconds(0);
                                        return [new Date(start - 86400000 * 6), new Date(start +
                                            86399999)];
                                    }
                                },
                                {
                                    text: '全部',
                                    value() {
                                        return [0, 0];
                                    }
                                }
                            ]
                        }],
                        format: function (filter) {
                            var f = {
                                keyword: filter.keyword,
                                deviceType: filter.deviceType,
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
                        label: '查看',
                        color: 'ghost',
                        operate(record) {
                            // Router.go('/PointManage/seeStatistics');
                            var hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            Router.go(`/PointManage/seeStatistics?${record.userId}/${hospitalId}/${record.endDayWaitSettleAmount+record.endDayWaitExchangeAmount}/${record.totalInSumAmount}/${record.totalOutSumAmount}`);
                        }
                    }
                    ],
                    datasource: (filter) => {
                        filter.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        filter.betweenDate =(filter.startDate||filter.endDate? filter.startDate+","+filter.endDate:"0,158000000000000000000000000");
                        return Store.statistics(filter).then(res=>{
                            return res;
                        });
                    }
                }
            }
        }
    };
</script>