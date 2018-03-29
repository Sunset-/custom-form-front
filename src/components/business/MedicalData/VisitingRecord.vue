<style lang="sass">
    .visiting-record {
        width: 100%;
        border-radius: 3px;
        border: 1px solid #E1E1E1;
        background: #FFF;
        margin-bottom: 5px;
        cursor: pointer;
        &:last-child {
            margin-bottom: 0px;
        }
        .visiting-content {
            padding: 5px 10px;
        }
        .visiting-footer {
            padding: 5px;
            background: #F3F3F3;
            border-top: 1px dashed #E1E1E1;
            text-align: right;
        }
        &.active {
            border: 1px solid #2CAB8E;
            background: #2CAB8E;
            color: #FFF;
            .visiting-content {
                display: block;
            }
            .visiting-footer {
                background: #2CAB8E;
                border-top: 1px dashed #FFF;
            }
        }
    }
</style>
<template>
    <div :class="['visiting-record',active?'active':'']">
        <div class="visiting-content">
            患者类型：{{visitingExtension.patientType | enum 'PATIENT_TYPE'}}
            <Icon v-if="isOwnHospitalPatient" style="float:right;" type="edit" @click.stop.prev="editVisiting"></Icon>
            <br> 科室：{{visitingExtension.registeredDept!='undefined'?visitingExtension.registeredDept:''}}
            <br> 就诊日期：{{visitingExtension.registeredDate | time 'yyyy-MM-dd'}}
            <br> 更新日期：{{visiting.lastModifyDate | time 'yyyy-MM-dd'}}
            <br>
        </div>
        <div class="visiting-footer">
            {{visiting.creator&&visiting.creator.name}}
        </div>
    </div>
</template>
<script>
    import MedicalDataStore from './MedicalDataStore.js';

    export default {
        props: {
            patient: {},
            visiting: {},
            isFirst: {},
            filter: {

            },
            active: {

            }
        },
        data() {
            return {}
        },
        computed: {
            visitingExtension() {
                return this.visiting && this.visiting.extension || {};
            },
            isOwnHospitalPatient() {
                return GlobalService.getCurrentUserSync().relation.hospital[0].id == this.patient.hospitalId;
            }
        },
        methods: {
            editVisiting() {
                this.$emit('edit');
            }
        }
    }
</script>