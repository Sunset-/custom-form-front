<style lang="sass">
    .hospital-container {
        &>.sidebar {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            width: 300px;
            box-sizing: border-box;
            border-right: 1px solid #ccc;
            color: #222;
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
            &>ul {
                position: absolute;
                top: 50px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                overflow: auto;
                padding: 10px;
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
            left: 300px;
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
        &>.major {
            position: absolute;
            top: 0px;
            left: 300px;
            right: 0px;
            bottom: 0px;
            overflow: auto;
            padding: 10px 30px;
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
            &:before {
                content: '';
                position: absolute;
                top: 41px;
                left: 0px;
                width: 50px;
                height: 1px;
                background: #d7dde4;
            }
            &>.ivu-tabs {
                position: static;
                &>.ivu-tabs-content {
                    .ivu-tabs-tabpane:first-child {
                        position: absolute;
                        top: 50px;
                        left: 0px;
                        right: 0px;
                        bottom: 0px;
                    }
                }
            }
        }
    }
</style>
<template>
    <div class="hospital-container">
        <div class="sidebar">
            <header>
                <span>医院管理</span>
                <i-button type="success" style="float:right;" @click="addHospital(null)">添加医院</i-button>
            </header>
            <ul>
                <li :class="[selectedHospital==hospital?'active':'']" v-for="hospital in hospitals" @click="selectHospital(hospital)">
                    <h4 style="word-wrap: break-word;">{{hospital.extension.name}}
                        <a href="javascript:;" style="font-size:12px;margin-left:5px;" @click="addHospital(hospital)">修改</a>
                    </h4>
                    <p style="word-wrap: break-word;">{{hospital.extension.type | enum 'HOSPITAL_TYPE'}} | {{hospital.extension.level | enum 'HOSPITAL_LEVEL'}}</p>
                </li>
            </ul>
            <sunset-form-modal v-if="addHospitalModalOptions.formOptions" v-ref:hospitalmodal @saved="loadAllHospital" :options="addHospitalModalOptions"></sunset-form-modal>
        </div>
        <div class="major">
            <Tabs type="card" :animated="false" active-key="office">
                <Tab-pane label="科室" key="office">
                    <div>
                        <hospital-office v-if="selectedHospital" :hospital="selectedHospital"></hospital-office>
                    </div>
                </Tab-pane>
                <Tab-pane label="设备" key="equipment">
                    <equipment v-if="selectedHospital" :hospital="selectedHospital"></equipment>
                </Tab-pane>
                <Tab-pane label="字典管理" key="Dictionaries">
                    <dictionaries v-if="selectedHospital" :hospital="selectedHospital"></dictionaries>
                </Tab-pane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import HospitalOffice from './Office/Office.vue';
    import Equipment from '../Equipment/Equipment.vue';
    import HospitalStore from './HospitalStore.js';
    import Dictionaries from './Dictionaries/Dictionaries.vue';
    

    export default {
        components: {
            HospitalOffice,
            Equipment,
            Dictionaries
        },
        data() {
            return {
                hospitals: [],
                selectedHospital: null,
                addHospitalModalOptions: {
                    title: '添加医院',
                    width: 800,
                    formOptions: null
                }
            }
        },
        methods: {
            loadAllHospital() {
                HospitalStore.loadHospital({
                    systemId: GlobalService.getCurrentUserSync().user.systemId
                }).then(hospitals => {
                    this.hospitals = hospitals;
                    if (hospitals.length) {
                        this.selectHospital(hospitals[0]);
                    }
                });
            },
            addHospital(model) {
                if (this.addHospitalModalOptions.formOptions) {
                    this.$refs.hospitalmodal.open(model);
                } else {
                    GlobalService.getCustomForm('HOSPITAL').then(res => {
                        res.cast = (model) => {
                            var group = {};
                            group.id = model.id;
                            group.category = Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL');
                            var extension = model.extension || {};
                            extension._group = group;
                            return extension;
                        };
                        res.format = (model) => {
                            var group = model._group;
                            delete model._group;
                            return {
                                "id": group.id,
                                "name": model.name,
                                "category": group.category,
                                "extension": JSON.stringify(model),
                                "systemId": GlobalService.getSystemId()
                            };
                        };
                        res.submit = (model) => {
                            return HospitalStore.saveHospital(model).then(res => {
                                Sunset.tip('保存成功', 'success');
                            });
                        };
                        res.tools = false;
                        this.addHospitalModalOptions.formOptions = res;
                        this.$nextTick(() => {
                            this.$refs.hospitalmodal.open(model);
                        });
                    });
                }
            },
            selectHospital(hospital) {
                if (hospital) {
                    this.selectedHospital = hospital;
                }
            }
        },
        ready() {
            this.loadAllHospital();
        }
    }
</script>