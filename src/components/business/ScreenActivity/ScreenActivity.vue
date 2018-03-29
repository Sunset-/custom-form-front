<style lang="sass">
    .eye_activity_container {
        overflow: auto;
        width: 100%;
        height: 100%;
        .eye_screen_activity {
            padding: 15px;
            padding-top: 25px;
            .sunset-form {
                .sunset-field-label,
                .ivu-input,
                .ivu-checkbox-wrapper {
                    font-size: 14px;
                }
            }
            .check_activity {
                font-size: 14px;
                & li {
                    height: 30px;
                    line-height: 30px;
                    &>span {
                        text-align: center;
                    }
                    &>label {
                        text-align: left;
                        font-weight: 600;
                    }
                }
            }
            .activity_list {
                width: 1322px;
                height: 100%;
                margin: 20px auto;
                overflow: hidden;
                .no_data {
                    margin: 140px auto;
                    height: 400px;
                    width: 400px;
                    background: url(/assets/img/nodata.png) no-repeat;
                }
            }
            & .sunset-form-modal .ivu-modal-body>div{
                padding: 10px 30px;
            }
            .sunset-page.sunset-page-right .ivu-page {
                float: none;
                margin: 0 auto;
                display: table;
            }
        }
        .ivu-modal-content{
            .ivu-select-dropdown{
                position:absolute !important;
                top:30 !important;
                left:90 !important;
            }
        }
    }
</style>
<template>
    <div class="eye_activity_container">
        <div class="eye_screen_activity" v-show="currentPatientId?false:true">
            <sunset-filter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
            <sunset-filter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
            <sunset-view-modal v-ref:tablemodal :options="tableOptions">
                <ul class="check_activity">
                    <li><label>活动名称：</label>{{currentActivity?currentActivity.name:''}}<span><span></li>
                    <li><label>活动时间：</label><span>{{activityTime}}<span></li>
                    <li><label>活动地点：</label><span>{{currentActivity?currentActivity.location:''}}{{currentActivity?currentActivity.address:''}}<span></li>
                    <li><label>参与人员：</label><span>{{activityMember}}<span></li>
                    <li><label>检查项目：</label><span>{{activityChecks}}<span></li>
                </ul>
            </sunset-view-modal>
            <sunset-datapage v-ref:datapage :options="options" @refresh="refresh">
                <div class="activity_list">
                    <screen-activity-item v-for="item in activityList" :activity="item" @detail="detail" @check="getCurrentActivity"></screen-activity-item>
                    <div class="no_data" v-show="nothingData"></div>
                </div>
            </sunset-datapage>
            <sunset-form-modal v-ref:formmodal :options="{title : '创建筛查活动',width :600, style : 'max-height:400px', formOptions:formOptions}"></sunset-form-modal>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import ScreenActivityItem from "./ScreenActivityItem";
    import ScreenActivityStore from "./ScreenActivityStore.js"
    export default {
        components: {
            ScreenActivityItem
        },
        computed: {
            currentPatientId() {
                return this.$route.params.activityId;
            },
            activityTime(){
                return this.currentActivity?Sunset.Dates.format(new Date(this.currentActivity.startDate),'yyyy-MM-dd') + "~" + Sunset.Dates.format(new Date(this.currentActivity.endDate),'yyyy-MM-dd'):'';
            },
            activityMember(){
                return this.currentActivity?this.currentActivity.users[0].name.replace(',',' '):''
            },
            activityChecks(){
                return this.currentActivity?this.currentActivity.checks[0].value:''
            },
            activityChecks(){
                if(this.currentActivity&&this.currentActivity.checks){
                    var checkitems = Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v=>v.key);
                    var arr= checkitems.filter(v=>(this.currentActivity.checks[0].value&v)>0);
                    var arry=[];
                    arr.map(key=>{
                        Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v=>{
                            if(v.key==key){
                                arry.push(v.value)
                            }
                        })
                    });
                    return arry?arry.join(" "):''
                }
            },
        },
        data() {
            return {
                activityMembers: null,
                currentActivity: null,
                checkActivity: false,
                activityList: null,
                nothingData: false,
                filter: {
                    status:Sunset.Service.Dictionary.alias('ACTIVITY_STATUS','ON_GOING')
                },
                options: {
                    pageNumberStart: 0,
                    pageSize: 12,
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
                        return ScreenActivityStore.list(filter);
                    }
                },
                tableOptions:{
                    title: '查看活动',
                    width: 600,
                    height:600,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    tableOptions: {
                        columns: [{}],
                        showIndex: false,
                        pageNumberStart: 0,
                        pageSize: 5,
                        localPage: true,
                        sortable: true,
                        multiCheck: true,
                        idKey: 'uniqueId',
                        format: {
                            list: '',
                            count: 'length',
                            pageSize: 'pageSize',
                            currentPage: 'pageNumber'
                        },
                        recordTools: [],
                        datasource: (filter) => {
                        },
                        filter: {
                        }
                    },
                    toolbar: [{
                        label: '关闭',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        }
                    }]
                },
                formOptions: {
                    cols: 2,
                    tools: false,
                    fields: [{
                        label: '活动名称',
                        name: 'name',
                        monopolize: true,
                        style: "margin:0 auto",
                        validate: {
                            required: true,
                            minlength:4,
                            maxlength:20
                        },
                        widget: 'input'
                    }, {
                        label: '活动时间',
                        name: 'time',
                        placeholder: '活动时间',
                        widget: 'date',
                        monopolize: true,
                        validate: {
                            required: true,
                            dateRequired: true
                        },
                        disabledDate : function(d){
                            return d.getTime() < Date.now();
                        },
                        type: 'daterange'
                    }, {
                        label: '活动地点',
                        name: 'place',
                        widget: 'cascader',
                        monopolize: true,
                        type: 'region',
                        validate: {
                            required: true,
                            maxlength:100,
                            validateAddr:true
                        },
                        data: () => {
                            return $.ajax({
                                url: '/assets/data/regionJSON.json'
                            }).then(function (list) {
                                function generateCascaderData(list) {
                                    return list.map(function (item) {
                                        var children;
                                        if (item.sub) {
                                            children = generateCascaderData(item.sub);
                                        }
                                        return {
                                            label: item.name,
                                            value: item.name,
                                            children: children
                                        };
                                    })
                                }
                                return generateCascaderData(list);
                            });
                        },
                        disabled: false
                    }, {
                        label: '详细地址',
                        name: 'address',
                        monopolize: true,
                        placeholder: "详细地址",
                        validate: {
                            required: true,
                            maxlength:20,
                            minlength:4
                        },
                        widget: 'input'
                    }, {
                        label: '参与人员',
                        name: 'member',
                        monopolize: true,
                        widget: 'select',
                        textPlace: 'label',
                        clearable: true,
                        multiple: true,
                        filterable: true,
                        validate: {
                            required: true
                        },
                        data: () => {
                            var para = {
                                pageNumber: 0,
                                pageSize: 999
                            };
                            para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            para.property = Sunset.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY',
                                'In');
                            return ScreenActivityStore.getActivityMember(para).then(res => {
                                this.activityMembers = res.rows.map(v => {
                                    return {
                                        value: v.name,
                                        label: v.name,
                                        userId: v.id
                                    }
                                });
                                return this.activityMembers
                            })
                        }
                    }, {
                        label: '检查项目',
                        name: 'checkItem',
                        widget: 'checkbox',
                        monopolize: true,
                        validate: {
                            required: true
                        },
                        enum: 'SCREENING_EYES_DEPT'
                    }],
                    format: (model) => {
                        var checks = 0;
                        model.checkItem.split(',').forEach(v => checks += parseInt(v));
                        var deptType = 'EYES_DEPT';

                        var users = this.activityMembers.filter(v => model.member.split(",").indexOf(v.label) != -1);
                        var startDate = model.time[0];
                            startDate.setHours(0);
                            startDate.setMinutes(0);
                            startDate.setSeconds(0);
                            startDate.setMilliseconds(0);
                        var endDate = model.time[1];
                            endDate.setHours(0);
                            endDate.setMinutes(0);
                            endDate.setSeconds(0);
                            endDate.setMilliseconds(0);
                        var para = {
                            id:model.id,
                            name: model.name,
                            startDate: startDate.getTime(),
                            endDate: endDate.getTime() + 3600 *
                                24 * 1000 - 1,
                            location: model.place,
                            address: model.address,
                            users: users.map(v => {
                                return {
                                    userId: v.userId
                                }
                            }),
                            checks: [{
                                deptType: deptType,
                                value: checks
                            }],
                            systemId: GlobalService.getCurrentUserSync().user.systemId,
                            hospitalId: GlobalService.getCurrentUserSync().relation.hospital[0].id
                        };
                        return para
                    },
                    submit: (m) => {
                        if(m.location.indexOf("请选择")!=0&&m.location.indexOf("请选择")!=m.location.length-3){
                            return ScreenActivityStore.createActivity(m).then(res => {
                                Sunset.tip('保存成功', 'success');
                                this.$refs.datapage.refresh();
                            });
                        }else{
                            Sunset.tip('请选择有效地址', 'warning');
                        }
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
                    toolbar: {
                        tools: [{
                            label: '新建活动',
                            color: 'success',
                            operate: () => {
                                var relation =  GlobalService.getCurrentUserSync().relation;
                                var place ={
                                    place:relation.hospital&&relation.hospital[0]&&relation.hospital[0].location
                                };
                                this.$refs.formmodal.open(place);
                            }
                        }]
                    }
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
                }
            }
        },
        ready(){
        },
        methods: {
            refresh(data) {
                this.activityList = data;
                if (!data.length) {
                    this.nothingData = true;
                } else {
                    this.nothingData = false;
                }
            },
            leftFilter(f) {
                Object.assign(this.filter, f);
                this.$refs.datapage.setFilter(this.filter);
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.$refs.datapage.setFilter(this.filter);
            },
            getCurrentActivity(data) {
                return ScreenActivityStore.getActivityInfo(Sunset.isArray(data)?data[0].id:data.id).then(res => {
                    this.currentActivity = res;
                    var members = [];
                    this.activityMembers.forEach(v => {
                        res.users.forEach(value => {
                            if (v.userId == value.id) {
                                members.push(v.label)
                            }
                        })
                    });
                    var checks = Sunset.Service.Dictionary.getEnums('SCREENING_EYES_DEPT').map(v => v.key);
                    var para = {
                        name: res.name,
                        place: res.location,
                        address: res.address,
                        time: [new Date(res.startDate), new Date(res.endDate)],
                        member: members,
                        id:res.id,
                        checkItem: checks.filter(v => (res.checks[0].value & v) > 0)
                    }
                    if(data[1]){
                        this.$refs.tablemodal.open();
                    }else{
                        this.$nextTick(() => {
                            this.$refs.formmodal.open(para);
                        })
                    }
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