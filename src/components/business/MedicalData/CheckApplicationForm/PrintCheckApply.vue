<style lang="sass">
.print_check_apply{
    color:#333;
    .check_apply_title{
        font-size:18px;
        font-weight:600;
        &>span{
            font-size:14px;
            margin-left:40px;
            font-weight:normal;
            color:#999;
        }
    }
    .complain_text{
        margin-top:20px;
        .complain_content{
            color: #06F;
        }
    }
    .check_apply_content{
        border:1px dashed #ccc;
        width:300px;
        min-height:140px;
        padding::18px;
        margin: 15px 15px 15px 0;
        position:relative;
        float:left;
        &>div{
            width: 200px;
            line-height:34px;
		    word-wrap: break-word;
        }
        &>.btn_print{
            position:absolute;
            right:15px;
            top:15px;
            border:1px solid #ccc;
            width:60px;
            height:30px;
            line-height:28px;
            border-radius:3px;
            text-align:center;
            cursor:pointer;
        }
    }
    .operate_bar{
        position:absolute;
        top:0;
        right:0;
        &>div{
            height:36px;
            line-height:36px;
            width:60px;
            float:left;
            text-align:center;
            border-radius:3px;
            cursor:pointer;
        }
        &>.edit{
            background-color:#3399ff;
            color:#fff;
            margin-right:20px;
            width: 56px;
            height: 32px;
            line-height: 32px;
            margin-top: 10px;
            font-size: 12px;
            border-radius: 4px;
        }
    }
}
</style>
<template>
  <div class="print_check_apply">
        <div class="check_apply_title">检查申请单<span>{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}} 编辑</span></div>
        <div class="operate_bar">
            <div v-show="isEdit" class="edit" @click="edit">编辑</div> 
        </div>
        <div class="complain_text"><span>初步诊断 ：</span><span class="complain_content">{{printData?printData.diagnose:''}}</span></div>
        <div class="check_apply_content" v-for='item in printItems'>
            <div><label>检查项目 : </label><span>{{item.checkmethod}}</span></div>
            <div><label>检查部位 : </label><span>{{item.checkpoint}}</span></div>
            <div><label>检查目的 : </label><span>{{item.checktarget}}</span></div>
            <div  v-show="isPrint" class="btn_print" @click="print(item)">打印</div>
        </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
    }
  },
  props:{
    printData:{},
    card:{}
  },
  computed:{
    isPrint(){
        return GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE', 'ASSISTANT');
    },
    isEdit(){
        return this.card.digest.id == GlobalService.getCurrentUserSync().user.userId
    },
    printItems(){
        if(this.printData){
            var item=[];
            var data =JSON.parse(JSON.stringify(this.printData));
            for(var v in  data){
                if(v.indexOf("checkapply")== 0){
                    item.push(JSON.parse(data[v]))  
                };
            };
            return item
        }  
    }
  },
  methods:{
      print(item){
        var card=this.card;
        //病人信息
        var printLabels= [['编号','patientNumber',null,'visiting'], ['姓名','name',null,'patient'], ['性别','sex','SEX','patient'],
            ['年龄','patientAge',function(v){return v.split(",").join("")},'visiting'], ['患者类型','patientType','PATIENT_TYPE','visiting'], ['科室','registeredDept',null,'visiting'],
            ['日期','createDate',Date,'CARD']];
        var patientPrintInfo= printLabels.map(v=>{
            var label = v[0];
            var valueType = v[2];
            var value = v[3]=='CARD'?card[v[1]]:card[v[3]][v[1]];
            if(valueType===Date){
                value = Sunset.Dates.format(value,'yyyy-MM-dd');
            }else if(typeof valueType=='string'){
                value = Sunset.Service.Dictionary.transcode(valueType, value);
            }else if(typeof valueType=='function'){
                value = valueType(value);
            }
            if(value===void 0){
                value = '';
            }
            return {
                label : label,
                value : value
            }
        });
        //检查信息
        var patientCheckInfo=[];
        var checkLabels=[['检查方法','checkmethod'], ['检查部位','checkpoint'], ['检查目的','checktarget']];
        var patientCheckInfoLsit=[];
        checkLabels.map(v=>{
            var obj={};
            obj.label= v[0];
            obj.value=item[v[1]];
            patientCheckInfoLsit.push(obj)
        });
        patientCheckInfo.push(patientCheckInfoLsit);
        GlobalService.CommonPrint('print-template-checkform',{
            hospital: GlobalService.getCurrentUserSync().relation.hospital[0].name,
            subTitle: '检查申请单',
            labels: patientPrintInfo,
            items: patientCheckInfo,
            mainSuit: card.history.complain,
            firstDiagnose: this.printData.diagnose,
            diagnoseDoctor: this.card?this.card.digest.doctor:'',
            applyTime: Sunset.Dates.format(new Date(),'yyyy-MM-dd')
        })
      },
      edit(mark){
          this.$emit("edit", mark)
      }
  }
}
</script>
