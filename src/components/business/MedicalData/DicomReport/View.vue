<style lang="sass">

    .video-reportcard-view{
        width:80%;
        height:100%;
        position:relative;
        margin:0 auto;
        border:1px solid #ddd;
        margin-top:65px;
        .report-table{
            .viewer-image{
                width:100px;
                height:100px;
            }
        }
    .report_info{
        float:left;
        width:100%;
    }
    .pag-footer{
        overflow: hidden;
        width: 100%;
        position: absolute;
        bottom: 0;
        .report_footer{
        margin:30px 0;  
        border-top:1px solid #ccc;
        width:90%;
        margin-bottom: 0;
    }
     span{
            float:left;
            padding:0 50px;
            overflow:hidden;
        }
    }
    ul{
        overflow:hidden;
    }   
    ul li{
        float: left;
        width:23%;
        text-align:left;
        padding-left:15px;
        line-height: 1.5rem;
    }
    table{
        border:none;
        margin-top:20px;
    }
    h4{
       margin-bottom: 20px;
    }


        
    }

.topright{
    padding: 10px 0px;
    overflow: hidden;
    position: absolute;
    right: 3rem;
    top: 0;
}
.v-dicom{
        font-size: 14px;
        color: #333;
        padding-bottom: 10px;
    &>h3 {
        color: #8d8d8d;
        font-weight: 500;
        padding: 15px 0px;
    }
    .datamsg{
        font-size: 14px !important;
        color: #333 !important;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","\5FAE\8F6F\96C5\9ED1",Arial,sans-serif !important;
    }
}

.dicom-table{
    width: 100%;
    border-collapse: collapse;
    font-size:15px;
    .label{
        background: #F2F2F2;
        font-weight: bold;
        width: 100px;
        padding: 15px 0px;
        text-align: center;
    }
    td{
        padding:10px;
        border: 1px solid #CCC;
    }
}
  
</style>
<template>
<div style="position:relative;" class="v-dicom">
  <sunset-toolbar class="topright viewbtn" style="margin-top:0px;" :options="recordTools"></sunset-toolbar>   
    <!-- <div class="video-reportcard-view">
        <h3>{{diagnoseDoctor.relation.hospital[0].name}}</h3>
        <h4> {{deviceType}}检查报告 </h4>       
        <ul>
            <li> <b>患者姓名 : </b> {{card.patient.name}} </li>
            <li> <b>性别 : </b> {{cardsex}} </li>
            <li> <b>年龄 : </b> {{patientAge}} </li>
            <li> <b>检查日期 : </b>{{createDate}}</li>
            <li> <b>科室 : </b> {{card.visiting.registeredDept}} </li>
            <li> <b>患者编号 : </b> {{card.visiting.patientNumber}} </li>
            <li> <b>电话 : </b> {{card.patient.idCard}} </li>
        </ul>
        <table>
            <tr>
                <td style="width:13%;vertical-align: top;"> <b>图像所见 : </b> </td>
                <td>{{{imageMark}}}</td>
            </tr>
            <tr>
                <td  style="vertical-align: top;"> <b>影像提示 : </b> </td>
                <td>{{{imagingFinding}}}</td>
            </tr>
        </table>
        <div style="margin-top: 200px;">
                    <div class="pag-footer">
                        <span>报告医生  :  </span>
                        <span>报告日期  :  </span>
                        <div class="report_footer"></div>
                        <p style="margin-bottom:23px;">此报告仅供本院临床医生参考，结论只对本次检查有效。</p>
                </div>
            <div> &nbsp;</div>
        </div>
     
    </div> -->
        <h3>报告意见 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}} {{card.creator.name}}编辑) </span></h3>
        <table class="dicom-table" style="margin-top:10px;"> 
            <tr>
                <td class="label" width="150px">图像所见：</td>
                <td class="datamsg">{{{imageMark}}}</td>
            </tr>
            <tr>
                <td class="label">影像提示：</td>
                <td class="datamsg">{{{imagingFinding}}}</td>
            </tr>
            <tr>
                <td class="label">建议：</td>
                <td class="datamsg">{{{data.textarea}}}</td>
            </tr>
            <tr>
                <td class="label">报告医生：</td>
                <td class="datamsg">{{data.userName}}</td>
            </tr>
        </table>
        <span style="color:red;padding:10px;"> *本报告结论仅供患者及临床医师参考，不做任何法律依据。 </span>
        <!-- <dicom-report></dicom-report> -->

        <!-- 放在这里做一个打印模板 -->
<div>
    <div :class="card.cardId" class="reportnone">
    <style>
        .reportnone{
            position:relative;
            padding:15px;
            font-family: 'SimSun', 'Arial';
            display:none;
        }
        .reportnone .title-wrap{
            margin: 0 auto;
            font-size: 20px;
            text-align: center;
            padding: 20px;
            line-height: 1.8rem;
        }
        .reportnone .reportnone h4{
            font-weight: bold;
            font-size:20px;
        }
        .reportnone .paint-cont{
            overflow:hidden;
        }
        .reportnone .paint-cont ul{
            list-style:none;
        }
        .reportnone .paint-cont ul li {
            font-weight:400;
            float:left;
            width:30%;
        }
        .reportnone .paint-cont ul li{
            font-weight:normal;
        }
        .reportnone .w-line{
            width: 95%;
            border: 1px solid #ddd;
            margin: 10px auto;
            margin-bottom: 20px;
        }
        
        .reportnone .report_footer{
            width: 100%;
            border: 1px solid #ddd;
            margin: 10px auto;
            margin-bottom: 10px;
        }
        .pa-footer{
            width:100%;
        }
    </style>
        <div class="title-wrap">
            <div class="title" style="font-size: 25px;">{{diagnoseDoctor.relation.hospital[0].name}}</div>
            <div class="title">{{deviceType}}检查报告单</div>
        </div>

        <div class="paint-cont" style="margin-left:10px;">
            <ul>
               <li>姓名 : <span>{{card.patient.name}}</span>  </li>
               <li>性别 : <span>{{cardsex}}</span>  </li>
               <li>年龄 : <span>{{patientAge}}</span>  </li>
               <li>设备 : <span>{{deviceType}}</span>  </li>
               <li>科室 : <span>{{card.visiting.registeredDept}}</span>  </li>
               <li>患者编号 : <span>{{card.visiting.patientNumber}}</span>  </li>
               <li>住院号 : <span>{{card.digest.dicomfile.patientNo}}</span>  </li>                
               <li style="width:50%;">检查日期 : <span>{{card.digest.dicomfile.studyDate}}</span>  </li>
            </ul>
        </div>

        <div class="w-line">  </div>

        <div  style="margin-left:20px;">  <h4> 检查部位及方法 : </h4> {{card.digest.checkPoints}}   [ {{card.digest.position}} ， {{card.digest.checkMethod}} ]</div>

        <div class="report-maincon"  style="margin-left:20px;">
            <div>
                <h4>影像学表现</h4>
                <div>{{{data.biaoxian}}}</div>
            </div>
            <div>
                <h4>影像学提示</h4>
                <div>{{{data.yingxiangtixing}}}</div>
            </div>
            <div id="kong" style="height:200px;width:100%"></div>
        </div>

        <div style="position: absolute;    bottom: 0; width:100%">
                    <div class="pa-footer">
                        <span> 报告医生  :{{data.doctor}} </span>
                        <span style="float:right;margin-right:100px;"> 审核医师  :      </span>
                        <div class="report_footer"></div>
                        <span style="margin-bottom:23px;font-size:14px;">此报告仅供本院临床医生参考，结论只对本次检查有效。</span>
                        <span style="float:right;margin-right:10px; "> 报告时间 : {{reportdata}} </span>
                    </div>
        </div>
    </div>

</div>

    <!-- 模板结束 -->

</div>
      
</template>
<script>

    // import DicomReport from '../../Print/templates/DicomReport.vue';


    export default {
        // components : {
        //     DicomReport
        // },
        props: {
            card: {},
            data: {},
            flow:{},
            // patientage: {},
            visiting:{},
        },
        ready(){
            // debugger;
            var cc = this.card
        },
        data() {
            return {
                editing:false,
                chronicDisease:123,
                newHistoryFields:[],
                newCheckFields:[],
                recordTools: {
                        tools: [{
                            label: '打印',
                            icon: 'ios-pricetags',
                            color: 'info',
                            operate: (record) => {
                                console.log(this.data);
                                console.log(this.card.visiting);
                                console.log(this.visiting);
                                GlobalService.CommonPrint('print-template-DicomReport',{
                                    patientName : this.card.patient.name,
                                    sex:Sunset.Service.Dictionary.transcode('SEX',this.card.patient.sex),
                                    age:this.visiting.extension.patientAge,
                                    shebei:JSON.parse(this.card.digest.dicomfile).deviceType,//
                                    keshi:this.visiting.registeredDept,
                                    patientid:this.visiting.patientNumber,
                                    jianchadata:JSON.parse(this.card.digest.dicomfile).studyDate,
                                    zhuyuanid:JSON.parse(this.card.digest.dicomfile).patientNo,
                                    doctor:this.card.extension.userName,
                                    reportdata:this.visiting.registeredDate,
                                    imageMark:this.data.textarea,
                                    imagingTips:this.data.yingxiangtixing,
                                    imagingFinding:this.data.biaoxian,
                                    jianyi:this.card.extension.textarea,
                                    checkMethod:this.card.digest.checkMethod,
                                    checkPoints:this.card.digest.checkPoints,
                                    position:this.card.digest.position,
                                    series:this.card.digest.series,
                                    cardId:this.card.cardId,
                                    // 医生  和  检查部位方法
                                });
                            },
                        },{
                            label: '编辑',
                            icon: 'ios-pricetags',
                            color: 'info',
                        premise: () => {
                            var c=this.card.creatorId;
                            var u=GlobalService.getCurrentUserSync().user.userId;
                            // debugger
							return (GlobalService.getCurrentUserSync().user.userId == this.card.creatorId);
						},
                        operate: () => {
                            //  this.$emit('edit');
                            this.$emit('edit-card');
                            // console.log(this.data);
                        }
                    }

                    ]
                } 
                                
            }
        },
        computed: {
            safeData() {
                var d = this.data;
                var f= this.flow;
                var c = this.card;
                var v =this.visiting;
                // debugger
                this.card.digest.userId == GlobalService.getCurrentUserSync().user.userId;
                // console.log(GlobalService.getCurrentUserSync());
                return this.data || {};
            },
            deviceType(){
                var ss = JSON.parse(this.card.digest.dicomfile);
                ss = ss.deviceType;
                return ss ? ss : {};
            },
            createDate(){
                var ss = JSON.parse(this.card.digest.dicomfile);
                ss = Sunset.Dates.format(ss.studyDate || new Date(), 'yyyy-MM-dd');
                return ss ? ss : {};
            },

            reportdata(){
                var ss = JSON.parse(this.card.lastModifyDate);
                ss = Sunset.Dates.format(ss || new Date(), 'yyyy-MM-dd');
                return ss ? ss : {};
            },
            // study() {
            //     return this.safeData.dicomfile ? JSON.parse(this.safeData.dicomfile) : {};
            // },
            imageMark(){
                return this.safeData.biaoxian
            },
            imagingFinding(){
                return this.safeData.yingxiangtixing
            },
            // imagingTips(){
            //     return Sunset.Service.Dictionary.transcode('DME',this.safeData.imagingTips)
            // },
            // positiveNegative(){
            //     return Sunset.Service.Dictionary.transcode('DME',this.safeData.positiveNegative)
            // }, 
            diagnoseDoctor(){
                return GlobalService.getCurrentUserSync()
            },
            patientAge(){
                // var age = this.card.visiting.patientAge.split(",");
                var age = this.visiting.extension.patientAge&&this.visiting.extension.patientAge.split(",");
                // this.patientage=age[0]+age[1];
                age = age[0] + age[1];
                return age;
            },
            cardsex(){
                // var cardsex = this.card.patient.sex==1?'女':this.card.patient.sex==0?'男':'不详';
                return Sunset.Service.Dictionary.transcode('SEX',this.card.patient.sex)
            }
        },
        methods: {
        }
    }
</script>