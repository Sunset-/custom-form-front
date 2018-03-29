<style lang="sass">
    .seeintegral-container {
        padding: 15px;
        .seehead{
            text-align: center;
            div{
                display:inline-block;
                width:200px;
                height:100px;
                line-height:100px;
                background:#f2f2f2;
                font-size:18px;
                color:#333;
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
    }
</style>
<template>
    <div class="seeintegral-container">
        <div class="seehead">
            <div>当前积分  {{record[2]}}</div>
            <div>累积获取  {{record[3]}}</div>
            <div>已兑换   {{record[4]}}</div>
        </div>
        <div class="seebody">
            <sunset-filter v-ref:leftfilter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
            <sunset-datapage  v-ref:datapage :options="options" @refresh="refresh">
            <table cellspacing="0">
                <tr style="background:#2cab8e;color:#fff;height: 35px;">
                    <th>明细</th>
                    <th>兑换时间</th>
                    <th>兑换积分</th>
                    <th>操作人</th>
                </tr>
                <tr v-for="item in flowList" style="background:#f2f2f2;margin-top:10px;">
                    <td>
                        <!---->
                        <div>
                            <span>{{item.causeType=="WORK_REWARD"&&item.cause.patient.name || "积分兑换"}} </span>
                            <span style="margin-left:10px;" v-if="item.causeType=='WORK_REWARD'">{{item.cause.transfortype}} </span>
                        </div>
                        <div v-if="item.causeType=='WORK_REWARD'">单号:{{item.cause.reservationNumber}}</div>
                        <div v-if="item.causeType=='EXCHANGE'">报表:{{item.settlementReport.startDay}}至{{item.settlementReport.endDay}}</div>
                    </td>
                    <td>{{item.causeDate | time 'yyyy/MM/dd HH:mm'}}</td>
                    <td>{{item.amount}}</td>
                    <td>{{item.operator.name}}</td>
                </tr>
            </table>
            <div class="no_data" v-show="nothingData"></div>
            </sunset-datapage>
        </div>
    </div>
</template>

<script>
    import Store from './Store';


    export default {
        components: {

        },
        computed: {
            record(){
                var  ss=[]
                for (var p1 in this.$route.query) {
                    if (this.$route.query.hasOwnProperty(p1))
                        ss.push(p1);
                }
                ss = ss[0].split("/");
                return ss;
            },
        },
        props: {
        },
        ready() {
        },
        data() {
            return {
                // 循环的列表数据  阿拉拉了  阿拉拉  啊拉
                flowList:[],
                leftFilterOps:{
                    fields: [{
                        name: 'type',
                        widget: 'radio',
                        type: 'button',
                        default:'0', //Sunset.Service.Dictionary.alias('REFERRAL_IN_STATUS','WAITING'),2    这个值是"2"
                        valuePlace: 'key',
                        textPlace: 'value',
                        changeFilter: true,
                        data() {
                            var enums = [
                                {   alias:"ALL",
                                    key:"0",
                                    // type:"REFERRAL_IN_STATUS",
                                    value:"全部",
                                },{
                                    alias:"IN",
                                    key:"1",
                                    value:"获取",
                                },
                                {
                                    alias:"OUT",
                                    key:"2",
                                    value:"兑换",
                                }
                            ];
                            return enums;
                        }
                    }],
                },
                options:{
                    lazy : true,
                    pageNumberStart: 0,
                    pageSize: 5,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        // console.log(filter);
                        filter.userId=this.record[0];
                        filter.hospitalId = this.record[1];
                        return Store.getuserstatement(filter).then(res=>{
                            res.rows&&res.rows.forEach(element => {
                                element.inOrOut>0?"":element.amount='-'+element.amount;
                                if(element.causeType=='WORK_REWARD'&&element.cause.type=="transfertreatment"){element.cause.transfortype=Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_TYPE',element.cause.referralType)}
                                if(element.causeType=='WORK_REWARD'&&element.cause.type=="ordercheck"){element.cause.transfortype=element.cause.checkItem.categoryA+'>'+element.cause.checkItem.categoryB+'>'+element.cause.checkItem.item}
                                if(element.causeType=='EXCHANGE'){
                                    element.settlementReport.startDay=element.settlementReport.startDay.substr(0,4)+'/'+element.settlementReport.startDay.substr(4,2)+'/'+element.settlementReport.startDay.substr(6,2);
                                    element.settlementReport.endDay=element.settlementReport.endDay.substr(0,4)+'/'+element.settlementReport.endDay.substr(4,2)+'/'+element.settlementReport.endDay.substr(6,2);
                                }
                            });
                            this.flowList=res.rows;
                            return res
                        })
                    }
                },
            }
        },
        methods: {
            leftFilter(f) {
                this.$refs.datapage.search(f);
            },
            refresh(data){
                console.log(data);
            },
        }
    };
</script>