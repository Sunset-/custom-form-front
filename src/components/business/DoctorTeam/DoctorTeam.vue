<style lang="sass">
    .team-container {
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
            width: 300px;
            &>header {
                background: #F2F2F2;
                padding: 10px;
                overflow: hidden;
                height: 50px;
                line-height: 30px;
                &>span {
                    display: inline-block;
                    font-size: 18px;
                    font-weight: bold;
                }
            }
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
            &>.team-ul {
                position: static;
                padding: 5px;
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
</style>
<template>
    <div class="team-container">
        <div class="sidebar">
            <header>
                <span>团队管理</span>
                <i-button type="success" style="float:right;" @click="editTeam(null)">创建团队</i-button>
            </header>
            <ul class="team-ul">
                <li :class="[selectedTeam==office?'active':'']" v-for="office in offices" @click="selectTeam(office)">
                    <h4 style="word-wrap: break-word;">{{office.extension.name}} |
                        <a href="javascript:;" style="font-size:12px;margin-left:5px;" @click="editTeam(office)">修改</a>
                    </h4>
                </li>
            </ul>
            <sunset-form-modal v-ref:teammodal @saved="savedTeam" :options="modalOptions"></sunset-form-modal>
        </div>
        <div class="major">
            <sunset-toolbar :options="doctorToolbar" style="margin-bottom:10px;"></sunset-toolbar>
            <sunset-table v-ref:doctortable :options="doctorTableOptions"></sunset-table>
            <doctor-modal v-ref:doctormodal @submit="addDoctors"></doctor-modal>
        </div>
    </div>
</template>
<script>
    import Store from './DoctorTeamStore.js';
    import DoctorStore from '../Doctor/DoctorStore.js';
    import DoctorModal from '../Doctor/DoctorModal.vue';

    export default {
        components: {
            DoctorModal
        },
        data() {
            return {
                offices: [],
                selectedTeam: null,
                toolbarOptions: {
                    tools: [{
                        label: '新增团队',
                        color: 'info',
                        icon: 'network',
                        operate: () => {
                            this.editTeam();
                        }
                    }]
                },
                modalOptions: {
                    width: 600,
                    title: '团队管理',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '团队名称',
                            name: 'name',
                            widget: 'input',
                            validate: {
                                required: true,
                                fullName: true
                            }
                        }, {
                            label: '联系电话',
                            name: 'contactPhone',
                            widget: 'input',
                            validate: {
                                required: true,
                                phone: true
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
                        }],
                        tools: false,
                        cast: (model) => {
                            var group = {};
                            group.id = model.id;
                            group.organizationId = group.organizationId;
                            group.memberEntityId = model.memberEntityId;
                            var extension = model.extension || {};
                            extension._group = group;
                            return extension;
                        },
                        format: (model) => {
                            var group = model._group;
                            delete model._group;
                            return {
                                "id": group.id,
                                "parentId": group.parentId,
                                "name": model.name,
                                "category": Sunset.Service.Dictionary.alias('ORG_CODE', 'TEAM'),
                                "extension": JSON.stringify(model),
                                "systemId": GlobalService.getSystemId()
                            };
                        },
                        submit: (model) => {
                            return Store.save(model).then(res => {
                                Sunset.tip('保存成功', 'success');
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
                        this.$refs.doctormodal.open();
                    }
                }],
                doctorTableOptions: {
                    lazy: true,
                    columns: [{
                        title: '姓名',
                        name: 'entity.name'
                    }, {
                        title: '类型',
                        name: 'entity.userType',
                        format(v) {
                            return Sunset.Service.Dictionary.transcode('SYSTEM_ACCOUNT_TYPE', v)
                        }
                    }, {
                        title: '联系方式',
                        name: 'entity.mobilePhone'
                    }, {
                        title: '加入时间',
                        name: 'join_date',
                        format : 'DATETIME'
                    }],
                    recordTools: [{
                        label: '移除',
                        color: 'error',
                        confirm: '确定移除此医生？',
                        operate: (record) => {
                            return Store.remove(record).then(res => {
                                this.$refs.doctortable.refresh();
                            });
                        }
                    }],
                    pageNumberStart: 0,
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    datasource: (filter) => {
                        filter.organizationId = this.selectedTeam.id;
                        return Store.loadDoctors(filter);
                    }
                }
            }
        },
        methods: {
            editTeam(office) {
                this.$refs.teammodal.open(office || {});
            },
            savedTeam() {
                this.loadAllTeams();
            },
            selectTeam(office) {
                this.selectedTeam = office;
                this.$refs.doctortable.refresh();
            },
            loadAllTeams() {
                return Store.loadAll().then(res => {
                    this.offices = res;
                    this.offices.length && this.selectTeam(this.offices[0]);
                    return res;
                });
            },
            addDoctors(addDoctors) {
                return Store.addDoctors(addDoctors.map(doctor => {
                    return {
                        "systemId": GlobalService.getSystemId(),
                        "memberEntityId": doctor.userId,
                        "memberCategory": Sunset.Service.Dictionary.alias('ORG_CODE', 'PERSONAL'),
                        "organizationId": this.selectedTeam.id
                    }
                })).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.doctormodal.close();
                    this.$refs.doctortable.refresh();
                }).catch(e=>{
                    this.$refs.doctormodal.cancelLoading();
                });
            }
        },
        ready() {
            this.loadAllTeams();
        }
    }
</script>