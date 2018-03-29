<style lang="sass">
.VideoConsultation{
    padding:30px;
    .videomain{
        padding:20px;
        padding: 20px;
        overflow: hidden;
        margin-top: 45px;
    }
    .shebei{
        float:right;
        line-height: 30px;
        height: 30px;
    }
    .iframe-wrapper{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .ivu-row{
        line-height: 45px;
        .ivu-col{
            font-size:16px;
        }
    }
}


</style>


<template>

<div class="VideoConsultation">
  <div>
    <sunset-filter :options="filterOptions"  @filter="filterData"  style="float:left;margin-bottom:10px;"></sunset-filter>
    <!-- @filter="filterData" -->
    <sunset-toolbar :options="toolbarOptions" style="float:left;margin: 0px 10px;"></sunset-toolbar>
    <div class="shebei">
        <span>当前设备 ： {{nowequipment&&nowequipment.code || "本机摄像头"}} {{nowequipment&&nowequipment.equipName}} {{nowequipment&&nowequipment.hospitalName}}</span>
        <span v-on:click="openshebeimodel()" style="cursor: pointer;" > <Icon type="gear-b" size="20" color="rgb(102, 121, 102)"></Icon> </span>
    </div>
  </div>
<sunset-datapage v-ref:datapage :options="options" @refresh="refresh">
    <div class="videomain"> 
        <patient-videodetail  v-for="item in cardcontent" :carditem="item" :nowequipment="nowequipment" @checked="rewriteVideo">
        </patient-videodetail>
  </div>
</sunset-datapage>
        <sunset-form-modal v-ref:rewritevideotime :options="modeloptions"></sunset-form-modal>
    <div>
        <Apply-model v-ref:formmodal @subrefreh="subrefreh" ></Apply-model>
    </div>
    <div>
        <Shebei-xuanze v-ref:shebeixuanze @putequipment="putequipment"></Shebei-xuanze>
    </div>
    <!-- <Modal
        :visible.sync="modal1"
        title="修改预约时间"
        @on-ok="ok"
        @on-cancel="cancel">
          <i-form v-ref:form-custom :model="formCustom" :rules="ruleCustom" :label-width="80">
            <row>
                <i-col span="4">
                    选择日期：
                </i-col>
                <i-col span="18">
                    <Date-picker :value.sync="riqi" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px" :options="optionsdate"></Date-picker>
                </i-col>
            </row>
            <row>
                <i-col span="4">
                    选择时段：
                </i-col>
                <i-col span="18">
                    <Time-picker confirm :value.sync="shijian" format="HH:mm" type="timerange" placeholder="选择时间" style="width: 200px"></Time-picker>
                </i-col>
            </row> 
        </i-form>
    </Modal> -->
</div>



</template>

<script>
    import PatientVideodetail from './videoitem.vue';
    import Store from './Store.js';
    import ApplyModel from './Applymodel.vue';
    import ShebeiXuanze from './shebeimodel.vue';
    // import ShebeiModel from './Applymodel.vue';
    // import ApplyModel from './shebeimodel.vue';
export default {
   components: {
        PatientVideodetail,
        ApplyModel,
        ShebeiXuanze,
  },
    computed: {

    },
    props:{
    },
  data() {
    return{
      cardcontent:[],
      nowequipment:"",
      showiframe:false,
      modal1: false,     // iview 的  model
      formmodaldata:"",
      riqi:"",
      shijian:"",
    //   ruleCustom: {
    //         riqi: [
    //             { required: true, message: '请填写用户名', trigger: 'blur' }
    //         ],
    //         shijian: [
    //            { required: true, message: '请填写用户名', trigger: 'blur' }
    //         ],
    //     },
        options: {
                lazy : true,
                pageNumberStart: 0,
                pageSize: 20,
                format: {
                    list: 'rows',
                    count: 'totalCount',
                    pageSize: 'pageSize',
                    currentPage: 'pageNumber',
                },
                datasource: (filter) => {
                    var aa = GlobalService.getCurrentUserSync();
                    var  ss =GlobalService.getCurrentUserSync();
                    // var hospitalarr = [];
                    var arr=[];
                    ss.relation.teams && ss.relation.teams.forEach(item => {
                        arr.push(item.id);
                    })
                    ss.relation.offices && ss.relation.offices.forEach(item => {
                        arr.push(item.id);
                    })
                    ss.relation.flowHospital && ss.relation.flowHospital.forEach(item => {
                        arr.push(item.entity.id);
                    })
                    // ss.relation.hospital && ss.relation.hospital.forEach(item => {
                    //        hospitalarr.push(item.id);
                    // })
                    arr=arr.join(",");
                    // hospitalarr=hospitalarr.join(",");
                    filter.expertUserId=GlobalService.getCurrentUserSync().user.userId;
                    filter.applyUserId=GlobalService.getCurrentUserSync().user.userId;
                    // filter.applyerHospital=GlobalService.getCurrentUserSync().relation.hospital[0].id;
                    filter.expertTeamId=GlobalService.getCurrentUserSync().relation.teams&&GlobalService.getCurrentUserSync().relation.teams[0]&&GlobalService.getCurrentUserSync().relation.teams[0].id;

                    filter.expertTeamId=GlobalService.getCurrentUserSync().relation.teams&&arr;
                    // filter.hospitalId=hospitalarr;
                    return Store.list(filter);
                }
            },
      filterOptions: {
            fields: [{
                widget: 'radio',
                name: 'status',
                type: 'button',
                defaultFirst: true,
                changeFilter: true,
                order:"DESC",
                data: () => {
                    return [{
                        value:1,
                        text: '进行中'
                    }, {
                        value:2,
                        text: '已过期'
                    }];
                },

            }],
        },
        toolbarOptions: {
            tools: [{
                label: '预约',
                color: 'success',
                operate: () => {
                    this.$refs.formmodal.open({
                    });
                },
                
            },
            ]
        },
        optionsdate: {
            disabledDate (date) {
                return date && date.valueOf() < Date.now() - 86400000;
            }
        },
        modeloptions: {
                    title: '修改预约时间',
                    width: 1000,
                    style: 'max-height:400px;text-align:left;',
                    formOptions: {
                        cols: 2,
                        tools: false,
                        title:"修改预约时间",
                        fields: [{
                        label:"预约日期：",
                        name: 'StartDate',
                        widget:'date',
                        type:'date',
                        placeholder:"预约日期",
                        disabledDate : function(d){
                            return d.getTime() < Date.now()-86400000;
                        },
                        cols: 10,
                        disabled: false,
                        validate: {
                                required: true,
                                StartDate: true
                        },
                    },{
                        label:"预约时段:",
                        name: 'EndDate',
                        widget:'time',
                        type:'timerange',
                        format:"HH:mm",
                        default:Date.now(),
                        placeholder:"预约时段",
                        cols: 10,
                        disabled: false,
                        validate: {
                                required: true,
                                EndDate: true
                        },
                    },
                        ],
                        format: (model) => {
                            var parampost={};
                            const start = new Date();
                            start.setHours(0);
                            start.setMinutes(0);
                            start.setSeconds(0);
                            start.setMilliseconds(0);
                            model.StartDate.setHours(0);
                            model.StartDate.setMinutes(0);
                            model.StartDate.setSeconds(0);
                            model.StartDate.setMilliseconds(0);
                            var jintian =  new Date(start + 86399999).getTime();
                            var startTime=model.EndDate[0].getTime()-jintian+model.StartDate.getTime();
                            var endTime = model.EndDate[1].getTime()-jintian+model.StartDate.getTime();
                            parampost.id=model.subdata.id
                            parampost.startTime=startTime;
                            parampost.endTime=endTime;
                            parampost.applyUserId=model.subdata.applyUserId;
                            parampost.expertTeamId=model.subdata.expertTeamId;
                            parampost.expertUserId=model.subdata.expertUserId;
                            return parampost;
                        },
                        submit: (m) => {
                            return Store.submitFlow(m).then(res=>{
                                Sunset.tip('提交成功', 'success');
                                this.$emit('submited');
                                this.$refs.rewritevideotime.cancel();
                                this.$refs.datapage.refresh();
                            });
                        }
                    }
                }
    }
  },
  methods: {
    filterData(filter) {
        console.log(filter);
        this.$refs.datapage.setFilter(filter);
        // var ss = this.options
        // debugger
        // Store.list(this.videofilter).then(res => {
        //     console.log(res);
        //     this.cardcontent=res.rows;
        // })
    },
    openshebeimodel(){
        this.$refs.shebeixuanze.open({
        });
    },
    putequipment(putequipment){
        console.log("传过来的设备信息");
        console.log(putequipment);
        this.nowequipment=putequipment;
    },
    refresh(data){
        this.cardcontent = data;
    },
    rewriteVideo(data){
        console.log(data);
        this.formmodaldata=data;
        // this.modal1 = true;
        //  打开 sunset 模态框
        this.$refs.rewritevideotime.open({
            subdata:data,
        });
    },
    cancel(){
    },
    ok(){
        console.log(this.riqi);
        console.log(this.shijian);
        console.log(this.formmodaldata);

        var startday=new Date(new Date().setHours(0, 0, 0, 0)) / 1000*1000;
        var startTime=this.shijian[0].getTime()-startday+this.riqi.getTime();
        var endTime = this.shijian[1].getTime()-startday+this.riqi.getTime();

        var parampost={};
        parampost.id=this.formmodaldata.id;
        parampost.startTime=startTime;
        parampost.endTime=endTime;
        parampost.applyUserId=this.formmodaldata.applyUserId;
        parampost.expertTeamId=this.formmodaldata.expertTeamId;
        parampost.expertUserId=this.formmodaldata.expertUserId;

        return Store.submitFlow(parampost).then(res=>{
            Sunset.tip('提交成功', 'success');
            this.$emit('submited');
            // this.$refs.rewritevideotime.cancel();
            // this.refresh();
        });
    },
    subrefreh(){
        this.$refs.datapage.refresh();
    },
  },
  ready() {
        // Store.list(this.videofilter).then(res => {
        //     console.log(res);
        //     this.cardcontent=res.rows;
        // })
  },
  beforeDestroy() {
  },

}
</script>

