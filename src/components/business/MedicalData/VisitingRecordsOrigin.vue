<style lang="sass">
    .visiting-records {
        position: relative;
        &:before {
            content: '';
            position: absolute;
            top: 10px;
            bottom: 0px;
            left: 13px;
            border-left: 1px solid #CCC;
        }
    }
</style>
<template>
    <div class="visiting-records">
        <visiting-record v-for="vr in visitingRecords" v-ref:vrs :is-first="$index==0" :active="vr==currentRecord" :visiting="vr"
            :filter="cardFilter" @active="activeRecord" @detail="activeDetail"></visiting-record>
    </div>
</template>
<script>
    import VisitingRecord from './VisitingRecord';
    import MedicalDataStore from './MedicalDataStore.js';

    export default {
        components: {
            VisitingRecord
        },
        props: {
            patient: {}
        },
        data() {
            return {
                patientId: null,
                visitingRecords: [],
                singleCard: ['patient', 'registration'],
                currentRecord: null,
                cardFilter: null
            }
        },
        computed: {


        },
        methods: {
            refresh(patientId) {
                MedicalDataStore.clearCardCache();
                if (patientId) {
                    this.patientId = patientId;
                }
                MedicalDataStore.loadVisitingRecords(this.patientId).then(visitingRecords => {
                    this.visitingRecords = visitingRecords;
                    this.currentRecord = visitingRecords[0];
                    //获取最新就诊的详情信息
                    this.$emit('visiting', this.currentRecord);
                    this.$nextTick(() => {
                        this.home();
                    });
                });
            },
            filter(v) {
                this.cardFilter = function (item) {
                    if (!item.flow) {
                        return true;
                    } else {
                        return v == item.flow.id;
                    }
                }
            },
            haveEditing() {
                var vrs = this.$refs.vrs;
                if (vrs) {
                    for (var i = 0, l = vrs.length; i < l; i++) {
                        if (vrs[i].haveEditing()) {
                            return true;
                        }
                    }
                }
                return false;
            },
            newCard(viewName, id, digest) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                var firstRecord = this.visitingRecords && this.visitingRecords[0];
                if (firstRecord) {
                    var newCard = {
                        id: id,
                        lastModifyDate: 0,
                        viewName: viewName,
                        patientId: firstRecord.patientId,
                        registrationRecordId: firstRecord.registrationRecordId,
                        digest: digest || {},
                        _editing: true,
                        _dirty: true
                    };
                    this.$refs.vrs[0].newCard(newCard);
                } else {
                    console.error('无就诊记录');
                }
            },
            addCard(card, slient) {
                this.$refs.vrs[0].addCard(card, slient);
            },
            home() {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                this.currentRecord = this.visitingRecords[0];
                this.$refs.vrs[0].home();
            },
            activeRecord(vr) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                this.currentRecord = vr;
                this.$emit('visiting', this.currentRecord);
            },
            activeDetail(card) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                card.patient = this.patient;
                this.$emit('detail', card);
            }
        }
    }
</script>