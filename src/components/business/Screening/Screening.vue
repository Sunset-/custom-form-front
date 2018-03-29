<style lang="sass">
    .eye_screening_container{
        overflow: auto;
        width: 100%;
        height: 100%;
        .eye_screen_activity{
            padding: 15px;
            padding-top: 25px;
            .activity_list{
                width: 1338px;
                height: 100%;
                margin: 20px auto;
                overflow: hidden;
                .activity_list_box{
                    border:1px solid #ccc;
                    width:100%;
                    height:100%;
                    &>div:nth-child(odd){
                        background:#f2f2f2;
                    }
                }
                .no_data{
                    margin:140px auto;
                    height:400px;
                    width:400px;
                    background:url(/assets/img/nodata.png) no-repeat;
                }
            }
            .sunset-page.sunset-page-right .ivu-page{
                float: none;
                margin: 0 auto;
                display: table;
            }
        }
    }
</style>
<template>
    <div class="eye_screening_container">
        <div class="eye_screen_activity" v-show="currentPatientId?false:true">
            <sunset-filter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
            <sunset-filter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
            <sunset-datapage v-ref:datapage :options="options" @refresh="refresh">
                <div class="activity_list">
                    <div v-show="!nothingData" class="activity_list_box">
                        <screening-item v-for="item in activityList" :activity="item" @detail="detail" @check="getCurrentActivity"></screening-item>
                    </div>
                    <div class="no_data" v-show="nothingData"></div>
                </div>
            </sunset-datapage>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import ScreeningItem from "../Screening/ScreeningItem";
    import ScreeningStore from "./ScreeningStore.js"
    export default {
        components:{
            ScreeningItem
        },
        ready(){
        },
        computed:{
            currentPatientId() {
                return this.$route.params.activityId;
            }

        },
        data(){
            return{
                activityMembers:null,
                currentActivity:null,
                checkActivity: false,
                activityList:null,
                nothingData:false,
                filterInited: false,        
                filter:{
                    status : Sunset.Service.Dictionary.alias('ACTIVITY_STATUS','OVER')
                },
                options: {
                    pageNumberStart: 0,
                    pageSize: 5,
                    lazy: true,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        var relation =  GlobalService.getCurrentUserSync().relation;
                        filter.hospitalId = relation.hospital&&relation.hospital[0]&&relation.hospital[0].id;
                        return ScreeningStore.list(filter);
                    }
                },
                leftFilterOps: {
                    fields: [{
                        name: 'status',
                        widget: 'radio',
                        type: 'button',
                        defaultFirst: true,
                        valuePlace: 'key',
                        textPlace: 'value',
                        changeFilter: true,
                        data() {
                            return [{
                                key: '1',
                                value: '进行中'
                            }, {
                                key: '2',
                                value: '已结束'
                            }]
                        }
                    }],
                    // format(filter) {
                    //     if (filter.status == 'ALL') {
                    //         filter.status = "";
                    //     }
                    // },
                    toolbar: {}
                },
                rightFilterOps: {
                    align: 'right',
                    format: (filter) => {
                        if (filter.keyword) {
                            filter.keyword = filter.keyword.trim();
                        } else {
                            filter.keyword = ""
                        };
                        if (filter.date && filter.date[0] && filter.date[1]) {
                            filter.date[0].setHours(0);
                            filter.date[0].setMinutes(0);
                            filter.date[0].setSeconds(0);
                            filter.date[1].setHours(0);
                            filter.date[1].setMinutes(0);
                            filter.date[1].setSeconds(0);
                            filter.betweenDate = filter.date[0].getTime() + ',' + (filter.date[1].getTime() + 3600 *
                                24 * 1000 - 1);
                            delete filter.date;
                        } else {
                            filter.betweenDate = '';
                            delete filter.date;
                        }
                        return filter
                    },
                    fields: [{
                        label: '',
                        name: 'date',
                        placeholder: '日期区间',
                        widget: 'date',
                        type: 'daterange'
                    }, {
                        name: 'keyword',
                        widget: 'search',
                        placeholder: '活动名称'
                    }]
                },
                tableOptions:{
                    columns: [{
                        title: '名称',
                        name: 'name'
                    }, {
                        title: '地点',
                        name: 'place',
                        align: 'center',
                        format(v) {
                            
                        }
                    }, {
                        title: '时间',
                        name: 'time',
                        enum: 'ACCOUNT_TYPE'
                    }],
                    datasource:()=>{
                        return this.currentActivity
                    },
                    datasource: (filter)=>{
                        return this.activityList
                    },
                    showIndex: false,
                    pageNumberStart: 0,
                    pageSize: 12,
                    localPage: true,
                    sortable: true,
                    idKey: "name",
                    recordTools: {tools:[]},   
                }
            }
        },
        methods:{
            leftFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited &&　this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            refresh(data){
                this.activityList = data;
                if (!data.length) {
                    this.nothingData = true;
                } else {
                    this.nothingData = false;
                }
            },
            getCurrentActivity(data){
                return ScreeningStore.getActivityInfo(data.id).then(res=>{
                    this.currentActivity = res;
                    var members = [];
                    this.activityMembers.forEach(v=>{
                        res.users.forEach(value=>{
                            if(v.userId == value.id){
                                members.push(v.label) 
                            }
                        })
                    });
                    var checks = Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v=>v.key);
                    var para={
                        name:res.name,
                        place:res.location,
                        address: res.address,
                        time:[new Date(res.startDate),new Date(res.endDate)],
                        member: members,
                        checkItem: checks.filter(v=>(res.checks[0].value&v)>0)
                    }
                    this.$nextTick(() => {
                        this.$refs.formmodal.open(para);
                    })
                })
            },
            detail(data){
                Router.go(`${this.$route.path}/activity/${data.id}`);
            }

        },
        watch: {
            currentPatientId(v) {
                if (!v) {
                    this.$refs.datapage.refresh();
                }
            }
        }
    }
</script>