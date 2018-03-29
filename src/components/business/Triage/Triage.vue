<template>
    <Modal
        :visible.sync="showTips" title="提示" ok-text="确定" @on-ok="confirmRet" @on-cancel="cancel">
        <p class="new_tip" style="text-align:center;font-size:16px">确定将重置密码为:123456。</p>
    </Modal>
    <sunset-crud v-ref:triage :options="options">
    </sunset-crud>
</template>
<script>
    import TriageStore from './TriageStore.js';


    export default {
        methods: {
            confirmRet(){
                var para={
                    checkSelf:false,
                    sefPwd:'',
                    userId:this.record.userId,
                    userPwd:'123456'
                };
                TriageStore.retPwd(para).then(res=>{
                    Sunset.tip('密码重置成功', 'success');
                })
            },
            cancel(){

            },
            test() {
                var clear = Sunset.confirm({
                    content: '确定删除此条目',
                    loading: true,
                    onOk: () => {
                        setTimeout(clear, 3000);
                    }
                });
            },
            filter(a, b) {
                debugger;
            },
            save(model) {
                debugger;
            }
        },
        data() {
            return {
                showTips:false,
                showCols: {
                    showNick: true
                },
                options: {
                    title: '分诊管理',
                    store: TriageStore,
                    //搜索
                    filterOptions: false,
                    //表格
                    tableOptions: {
                        minWidth: 1200,
                        columns: [{
                            title: '姓名',
                            name: 'name'
                        }, {
                            title: '账号',
                            name: 'username',
                            format(v) {
                                return v.substring(0, v.indexOf('@'));
                            }
                        }, {
                            title: '联系电话',
                            name: 'mobilePhone'
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
                                placeholder: '按分诊姓名搜索'
                            }]
                        },
                        //数据条目操作
                        recordTools: [{
                            label: '编辑',
                            color: 'info',
                            icon: 'edit',
                            signal:'MODIFY'
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            operate:(v)=>{
                                var clear = Sunset.confirm({
                                    content: '确定删除此条目',
                                    loading: true,
                                    onOk: () => {
                                        return TriageStore.delete(v.userId).then(res=>{
                                            clear();
                                            Sunset.tip("已删除","success");
                                            this.$refs.triage.operateSignal("REFRESH");
                                        })
                                    }
                                });
                            }
                        },{
                            label: '重置密码',
                            color: 'warning',
                            operate:(record)=>{
                                this.showTips = true;
                                this.record = record
                            }
                        }],
                        formatFilter(filter) {
                            filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'TRIAGE');
                            return filter;
                        },
                        store: TriageStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: TriageStore,
                        fields: [{
                            group: '账号信息',
                            label: '用户名',
                            name: 'username',
                            widget: 'input',
                            premise(model){
                                return !model.id;
                            },
                            validate: {
                                required: true,
                                userName: true
                            }
                        }, {
                            label: '密码',
                            name: 'password',
                            premise(model){
                                return !model.id;
                            },
                            widget: 'input',
                            validate: {
                                required: true,
                                password: true
                            }
                        }, {
                            group: '人员信息',
                            label: '姓名',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true,
                                fullName: true
                            }
                        }, {
                            label: '联系电话',
                            name: 'mobilePhone',
                            widget: 'input',
                            validate:{
                                phone:true
                            }
                        }],
                        submit: (data) => {
                            data.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'TRIAGE');
                            if(data.id&&data.userId){
                                data.entity = JSON.stringify({
                                    id:data.id,
                                    userId:data.userId,
                                    systemId: GlobalService.getCurrentUserSync().user.systemId,
                                    agencyCode: GlobalService.getSystemAgencyCode(),
                                    userType: data.userType,
                                    name: data.name,
                                    mobilePhone: data.mobilePhone
                                });
                            }else{
                                data.entity = JSON.stringify({
                                    systemId: GlobalService.getCurrentUserSync().user.systemId,
                                    agencyCode: GlobalService.getSystemAgencyCode(),
                                    userType: data.userType,
                                    name: data.name,
                                    mobilePhone: data.mobilePhone
                                });
                            }
                            delete data.birthday;
                            delete data.accountId;
                            delete data.systemId;
                            delete data.id;
                            delete data.userId;
                            delete data.isDomain;
                            delete data.name;
                            delete data.sex;
                            delete data.mobilePhone;
                            if(JSON.parse(data.entity).id){
                                Sunset.tip("保存成功","success");
                                return TriageStore.save(data);
                            }else{
                                return TriageStore.isExist({loginName:data.username,agencyCode: GlobalService.getSystemAgencyCode()}).then(res=>{
                                    if(res){
                                        Sunset.tip("账号已存在，请重新输入","warning");
                                        throw new Error();
                                    }else{
                                        Sunset.tip("保存成功","success");
                                        return TriageStore.save(data);
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
    };
</script>