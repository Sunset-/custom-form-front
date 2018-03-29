
<style  lang='sass'>

  .videoitem_flow_info{
    float:left;
    width: 338px;
    background: #f2f2f2;
    height:200px;
    border: 10px solid;
    border-color: #d7d7d7;
    margin-left: 20px;
    margin-top:30px;
    padding: 15px;
    position: relative;
      >h3{
        font-size: 20px;
        font-weight: 500;
        color: black;
        margin-bottom: 10px;
        width: 100%;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    .videobutton{
      float: right;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 5px;
      color: #fff;
      background: #2db7f5;
      border-color: #2db7f5;
      border: none;
      position: absolute;
      bottom: 5px;
      right: 10px;
    }
    .yiguoqi{
      position: absolute;
      width: 315px;
      height: 180px;
      top: 0px;
      left: 0px;
      background: #ebebeb;
      opacity: 0.5;
    }
    .wenzi{
      font-size: 25px;
      font-weight: 900;
      position: relative;
      top: 40%;
      left: 40%;
      color: black;
      width: auto;
    }
  }
</style>

<template>
    <div class="videoitem_flow_info" :title="'备注：'+remarkbeizhu">
      <h3 :title="carditem.topic">{{carditem.topic}}</h3>
      <div style="float: right;margin-top: -35px;" v-on:click="rewrite(carditem)"><Icon type="compose" size="20" color="black"></Icon></div>
        <div>邀请人：{{carditem.applyerHospital.name}} {{carditem.applyer.name}}</div>
        <div v-if="carditem.expert">受邀人：  {{carditem.expert.name}}  </div>
        <div v-if="carditem.team">受邀科室：  {{carditem.team.name}}  </div>
        <div v-if="!carditem.expert" style="">&nbsp;</div>
        <div style="text-align: right;">
          {{carditem.startTime | time 'yyyy-MM-dd'}} {{zhouji}} {{carditem.startTime | time 'HH:mm'}} - {{carditem.endTime | time 'HH:mm'}}
        </div>
        <!-- <button v-on:click="faxiaoxi(carditem.id,carditem.topic)">发消息</button> -->
        <button class="videobutton" v-on:click="invideo(carditem.id,carditem.topic)">进入视频</button>
        <div class="yiguoqi" v-show="carditem.status==2">
          <div class="wenzi">已过期</div>
        </div>
    </div>
</template>

<script>
    import SunsetWebsocket from '../../../common/ws.js';
    import Store from './Store';

export default {
    data (){
            return {
                baogaoshow:false,
                // modeloptions: {
                //     title: '修改预约时间',
                //     width: 1000,
                //     style: 'max-height:400px;text-align:left;',
                //     formOptions: {
                //         cols: 2,
                //         tools: false,
                //         title:"修改预约时间",
                //         fields: [{
                //         label:"预约日期：",
                //         name: 'StartDate',
                //         widget:'date',
                //         type:'date',
                //         placeholder:"预约日期",
                //         // style: {
                //         //     width: '30%',
                //         // },
                //         default:Date.now(),
                //         disabledDate : function(d){
                //             return d.getTime() < Date.now()-86400000;
                //         },
                //         cols: 10,
                //         disabled: false,
                //     },{
                //         label:"预约时段;&nbsp;&nbsp;&nbsp;&nbsp;",
                //         name: 'EndDate',
                //         widget:'date',
                //         type:'timerange',
                //         format:"HH:mm",
                //         // style: {
                //         //     width: '30%',
                //         // },
                //         default:Date.now(),
                //         placeholder:"预约时段",
                //         disabledDate : function(d){
                //             return d.getTime() < Date.now()-86400000;
                //         },
                //         cols: 10,
                //         disabled: false,
                //     },
                //         ],
                //         format: (model) => {
                //           debugger
                //             var parampost={};
                //             parampost.id=model.subdata.id
                //             parampost.startTime=model.StartDate.getTime();
                //             parampost.endTime=model.EndDate.getTime();
                //             parampost.applyUserId=model.subdata.applyUserId;
                //             parampost.expertTeamId=model.subdata.expertTeamId;
                //             parampost.expertUserId=model.subdata.expertUserId;
                //             debugger
                //             return parampost;
                //         },
                //         submit: (m) => {
                //             return Store.submitFlow(m).then(res=>{
                //                 Sunset.tip('提交成功', 'success');
                //                 this.$emit('submited');
                //                 this.$refs.rewritevideotime.cancel();
                //                 this.itemrefresh();
                //             });
                //         }
                //     }
                // }
            }
        },
        props:{
            carditem:{},
            data:{},
            nowequipment:{}
        },
        computed:{
            zhouji(){
              var guoqu = new Date(this.carditem.startTime);
              guoqu = guoqu.getDay();
              var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
              var week = weekArray[guoqu];
              return week
          },
          remarkbeizhu(){
            if(this.carditem.remark==""){this.carditem.remark="无"}
            return this.carditem.remark!=undefined?this.carditem.remark:"无";
          }
        },
        methods:{
           invideo(id,topic){
             if(!this.nowequipment){
                // GlobalService.OpenVideoTalk(`/video.html?equipmentId=8f0dac940d434a52964eee665928f181&target=${topic}&room=123`);
                GlobalService.OpenVideoTalk(`/video.html?room=${id}&target=${topic}`);
             }else{
              var equipmentId = this.nowequipment.equipmentId;
              // this.openWebsocket(equipmentId);
              // this.openVideo(equipmentId, '空闲');
              // GlobalService.OpenVideoTalk(`/video.html?equipmentId=${equipmentId}&target=${topic}`);
              this.faxiaoxi();
            }
           },
           openVideo(room, target){
             var iframeUrl = null;
              document.getElementById('toptitle').innerHTML = target || '空闲';
              var url = 'https://meet.peami.com/' + room;
              if (iframeUrl != url) {
                  document.getElementById('videoiframe').src = url;
                  window.focus();
              }
              $(".iframe-wrapper").show();
           },
           openWebsocket(equipmentId){
                  var topic = 'ws://192.168.0.241:8880/business/ws?clientId=' + equipmentId + '&clientType=EQUIPMENT';
                  var  ss = SunsetWebsocket.EVENTS.MESSAGE; //  = MESSAGE
                  SunsetWebsocket.listen(topic, SunsetWebsocket.EVENTS.MESSAGE, function (res) {
                      if (res.content) {
                          if (res.content.messageType == 'MESSAGE') {
                              if (res.content.nextOne && res.content.nextOne.deptId) {
                                  //专家端设备
                                  openVideo(res.content.nextOne.deptId, res.content.nextOne.hospital.name + ':' + res
                                      .content
                                      .nextOne.patient.name);
                              } else if (res.content.expert) {
                                  //医院端设备
                                  document.getElementById('toptitle').innerHTML = res.content.expert.name || '';
                              } else {
                                  openVideo(equipmentId, '空闲');
                              }
                          }
                      }
                  });
                  SunsetWebsocket.connect({
                      url: topic,
                      json: true
                  });

                 var postequ={
                        equipmentId:equipmentId,
                        body:{
                        content:{
                          messageType:"MESSAGE",
                          messagecontent:"try 信息 进入比方"
                        }
                      }
                    }
                    // debugger
                  Store.wssquipment(postequ);
                },
                faxiaoxi(){
                  var equipmentId = this.nowequipment.equipmentId;
                  var roomId = this.carditem.id;
                  // SunsetWebsocket.send(topic, JSON.stringify({
                  //     equipmentId:equipmentId,
                  //       body:{
                  //       content:{
                  //         messageType:"MESSAGE",
                  //       }
                  //       }
                  //   }))
                  var postequ={
                        equipmentId:equipmentId,
                        body:{
                          messageType:"MESSAGE",
                          nextOne:{
                            deptId:roomId,
                            topic:this.carditem.topic,
                          }
                      }
                    }
                  Store.wssquipment(postequ);
                },
                rewrite(carditem){
                  this.$emit('checked',carditem);
                }
        }
        
}
</script>
