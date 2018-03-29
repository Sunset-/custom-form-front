<style lang="sass">
    .integral-container {
        padding: 15px;
        .pagebottom{
            position: fixed;
            bottom: 0;
            text-align: center;
            width: 100%;
            background: #c2c2c2;
            left: 130px;
            height: 80px;
            button{
                color: #fff;
                background: #09f;
                border: #09f;
                border-radius: 5px;
                padding: 10px;
                margin-top: 20px;
                cursor: pointer;
            }
        }
    }
</style>
<template>
    <div class="integral-container">
        <sunset-filter style="margin-bottom:15px;" :options="tableOptions.filter" @filter="filterData"></sunset-filter>
        <sunset-table v-ref:table :options="tableOptions"></sunset-table>
        <div class="pagebottom">
            <button @click="openshengcheng">生成结算报表</button>
        </div>
            <!-- <sunset-form-modal v-ref:jiesuanmodal :options="jiesuanOptions"></sunset-form-modal> -->
            <integral-modal v-ref:jiesuanmodal @submit="jiesuansubmit" @refresh ="filterData" ></integral-modal>
            <sunset-form-modal v-ref:shengchengmodal :options="shengchengOptions">
            </sunset-form-modal>
    </div>
</template>
<script>
    import Store from './Store';
    import IntegralModal from './IntegralModal.vue';
    // const TASK_STATUS_BACK = '7';
    // const TASK_STATUS_REPHOTO = '10';

    export default {
        components: {
            IntegralModal
        },
        methods: {
            filterData(filter) {
                this.$refs.table.search(filter);
            },
            openshengcheng(){
                var model={
                    hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                }
                return Store.lastreport(model).then(res => {
                    var startdate = new Date();
                    startdate.setFullYear(res.endDay.substr(0,4));
                    startdate.setMonth(res.endDay.substr(4,2)-1);
                    startdate.setDate(res.endDay.substr(6,2));
                    // startdate.setHours(0);startdate.setMinutes(0);startdate.setMilliseconds(0);
                    startdate = startdate.getTime();
                    // this.$refs.shengchengmodal.open({startdate:res.endDay.substr(0,4)+'/'+res.endDay.substr(4,2)+'/'+res.endDay.substr(6,2)});
                    this.$refs.shengchengmodal.open({startdate:startdate});
                });
                // this.$refs.shengchengmodal.open({startdate:1520006400000});
            },
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
                        title: '待结算积分',
                        name: 'waitSettleAmount'
                    }, {
                        title: '待兑换积分',
                        name: 'waitExchangeAmount',
                    }, {
                        title: '已兑换积分',
                        name: 'totalOutSumAmount'
                    }, {
                        title: '积分兑换时间',
                        name: 'lastExchangeTime',
                        format: 'DATETIME'
                    }],
                    showIndex: true,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: false,  // 可以更改 最前面的选项
                    sortable: true,
                    pageNumberStart: 0,
                    lazy: true,
                    format: {
                        list: 'rows',
                        count: 'totalCount',//count
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    filter: {
                        align: 'left',
                        fields: [ {
                            name: 'keyword',
                            widget: 'search',
                            placeholder: '医生姓名/手机号'
                        }],
                        format: function (filter) {
                            var f = {
                                keyword: filter.keyword,
                                // deviceType: filter.deviceType,
                                // startDate: void 0,
                                // endDate: void 0
                            };
                            // if (filter.date && filter.date[0] && filter.date[1]) {
                            //     f.startDate = filter.date[0].getTime();
                            //     f.endDate = filter.date[1].getTime();
                            // }
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
                            var hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            Router.go(`/PointManage/seeintegral?${record.userId}/${hospitalId}/${record.currentSumAmount}/${record.totalInSumAmount}/${record.totalOutSumAmount}`);
                        }
                    },{
                        label: '积分兑换',
                        color: 'ghost',
                        operate: (record) => {
                            this.$refs.jiesuanmodal.open(record);
                        }
                    }
                    ],
                    datasource: (filter) => {
                        // filter.opcId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        // return $http({
                        //     url: '/dicom-service/dcmInfo/searchList',
                        //     type: 'POST',
                        //     data: filter
                        // });
                        filter.hospitalId=GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        return Store.getintegralmain(filter);
                    }
                },
                shengchengOptions:{
                    width: 600,
                    title: '结算报表',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '结算初始日',
                            name: 'startdate',
                            widget: 'date',
                            disabled: true,
                            // validate: {
                                
                            // },
                        },{
                            label: '结算截止日',
                            name: 'enddate',
                            widget:'date',
                            validate: {
                                required: true
                            },
                            disabledDate : function(d){
                                return d.getTime() > Date.now()-86400000
                                // return d.getTime() > Date.now()
                            },
                            }],
                        tools: false,
                        submit: (model) => {
                            if(model.enddate+86400000<=model.startdate){
                                Sunset.tip("截止日期必须大于初始日期");
                                return
                            }
                            var postdata={
                                settleDate:model.enddate.getTime()+86400000-1,
                                hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                            }
                            return Store.SETTLE(postdata).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.table.refresh();
                                return res;
                            });
                        }
                    }
                },
                jiesuanOptions:{

                },
            }
        }
    };
</script>