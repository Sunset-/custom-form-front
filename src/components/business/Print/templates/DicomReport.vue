

<template>
    <!-- 影响报告 -->

    <div class="dicomreportma" style="font-size:18px;line-height:2rem;font-family: 'SimSun', 'Arial';">
    <style>
        .dicomreportma{
            position:relative;
            padding:15px;
            <!-- height:1000px; -->
            font-family: 'SimSun', 'Arial';
            font-size:18px;
        }
        .dicomreportma .title-wrap{
            margin: 0 auto;
            font-size: 20px;
            text-align: center;
            padding: 20px;
        }
        .dicomreportma .dicomreportma h4{
            font-weight: bold;
            font-size:20px;
            disolay:inline-block;
        }
        .dicomreportma .paint-cont{
            overflow:hidden;
        }
        .dicomreportma .paint-cont ul{
            list-style:none;
        }
        .dicomreportma .paint-cont ul li {
            font-weight:400;
            float:left;
            width:30%;
        }
        .dicomreportma .paint-cont ul li>span{
            font-weight:normal;
        }
        .dicomreportma .w-line{
            width: 95%;
            border: 1px solid #ddd;
            margin: 10px auto;
            margin-bottom: 20px;
        }
        .dicomreportma .report-maincon{
        }
        .dicomreportma .report_footer{
            width: 100%;
            border: 1px solid #ddd;
            margin: 6px auto;
        }
    </style>
        <div class="title-wrap">
            <div class="title" style="font-size: 25px;">{{user.relation.hospital[0].name}}</div>
            <div class="title">{{deviceType}}检查报告单</div>
        </div>

        <div class="paint-cont" style="margin-left:12px; font-color:#ccc">
            <ul>
               <li>姓名 : <span>{{data.patientName}}</span>  </li>
               <li>性别 : <span>{{data.sex}}</span>  </li>
               <li>年龄 : <span>{{patientAge}}</span>  </li>
               <li>设备 : <span>{{data.shebei}}</span>  </li>
               <li>科室 : <span>{{data.keshi}}</span>  </li>
               <li>患者编号 : <span>{{data.patientid}}</span>  </li>
               <!-- <li>住院号 : <span>{{data.zhuyuanid}}</span>  </li>                 -->
               <li style="width:50%;">检查日期 : <span>{{jianchadata}}</span>  </li>
            </ul>
        </div>

        <div class="w-line">  </div>

        <div  style="margin-left:20px;">  <h4> 检查部位及方法 : </h4>{{data.checkPoints}}[ {{safeData.checkMethod}}，{{safeData.position}}{{safeData.series}} ]</div>

        <div class="report-maincon"  style="margin-left:20px;">
            <div>
                <h4>影像学表现</h4>
                <div style="">{{{safeData.imagingFinding}}}</div>
            </div>
            <div>
                <h4>影像学提示</h4>
                <div style="">{{{data.imagingTips}}}</div>
            </div>
            <!-- <div>
                <h4>data</h4>
                <div>{{data | json}}</div>
            </div>
            <div>
                <h4>card</h4>
                <div>{{card | json}}</div>
            </div> -->
            <!-- <div id="kong" style="height:200px;width:100%"></div> -->
        </div>
        <div style="position: absolute;bottom: 0;width:95%;font-size:10px;">
                    <div class="pa-footer">
                        <span> 报告医生  : {{data.doctor}} </span>
                        <span style="float:right;margin-right:100px;"> 审核医师  :      </span>
                        <div class="report_footer"></div>
                        <span style="margin-bottom:10px;">此报告仅供本院临床医生参考，结论只对本次检查有效。</span>
                        <span style="float:right;margin-right:10px; "> 报告时间 : {{reportdata}} </span>
                    </div>
        </div>

    </div>
</template>
<script>
    export default {
        props: {
            data: {
                default () {
                    return {
                        patientName: '张三',
                        sex: '男',
                        patientAge: '25',
                        shebei:"XD",
                        keshi: '普洱市普洱市普洱市人民医院',
                        patientid: '201710180001',
                        zhuyuanid: '123123213eqweqw',
                        position: '',
                        checkPoints: '',
                        checkMethod: '55',
                        imagingFinding:'',
                        imagingTips:''
                    };

                }
            }
        },
        computed: {
            safeData() {
                // debugger;
                //获取页面总高度，然后进行判断吧
             var kong=$("."+this.data.cardId+"").height();
             console.log("kong"+kong); 
             for(var i=0;i<=kong/750+1;i++){               
             };
                $(".dicomreportma").css('height',(i-1)*1000+'px');
                // $(".dicomreportma").css('height','2000px');
                if(this.data.series!=undefined){this.data.series=this.data.series.replace(/;/g,"，")}
                if(this.data.series!=undefined){this.data.series=" - "+this.data.series;}
                if(this.data.checkPoints!=undefined){this.data.checkPoints=this.data.checkPoints.replace(/;/g,"，")}
                if(this.data.checkMethod!=undefined){this.data.checkMethod=this.data.checkMethod.replace(/;/g,"，")}
                if(this.data.position!=undefined){this.data.position=this.data.position.replace(/;/g,"，")}
				return this.data || {};
			},
            imagingFinding(){
                return this.safeData.imagingFinding;
            },
            imagingTips(){
                return this.data.imagingTips;
            },
            user() {
               var user = GlobalService.getCurrentUserSync();
               console.log(user);
               return user;
            },
            patientAge(){
                var age = this.data.age&&this.data.age.replace(",","");
                return age;
            },
            jianchadata(){
                return Sunset.Dates.format(this.data.jianchadata || new Date(), 'yyyy-MM-dd');
            },
            reportdata(){
                return Sunset.Dates.format(this.data.reportdata || new Date(), 'yyyy-MM-dd');
            },
            deviceType(){
                var deviceType;
                if(this.data.shebei=='CT'){deviceType='CT'}
                else if(this.data.shebei=='MR'){deviceType='核磁'}
                else{deviceType='放射'};
                return deviceType
            },
             
            
        },
        methods: {
            showCheckItem(alias) {
                return (this.allCheck & Sunset.Service.Dictionary.alias('SCREENING_EYES_DEPT', alias)) == Sunset.Service
                    .Dictionary.alias('SCREENING_EYES_DEPT', alias);
            }
        },

    }

</script>