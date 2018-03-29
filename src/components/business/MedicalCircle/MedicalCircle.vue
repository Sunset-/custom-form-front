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
                <span>医联体</span>
                <i-button type="success" style="float:right;" @click="editCircle(null)">创建</i-button>
            </header>
            <ul class="team-ul">
                <li :class="[selectedCircle==circle?'active':'']" v-for="circle in circles" @click="selectTeam(circle)">
                    <h4 style="word-wrap: break-word;">{{circle.extension.name}} |
                        <a href="javascript:;" style="font-size:12px;margin-left:5px;" @click="editCircle(circle)">修改</a>
                    </h4>
                </li>
            </ul>
            <sunset-form-modal v-ref:circlemodal @saved="savedTeam" :options="modalOptions"></sunset-form-modal>
        </div>
        <div class="major">
            <sunset-toolbar :options="doctorToolbar" style="margin-bottom:10px;"></sunset-toolbar>
            <sunset-table v-ref:table :options="doctorTableOptions"></sunset-table>
            <doctor-modal v-ref:doctormodal @submit="addDoctors"></doctor-modal>
            <hospital-modal v-ref:hospitalmodal @submit="addHospitals"></hospital-modal>
            <doctor-team-modal v-ref:teammodal @submit="addTeams"></doctor-team-modal>
            <sunset-view-modal v-ref:relmodal :options="{title:'设置关系',width:800,toolbar:false}">
                <!-- <i-button type="success" @click="addRel">新增</i-button> -->
                <sunset-table style="padding-bottom:20px;border-bottom:1px solid #e1e1e1;margin-bottom:10px;margin-top:5px;" v-ref:reltable :options="relTableOptions"></sunset-table>
                <sunset-form v-ref:relform :options="relFormOptions"></sunset-form>
            </sunset-view-modal>
        </div>
    </div>
</template>
<script>
    import Store from './Store.js';
    import DoctorStore from '../Doctor/DoctorStore.js';
    import DoctorModal from '../Doctor/DoctorModal.vue';
    import HospitalModal from '../Hospital/HospitalModal.vue';
    import DoctorTeamModal from '../DoctorTeam/DoctorTeamModal.vue';

    export default {
        components: {
            DoctorModal,
            HospitalModal,
            DoctorTeamModal
        },
        data() {
            return {
                circles: [],
                selectedCircle: null,
                members: [],
                currentMember: null,
                modalOptions: {
                    width: 600,
                    title: '医疗圈管理',
                    formOptions: {
                        cols: 2,
                        fields: [{
                            label: '医疗圈ID',
                            name: 'id',
                            widget: 'input',
                            readonly : true,
                            monopolize: true,
                            premise(model){
                                // debugger;
                                return model.id;
                            }
                        },{
                            label: '医疗圈名称',
                            name: 'name',
                            widget: 'input',
                            monopolize: true,
                            validate: {
                                required: true,
                                maxlength: 24
                            }
                        }],
                        tools: false,
                        cast: (model) => {
                            var group = {};
                            group.id = model.id;
                            group.organizationId = group.organizationId;
                            group.memberEntityId = model.memberEntityId;
                            var extension = model && model.extension || {};
                            extension._group = group;
                            extension.id = model.id;
                            return extension;
                        },
                        format: (model) => {
                            var group = model._group;
                            delete model._group;
                            return {
                                "id": group.id,
                                "parentId": group.parentId,
                                "name": model.name,
                                "category": Sunset.Service.Dictionary.alias('ORG_CODE', 'SCENES'),
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
                    icon: 'person-add',
                    operate: () => {
                        this.$refs.doctormodal.open();
                    }
                }, {
                    label: '添加医院',
                    color: 'info',
                    icon: 'ios-home',
                    operate: () => {
                        this.$refs.hospitalmodal.open();
                    }
                }, {
                    label: '添加团队',
                    color: 'info',
                    icon: 'person-stalker',
                    operate: () => {
                        this.$refs.teammodal.open();
                    }
                }],
                doctorTableOptions: {
                    lazy: true,
                    pageSize : 10,
                    localPage : true,
                    columns: [{
                        title: '姓名',
                        name: 'entity.name'
                    }, {
                        title: '类型',
                        name: 'memberCategory',
                        format(v) {
                            return Sunset.Service.Dictionary.transcode('ORG_CODE', v);
                        }
                    }, {
                        title: '加入时间',
                        name: 'join_date',
                        format: 'DATETIME'
                    }],
                    recordTools: [{
                        label: '设置关系',
                        color: 'success',
                        operate: (record) => {
                            this.currentMember = {
                                systemId: GlobalService.getSystemId(),
                                scenesId: this.selectedCircle.id,
                                partyaMemberId: record.id,
                                partyaId: record.memberEntityId,
                                partyaCategory: record.memberCategory,
                                members: []
                            };
                            this.$refs.relform.reset(this.currentMember);
                            this.$refs.relmodal.open();
                            this.$refs.reltable.search({
                                scenesId: this.selectedCircle.id,
                                partyaId: record.memberEntityId
                            });
                            // this.$refs.relform.open({
                            //     systemId: GlobalService.getSystemId(),
                            //     scenesId: this.selectedCircle.id,
                            //     partyaMemberId: record.id,
                            //     partyaId: record.memberEntityId,
                            //     partyaCategory: record.memberCategory
                            // });
                        }
                    }, {
                        label: '移除',
                        color: 'error',
                        confirm: '确定移除此医生？',
                        operate: (record) => {
                            return Store.remove(record.id).then(res => {
                                this.$refs.table.refresh();
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
                        filter.organizationId = this.selectedCircle.id;
                        return Store.loadMembers(filter).then(res => {
                            this.members = res.rows || [];
                            return res;
                        });
                    }
                },
                relFormOptions: {
                    cols: 1,
                    fields: [{
                        label: '上级对象',
                        name: 'partyb',
                        widget: 'select',
                        watch: ['members,partyaMemberId', (dep, options, model) => {
                            options.data = dep.members;
                        }],
                        data: () => {
                            return this.members;
                        },
                        premise(model){
                            return !model.id;
                        },
                        validate: {
                            requried: true
                        }
                    }, {
                        label: '上级对象',
                        name: 'partybname',
                        widget: 'input',
                        readonly : true,
                        premise(model){
                            return model.id;
                        }
                    }, {
                        label: '服务范围',
                        name: 'scenesType',
                        widget: 'checkbox',
                        enum: 'SCENES_CATEGORY',
                        validate: {
                            requried: true
                        }
                    }],
                    format: (model) => {
                        var partyb = model.partyb.split('_');
                        delete model.partyb;
                        model.partybMemberId = partyb[0];
                        model.partybId = partyb[1];
                        model.partybCategory = partyb[2];
                        model.scenesType = model.scenesType.split(',').reduce((res, item) => {
                            return res += +item;
                        }, 0);
                        Object.assign(model, this.currentMember);
                        return model;
                    },
                    submit: (model) => {
                        if (model.scenesType == 0) {
                            Sunset.tip('服务范围不能为空', 'warning');
                            return;
                        }
                        return Store.saveRel(model).then(res => {
                            Sunset.tip('保存成功', 'success');
                            this.$refs.relform.reset(this.currentMember);
                            this.$refs.reltable.refresh(1, true);
                        }).catch(e => {
                            this.$refs.relform.reset(this.currentMember);
                            this.$refs.reltable.refresh(1, true);
                        });
                    },
                    tools: [{
                        label: '保存',
                        color: 'success',
                        signal: 'SUBMIT'
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            this.$refs.relmodal.cancel();
                        }
                    }]
                },
                relTableOptions: {
                    columns: [{
                        title: '名称',
                        name: 'partyb.name'
                    }, {
                        title: '类型',
                        name: 'partybCategory',
                        enum: 'ORG_CODE'
                    }, {
                        title: '服务范围',
                        name: 'scenesType',
                        format: (v) => {
                            v = +v;
                            return Sunset.Service.Dictionary.getEnums('SCENES_CATEGORY').filter(item =>
                                item.key &
                                v).map(item => item.value).join(',');
                        }
                    }],
                    lazy: true,
                    showIndex: false,
                    pageSize: 5,
                    localPage: true,
                    multiCheck: false,
                    sortable: true,
                    pageNumberStart: 0,
                    format: {
                        list: '',
                        count: 'length',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    //表格工具栏
                    toolbar: [],
                    //表格搜索
                    filter: false,
                    recordTools: [{
                        label: '修改',
                        color: 'warning',
                        operate: (record) => {
                            return this.$refs.relform.reset({
                                id: record.id,
                                systemId: record.systemId,
                                scenesId: record.scenesId,
                                partyaMemberId: record.id,
                                partyaId: record.partyaId,
                                partyaCategory: record.partyaCategory,
                                partyb: `${record.partybMemberId}_${record.partybId}_${record.partybCategory}`,
                                partybname : record.partyb.name,
                                scenesType: Sunset.Service.Dictionary.getEnums('SCENES_CATEGORY').filter(
                                    item =>
                                    item.key &
                                    record.scenesType).map(item => item.key).join(',')
                            });
                        }
                    }, {
                        label: '移除',
                        color: 'error',
                        confirm: '确定移除此关系？',
                        operate: (record) => {
                            return Store.removeRel(record.id).then(res => {
                                this.$refs.reltable.refresh(1, true);
                            });
                        }
                    }],
                    datasource: (filter) => {
                        return Store.loadRelsFromA(filter).then(res => {
                            var configedMemberIds = res && res.map(item => item.partybId);
                            this.$refs.relform.getModel(true).members = this.members.filter(item => item.memberEntityId !=
                                this.currentMember
                                .partyaId && (!~configedMemberIds.indexOf(item.memberEntityId))).map(
                                item => ({
                                    value: `${item.id}_${item.memberEntityId}_${item.memberCategory}`,
                                    text: item.entity.name
                                }))
                            return res;
                        });
                    }
                }
            }
        },
        methods: {
            editCircle(circle) {
                this.$refs.circlemodal.open(circle || {});
            },
            savedTeam() {
                this.loadAllTeams();
            },
            selectTeam(circle) {
                this.selectedCircle = circle;
                this.$refs.table.refresh();
            },
            loadAllTeams() {
                return Store.loadAll().then(res => {
                    this.circles = res;
                    this.circles.length && this.selectTeam(this.circles[0]);
                    return res;
                });
            },
            addDoctors(addDoctors) {
                return Store.addMembers(addDoctors.map(doctor => {
                    return {
                        "systemId": GlobalService.getSystemId(),
                        "memberEntityId": doctor.userId,
                        "memberCategory": Sunset.Service.Dictionary.alias('ORG_CODE', 'PERSONAL'),
                        "organizationId": this.selectedCircle.id
                    }
                })).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.doctormodal.close();
                    this.$refs.table.refresh();
                })
            },
            addHospitals(items) {
                return Store.addMembers(items.map(item => {
                    return {
                        "systemId": GlobalService.getSystemId(),
                        "memberEntityId": item.id,
                        "memberCategory": Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL'),
                        "organizationId": this.selectedCircle.id
                    }
                })).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.hospitalmodal.close();
                    this.$refs.table.refresh();
                })
            },
            addTeams(items) {
                return Store.addMembers(items.map(item => {
                    return {
                        "systemId": GlobalService.getSystemId(),
                        "memberEntityId": item.id,
                        "memberCategory": Sunset.Service.Dictionary.alias('ORG_CODE', 'TEAM'),
                        "organizationId": this.selectedCircle.id
                    }
                })).then(res => {
                    Sunset.tip("保存成功", "success");
                    this.$refs.teammodal.close();
                    this.$refs.table.refresh();
                })
            },
            // addRel(){
            //     this.$refs.relform.reset(this.currentMember);
            // }
        },
        ready() {
            this.loadAllTeams();
        }
    }
</script>