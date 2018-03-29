<style lang="sass" scoped>
  .treatment-textarea {
    // border: 1px solid #ccc;
    // padding-left: 70px;
    padding-right: 10px;
    padding-bottom: 5px;
    button {
      float: right;
    }
    .main {
      label {
        margin-left: -70px;
        float: left;
      }
    }
  }
</style>

<template>
  <div v-if="value!==null" class="treatment-textarea">
    <div>
      <i-button type="text" @click="remove">删除</i-button>
      <div style="clear:both;"></div>
    </div>
    <div class="main">
      <i-input type="textarea" :value.sync="value" :rows="2" :placeholder="options.placeholder"></i-input>
    </div>
  
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      },
      options: {
        type: Object
      }
    },
    name: "TreatmentTextarea",
    data() {
      return {}
    },
    methods: {
      remove() {
        this.value = null;
      }
    }
  }
</script>