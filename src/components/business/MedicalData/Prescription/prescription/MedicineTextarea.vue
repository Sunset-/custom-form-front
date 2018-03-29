<style lang="sass" scoped>

</style>
<template>
  <div>
    <i-input type="textarea" :maxlength="50" :value.sync="value"></i-input>
  </div>
</template>
<script>
  export default {
    name: "MedicineTextarea",
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {}
    }
  }
</script>