<style lang="sass">
    .visiting-records {
        border: 5px solid #FFF;
        position: relative;
    }
</style>
<template>
    <div class="visiting-records">
        <visiting-record v-for="vr in showVisitingRecords" v-ref:vrs :active="vr==currentRecord" :patient="patient" :visiting="vr" @edit="editVisiting(vr)" @click="activeRecord(vr)"></visiting-record>
        <visiting-modal v-ref:visitingmodal></visiting-modal>
    </div>
</template>
<script>
import VisitingRecord from "./VisitingRecord";
import MedicalDataStore from "./MedicalDataStore.js";
import VisitingModal from "../PatientDetail/VisitingModal.vue";

export default {
  components: {
    VisitingRecord,
    VisitingModal
  },
  props: {
    patient: {}
  },
  data() {
    return {
      patientId: null,
      visitingRecords: [],
      currentRecord: null,
      visitingFilter: null
    };
  },
  computed: {
    showVisitingRecords() {
      if (this.visitingFilter) {
        var visitingRecords = this.visitingRecords.filter(this.visitingFilter);
        if (
          !visitingRecords.find(v => v == this.currentRecord) &&
          visitingRecords[0]
        ) {
          this.activeRecord(visitingRecords[0], true);
        }
        return visitingRecords;
      } else {
        return this.visitingRecords;
      }
    }
  },
  methods: {
    refresh(patientId) {
      MedicalDataStore.clearCardCache();
      if (patientId) {
        this.patientId = patientId;
      }
      MedicalDataStore.loadVisitingRecords(this.patientId).then(
        visitingRecords => {
          this.visitingRecords = visitingRecords;
          this.currentRecord = visitingRecords[0];
          this.$emit("visitings", visitingRecords);
          this.$emit("visiting", this.currentRecord);
        }
      );
    },
    activeRecord(vr, slient) {
      this.currentRecord = vr;
      this.$emit("visiting", this.currentRecord, slient);
    },
    filter(func) {
      this.visitingFilter = func;
    },
    editVisiting(vr) {
      vr.patient = this.patient;
      this.$emit("edit-card", vr, "编辑病历");
    }
  }
};
</script>