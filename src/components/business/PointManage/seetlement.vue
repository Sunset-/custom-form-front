<style lang="sass">
    .seetlement-container {
        padding: 15px;
        .seehead{
            .head1{
                border-bottom:1px solid #ccc;
                padding-bottom: 10px;
            }
            .head2{
                margin-bottom:15px;
                margin-top: 10px;
                font-size: 16px;
            }
        }
        .seebody{
            margin-top:20px;
            table{
                width:100%;
                text-align:left;
                margin-top:15px;
                tr{
                    td,th{
                        padding:5px;
                    }
                    td{
                        border-top: 5px solid #fff;
                    }
                }
            }
        }
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
                background: #f90;
                border: #09f;
                border-radius: 5px;
                padding: 10px;
                margin-top: 20px;
            }
        }
    }
</style>
<template>
    <div class="seetlement-container">
        <div class="seehead">
            <div class="head1">结算报表 / 查看</div>
            <div class="head2">{{startday}} 至 {{endday}} 结算报表如下：</div>
        </div>
        <div class="seebody">
            <sunset-table v-ref:table :options="tableOptions" :checkeds="checkeds"></sunset-table>
            <!-- {{checkeds | json}} -->
        </div>
        <div class="pagebottom">
            <button @click="openshengcheng">积分兑换</button>
        </div>
    </div>
</template>

<script>
    import Store from './Store';


    export default {
        ready() {
            var  ss=[]
            for (var p1 in this.$route.query) {
                if (this.$route.query.hasOwnProperty(p1))
                    ss.push(p1);
            }
            ss = ss[0].split("/");
            // this.getdata = ss;
            ss[3]?this.$refs.table.search({
                settlementReportId:ss[0],
                isExchanged:0
            }):this.$refs.table.search({
                settlementReportId:ss[0],
            });

        },
        components: {

        },
        computed: {
            startday() {
                var  ss=[]
                for (var p1 in this.$route.query) {
                    if (this.$route.query.hasOwnProperty(p1))
                        ss.push(p1);
                }
                ss = ss[0].split("/");
                return ss[1].substr(0,4)+'/'+ss[1].substr(4,2)+'/'+ss[1].substr(6,2);
            },
            endday(){
                var  ss=[]
                for (var p1 in this.$route.query) {
                    if (this.$route.query.hasOwnProperty(p1))
                        ss.push(p1);
                }
                ss = ss[0].split("/");
                return ss[2].substr(0,4)+'/'+ss[2].substr(4,2)+'/'+ss[2].substr(6,2);
            }
        },
        data() {
            return {
                // 循环的列表数据  阿拉拉了  阿拉拉  啊拉
                checkeds:[],
                getdata:[],
                tableOptions: {
                    columns: [{
                        title: '医生',
                        name: 'user.name',
                        sortable: false,
                    }, {
                        title: '联系电话',
                        name: 'user.mobilePhone',
                        sortable: false,
                    }, {
                        title: '所属医院',
                        name: 'user.hospital',
                        sortable: false,
                    }, {
                        title: '积分',
                        name: 'stagedAmount',
                    },{
                        title: '是否兑换',
                        name: 'isExchanged',
                        format(v,record) {
                            return v?'<span>已兑换</span>':`<span style="color:#f00">未兑换</span>`
                        }
                    },{
                        title: '积分兑换时间',
                        name: 'exchangeTime',
                        format: 'DATETIME',
                    }, {
                        title: '兑换人',
                        name: 'operator.name',
                    }],
                    showIndex: true,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: true,
                    multiCheck(item) {
                        return !(item.isExchanged?'true':item.stagedAmount==0?'true':item.isExchanged);
                    },
                    sortable: true,
                    pageNumberStart: 0,
                    lazy: true,
                    idKey : 'userId',
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
                            name: 'keyword',
                            widget: 'search',
                            placeholder: '医生姓名/手机号'
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
                        label: '积分兑换',
                        color: 'info',
                        disabled: (record) => {
                            // if(record){return record.isExchanged}
                            if(record){return record.isExchanged?'true':record.stagedAmount==0?'true':record.isExchanged;}
                        },
                        operate: (record) => {
                            var somemodel={
                                userIds:record.userId,
                                hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                                settlementReportId:record.settlementReportId,
                            }
                            return Store.multiusers(somemodel).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$emit('submited');
                                this.checkeds=[];
                                this.$refs.table.refresh();
                            });
                        }
                    }
                    ],
                    datasource: (filter) => {
                        return Store.TLEMENTDETAIL(filter).then(res=>{
                            return res;
                        });
                        // return Store.getOicm(filter).then(res=>{
                        //     return res;
                        // });
                    }
                },
            }
        },
        methods: {
            leftFilter(f) {
                // Object.assign(this.filter, f);
                // this.filterInited && this.$refs.datapage.setFilter(this.filter);
                // this.filterInited = true;
                console.log(f);
            },
            refresh(data){
                // this.flowList = data;
                // if (!data.length) {
                //     this.nothingData = true;
                // } else {
                //     this.nothingData = false;
                // }
                console.log(data);
            },
            openshengcheng(){
                if(this.checkeds.length<=0){
                    Sunset.tip("请选择需要兑换的信息");
                    return
                }
                var checkeds= this.checkeds;
                var idss = []
                checkeds.forEach(element => {
                    idss.push(element.userId)
                });
                var userids = idss.join(",");
                var somemodel={
                    userIds:userids,
                    hospitalId:GlobalService.getCurrentUserSync().relation.hospital&&GlobalService.getCurrentUserSync().relation.hospital[0].id,
                    settlementReportId:checkeds[0].settlementReportId,
                }
                return Store.multiusers(somemodel).then(res=>{
                    Sunset.tip('提交成功', 'success');
                    this.$emit('submited');
                    this.checkeds=[];
                    this.$refs.table.refresh();
                });
            }
        }
    };
</script>