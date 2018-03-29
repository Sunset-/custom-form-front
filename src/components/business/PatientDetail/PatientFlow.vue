<style lang="sass">
    .patient-flow {
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        border-top: 1px solid #E1E1E1;
    }
</style>

<template>
    <div class="patient-flow">
        <sunset-toolbar style="width:100%;" :options="toolbarOptions"></sunset-toolbar>
        <consultation-apply v-ref:consultationmodel :patient="patient" :visitings="visitings" @submited="submitedFlow"></consultation-apply>
        <transfer-treatment-modal v-ref:ttmodal :patient="patient" :visitings="visitings" @submited="submitedFlow"></transfer-treatment-modal>
        <order-check-modal v-ref:checkmodal :patient="patient" :visitings="visitings" @submited="submitedFlow"></order-check-modal>
    </div>
</template>
<script>
    import ConsultationApply from '../FlowData/ConsultationApply/ConsultationApply';
    import TransferTreatmentModal from '../FlowData/TransferTreatment/TransferTreatmentModal.vue';
    import OrderCheckModal from '../FlowData/OrderCheck/OrderCheckModal.vue';

    export default {
        props: {
            visitings: {},
            patient: {}
        },
        components: {
            ConsultationApply,
            TransferTreatmentModal,
            OrderCheckModal
        },
        data() {
            return {
                toolbarOptions: {
                    tools: [ {
                        label: '预约检查',
                        itemStyle: 'width:45%;padding-right:0px;padding-bottom:5px;margin-right:10%;',
                        style: 'width:100%',
                        color: 'warning',
                        operate: () => {
                            this.$refs.checkmodal.open();
                        }
                    }, {
                        label: '预约转诊',
                        color: 'success',
                        itemStyle: 'width:45%;padding-right:0px;padding-bottom:5px;',
                        style: 'width:100%',
                        operate: () => {
                            this.$refs.ttmodal.open();
                        }
                    }, {
                        label: '疑难会诊',
                        itemStyle: 'width:100%;padding-right:0px;padding-bottom:5px;',
                        style: 'width:100%',
                        operate: () => {
                            this.$refs.consultationmodel.open();
                        }
                    }]
                }
            }
        },
        methods : {
            submitedFlow(){
                this.$emit('refresh-flows');
            }
        }
    }
</script>