<style lang="sass">
  .medicine-entrust {
    .ivu-radio-wrapper {
      border-left: 0;
    }
  }
</style>
<template>
  <div class="medicine-entrust">
    <div>
      <Radio-group :model.sync="value" vertical @on-change="onChange">
        <Radio :value="item.name" v-for="item in list.data">
          <span>{{item.name}}</span>
        </Radio>
      </Radio-group>
    </div>
    <Page v-if="list.totalCount>10" :total="list.totalCount" show-elevator @on-change="changePages" :current="model.pageNumber+1"
      class="pull-right"></Page>
    <div style="clear:both;"></div>
  </div>
</template>
<script>
  export default {
    name: "MedicineEntrust",
    data() {
      return {
        value: '',
        list: {},
        model: {
          pageNumber: 0,
          pageSize: 10,
          type: 'ENTRUST'
        }
      }
    },
    methods: {
      changePages(v) {
        this.model.pageNumber = v - 1;
        this.refresh();
      },
      refresh() {
        this.value = '';
        return $http({
          url: '/service/owner/save',
          data: this.model
        }).then(res => {
          this.list = res;
        })
      },
      onChange(value) {
        this.$emit('select', value);
      }
    },
    ready() {
      this.refresh()
    }
  }
</script>