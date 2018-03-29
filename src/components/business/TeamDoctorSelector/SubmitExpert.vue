<style lang="sass">
    .choose_experts{
        .ivu-modal-footer .sunset-toolbar:before{
            content:"正在分诊不可再提交！";
            width:100px;
            height:30px;
            line-height:30px;
            color:red;
        }
    }
    .table-modal-selected-item {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        margin: 2px 4px 2px 0;
        padding: 0 8px;
        border: 1px solid #3399ff;
        border-radius: 3px;
        background: #3399ff;
        font-size: 12px;
        vertical-align: middle;
        opacity: 1;
        overflow: hidden;
        cursor: pointer;
        color: #FFF;
        &.clear {
            border: 1px solid #ff6600;
            background: #ff6600;
        }
        .ivu-icon-ios-close-empty {
            position: relative;
            top: 1px;
            margin-left: 3px;
            -webkit-transform: scale(1.42857143) rotate(0);
            transform: scale(1.42857143) rotate(0);
        }
    }
    .item_checks{
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        &>div>span{
            background: #39f;
            color: #fff;
            border-radius: 2px;
            padding: 2px 5px;
            margin-right:5px;
        }
    }
    .sunset-search-form-container{

    }
    .label_bar{
        height:30px;
        border-bottom:1px solid #ccc;
        &>span{
            height:30px;
            line-height:30px;
            width:120px;
            display:inline-block;
            background:#ccc;
            color:#fff;
            font-size:14px;   
            text-align:center;
            border-sizing:border-box;
            border:1px solid #ccc;
            cursor:pointer;
        }
        .active{
            background:#fff; 
            color:#666;  
            border-bottom:none;
        }
    }
</style>
<template>
    <div :class="isTriaged&&hasTriage?'choose_experts':''">
         <sunset-view-modal v-if="teamParams" v-ref:table :options="viewOptions" @submit="submitTeam">
            <div class="" v-if="teamCheckeds.length || doctorCheckeds.length">
                <div class="table-modal-selected-item" v-for="item in teamCheckeds">
                    <span>{{item.name}}</span>
                    <Icon type="ios-close-empty" size="14" @click="removeItem(item,'team')"></Icon>
                </div>
                <div class="table-modal-selected-item" v-for="item in doctorCheckeds">
                    <span>{{item.name}}</span>
                    <Icon type="ios-close-empty" size="14" @click="removeItem(item,'docotr')"></Icon>
                </div>
                <div v-if="teamCheckeds.length" class="table-modal-selected-item clear" @click="removeAll">
                    <span>清空</span>
                </div>
            </div> 
            <Tabs type="card" :animated="false" active-key="TEAM" style="height:100%;">
                <Tab-pane label="医院(医生集团)" key="TEAM">
                <div style="display:inline-block;height:30px;line-height:30px;margin-left:10px;margin-top: -50px;font-size:14px" v-if="choosedTeamList.length">已选医院： <span v-for="item in choosedTeamList">{{item}}&nbsp<span></div>                    
                <sunset-table v-ref:teamtable :options="teamOptions" :checkeds="teamCheckeds"></sunset-table>
                </Tab-pane>
                <Tab-pane label="医生(专家)" key="EXPORTS">
                    <div style="display:inline-block;height:30px;line-height:30px;margin-left:10px;margin-top: -50px;font-size:14px" v-if="choosedDoctorList.length">已选专家： <span v-for="item in choosedDoctorList">{{item}}&nbsp<span></div>
                    <sunset-table v-ref:doctortable :options="doctorOptions" :checkeds="doctorCheckeds"></sunset-table>
                </Tab-pane>
            </Tabs>
        </sunset-view-modal> 
    </div>
</template>
<script>
    import ExpertSelectorStore from './ExpertSelectorStore.js';

    export default {
        components: {},
        props:{
            checkeds:[]
        },
        computed:{
            hasTriage(){
               return GlobalService.getSystemModules().map(v=>v.moduleNo).indexOf("TriageCenter")!=-1;
            }
        },
        data() {
            return {
                teamCheckeds: [],
                doctorCheckeds:[],
                isActive:true,
                selectorItem:'',
                choosedTeamList:[],
                choosedDoctorList:[],
                cacheChoosedStatus: null,
                patientId:null,
                isTriaged:null,
                teamParams: null,
                viewOptions:{
                    title: '选医院(医生集团)',
                    width: 1000,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    toolbar: [{
                        label: '提交分诊平台',
                        color: 'warning',
                        premise: () => {
                            return this.teamParams.userType != "Triage"&&this.hasTriage;
                        },
                        disabled:()=>{
                            return this.isTriaged
                        },
                        operate: () => {
                            var para = {};
                            this.$emit("submit", para);
                        }
                    }, {
                        label: '确定',
                        color: 'success',
                        operate: (m) => {
                            this.submitTeam();
                        },
                        premise: () => {
                            return this.teamParams.userType != "Triage";
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.cancel();
                        },
                        premise: () => {
                            return this.teamParams.userType != "Triage";
                        }
                    }, {
                        label: '关闭',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.table.cancel();
                        },
                        premise: () => {
                            return this.teamParams.userType == "Triage";
                        }
                    }]
                },
                doctorOptions: {
                    columns: [{
                        title: '头像',
                        name: 'picture',
                        style: 'width:60px;',
                        align: 'center',
                        format(v) {
                            return `<img style="width:40px;height:40px;border-radius:50px;overflow:hidden;"  onerror="this.src='/assets/img/user-default.png'" src="${Base.transformNfsFilePath(v)}" />`;
                        }
                    }, {
                        title: '姓名',
                        name: 'name',
                        align: 'center'
                    }, {
                        title: '科室',
                        name: 'dept',
                        align: 'center'
                    }, {
                        title: '职称',
                        name: 'jobTitle',
                        align: 'center',
                        enum: 'HOSPITAL_DUTY'
                    }, {
                        title: '就职医院',
                        name: 'hospital',
                        align: 'center'
                    }, {
                        title: '状态',
                        name: 'isChoosed',
                        align: 'center',
                        format(v){
                            return v?'已选择':'';
                        }
                    }],
                    showIndex: false,
                    pageNumberStart: 0,
                    pageSize: 5,
                    localPage: true,
                    sortable: true,
                    multiCheck: (record) => {
                        return !record.isChoosed;
                    },
                    idKey: 'uniqueId',
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    recordTools: [],
                    datasource: (filter) => {
                        var params = Sunset.clone(this.teamParams);
                        params.isWrapTeam = true;
                        return Promise.all([ExpertSelectorStore.getTeams(params),Promise.resolve().then(()=>{
                            if(this.cacheChoosedStatus && this.cacheChoosedStatus.length){
                                return this.cacheChoosedStatus
                            }else{
                                return ExpertSelectorStore.doctorInFlow(this.patientId).then(res=>{
                                    return this.cacheChoosedStatus = res;
                                });
                            }
                        })]).then(res => {
                            if(res[0].rows.length){
                                this.choosedDoctorList=[];
                                res[1].map(v=>{
                                    res[0].rows.map(item=>{
                                        if(item.id==v){
                                            item.isChoosed = true;
                                            this.choosedDoctorList.push(item.name);
                                        }
                                    })
                                })
                            }
                            return res[0]
                        }).then(res => {
                            return res.rows.map(v => {
                                var obj = {};
                                obj.name = v.name;
                                obj.userId = v.wrapUserId;
                                obj.teamId = v.id;
                                obj.dept = v.dept;
                                obj.picture = v.picture;
                                obj.jobTitle = v.jobTitle;
                                obj.hospital = v.hospital;
                                obj.uniqueId =obj.teamId + '_' + obj.userId;
                                obj.isChoosed = v.isChoosed;
                                return obj
                            });
                        })
                    },
                    filter: {
                        fields: [{
                            label: '',
                            name: 'teamselect',
                            widget: 'select',
                            style: {
                                width: '200px'
                            },
                            changeFilter: true,
                            defaultFirst: true,
                            textPlace: 'name',
                            valuePlace: 'id',
                            data: () => {
                                if (this.teamParams.userType == "Triage") {
                                    var params = Object.assign({}, this.teamParams);
                                    delete params.userType;
                                    params.isWrapTeam = false;
                                    return ExpertSelectorStore.getAllTeams(params).then(res => {
                                        return res.rows.concat({
                                            name: '专家',
                                            id: 'other'
                                        })
                                    })
                                } else {
                                    var param = Object.assign({}, this.teamParams);
                                    param.isWrapTeam = false;
                                    return ExpertSelectorStore.getTeams(param).then(res => {
                                        return res.rows.concat({
                                            name: '专家',
                                            id: 'other'
                                        })
                                    })
                                };
                            }
                        }]
                    }
                },
                teamOptions: {
                    columns: [{
                        title: '头像',
                        name: 'picture',
                        style: 'width:60px;',
                        align: 'center',
                        format(v) {
                            return `<img style="width:40px;height:40px;border-radius:50px;overflow:hidden;"  onerror="this.src='/assets/img/user-default.png'" src="${Base.transformNfsFilePath(v)}" />`;
                        }
                    }, {
                        title: '姓名',
                        name: 'name',
                        align: 'center'
                    }, {
                        title: '联系方式',
                        name: 'contactPhone',
                        align: 'center'
                    },{
                        title: '状态',
                        name: 'isChoosed',
                        align: 'center',
                        format(v){
                            return v?'已选择':'';
                        }
                    }],
                    showIndex: false,
                    pageNumberStart: 0,
                    pageSize: 5,
                    localPage: true,
                    sortable: true,
                    multiCheck: (record) => {
                        return !record.isChoosed;
                    },
                    idKey: 'id',
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    recordTools: [],
                    datasource: (filter) => {
                        var params = Sunset.clone(this.teamParams);
                        params.isWrapTeam = false;
                        return Promise.all([ExpertSelectorStore.getTeams(params),Promise.resolve().then(()=>{
                            if(this.cacheChoosedStatus && this.cacheChoosedStatus.length){
                                return this.cacheChoosedStatus
                            }else{
                                return ExpertSelectorStore.doctorInFlow(this.patientId).then(res=>{
                                    return this.cacheChoosedStatus = res;
                                });
                            }
                        })]).then(res => {
                            if(res[0].rows.length){
                                this.choosedTeamList=[];
                                res[1].map(v=>{
                                    res[0].rows.map(item=>{
                                        if(item.id==v){
                                            item.isChoosed = true;
                                            this.choosedTeamList.push(item.name);
                                        }
                                    })
                                })
                            }
                            return res[0]
                        }).then(res => {
                            return res.rows.map(v => {
                                var obj = {};
                                obj.name = v.name;
                                obj.teamId = v.id;
                                obj.picture = v.picture;
                                obj.contactPhone = v.contactPhone;
                                obj.id = v.id;
                                obj.isChoosed = v.isChoosed;
                                return obj
                            });
                        })
                    },
                    filter: {
                        fields: [{
                            label: '',
                            name: 'teamselect',
                            widget: 'select',
                            style: {
                                width: '200px'
                            },
                            changeFilter: true,
                            defaultFirst: true,
                            textPlace: 'name',
                            valuePlace: 'id',
                            data: () => {
                                if (this.teamParams.userType == "Triage") {
                                    var params = Object.assign({}, this.teamParams);
                                    delete params.userType;
                                    params.isWrapTeam = false;
                                    return ExpertSelectorStore.getAllTeams(params).then(res => {
                                        return res.rows.concat({
                                            name: '专家',
                                            id: 'other'
                                        })
                                    })
                                } else {
                                    var param = Object.assign({}, this.teamParams);
                                    param.isWrapTeam = false;
                                    return ExpertSelectorStore.getTeams(param).then(res => {
                                        return res.rows.concat({
                                            name: '专家',
                                            id: 'other'
                                        })
                                    })
                                };
                            }
                        }]
                    }
                }
            }
        },
        methods: {
            open(para,patientId,status) {
                this.teamCheckeds=[];
                this.doctorCheckeds=[];
                this.isTriaged = status;
                this.cacheChoosedStatus=null;
                this.patientId = patientId;
                this.teamParams = null;
                this.$nextTick(() => {
                    this.teamParams = Object.assign({}, para);
                    this.teamOptions.multiCheck = this.teamParams.userType != "Triage"?(function(item){
                        return !item.isChoosed;
                    }):false;
                    this.doctorOptions.multiCheck = this.teamParams.userType != "Triage"?(function(item){
                        return !item.isChoosed;
                    }):false;
                    this.$nextTick(() => {
                        this.$refs.table.open(para);
                    });
                });
            },
            removeItem(item,which) {
                if(which=="team"){
                    this.$refs.teamtable.checkRecord(item, false);
                }else{
                    this.$refs.doctortable.checkRecord(item, false);
                }
            },
            removeAll() {
                this.$refs.teamtable.checkAll(false);
                this.$refs.doctortable.checkAll(false);
            },
            loadDoctors(filter) {
                this.$refs.table.search(filter);
            },
            showMembers(item) {
                ExpertSelectorStore.getTeamMembers(item.id).then(res => {
                    item.members = res.members;
                })
            },
            submitTeam() {
                if(this.teamCheckeds.length || this.doctorCheckeds.length){
                    var para = {};
                    para.experts = {};
                    this.teamCheckeds.map(value => {
                        para.experts[value.teamId]=null;
                    });
                    this.doctorCheckeds.map(value => {
                        para.experts[value.teamId]=[value.userId];
                    })
                    // if (this.teamParams.userType == "Triage") {
                    //     para.expertUserId = data[0].userId;
                    //     para.expertTeamId = data[0].teamId;
                    // } else {
                    //     para.experts = {};
                    //     data.map(value => {
                    //         if (para.experts[value.teamId]) {
                    //             para.experts[value.teamId].push(value.userId)
                    //         } else {
                    //             para.experts[value.teamId] = [];
                    //             para.experts[value.teamId].push(value.userId)
                    //         }
                    //     })
                    // }
                    this.$emit("submit", para);
                }else{
                   Sunset.tip("请选择专家","warning"); 
                }
            },
            cancel() {
                this.$refs.table.cancel()
            }
        }
    }
</script>