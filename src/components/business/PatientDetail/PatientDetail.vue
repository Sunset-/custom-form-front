<style lang="sass">
    $sidebar-width: 250px;
    $sidebar-info-height: 95px;
    $sidebar-flow-height: 100px;
    $major-pdtabs-height: 35px;
    $major-pdtab-height: 30px;

    .patient-detail {
        position: absolute;
        top: 0px;
        right: 0px;
        left: 0px;
        bottom: 0px;
        background: #F3F3F3;
        color: #454545;
        font-size: 14px;
        .pd-sidebar {
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            width: $sidebar-width;
            box-sizing: border-box;
            border-right: 1px solid #E1E1E1;
            .pd-info {
                width: 100%;
                height: $sidebar-info-height;
            }
            .vf-tabs {
                position: absolute;
                top: $sidebar-info-height;
                width: 100%;
                height: 40px;
                font-size: 0px;
                &>div {
                    display: inline-block;
                    width: 50%;
                    font-size: 16px;
                    line-height: 40px;
                    text-align: center;
                    background: #E1E1E1;
                    color: #454545;
                    cursor: pointer;
                    &.active {
                        background: #FFF;
                        color: #2CAB8E;
                    }
                }
            }
            .vf-tab-visiting {
                position: absolute;
                width: 100%;
                top: $sidebar-info-height + 40px;
                bottom: 0px;
                .pd-records {
                    position: absolute;
                    width: 100%;
                    top: 0px;
                    bottom: $sidebar-flow-height;
                    background: #FFF;
                    overflow-y: auto;
                }
                .pd-flow {
                    position: absolute;
                    bottom: 0px;
                    width: 100%;
                    height: $sidebar-flow-height;
                    background: #FFF;
                }
            }
            .vf-tab-flow {
                position: absolute;
                width: 100%;
                top: $sidebar-info-height + 40px;
                bottom: 0px;
                overflow-y: auto;
                background: #FFF;
            }
            &.in-flow {
                .vf-tabs {
                    display: none;
                }
                .vf-tab-visiting {
                    top: $sidebar-info-height;
                    .pd-records {
                        bottom: 0px;
                    }
                    .pd-flow {
                        display: none;
                    }
                }
            }
        }
        .pd-major {
            position: absolute;
            top: 0px;
            bottom: 0px;
            right: 0px;
            left: $sidebar-width;
            height:100%;
            .pd-tabs {
                background: #FFf;
                width: 100%;
                height: $major-pdtabs-height;
                padding: 5px 10px 0px 10px;
                box-sizing: border-box;
                border-bottom: 1px solid #E1E1E1;
                .pd-tab {
                    position: relative;
                    display: inline-block;
                    height: $major-pdtab-height;
                    background: #E1E1E1;
                    cursor: pointer;
                    z-index: 1;
                    margin: 0px 12px;
                    padding: 0px 10px;
                    text-align: center;
                    line-height: $major-pdtab-height;
                    vertical-align: bottom;
                    &:before {
                        content: '';
                        display: block;
                        width: 20px;
                        height: $major-pdtab-height;
                        position: absolute;
                        transform: skewX(-20deg);
                        background: red;
                        border-top-left-radius: 3px;
                        left: -10px;
                        top: 0;
                        z-index: -1;
                        background: #E1E1E1;
                    }
                    &:after {
                        content: '';
                        display: block;
                        width: 20px;
                        height: $major-pdtab-height;
                        position: absolute;
                        transform: skewX(20deg);
                        background: red;
                        border-top-right-radius: 3px;
                        top: 0;
                        right: -10px;
                        z-index: -1;
                        background: #E1E1E1;
                    }
                    &:hover {
                        z-index: 3;
                        background: #C5C5C5;
                        &:before {
                            background: #C5C5C5;
                        }
                        &:after {
                            background: #C5C5C5;
                        }
                    }
                    &.active {
                        z-index: 2;
                        color: #FFF;
                        background: #2CAB8E;
                        &:before {
                            background: #2CAB8E;
                        }
                        &:after {
                            background: #2CAB8E;
                        }
                    }
                    &.pd-tab-flow {
                        &:before {
                            transform: skewX(0deg);
                        }
                        &:after {
                            transform: skewX(0deg);
                        }
                    }
                    &.pd-tab-card {
                        height: $major-pdtab-height - 5px;
                        line-height: $major-pdtab-height - 5px;
                        &:before {
                            height: $major-pdtab-height - 5px;
                        }
                        &:after {
                            height: $major-pdtab-height - 5px;
                        }
                    }
                    .pd-tab-close {
                        margin-top: 5px;
                        font-size: 12px;
                        position: relative;
                        right: -5px;
                        &:hover {
                            color: #e1e1e1;
                        }
                    }
                }
            }
            .pd-tab-content {
                position: absolute;
                left: 0px;
                right: 0px;
                bottom: 0px;
                top: $major-pdtabs-height;
                overflow-y: auto;
            }
        }
    }
</style>
<template>
    <div class="patient-detail">
        <!-- 左侧-->
        <div :class="['pd-sidebar',flowId?'in-flow':'']">
            <div class="pd-info">
                <patient-info :patient="patient" @refresh-visiting="refreshVisiting"></patient-info>
            </div>
            <div class="vf-tabs">
                <div :class="currentTypeTab=='VISITING'?'active':''" @click="currentTypeTab='VISITING'">病历</div>
                <div :class="currentTypeTab=='FLOW'?'active':''" @click="currentTypeTab='FLOW'">流程</div>
            </div>
            <div v-show="currentTypeTab=='VISITING'" class="vf-tab-visiting">
                <div class="pd-records">
                    <visiting-records v-ref:records :patient="patient" @visitings="refreshVisitings" @edit-card="editCard" @visiting="activeVisiting"></visiting-records>
                </div>
                <div class="pd-flow">
                    <patient-flow :visitings="visitings" :patient="patient"  @refresh-flows="refreshFlows"></patient-flow>
                </div>
            </div>
            <div v-show="currentTypeTab=='FLOW'" class="vf-tab-flow">
                <flow-cards v-if="!flowId" v-ref:flows :patient-id="patientId" @flow="addFlowTab"></flow-cards>
            </div>
        </div>
        <!-- 右侧 -->
        <div class="pd-major">
            <div class="pd-tabs">
                <div v-for="tab in tabs" v-show="tab.type=='CARD'||(tab.type=='VISITING'&&tab.visiting==currentVisiting)||(tab.type=='FLOW'&&tab.flow==currentFlow)" :class="['pd-tab','pd-tab-'+tab.type.toLowerCase(),currentTab==tab?'active':'']"
                    @click="selectedTab(tab)">
                    {{tab.title}}
                    <Icon v-if="tab.closeable" class="pd-tab-close" type="close-round" @click="closeTab(tab)"></Icon>
                </div>
            </div>
            <div class="pd-tab-content">
                <div v-for="tab in tabs" v-show="currentTab==tab">
                    <component v-if="tab.inited" :is="tab.component" :data="tab" :card="tab.card" :patient="patient" :flow="tab.flow" :visitings="visitings"
                        @edit-card="editCard" @visiting="activeVisiting" @close="closeTab(tab)" @saved="savedCard(tab)" @refresh="refreshTab(tab)" @refresh-flows="refreshFlows"></component>
                </div>
            </div>
        </div>
        <consultation-im v-if="flowId&&Difficult" :roomid="flowId" :roomname="'疑难会诊'"></consultation-im>
    </div>
</template>
<script>
    import PatientInfo from './PatientInfo';
    import PatientFlow from './PatientFlow';
    import VisitingRecords from '../MedicalData/VisitingRecords';
    import VisitingView from '../MedicalData/VisitingView';
    import CardDetail from '../MedicalData/Detail';
    import FlowCards from '../FlowData/FlowCards.vue';

    import MedicalDataStore from "../MedicalData/MedicalDataStore.js";
    import FlowStore from '../FlowData/Store';

    import ConsultationIm from '../FlowData/ConsultationIm/Im.vue';
    export default {
        components: {
            PatientInfo,
            VisitingRecords,
            PatientFlow,
            VisitingView,
            CardDetail,
            FlowCards,
            ConsultationIm
        },
        props: {
            patientId: {},
            flowId: {}
        },
        ready() {
            this.init();
            
        },
        computed: {
            Difficult(){
                if(this.$route.path.startsWith('/DifficultConsultation')){
                    return true
                }
                return false
            }
        },
        data() {
            return {
                patient: {},
                visitings: {},
                currentVisiting: null,
                currentFlow: null,
                currentTab: null,
                currentTypeTab: 'VISITING',
                tabs: [
                    //     {
                    //     type: 'FLOW',
                    //     title: '咨询流程',
                    //     inited: false,
                    //     component: 'visiting-view'
                    // }, 
                    // {
                    //     type: 'CARD',
                    //     title: '写报告',
                    //     inited: false,
                    //     component: 'visiting-view'
                    // }
                ]
            }
        },
        methods: {
            init() {
                this.$refs.records.refresh(this.patientId);
                MedicalDataStore.getCardsDetailData(this.patientId).then((res) => {
                    this.patient = res && res[0] || {};
                });
                if (this.flowId) {
                    this.initFlow(this.flowId);
                }
            },
            initFlow(flowId) {
                FlowStore.getFlowById(flowId).then(flow => {
                    var Dictionary = Sunset.Service.Dictionary;
                    var flowTab = {
                        type: 'FLOW',
                        title: Dictionary.transcode('SCENES_CATEGORY', Dictionary.alias('SCENES_CATEGORY',
                            flow.type)),
                        closeable: false,
                        inited: true,
                        component: `flow-view-${flow.type}`,
                        patient: this.patient,
                        flow: flow
                    };
                    var flowVisitingIds = [];
                    flow.flowCaseList && flow.flowCaseList.forEach(item => {
                        if (item.caseType == 'RegistrationRecord') {
                            flowVisitingIds.push(item.caseId);
                        }
                    });
                    this.$refs.records.filter((item) => {
                        return flowVisitingIds.indexOf(item.registrationRecordId) >= 0;
                    });
                    this.currentFlow = flow;
                    this.tabs.unshift(flowTab);
                    this.selectedTab(flowTab);
                });
            },
            selectedTab(tab) {
                tab.inited = true;
                this.currentTab = tab;
            },
            refreshTab(tab) {
                tab.refresh && tab.refresh();
            },
            closeTab(tab) {
                var createTab = tab._createTab;
                delete tab._createTab;
                var index = this.tabs.indexOf(tab);
                this.tabs.splice(index, 1);
                if (createTab && createTab.type == 'FLOW') {
                    this.selectedTab(createTab);
                } else {
                    if (this.currentTab == tab) {
                        if (this.tabs.length > index) {
                            this.selectedTab(this.tabs[index]);
                        } else {
                            this.selectedTab(this.tabs[index - 1]);
                        }
                    }
                }
                $(".visiting-records .active").click();
            },
            refreshVisitings(visitings) {
                this.visitings = visitings;
            },
            activeVisiting(visiting, slient) {
                var visitingTab = this.tabs.find(item => item.type == 'VISITING' && item.visiting == visiting);
                if (!visitingTab) {
                    this.tabs.splice(1, 0, visitingTab = {
                        type: 'VISITING',
                        title: `${Sunset.Dates.format(visiting.registeredDate,'yyyy/MM/dd')} 病历`,
                        inited: true,
                        component: 'visiting-view',
                        visiting: visiting
                    });
                }
                if (!this.flowId) {
                    this.selectedTab(visitingTab);
                } else {
                    if (!slient && this.currentVisiting) {
                        this.selectedTab(visitingTab);
                    }
                }
                this.currentVisiting = visiting;
            },
            addFlowTab(flow) {
                var flowTab = this.tabs.find(item => item.type == 'FLOW' && item.flow == flow);
                if (!flowTab) {
                    var Dictionary = Sunset.Service.Dictionary;
                    this.tabs.splice(1, 0, flowTab = {
                        type: 'FLOW',
                        title: Dictionary.transcode('SCENES_CATEGORY', Dictionary.alias('SCENES_CATEGORY',
                            flow.type)),
                        inited: true,
                        component: `flow-view-${flow.type}`,
                        flow: flow,
                        _createTab: this.currentTab
                    });
                }
                this.currentFlow = flow;
                this.selectedTab(flowTab);
            },
            editCard(card, title, flow) {
                var tab;
                this.tabs.push(tab = {
                    type: 'CARD',
                    title: title,
                    closeable: true,
                    inited: true,
                    component: 'card-detail',
                    patient: this.patient,
                    card: card,
                    flow: flow,
                    _createTab: this.currentTab
                });
                this.selectedTab(tab);
            },
            savedCard(tab) {
                var createTab = tab._createTab;
                if (createTab) {
                    createTab.refresh && createTab.refresh();
                }
                this.closeTab(tab);
                $(".visiting-records .active").click();
            },
            refreshVisiting() {
                this.$refs.records.refresh(this.patientId);
            },
            refreshFlows(){
                this.$refs.flows.refresh();
            },

        }
    }
</script>