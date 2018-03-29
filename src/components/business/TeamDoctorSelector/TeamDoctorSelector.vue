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
    .sunset-search-form-container{

    }
</style>
<template>
    <!-- <Modal width="800" overflow="auto" title="选团队 / 专家" @on-ok="submitTeam" @on-cancel="cancel" :visible.sync="choosePageShow"> -->
    <div :class="isTriaged&&hasTriage?'choose_experts':''">
        <sunset-table-modal v-if="teamParams" v-ref:tablemodal :options="options" @submit="submitTeam">
            <!-- <div slot="filter" style="display:inline-block;height:30px;line-height:30px;margin-left:10px;">已选专家: <span v-for="item in choosedList">{{item}}&nbsp<span></div> -->
        </sunset-table-modal>
    </div>
    <!-- </Modal> -->
</template>
<script>
    import ExpertSelectorStore from './ExpertSelectorStore.js';

    export default {
        components: {},
        computed:{
            hasTriage(){
               return GlobalService.getSystemModules().map(v=>v.moduleNo).indexOf("TriageCenter")!=-1;
            }
        },
        data() {
            return {
                choosedList:["谢医生","医生1"],
                cacheChoosedStatus: null,
                patientId:null,
                isTriaged:null,
                teamParams: null,
                options: {
                    title: '选团队 | 专家',
                    width: 1000,
                    checked: {
                        multi: false,
                        label: 'name',
                        premise: (record) => {
                            return !record.isChoosed;
                        }
                    },
                    tableOptions: {
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
                            if (filter.teamselect) {
                                if (filter.teamselect == "other") {
                                    if(this.teamParams.userType == "Triage"){
                                        var params = Sunset.clone(this.teamParams);
                                        delete params.systemId;
                                        delete params.userType;
                                        params.isWrapTeam = true;
                                        return Promise.all([ExpertSelectorStore.getAllTeams(params), Promise.resolve().then(()=>{
                                            if(this.cacheChoosedStatus && this.cacheChoosedStatus.length){
                                                return this.cacheChoosedStatus
                                            }else{
                                                return ExpertSelectorStore.doctorInFlow(this.patientId).then(res=>{
                                                    return this.cacheChoosedStatus = res;
                                                });
                                            }
                                        })]).then(res => {
                                            if(res[1].length&&res[0].rows.length){
                                                res[1].map(v=>{
                                                    res[0].rows.map(item=>{
                                                        if(item.wrapUserId==v){
                                                            item.isChoosed = true;
                                                        }
                                                    })
                                                })
                                            }
                                            return res[0]
                                        }).then(res=>{
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
                                                return obj;
                                            });
                                        })
                                    }else{
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
                                            if(res[1].length&&res[0].rows.length){
                                                res[1].map(v=>{
                                                    res[0].rows.map(item=>{
                                                        if(item.wrapUserId==v){
                                                            item.isChoosed = true;
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
                                    }
                                } else {
                                    return Promise.all([ExpertSelectorStore.getTeamMembers(filter.teamselect),Promise.resolve().then(()=>{
                                            if(this.cacheChoosedStatus && this.cacheChoosedStatus.length){
                                                return this.cacheChoosedStatus
                                            }else{
                                                return ExpertSelectorStore.doctorInFlow(this.patientId).then(res=>{
                                                    return this.cacheChoosedStatus = res;
                                                });
                                            }
                                        })]).then(res => {
                                        if(res[1].length){
                                            res[1].map(v=>{
                                                if(res[0]&&res[0].members.length){
                                                    res[0].members.map(item=>{
                                                        if(item.userId==v){
                                                            item.isChoosed = true;
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        return res[0]
                                    }).then(res => {
                                        res.members.forEach(v=>v.uniqueId=v.teamId + '_' + v.userId);
                                        return res.members
                                    })
                                }
                            }
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
                        operate: () => {
                            this.$refs.tablemodal.ok();
                        },
                        premise: () => {
                            return this.teamParams.userType != "Triage";
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        },
                        premise: () => {
                            return this.teamParams.userType != "Triage";
                        }
                    }, {
                        label: '关闭',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.tablemodal.cancel();
                        },
                        premise: () => {
                            return this.teamParams.userType == "Triage";
                        }
                    }]
                }
            }
        },
        methods: {
            open(para,patientId,status) {
                this.isTriaged = status;
                this.cacheChoosedStatus=null;
                this.patientId = patientId;
                this.teamParams = null;
                this.$nextTick(() => {
                    this.teamParams = Object.assign({}, para);
                    this.options.checked.multi = this.teamParams.userType != "Triage"?(function(item){
                        return !item.isChoosed;
                    }):false;
                    this.$nextTick(() => {
                        this.$refs.tablemodal.open();
                    });
                });
            },
            loadDoctors(filter) {
                this.$refs.table.search(filter);
            },
            showMembers(item) {
                ExpertSelectorStore.getTeamMembers(item.id).then(res => {
                    item.members = res.members;
                })
            },
            submitTeam(data) {
                if(data.length){
                    var para = {};
                    if (this.teamParams.userType == "Triage") {
                        para.expertUserId = data[0].userId;
                        para.expertTeamId = data[0].teamId;
                    } else {
                        para.experts = {};
                        data.map(value => {
                            if (para.experts[value.teamId]) {
                                para.experts[value.teamId].push(value.userId)
                            } else {
                                para.experts[value.teamId] = [];
                                para.experts[value.teamId].push(value.userId)
                            }
                        })
                    }
                    this.$emit("submit", para);
                }else{
                   Sunset.tip("请选择专家","warning"); 
                }
            },
            cancel() {
                this.$refs.tablemodal&&this.$refs.tablemodal.cancel()
            }
        }
    }
</script>