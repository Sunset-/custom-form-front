<style lang="sass">
    .office-container {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        &>header {
            background: #F2F2F2;
            padding: 10px;
            overflow: hidden;
            height: 40px;
            line-height: 20px;
            &>span {
                display: inline-block;
                font-size: 16px;
            }
        }
        .office-content {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            .sidebar {
                position: absolute;
                top: 0px;
                left: 0px;
                bottom: 0px;
                width: 220px;
                box-sizing: border-box;
                border-right: 1px solid #ccc;
                color: #222;
                overflow: auto;
                padding: 0px;
                &>.office-ul {
                    position: static;
                    &>li {
                        border: 1px solid #C1D0E0;
                        border-radius: 2px;
                        background: #E7F0F5;
                        padding: 10px;
                        cursor: pointer;
                        margin-bottom: 10px;
                        &.active,
                        &:active {
                            border: 1px solid #FFCC66;
                            background: #FFF7E8;
                        }
                        h4 {
                            font-size: 16px;
                            padding-bottom: 5px;
                        }
                        p {
                            padding-top: 10px;
                            margin-bottom: 0px;
                            color: #555;
                        }
                    }
                }
            }
            .major_title {
                height: 50px;
                line-height: 50px;
                position: absolute;
                top: 0;
                background: #F2F2F2;
                left: 220px;
                padding: 0 10px;
                width: 100%;
                font-size: 18px;
                font-weight: bold;
                color: #222;
                &>span {
                    margin-left: 15px;
                    height: 100%;
                    width: 80px;
                    display: inline-block;
                    text-align: center;
                    cursor: pointer;
                }
                .active {
                    background: #fff;
                }
            }
            .major {
                position: absolute;
                top: 0px;
                left: 220px;
                right: 0px;
                bottom: 0px;
                overflow: auto;
                padding: 10px 20px;
                &>div>h4 {
                    font-size: 14px;
                    font-weight: bold;
                    color: #222;
                    padding: 10px 0px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #aaa;
                }
                & .ivu-modal {
                    top: 70px !important;
                }
            }
        }
    }
</style>
<template>
    <div class="office-container">
        <div class="office-content">
            <div class="sidebar">
                <div style="padding:2px 0px 2px 10px;">
                    <sunset-toolbar :options="officeToolbarOptions"></sunset-toolbar>
                </div>
                <sunset-tree v-ref:localtree :options="localTreeOptions" :nodes="localTreeNodes" @inited="localTreeInited"></sunset-tree>
                <sunset-form-modal v-ref:officemodal :options="modalOptions"></sunset-form-modal>
            </div>
            <div class="major">
                <sunset-toolbar :options="doctorToolbar" style="margin-bottom:10px;"></sunset-toolbar>
                <sunset-table v-ref:doctortable :options="doctorTableOptions"></sunset-table>
                <doctor-modal v-ref:doctormodal @submit="addDoctors"></doctor-modal>
                <sunset-form-modal v-ref:dutymodal :options="dutyOptions"></sunset-form-modal>
            </div>
        </div>
    </div>
</template>
<script>
    import Store from './Store.js';
    import DoctorStore from '../../Doctor/DoctorStore.js';
    import DoctorModal from '../../Doctor/DoctorModal.vue';

    export default {
        components: {
            DoctorModal
        },
        props: {
            hospital: {}
        },
        data() {
            return {
                hospitalNode: null,
                currentTreeNode: null,
                officeToolbarOptions: {
                    size: 'small',
                    tools: [{
                        label: '新建科室',
                        color: 'success',
                        icon: 'plus',
                        operate: () => {
                            var currentTreeNode = this.currentTreeNode;
                            this.editOffice(this.currentTreeNode ? {
                                parentId: this.currentTreeNode.id,
                                parentName: this.currentTreeNode.name,
                                originCategory: currentTreeNode ? currentTreeNode.category : null,
                                category: currentTreeNode ? currentTreeNode.category : null
                            } : {
                                parentId: this.hospital.id,
                                parentName: this.hospital.name
                            });
                        }
                    }, {
                        label: '修改',
                        color: 'warning',
                        icon: 'edit',
                        operate: () => {
                            var currentTreeNode = this.currentTreeNode;
                            if (currentTreeNode&&currentTreeNode.parentId!='0') {
                                this.editOffice(currentTreeNode);
                            } else {
                                Sunset.tip('请选择一个科室');
                            }
                        }
                    }, {
                        label: '删除',
                        color: 'error',
                        icon: 'trash-a',
                        operate: () => {
                            var currentTreeNode = this.currentTreeNode;
                            if (currentTreeNode&&currentTreeNode.parentId!='0') {
                                var clear = Sunset.confirm({
                                    content: `确定删除科室：${currentTreeNode.name}`,
                                    loading: true,
                                    onOk: () => {
                                        Store.remove({
                                            organizationId: currentTreeNode.parentId,
                                            memberEntityId: currentTreeNode.id
                                        }).then(res => {
                                            clear();
                                            Sunset.tip('删除成功', 'success');
                                            this.$refs.localtree.removeNode(
                                                currentTreeNode);
                                            this.currentTreeNode = null;
                                        });
                                    }
                                });
                            } else {
                                Sunset.tip('请选择一个科室');
                            }
                        }
                    }]
                },
                localTreeOptions: {
                    autoExpand: 'all',
                    setting: {
                        view: {
                            expandSpeed: ''
                        },
                        data: {
                            key: {
                                name: 'name',
                                title: 'name'
                            },
                            simpleData: {
                                enable: true,
                                idKey: 'id',
                                pIdKey: 'parentId',
                                rootPId: '0'
                            }
                        },
                        edit: {
                            enable: true,
                            showRenameBtn: function (treeId, treeNode) {
                                return false;
                            },
                            showRemoveBtn: function (treeId, treeNode) {
                                return false;
                            },
                            removeTitle: '删除',
                            renameTitle: "编辑节点名称"
                        },
                        callback: {
                            onClick: (event, treeId, treeNode, clickFlag) => {
                                if (treeNode.data.category.indexOf(Sunset.Service.Dictionary.alias(
                                        'ORG_GROUP_CODE', 'DEPT')) == 0) {
                                    this.selectOffice(treeNode.data);
                                } else {
                                    this.selectOffice(null);
                                }
                            }
                        },
                        check: {
                            radioType: 'all'
                        },
                        format: {
                            nodeToValue(treeNode) {
                                return treeNode && treeNode.data;
                            }
                        }
                    }
                },
                localTreeNodes: [],
                modalOptions: {
                    width: 600,
                    title: '科室管理',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '上级',
                            name: 'parentName',
                            monopolize: true,
                            widget: 'input',
                            readonly: true
                        }, {
                            label: '科室名称',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true,
                                maxlength: 30
                            }
                        }, {
                            label: '科室类型',
                            name: 'category',
                            textPlace: 'value',
                            valuePlace: 'key',
                            premise(model) {
                                return !model.id;
                            },
                            data: () => {
                                return Sunset.Service.Dictionary.getEnums('ORG_CODE').filter(item => item.key
                                    .indexOf(Sunset.Service.Dictionary.alias(
                                        'ORG_GROUP_CODE', 'DEPT')) == 0);
                            },
                            widget: 'select',
                            validate: {
                                required: true
                            }
                        }],
                        tools: false,
                        format: (model) => {
                            model.systemId = model.systemId || GlobalService.getSystemId();
                            return model;
                        },
                        submit: (model) => {
                            return Store.save(model).then(res => {
                                Sunset.tip('保存成功', 'success');
                                if (this.currentTreeNode && model.id == this.currentTreeNode.id) {
                                    Object.assign(this.currentTreeNode, res);
                                    this.$refs.localtree.updateNode(this.currentTreeNode);
                                } else if (!model.id) {
                                    this.$refs.localtree.addNodes(this.currentTreeNode || this.hospitalNode, {
                                        id: res.id,
                                        parentId: model.parentId,
                                        parentName: model.parentName,
                                        name: res.name,
                                        category: res.category,
                                        extension: res.extension,
                                        systemId: res.systemId,
                                        icon: '/assets/tree-icons/home.png'
                                    });
                                }
                                return res;
                            });
                        }
                    }
                },
                //医生相关
                doctorToolbar: [{
                    label: '添加医生',
                    color: 'info',
                    operate: () => {
                        if (this.currentTreeNode && this.currentTreeNode.parentId != '0') {
                            this.$refs.doctormodal.open();
                        } else {
                            Sunset.tip('请选择科室');
                        }
                    }
                }],
                doctorTableOptions: {
                    sortable: true,
                    lazy: true,
                    columns: [{
                        title: '姓名',
                        name: 'entity.name',
                        format(v, record) {
                            return v + (record.property == '4' ?
                                '<i style="color:orange;font-size:18px;margin-left:3px;" class="ivu-icon ivu-icon-person"></i>' :
                                '')
                        }
                    }, {
                        title: '登录名',
                        name: 'entity.username',
                        format(v, record) {
                            return v.substring(0, v.indexOf("@"));
                        }
                    }, {
                        title: '所属科室',
                        name: 'officeName'
                    }, {
                        title: '角色',
                        name: 'property',
                        format(v) {
                            if (v == '0') {
                                return Sunset.Service.Dictionary.transcode('OFFICE_DUTY_TYPE', v);
                            } else {
                                var ps = Sunset.Service.Dictionary.getEnums('OFFICE_DUTY_TYPE').filter(item =>
                                    (((+item.key) & v) == item.key && item.key != '0')).map(item => item.value);
                                return ps.join(',');
                            }
                        }
                    }, {
                        title: '联系方式',
                        name: 'entity.mobilePhone'
                    }],
                    recordTools: [{
                            label: '设为管理员',
                            colir: 'success',
                            premise(record) {
                                return record.property == '0';
                            },
                            operate: (record) => {
                                var model = Sunset.clone(record);
                                model.property = Sunset.Service.Dictionary.alias('OFFICE_DUTY_TYPE', 'MANAGER');
                                Store.setMemberDuty(model).then(res => {
                                    this.$refs.doctortable.refresh();
                                    return res;
                                });
                            }
                        },
                        {
                            label: '取消管理员',
                            color: 'warning',
                            premise(record) {
                                return record.property != '0';
                            },
                            operate: (record) => {
                                var model = Sunset.clone(record);
                                model.property = Sunset.Service.Dictionary.alias('OFFICE_DUTY_TYPE', 'NORMAL');
                                Store.setMemberDuty(model).then(res => {
                                    this.$refs.doctortable.refresh();
                                    return res;
                                });
                            }
                        },
                        {
                            label: '设置角色',
                            color: 'info',
                            premise() {
                                return false;
                            },
                            operate: (record) => {
                                this.$refs.dutymodal.open(record);
                                // return Store.remove(record).then(res => {
                                //     this.$refs.doctortable.refresh();
                                // });
                            }
                        },
                        {
                            label: '移除',
                            color: 'error',
                            confirm: '确定移除此医生？',
                            operate: (record) => {
                                return Store.remove(record).then(res => {
                                    this.$refs.doctortable.refresh();
                                });
                            }
                        }
                    ],
                    pageNumberStart: 0,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        return Store.loadDoctors(this.currentTreeNode ? this.currentTreeNode.id : this.hospital.id);
                    }
                },
                dutyOptions: {
                    title: '设置角色',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '角色',
                            name: 'property',
                            widget: 'checkbox',
                            data: Sunset.Service.Dictionary.getEnums('OFFICE_DUTY_TYPE').filter(item => item.key !=
                                '0').map(item => ({
                                value: item.key,
                                text: item.value
                            })),
                            monopolize: true
                        }],
                        tools: false,
                        cast(model) {
                            var property = +model.property;
                            var ps = Sunset.Service.Dictionary.getEnums('OFFICE_DUTY_TYPE').filter(item => (((+item.key) &
                                property) == item.key)).map(item => item.key);
                            ps.sort();
                            model.property = ps.join(',');
                        },
                        format(model) {
                            model.property = model.property && model.property.split(',').reduce((res, p) => {
                                return res + +p;
                            }, 0) || 0;
                        },
                        submit: (model) => {
                            Store.setMemberDuty(model).then(res => {
                                this.$refs.doctortable.refresh();
                                return res;
                            });
                        }
                    }
                }
            }
        },
        methods: {
            localTreeInited() {
                var node = this.$refs.localtree.getNodeByData(this.currentTreeNode);
                this.$refs.localtree.ztreeObj.selectNode(node);
            },
            editOffice(office) {
                this.$refs.officemodal.open(office);
            },
            selectOffice(office) {
                this.currentTreeNode = office;
                this.$refs.doctortable.refresh();
            },
            loadAllOffices() {
                Store.loadAll(this.hospital.id).then(res => {
                    var nodes = [];
                    // debugger
                    function addMembers(parent, memberId, parentId, parentName) {
                        var name = parent.name;
                        var category = parent.category;
                        nodes.push({
                            id: parent.id,
                            parentId: parentId,
                            name: name,
                            icon: '/assets/tree-icons/home.png',
                            data: {
                                id: parent.id,
                                parentId: parentId,
                                parentName: parentName,
                                name: name,
                                category: category,
                                extension: parent.extension,
                                systemId: GlobalService.getSystemId()
                            }
                        });
                        if (parent.members) {
                            parent.members.forEach(m => {
                                if (m.memberCategory.indexOf(Sunset.Service.Dictionary.alias(
                                        'ORG_GROUP_CODE', 'DEPT')) == 0) {
                                    addMembers(m.entity, m.id, m.organizationId, name);
                                }
                            })
                        }
                    }
                    if (res) {
                        this.hospitalNode = {
                            id: res.id,
                            parentId: '0',
                            parentName: '',
                            name: res.name,
                            category: res.category,
                            systemId: GlobalService.getSystemId()
                        };
                        addMembers(res, res.id, '0');
                    }
                    this.$refs.localtree.refresh(this.localTreeNodes = nodes);
                    this.selectOffice(nodes[0]);
                });
            },
            addDoctors(addDoctors) {
                return Store.addDoctors(addDoctors.map(doctor => {
                    return {
                        "systemId": GlobalService.getSystemId(),
                        "memberEntityId": doctor.userId,
                        "memberCategory": Sunset.Service.Dictionary.alias('ORG_CODE', 'PERSONAL'),
                        "organizationId": this.currentTreeNode.id
                    }
                })).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.doctormodal.close();
                    this.$refs.doctortable.refresh();
                }).catch(e => {
                    this.$refs.doctormodal.cancelLoading();
                })
            }
        },
        ready() {
            this.loadAllOffices();
        },
        watch: {
            hospital() {
                this.loadAllOffices();
            }
        }
    }
</script>