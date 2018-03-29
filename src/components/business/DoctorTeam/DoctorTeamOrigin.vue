
<style></style>
<template>
    <sunset-crud :options="options" v-ref:teamform>
    </sunset-crud>
    <sunset-table-modal v-ref:doctormodal :options="doctorTableOptions"></sunset-table-modal>
</template>
<script>
import DoctorTeamStore from './DoctorTeamStore.js';
import DoctorStore from '../Doctor/DoctorStore.js';
export default {
    data() {
        return {
            showCols: {
                showNick: true
            },
            options: {
                title: '医生团队管理',
                store: DoctorTeamStore,
                //搜索
                filter: true,
                //表格
                tableOptions: {
                    minWidth: 1200,
                    columns: [{
                        title: '头像',
                        name: 'picture',
                        style: 'width:60px;',
                        align: 'center',
                        format(v) {
                            return `<img style="width:40px;height:40px;border-radius:50px;overflow:hidden;"  onerror="this.src='/assets/img/user-default.png'" src="${Base.transformNfsFilePath(v)}" />`;
                        }
                    }, {
                        title: '团队名称',
                        name: 'name'
                    }, {
                        title: '联系电话',
                        name: 'contactPhone',
                    }, {
                        title: '创建时间',
                        name: 'createDate',
                        format(v){
                            return Sunset.Dates.format(v,'yyyy-MM-dd HH:mm:ss')
                        }
                    }],
                    showIndex: true,
                    pageNumberStart: 0,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: false,
                    sortable: true,
                    lazy: false,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [{
                        label: '新增',
                        icon: 'plus',
                        color: 'success',
                        permission: 'SYSTEM_MANAGER_DICTIONARY_ADD',
                        signal: 'ADD'
                    }],
                    //表格搜索
                    filter: {
                        align: 'right',
                        format:(filter)=>{
                            if(filter.keyword){
                                filter.keyword = filter.keyword.trim();
                                return filter
                            }
                        },
                        fields: [{
                            name: 'keyword',
                            widget: 'search',
                            placeholder: '按团队名称搜索'
                        }]
                    },
                    //数据条目操作
                    recordTools: [{
                        label: '修改',
                        color: 'info',
                        operate:(data)=>{
                            DoctorTeamStore.getTeamMembers(data.id).then(res=>{
                                this.$refs.teamform.operateSignal('MODIFY',res);
                            });
                        }
                    }],
                    formatFilter(filter) {
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'OPERATER');
                        filter.isWrapTeam = false;
                        return filter;
                    },
                    store: DoctorTeamStore
                },
                //表格表单
                formOptions: {
                    cols: 3,
                    store: DoctorTeamStore,
                    fields: [{
                        group: '基本信息',
                        label: '团队名称',
                        name: 'name',
                        widget: 'input',
                        validate:{
                            required: true,
                            fullName: true
                        }
                    }, {
                        label: '联系电话',
                        name: 'contactPhone',
                        widget: 'input',
                        validate: {
                            required: true,
                            phone:true
                        }
                    }, {
                        label: '团队头像',
                        name: 'picture',
                        widget: 'image',
                        monopolize: true,
                        url: '/upload/api/1.0.0/file/storage',
                        max: 1,
                        thumbnail(result) {
                            if (result) {
                                return Base.transformNfsFilePath(result);
                            }
                        },
                        validate: {
                            maxlength: 32
                        }
                    }, {
                        group: '团队成员',
                        label: '成员列表',
                        name: 'members',
                        widget: 'table',
                        monopolize: true,
                        table: {
                            columns: [{
                                title: '姓名',
                                name: 'name'
                            }, {
                                title: '职称',
                                name: 'jobTitle',
                                enum:'HOSPITAL_DUTY'
                            },  {
                                title: '科室',
                                name: 'dept'
                            },{
                                title: '医院',
                                name: 'hospital'
                            }],
                            recordTools: {
                                length: 1,
                                size: 'small',
                                tools: [{
                                    label: '删除',
                                    icon: 'trash-a',
                                    color: 'error',
                                    signal: 'REMOVE'
                                }]
                            },
                            footTools: [{
                                label: '设置团队成员',
                                icon: 'plus-round',
                                color: 'info',
                                operate: (list) => {
                                    this.$refs.doctormodal.open().then(res => {
                                        res =res.length?res.map(item =>({
                                            name: item.name,
                                            username: item.username,
                                            mobilePhone: item.mobilePhone,
                                            userId: item.userId,
                                            dept: item.dept,
                                            jobTitle: item.jobTitle,
                                            hospital: item.hospital
                                        })):[];
                                        var exsits = {};
                                            // newExsits = {};
                                        list.forEach(item => {
                                            exsits[item.userId] = true;
                                        });
                                        res && res.forEach(item => {
                                            // newExsits[item.userId] = true;
                                            if (!exsits[item.userId]) {
                                                list.push(item);
                                            }
                                        });
                                        // for (var i = 0; i < list.length; i++) {
                                        //     if (!newExsits[list[i].userId]) {
                                        //         list.splice(i, 1);
                                        //         i--;
                                        //     }
                                        // }
                                        this.$refs.doctormodal.cancel();
                                    })
                                }
                            }]
                        }
                    }],
                    format: (model, record) => {
                        var para = {
                            name: model.name,
                            contactPhone: model.contactPhone,
                            picture: model.picture
                        };
                        para.members = [];
                        if(model.id){
                             para.id=model.id
                        };
                        if(model.members){
                            model.members.map(item => para.members.push({ userId: item.userId }));
                        }
                        // if (model.id) {
                        //     var deleteIds;
                        //     var oldMembers = record.members,
                        //         newMembers = model.members;
                        //     if (oldMembers) {
                        //         var newIds = {},
                        //             delIds = [];
                        //         newMembers.map(function (item) {
                        //             newIds[item.accountId] = true
                        //         });
                        //         oldMembers.map(function (item) {
                        //             if (!newIds[item.accountId]) {
                        //                 delIds.push(item.id);
                        //             }
                        //         });
                        //         deleteIds = delIds.length ? delIds : null;
                        //     }
                        //     return {
                        //         doctorTeam: model,
                        //         needDeleteIds: deleteIds
                        //     };
                        // } else {
                        //     return model;
                        // }
                        var params={};
                        params.name = model.name;
                        if(model.id){
                            params.id=model.id
                        };
                        return DoctorTeamStore.isExist(params).then(res=>{
                            if(res){
                                Sunset.tip("团队名称已存在，请重新输入","warning");
                                throw new Error();
                            }else{
                                return para
                            }
                        });
                    },
                    validate: (model) => {
                        return true;
                    },
                    tools: null
                }
            },
            doctorTableOptions: {
                title: '设置团队成员',
                width: 1000,
                checked: {
                    multi: true,
                    label: 'name'
                },
                tableOptions: {
                    columns: [{
                        title: '姓名',
                        name: 'name'
                    }, {
                        title: '职称',
                        name: 'jobTitle',
                        enum:'HOSPITAL_DUTY'
                    }, {
                        title: '科室',
                        name: 'dept'
                    }, {
                        title: '医院',
                        name: 'hospital'
                    }],
                    idKey: 'userId',
                    showIndex: true,
                    pageSize: 10,
                    localPage: false,
                    multiCheck: true,
                    sortable: true,
                    pageNumberStart: 0,
                    format: {
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber',
                        list: 'rows',
                        count: 'totalCount'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    filter: false,
                    //数据条目操作
                    formatFilter(filter) {
                        filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                        filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
                        return filter;
                    },
                    // recordTools: [{
                    //     label: '选择',
                    //     icon: 'glyphicon glyphicon-edit',
                    //     color: 'warning',
                    //     permission: 'SYSTEM_MANAGER_DICTIONARY_UPDATE',
                    //     signal: 'MODIFY'
                    // }],
                    store: DoctorStore
                }
            }
        }
    },
    methods: {
        filter(a, b) {
            debugger;
        },
        save(model) {
            debugger;
        }
    },
};
</script>