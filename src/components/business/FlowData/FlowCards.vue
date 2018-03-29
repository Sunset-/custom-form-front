<style lang="sass">
    .flow-cards-wrap {
        border: 5px solid transparent;
        .flow-card {
            width: 100%;
            border: 1px solid #e1e1e1;
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            margin-bottom: 5px;
            .fc-header {
                background: #C5C5C5;
                padding: 4px 3px;
                .fc-header-inner {
                    background: #F9F9F9;
                    padding: 4px;
                    border-radius: 5px;
                    label {
                        float: right;
                    }
                }
            }
            .fc-body {
                padding: 5px;
            }
            &.active {
                background: #2CAB8E;
                color: #FFF;
                .fc-header {
                    background: #2CAB8E;
                    .fc-header-inner {
                        background: #E7F4F1;
                        color: #2CAB8E;
                    }
                }
            }
        }
    }

    .vv-card-view {
        &.consultationsuggest,
        &.cure,
        &.checkapply,
        &.laboratoryapply,
        &.prescription,
        &.dicomreport {
            border-top: 3px solid orange !important;
        }
    }
</style>

<template>
    <div class="flow-cards-wrap">
        <component v-for="flow in flows" :class="selectedFlow==flow?'active':''" :is="'flow-card-'+flow.flow.type" :flow="flow.flow" :flow-data="flow"
            @click="selectFlow(flow)"></component>
    </div>
</template>
<script>
    import Store from "./Store";
    import MedicalDataStore from "../MedicalData/MedicalDataStore.js";

    export default {
        props: {
            patientId: {}
        },
        data() {
            return {
                flows: [],
                selectedFlow: null
            };
        },
        methods: {
            init() {
                Store.getFlowsByPatientId(this.patientId).then(flows => {
                    this.flows = flows || [];
                });
            },
            refresh(){
                this.init();
            },
            selectFlow(flow) {
                this.selectedFlow = flow;
                this.$emit("flow", flow.flow);
            }
        },
        ready() {
            this.init();
        }
    };
</script>