<template>
    <style>
        .report_template{
            font-size:14px;
        }
        .report_template .title{
            font-size:26px;
            text-align:center;
            height:40px;
            line-height:40px;
            font-weight:600;
        }
        .report_template .title1{
            font-size:18px;
            text-align:center;
            height:30px;
            line-height:50px;
            margin-bottom:30px;
        }
        .report_template .report-table{
            font-size:14px;
            display: table;
            border-spacing: 2px;
            border-color: gray;
            width: 100%;
            border-collapse: collapse;
        }
        .report_template .report-table td{
            padding: 10px;
            border: 1px solid #CCC;
            height:40px;
        }
    </style>
    <div class="report_template">
        <div class="title">{{safeData.hospitalName}}</div>
        <div class="title1">眼底检查报告单</div>
        <table style="width:100%;margin-top:20px;font-size:14px;">
            <tr><td><span style="font-weight:600;height:30px;line-height:30px">姓名：</span>{{safeData.patientName}}</td><td><span style="font-weight:600">性别：</span>{{safeData.patientSex}}</td><td><span style="font-weight:600">年龄：</span>{{safeData.patientAge}}</td><td><span style="font-weight:600">手机号：</span>{{safeData.mobilePhone}}</td></tr>
            <tr><td><span style="font-weight:600;height:30px;line-height:30px">患者编号：</span>{{safeData.patientNumber}}</td><td><span style="font-weight:600">就诊日期：</span>{{registeredDate}}</td><td><span style="font-weight:600">科室：</span>{{safeData.registeredDept}}</td><td><span style="font-weight:600">身份证：</span>{{safeData.idCard}}</td></tr>
        </table>
        <table class="report-table">
            <tr style="background-color:#F2F2F2">
                <td style="height:30px;text-align:center;width:50%;">右眼</td>
                <td style="height:30px;text-align:center;">左眼</td>
            </tr>
            <tr>
                <td style="width:50%">
                    <div v-if="safeData.images&&safeData.images.right.length==0">未上传</div>
                    <div v-if="safeData.images&&safeData.images.right.length!=0">
                        <div style="display:inline-block;margin-right:5px;" v-for="image in safeData.images.right" track-by="$index">
                            <img class="viewer-image" style="height:100px;width:auto;" :src="image | upload-image" />
                        </div>
                    </div>
                </td>
                <td>
                    <div v-if="safeData.images&&safeData.images.left.length==0">未上传</div>
                    <div v-if="safeData.images&&safeData.images.left.length!=0">
                        <div style="display:inline-block;margin-right:5px;" v-for="image in safeData.images.left" track-by="$index">
                            <img class="viewer-image" style="height:100px;width:auto;" :src="image | upload-image" />
                        </div>
                    </div>
                </td>
            </tr>
            <tr style="background-color:#F2F2F2"><td colspan="2" style="text-align:center;font-weight:600;">图像所见</td></tr>
            <tr>
                <td style="width:50%">{{{safeData.rightimg}}}</td>
                <td>{{{safeData.leftimg}}}</td>
            </tr>
            <tr style="background-color:#F2F2F2"><td colspan="2" style="text-align:center;font-weight:600;">诊断结论</td></tr>
            <tr>
                <td style="width:50%">{{{safeData.righteye}}}</td>
                <td>{{{safeData.lefteye}}}</td>
            </tr>
            <tr>
                <td style="width:50%"><span style="width:50%;display:inline-block">DR：{{safeData.rightDR}}</span><span>DME：{{safeData.rightDME}}</span></td>
                <td><span style="width:50%;display:inline-block">DR：{{safeData.leftDR}}</span><span>DME：{{safeData.leftDME}}</span></td>
            </tr>
        </table>
        <div style="margin-top:50px;font-size:12px;">
            <p style="border-bottom:1px solid #666;height:30px;line-height:30px;">此报告仅供本院临床医生参考，结论只对本次检查有效。</p>
            <p style="text-align:right;margin-top:5px;"><span style="margin-right:20px;">诊断医生：{{safeData.doctor}}</span><span>报告时间：{{date}}</span></p>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            data: {
                default () {
                    return {
                        // patientName: '张三',
                        // patientSex: '男',
                        // patientAge: '25',
                        // hospitalName: '普洱市普洱市普洱市人民医院',
                        // patientId: '201710180001',
                        // idCard: '123123213eqweqw',
                        // patientUrl: '11',
                        // eyesBottomCheckRightUrl: '44',
                        // eyesBottomCheckLeftUrl: '55'
                    };

                }
            }
        },
        data(){
            return{
                
            }
        },
        computed: {
            safeData(){
                return this.data||{}
            },
            date() {
                return Sunset.Dates.format(this.safeData.date || new Date(), 'yyyy-MM-dd');
            },
            registeredDate(){
                return Sunset.Dates.format(this.safeData.registeredDate || new Date(), 'yyyy-MM-dd');
            },
        },
        methods: {
            showCheckItem(alias) {
                return (this.allCheck & Sunset.Service.Dictionary.alias('SCREENING_EYES_DEPT', alias)) == Sunset.Service
                    .Dictionary.alias('SCREENING_EYES_DEPT', alias);
            }
        }
    }
</script>