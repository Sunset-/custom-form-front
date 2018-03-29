<style lang="sass">
    .eye_screen_container {
        overflow: auto;
        width: 100%;
        height: 100%;
        .eye_screen_activity {
            padding: 15px;
            padding-top: 25px;
            .activity_list {
                width: 1338px;
                height: 100%;
                margin: 20px auto;
                overflow: hidden;
                .activity_list_box{
                    border:1px solid #ccc;
                    &>div:nth-child(odd){
                        background:#f2f2f2;
                    }
                }
                .no_data {
                    margin: 140px auto;
                    height: 400px;
                    width: 400px;
                    background: url(/assets/img/nodata.png) no-repeat;
                }
            }
            .sunset-page.sunset-page-right .ivu-page {
                float: none;
                margin: 0 auto;
                display: table;
            }
        }
        .batch-upload-progress {
            width: 200px;
            height: 32px;
            border: 1px solid #32CD66;
            position: relative;
            .batch-upload-progress-inner {
                height: 30px;
                background: #32CD66;
                transition: all 150ms;
            }
            .progress-tip {
                position: absolute;
                left: 50%;
                transform: translate(-50%, 0);
                top: 5px;
                z-index: 1;
                color: #FFF;
                text-shadow: 0px 0 1px #000;
            }
            .upload_tip{
                position: absolute;
                z-index: 5;
                top: 35px;
                color:orange;
                font-size:12px;
                width:300px;
            }
        }
    }
</style>
<template>
    <div class="eye_screen_container">
        <div class="eye_screen_activity" v-show="currentPatientId?false:true">
            <div style="overflow:hidden;height:50px;">
                <!-- 批量上传 start -->
                <!-- <div class="pull-left" v-show="!batchUploading">
                    <sunset-file :options="batchUploadImageOptions" @start-upload="startBatchUpload" @finish="batchUploadFinish">
                        <i-button style="vertical-align: top;" type="primary" :size="options.size||size" icon="ios-upload">上传眼底照片</i-button>
                    </sunset-file>
                </div> -->
                <div style="float:left;">
                    <sunset-filter :options="leftFilterOps" @filter="leftFilter"></sunset-filter>
                </div>
                <div class="pull-left batch-upload-progress" v-show="batchUploading">
                    <div class="batch-upload-progress-inner" :style="{width:(batchUploadProgress||0)+'%'}"></div>
                    <span class="progress-tip">{{batchUploadProgress}}%</span>
                    <label class="upload_tip">正在上传中, 关闭或刷新浏览器都会导致上传终止</label>
                </div>
                <!-- 批量上传 end -->
                <sunset-filter :options="rightFilterOps" @filter="rightFilter"></sunset-filter>
            </div>
            <sunset-datapage v-ref:datapage :options="options" @refresh="refresh">
                <div class="activity_list">
                    <div v-show="!nothingData" class="activity_list_box">
                        <eye-screen-item v-for="item in activityList" :activity="item" @uploadstart="startBatchUpload" @uploadfinish="batchUploadFinish" :batch-uploading.sync="batchUploading" :batch-upload-token.sync="batchUploadToken" :batch-upload-progress.sync="batchUploadProgress" @detail="detail" @check="getCurrentActivity"></eye-screen-item>
                    </div>
                    <div class="no_data" v-show="nothingData"></div>
                </div>
            </sunset-datapage>
            <sunset-form-modal v-ref:formmodal :options="{title : '创建筛查活动',width :600, style : 'max-height:400px', formOptions:formOptions}"></sunset-form-modal>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import EyeScreenItem from "./EyeScreenItem";
    import EyeScreenStore from "./EyeScreenStore.js"
    export default {
        components: {
            EyeScreenItem
        },
        computed: {
            currentPatientId() {
                return this.$route.params.activityId;
            }
        },
        data() {
            return {
                activityMembers: null,
                currentActivity: null,
                checkActivity: false,
                activityList: null,
                nothingData: false,
                filterInited: false,
                filter: {
                    status:Sunset.Service.Dictionary.alias('ACTIVITY_STATUS','ON_GOING')
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
                        return EyeScreenStore.list(filter);
                    }
                },
                formOptions: {
                    cols: 2,
                    tools: false,
                    fields: [{
                        label: '活动名称',
                        name: 'name',
                        monopolize: true,
                        style: "margin:0 auto",
                        widget: 'input'
                    }, {
                        label: '活动时间',
                        name: 'time',
                        placeholder: '活动时间',
                        widget: 'date',
                        monopolize: true,
                        type: 'daterange'
                    }, {
                        label: '活动地点',
                        name: 'place',
                        widget: 'cascader',
                        monopolize: true,
                        type: 'region',
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
                        label: '    ',
                        name: 'address',
                        monopolize: true,
                        placeholder: "详细地址",
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
                        data: () => {
                            var para = {
                                pageNumber: 0,
                                pageSize: 999
                            };
                            para.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            para.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE',
                                'ASSISTANT');
                            return EyeScreenStore.getActivityMember(para).then(res => {
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
                        enum: 'SCREENING_EYES_DEPT'
                    }],
                    format: (model) => {
                        var checks = 0;
                        model.checkItem.split(',').forEach(v => checks += parseInt(v));
                        var deptType = 'EYES_DEPT';

                        var users = this.activityMembers.filter(v => model.member.split(",").indexOf(v.label) != -1);
                        var para = {
                            name: model.name,
                            startDate: model.time[0].getTime(),
                            endDate: model.time[1].getTime() - 1,
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
                        return EyeScreenStore.createActivity(m).then(res => {
                            Sunset.tip('保存成功', 'success');
                            this.$refs.datapage.refresh();
                        });
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
                batchUploading: false,
                batchUploadToken: null,
                batchUploadProgress: 0
            }
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
                this.filterInited &&　this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            rightFilter(f) {
                Object.assign(this.filter, f);
                this.filterInited && this.$refs.datapage.setFilter(this.filter);
                this.filterInited = true;
            },
            getCurrentActivity(data) {
                return EyeScreenStore.getActivityInfo(data.id).then(res => {
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
                        checkItem: checks.filter(v => (res.checks[0].value & v) > 0)
                    }
                    this.$nextTick(() => {
                        this.$refs.formmodal.open(para);
                    })
                })
            },
            detail(data) {
                if(!GlobalService.isUploading()){
                    Router.go(`${this.$route.path}/activity/${data.id}`);
                }else{
                    Sunset.tip('正在上传，请稍后');
                }
            },
            getUploadTaskToken() {
                $.ajax({
                    url: '/image-service/screeningOm/receiveTaskToken'
                }).then(res => {
                    this.batchUploadToken = res;
                });
            },
            startBatchUpload() {
                this.batchUploading = true;
                GlobalService.uploadingStatus['screen-eyebottom-batch-upload'] = true;
            },
            batchUploadFinish() {
                $.ajax({
                    url: '/image-service/screeningOm/receiveEnd',
                    type: 'POST',
                    data: {
                        taskToken: this.batchUploadToken
                    }
                }).then(res => {
                    this.getUploadTaskToken();
                    this.batchUploading = false;
                    this.batchUploadProgress = 0;
                    delete GlobalService.uploadingStatus['screen-eyebottom-batch-upload'];
                });
            }
        },
        ready() {
            this.getUploadTaskToken();
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