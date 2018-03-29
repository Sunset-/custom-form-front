<template>
    <Modal :visible.sync="showTips" title="提示" ok-text="确定" @on-ok="confirmRet" @on-cancel="cancel">
        <p class="new_tip" style="text-align:center;font-size:16px">确定将重置密码为:123456。</p>
    </Modal>
    <sunset-crud v-ref:doctor :options="options">
    </sunset-crud>
</template>
<script>
    import DoctorStore from './DoctorStore.js';


    export default {
        methods: {
            confirmRet() {
                var para = {
                    checkSelf: false,
                    sefPwd: '',
                    userId: this.record.userId,
                    userPwd: '123456'
                };
                DoctorStore.retPwd(para).then(res => {
                    Sunset.tip('密码重置成功', 'success');
                })
            },
            cancel() {

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
                record: null,
                showTips: false,
                showCols: {
                    showNick: true
                },
                options: {
                    title: '医生管理',
                    store: DoctorStore,
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
                            title: '所属学科',
                            name: 'dept',
                            enum: 'DEPATRMENT_TYPE'
                        }, {
                            title: '职称',
                            name: 'jobTitle',
                            enum: 'HOSPITAL_DUTY'
                        }, {
                            title: '医院',
                            name: 'hospital'
                        }, {
                            title: '联系电话',
                            name: 'mobilePhone'
                        }],
                        //数据条目操作
                        recordTools: [{
                            label: '编辑',
                            icon: 'edit',
                            color: 'info',
                            signal: 'MODIFY',
                            premise(record) {
                                return record.status == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                    'NORMAL');
                            }
                        }, {
                            label: '删除',
                            icon: 'trash-a',
                            color: 'error',
                            operate: (v) => {
                                var clear = Sunset.confirm({
                                    content: '确定删除此条目',
                                    loading: true,
                                    onOk: () => {
                                        return DoctorStore.delete(v.userId).then(res => {
                                            Sunset.tip("已删除", "success");
                                            clear();
                                            this.$refs.doctor.operateSignal("REFRESH");
                                        })
                                    }
                                });
                            },
                            premise(record) {
                                return record.status == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                    'NORMAL');
                            }
                        }, {
                            label: '重置密码',
                            color: 'warning',
                            operate: (record) => {
                                this.showTips = true;
                                this.record = record
                            },
                            premise(record) {
                                return record.status == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                    'NORMAL');
                            }
                        }, {
                            label: '审核通过',
                            confirm: '确认审核通过此用户？',
                            color: 'success',
                            operate: (record) => {
                                DoctorStore.review(record.userId, true).then(res => {
                                    Sunset.tip('操作成功');
                                    this.$refs.doctor.operateSignal("REFRESH");
                                });
                            },
                            premise(record) {
                                return record.status == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                    'CHECK_PENDING');
                            }
                        }, {
                            label: '审核拒绝',
                            confirm: '确认审核拒绝此用户？',
                            color: 'error',
                            operate: (record) => {
                                DoctorStore.review(record.userId, false).then(res => {
                                    Sunset.tip('操作成功');
                                    this.$refs.doctor.operateSignal("REFRESH");
                                });
                            },
                            premise(record) {
                                return record.status == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                    'CHECK_PENDING');
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
                            format: (filter) => {
                                if (filter.keyword) {
                                    filter.keyword = filter.keyword.trim();
                                    return filter
                                }
                            },
                            fields: [{
                                name: 'status',
                                widget: 'radio',
                                type: 'button',
                                defaultFirst: true,
                                changeFilter: true,
                                data: [{
                                    value: Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                        'NORMAL'),
                                    text: '医生列表'
                                }, {
                                    value: Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_STATUS',
                                        'CHECK_PENDING'),
                                    text: '待审核'
                                }]
                            }, {
                                name: 'keyword',
                                widget: 'search',
                                placeholder: '按医生姓名搜索'
                            }],
                            format(filter) {
                                if (filter.keyword) {
                                    filter.keyword = filter.keyword.trim();
                                }
                                return filter;
                            }
                        },
                        formatFilter(filter) {
                            filter.systemId = GlobalService.getCurrentUserSync().user.systemId;
                            filter.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
                            return filter;
                        },
                        store: DoctorStore
                    },
                    //表格表单
                    formOptions: {
                        cols: 3,
                        store: DoctorStore,
                        fields: [{
                            group: '账号信息',
                            label: '用户名',
                            name: 'username',
                            premise(model) {
                                return !model.id;
                            },
                            widget: 'input',
                            validate: {
                                required: true,
                                userName: true
                            }
                        }, {
                            label: '密码',
                            name: 'password',
                            premise(model) {
                                return !model.id;
                            },
                            widget: 'input',
                            validate: {
                                required: true,
                                password: true
                            }
                        }, {
                            group: '医生信息',
                            label: '姓名',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true,
                                fullName: true
                            }
                        }, {
                            label: '性别',
                            name: 'sex',
                            widget: 'radio',
                            defaultFirst: true,
                            data: Sunset.Service.Dictionary.getEnums('SEX').filter(item => item.alias !=
                                    'unknow')
                                .map(item => ({
                                    text: item.value,
                                    value: item.key
                                }))
                        }, {
                            label: '就职医院',
                            name: 'hospital',
                            widget: 'tableselect',
                            idKey: 'name',
                            inputable: true,
                            transcode(v) {
                                return v;
                            },
                            modalOptions: {
                                title: '选择医院',
                                check: {
                                    multi: false,
                                    label: 'name'
                                },
                                tableOptions: {
                                    columns: [{
                                        title: '医院名称',
                                        name: 'name'
                                    }, {
                                        title: '等级',
                                        name: 'level'
                                    }, {
                                        title: '地址',
                                        name: 'province'
                                    }],
                                    showIndex: true,
                                    pageNumberStart: 0,
                                    pageSize: 10,
                                    localPage: false,
                                    sortable: true,
                                    multiCheck: true,
                                    lazy: true,
                                    format: {
                                        list: 'rows',
                                        count: 'totalCount',
                                        pageSize: 'pageSize',
                                        currentPage: 'pageNumber'
                                    },
                                    filter: {
                                        fields: [{
                                            placeholder: '输入关键字',
                                            name: 'keyword',
                                            widget: 'search'
                                        }]
                                    },
                                    datasource: (filter) => {
                                        return $http({
                                            url: '/medical/hospital',
                                            data: filter
                                        });
                                    },
                                    recordTools: []
                                }
                            },
                            validate: {
                                required: true
                            }
                        }, {
                            label: '职称',
                            name: 'jobTitle',
                            widget: 'select',
                            validate: {
                                required: true
                            },
                            enum: 'HOSPITAL_DUTY'
                        }, {
                            label: '教育职称',
                            name: 'eduTitle',
                            widget: 'select',
                            enum: 'EDUCATIONAL_TITLE'
                        }, {
                            label: '学历',
                            name: 'rankAcademic',
                            widget: 'select',
                            enum: 'EDUCATION'
                        }, {
                            label: '医院职务',
                            name: 'post',
                            widget: 'select',
                            enum: 'DUTY'
                        }, {
                            label: '所属学科',
                            name: 'dept',
                            widget: 'searchinput',
                            check(v) {},
                            validate: {
                                required: true,
                                maxlength: 200
                            },
                            search(word) {
                                return Promise.resolve().then(() => {
                                    return $http({
                                        url: '/medical/department',
                                        type: 'GET',
                                        data: {
                                            keyword: word
                                        }
                                    }).then(res => res ? res.map(v => v.deptName) : '')
                                })
                            },
                            all() {
                                return Promise.resolve().then(() => {
                                    return $http({
                                        url: '/medical/department',
                                        type: 'GET',
                                        data: {}
                                    }).then(res => res ? res.map(v => v.deptName) : '')
                                })
                            }
                        }, {
                            label: '擅长',
                            name: 'skilledField',
                            widget: 'searchinput',
                            multi: true,
                            watch: ['dept', function (v, options, c, d, e) {
                                options.search = function (word) {
                                    return Promise.resolve().then(() => {
                                        return $http({
                                            url: '/medical/dept_disease/subject/dept/disease',
                                            type: 'GET',
                                            data: {
                                                deptName: v.dept,
                                                keyword: word
                                            }
                                        }).then(res => res ? res : '')
                                    })
                                }
                            }],
                            check(v) {},
                            validate: {
                                maxlength: 200
                            },
                            search(word) {
                                return Promise.resolve().then(() => {
                                    return $http({
                                        url: '/medical/dept_disease/subject/dept/disease',
                                        type: 'GET',
                                        data: {
                                            keyword: word
                                        }
                                    }).then(res => res ? res : '')
                                })
                            }
                        }, {
                            label: '联系电话',
                            name: 'mobilePhone',
                            widget: 'input',
                            validate: {
                                phone: true
                            }
                        }, {
                            label: '头像',
                            name: 'picture',
                            widget: 'image',
                            monopolize: true,
                            url: '/upload/api/1.0.0/file/storage',
                            max: 1,
                            thumbnail(result) {
                                if (result) {
                                    return Base.transformNfsFilePath(result);
                                }
                            }
                        }, {
                            label: '证件拍照',
                            name: 'certificateImage',
                            widget: 'image',
                            monopolize: true,
                            url: '/upload/api/1.0.0/file/storage',
                            thumbnail(result) {
                                if (result) {
                                    return Base.transformNfsFilePath(result);
                                }
                            }
                        }, {
                            label: '简介',
                            name: 'introduction',
                            widget: 'textarea',
                            monopolize: true,
                            validate: {
                                maxlength: 500
                            }
                        }],
                        submit: (data) => {
                            data.userType = Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
                            data.entity = JSON.stringify({
                                id: data.id,
                                userId: data.userId,
                                systemId: GlobalService.getCurrentUserSync().user.systemId,
                                agencyCode: GlobalService.getSystemAgencyCode(),
                                userType: data.userType,
                                name: data.name,
                                mobilePhone: data.mobilePhone,
                                sex: data.sex,
                                hospital: data.hospital,
                                jobTitle: data.jobTitle,
                                eduTitle: data.eduTitle,
                                rankAcademic: data.rankAcademic,
                                post: data.post,
                                dept: data.dept,
                                skilledField: data.skilledField,
                                picture: data.picture,
                                certificateImage: data.certificateImage,
                                introduction: data.introduction
                            });
                            delete data.name;
                            delete data.mobilePhone;
                            delete data.sex;
                            delete data.hospital;
                            delete data.jobTitle;
                            delete data.eduTitle;
                            delete data.rankAcademic;
                            delete data.post;
                            delete data.skilledField,
                                delete data.dept;
                            delete data.picture;
                            delete data.certificateImage;
                            delete data.introduction;
                            delete data.birthday;
                            delete data.accountId;
                            delete data.systemId;
                            delete data.id;
                            delete data.userId;
                            delete data.isDomain;
                            if (JSON.parse(data.entity).id) {
                                Sunset.tip("保存成功", "success");
                                return DoctorStore.save(data);
                            } else {
                                return DoctorStore.isExist({
                                    loginName: data.username,
                                    agencyCode: GlobalService.getSystemAgencyCode()
                                }).then(res => {
                                    if (res) {
                                        Sunset.tip("账号已存在，请重新输入", "warning");
                                        throw new Error();
                                    } else {
                                        Sunset.tip("保存成功", "success");
                                        return DoctorStore.save(data);
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