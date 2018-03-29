<style lang="sass">
    .search_regist{
        height: 100%;
        overflow:auto;
        .search_regist_main{
            padding: 15px;
            padding-top: 25px;
            .activity_title{
                padding-left: 20px;
                height: 40px;
                line-height: 40px;
                width: 100%;
                .back{
                    color: #0099ff;
                    cursor: pointer;
                }
            }
            .patient_list{
                width: 1338px;
                margin: auto;
                .count_table{
                    margin: 50px 0 30px;
                    .patient_count{
                        display:inline-block;
                        height:80px;
                        margin:10px 20px;
                        cursor:pointer;
                        .count_counter{
                            height:50px;
                            line-height:50px;
                            font-size:16px;
                            text-align:center;
                            &>span{
                                font-size:40px;
                                color:red
                            }
                            &>.active{
                                color:#3091f2;
                                border-bottom: 2px solid #3091f2;
                            }
                        }
                        .count_type{
                            height:30px;
                            line-height:30px;
                            font-size:16px;
                        }
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="search_regist">
        <div class='search_regist_main' v-show="currentPatientId?false:true">
            <sunset-filter v-ref:leftfilter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
            <div class="activity_title"><span class="back" @click="back">活动列表</span><span>&nbsp/&nbsp{{activityInfo?activityInfo.name:''}}</span></div>
             <div  class="patient_list" >
                <div class="count_table">
                    <div class="patient_count" v-for="item in countData" @click="search(item)">
                        <div class="count_counter"><span :class="[item._isActive?'active':'']">{{item.number}}</span>人</div>
                        <div class="count_type">{{item.diseaseName}}</div>
                    </div>
                </div>
                <sunset-table v-ref:table :options="tableOptions"></sunset-table>
            </div> 
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import ScreeningStore from "./ScreeningStore.js"
    export default {
        data(){
            return {
                countData:[],
                activityInfo:null,
                IDCardAutoInputTimer:null,
                patientIDCard:null,
                filter: {},
                options:{
                    pageNumberStart: 0,
                    pageSize: 2,
                    lazy: true,
                    format: {
                        list: '',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        return this.currentActivity
                    }
                },
                tableOptions:{
                    lazy: false,
                    columns: [{
                        title: '编号',
                        name: 'activityRegister.number'
                    }, {
                        title: '姓名',
                        name: 'patient.extension',
                        format(v){
                            return v?JSON.parse(v).name:''
                        }
                    },{
                        title: '性别',
                        name: 'patient.extension',
                        format(v){
                            return v?Sunset.Service.Dictionary.transcode('SEX',JSON.parse(v).sex):''
                        }
                    }, {
                        title: '年龄',
                        name: 'registration.extension',
                        format(v){
                            return v?JSON.parse(v).patientAge.replace(',',""):''
                        }
                    }, {
                        title: '联系方式',
                        name: 'patient.extension',
                        format(v){
                            return v?JSON.parse(v).mobilePhone:''
                        }
                    },{
                        title: '视力(右/左)',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            var eyeVersion=JSON.parse(v).vision;
                            if(eyeVersion==''||eyeVersion==undefined){
                                return '-'
                            }else{
                                var vision = JSON.parse(eyeVersion);
                                if(vision.right || vision.left){
                                    var right ='';
                                    var left ='';
                                    if(vision.right=='' || vision.right==undefined){
                                        right ='-'
                                    }else if(vision.right=='-1'){
                                        right ='未知'
                                    }else{
                                        right = vision.right
                                    };
                                    if(vision.left=='' || vision.left==undefined){
                                        left ='-'
                                    }else if(vision.left=='-1'){
                                        left ='未知'
                                    }else{
                                        left = vision.left
                                    }
                                    return  right + '/' + left;
                                }else{
                                    return '-'
                                }
                            }
                        }
                    }, {
                        title: '眼压(右/左)',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            if(v&&JSON.parse(v).eyeballTension){
                                var eyeballTension = JSON.parse(JSON.parse(v).eyeballTension);
                                if(eyeballTension !=''&&eyeballTension !=undefined){
                                    var r1 = eyeballTension.r1?(eyeballTension.r1>=1.33&&eyeballTension.r1<=2.80?`<span>${eyeballTension.r1}kPa</span>`:`<span style='color:red'>${eyeballTension.r1}kPa</span>`):'-';
                                    var l1 = eyeballTension.l1?(eyeballTension.l1>=1.33&&eyeballTension.l1<=2.80?`<span>${eyeballTension.l1}kPa</span>`:`<span style='color:red'>${eyeballTension.l1}kPa</span>`):'-';
                                    return r1 + '/' + l1
                                }
                            }else{
                                return '-'
                            }
                        }
                    },{
                        title: '裂隙灯检查',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            if(v&&JSON.parse(v).lxd){
                                var lxd = JSON.parse(JSON.parse(v).lxd);
                                if(lxd.right=='0'&&lxd.left!='0'){
                                    return lxd.left.split(',').map(v=>Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',v)).join(' ')
                                }else if(lxd.right!='0'&&lxd.left=='0'){
                                    return lxd.right.split(',').map(v=>Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',v)).join(' ')
                                }else if(lxd.right!='0'&&lxd.left!='0'){
                                    var lxd = lxd.right.split(',').concat(lxd.left.split(','));
                                    var lxdArr=[];
                                    lxd.forEach(v=>{
                                        if(lxdArr.indexOf(v)==-1){
                                            lxdArr.push(v)
                                        }
                                    });
                                    return lxdArr.map(v=>Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',v)).join(' ');
                                }else if(lxd.right=='0'&&lxd.left=='0'){
                                    return '正常'
                                }
                            }else{
                                return '-'
                            }
                        }
                    }, {
                        title: '眼底',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            return  v&&JSON.parse(v).eyeBottomResult?Sunset.Service.Dictionary.transcode('NORMAL_ABNORMAL',JSON.parse(v).eyeBottomResult):'-';
                        }
                    },{
                        title: '眼睑',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            if(JSON.parse(v).eyeslidResult==''||JSON.parse(v).eyeslidResult==undefined){
                                return '-'
                            }else{
                                var eyeslid = JSON.parse(JSON.parse(v).eyeslidResult);
                                if(eyeslid.left=='0'&&eyeslid.right=='0'){
                                    return '正常'
                                }else{
                                    return '异常'
                                }
                                // if(eyeslid.left!='0'&&eyeslid.right=='0'){
                                //     return eyeslid.left.split(',').map(v=>Sunset.Service.Dictionary.transcode('EYESLID_CHECK_RESULT',v)).join(' ')
                                // }else if(eyeslid.left=='0'&&eyeslid.right!='0'){
                                //     return  eyeslid.right.split(',').map(v=>Sunset.Service.Dictionary.transcode('EYESLID_CHECK_RESULT',v)).join(' ')
                                // }else if(eyeslid.left!='0'&&eyeslid.right!='0'){
                                //     return  eyeslid.right.split(',').map(v=>Sunset.Service.Dictionary.transcode('EYESLID_CHECK_RESULT',v)).join(' ') + ' ' + 
                                //     eyeslid.left.split(',').map(v=>Sunset.Service.Dictionary.transcode('EYESLID_CHECK_RESULT',v)).join(' ')
                                // }
                            } 
                        }
                    }, {
                        title: '检查结果',
                        name: 'eyeScreen.extension',
                        align:'center',
                        format(v){
                            return JSON.parse(v).isTarget?`<span style="color:green">建议进一步检查</span>`:'正常';
                        }
                    }],
                    recordTools: [{
                        label: '查看',
                        color: '',
                        operate: (record) => {
                            this.patientDetail(record.patient.id)
                        }
                    }],
                    pageSize: 10,
                    pageNumberStart : 0,
                    localPage: false,
                    sortable: true,
                    multiCheck: false,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter)=>{
                        filter.systemId= GlobalService.getCurrentUserSync().user.systemId;
                        filter.hospitalId= GlobalService.getCurrentUserSync().relation.hospital[0].id;
                        filter.activityId=  this.$route.params.activityId;
                        return ScreeningStore.PatientList(filter);
                    }
                },
                rightFilterOps: {
                    align: 'right',
                    format:(filter)=>{
                        if(filter.keyword){
                            filter.keyword = filter.keyword.trim();
                        }else{
                            filter.keyword = ""
                        };
                        if(filter.date && filter.date[0] && filter.date[1]){
                            filter.date[0].setHours(0);
                            filter.date[0].setMinutes(0);
                            filter.date[0].setSeconds(0);
                            filter.date[1].setHours(0);
                            filter.date[1].setMinutes(0);
                            filter.date[1].setSeconds(0);
                            filter.betweenDate = filter.date[0].getTime() + ',' + (filter.date[1].getTime()+3600*24*1000-1);
                            delete filter.date;
                        }else{
                            filter.betweenDate='';
                            delete filter.date;
                        };
                        this.countData.forEach(v=>{
                            v._isActive=false;
                            if(filter.keyword == ""&&v.disease=="all"){
                                v._isActive=true;
                            }
                        });
                        return filter
                    },
                    fields: [{
                        name: 'keyword',
                        widget: 'search',
                        placeholder: '患者姓名'
                    }]
                }
            }
        },
        computed:{
            currentPatientId(){
                return this.$route.params.patientId;
            }
        },
        ready(){
            this.init();
        },
        beforeDestroy(){
            this.stopReadIDCard();
        },
        methods:{
            init(){
                return ScreeningStore.getActivityInfo(this.$route.params.activityId).then(res=>{
                    this.activityInfo = res;
                    return ScreeningStore.ActivityCount({activityId:this.activityInfo.id}).then(res=>{
                        this.countData = res.EYES_DEPT.map(v=>{
                            v._isActive=false;
                            if(v.disease=="all"){
                                v.diseaseName = "全部";
                                v._isActive=true;
                            }else if(v.disease == 'normal'){
                                v.diseaseName = "正常"
                            }else if(v.disease.indexOf('eyeLid')==0){
                                v.diseaseName = "眼睑异常"
                            }else if(v.disease.indexOf('eyeGround')==0){
                                v.diseaseName = "眼底异常"
                            }else{
                                v.diseaseName = Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',v.disease.split("_")[1])  
                            }
                            return v
                        });
                    })
                })
            },
            search(item){
                this.countData.forEach(v=>{
                    v._isActive=false;
                });
                var params = {};
                if(item.disease =='normal'){
                    params.eyeLid=0;
                    params.eyeGround=0;
                    params.slitLamp=0;
                }else if(item.disease!='all'){
                    var key = item.disease.split('_')[0];
                    var value = item.disease.split('_')[1];
                    params[key] = value;
                };
                item._isActive=true;
                return this.$refs.table.search(params);
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.table.search(this.filter);
                this.filterInited = true;
            },
            back() {
                window.history.back(-1);
            },
            refresh(data){
                // this.activityList = data;
            },
            stopReadIDCard(){
                this.patientIDCard= null; 
                clearInterval(this.IDCardAutoInputTimer);
            },
            patientDetail(ids){
                Router.go(`${this.$route.path}/${ids}`);
            },
        },
        watch:{
            currentPatientId(v){
                if (!v) {
                    this.init();
                    this.$refs.table.refresh();
                }
            }
        }
    }
</script>