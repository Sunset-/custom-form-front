<template>
    <!-- 转诊申请单 -->
    <style>
        .print-template-transferreport {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 20px;
            bottom: 20px;
            color: #333333;
        }

        .print-template-transferreport .title {
            text-align: center;
            font-family: 'Arial Narrow Bold', 'Arial';
            font-weight: 700;
            font-style: normal;
            font-size: 26px;
        }

        .print-template-transferreport .sub-title {
            text-align: center;
            font-size: 18px;
            font-family: 'Arial Normal', 'Arial';
            font-weight: 400;
            font-style: normal;
            margin-top: 15px;
        }

        .print-template-transferreport .short-infos {
            padding: 10px 20px 5px 20px;
            font-size: 14px;
            margin-bottom:0px;
        }

        .print-template-transferreport .short-infos li {
            display: inline-block;
            min-width: 180px;
            padding: 10px 0px;
        }

        .print-template-transferreport .short-infos li label {
            display: inline-block;
            min-width: 50px;
        }
        .part1{
            height:420px;
            width:100%;
            overflow:hidden;
            margin-bottom:30px;
        }
        table{
            width:100%;
            border:1px solid #ccc;
            border-collapse: collapse;
        }
        tr{
            height:40px;
        }
        td{
            min-width:25%;
            text-align:center;
            border:1px solid #ccc;
        }
        td.label{
            text-align:center;
            width:80px;
        }
        .devide_line{
            width:100%;
            border:1px dashed #666;
            margin-bottom: 20px;
        }
    </style>
    <div class="print-template-transferreport">
        <div class="part1">
             <div class="title">{{data.hospital}}{{data.subTitle1}}</div> 
            <ul class="short-infos">
                <li v-for="label in labels">
                    <label>{{label.label}}</label>
                    <span>{{label.value}}</span>
                </li>
            </ul>
            <table>
                <tr>
                    <td class="label">患者姓名</td>
                    <td>{{patient.name}}</td>
                    <td class="label">性别</td>
                    <td>{{patientSex}}</td>
                    <td class="label">年龄</td>
                    <td>{{patientAge}}</td>
                    <td class="label">联系电话</td>
                    <td>{{patient.mobilePhone}}</td>
                </tr>
                <tr>
                    <td class="label">身份证号</td>
                    <td colspan="3" >{{patient.idCard}}</td>
                    <td class="label">费别</td>
                    <td colspan="3" >{{socialCard}}</td>
                </tr>
                <tr>
                    <td class="label">家属姓名</td>
                    <td colspan="3" ></td>
                    <td class="label">联系电话</td>
                    <td colspan="3" ></td>
                </tr>
                <tr>
                    <td class="label">转往机构</td>
                    <td colspan="7" style="text-align:left;padding-left:20px;">{{organization&&organization[0]}} {{organization&&organization[1]}}</td>
                </tr>
                <tr>
                    <td colspan="8" style="border-bottom:none">原因及目的</td>
                </tr>
                <tr>
                    <td colspan="8" style="height:100px;">{{transferreason}}</td>
                </tr>
                <tr style="border-top:none">
                    <td style="border:none">转诊医生签字</td>
                    <td colspan="3" style="border:none"></td>
                    <td class="label" style="border:none">打印日期</td>
                    <td colspan="3" style="border:none"> {{printDate}}</td>
                </tr>
            </table>
        </div>
        <div class="devide_line"></div>
        <div class="part2">
            <div class="title">{{data.hospital}}{{data.subTitle2}}</div>
            <ul class="short-infos">
                <li v-for="label in labels">
                    <label>{{label.label}}</label>
                    <span>{{label.value}}</span>
                </li>
            </ul>
            <table>
                <tr>
                    <td class="label">患者姓名</td>
                    <td>{{patient.name}}</td>
                    <td class="label">性别</td>
                    <td>{{patientSex}}</td>
                    <td class="label">年龄</td>
                    <td >{{patientAge}}</td>
                    <td class="label">联系电话</td>
                    <td>{{patient.mobilePhone}}</td>
                </tr>
                <tr>
                    <td class="label">身份证号</td>
                    <td colspan="3" >{{patient.idCard}}</td>
                    <td class="label">费别</td>
                    <td colspan="3" >{{socialCard}}</td>
                </tr>
                <tr>
                    <td class="label">转出医院（等级）</td>
                    <td colspan="3">{{organization&&organization[0]}}</td>
                    <td class="label">诊治科室</td>
                    <td colspan="3">{{organization&&organization[1]}}</td>
                </tr>
                <tr>
                    <td class="label">初步诊断</td>
                    <td colspan="7" style="text-align:left;padding-left:20px;">{{items.diagnose}}</td>
                </tr>
                <tr>
                    <td class="label">拟转入医院</td>
                    <td colspan="7" style="text-align:left;padding-left:20px;">{{organization&&organization[0]}} {{organization&&organization[1]}}</td>
                </tr>
                <tr>
                    <td colspan="8">原因及目的</td>
                </tr>
                <tr>
                    <td colspan="8" style="height:100px;">{{transferreason}}</td>
                </tr>
                <tr>
                    <td style="border:none;height:80px;">主治医师签字</td>
                    <td colspan="1" style="border:none;height:80px;"></td>
                    <td class="label" style="border:none;height:80px;">打印日期</td>
                    <td colspan="3" style="border:none;height:80px;"> {{printDate}}</td>
                    <td style="height:80px;">医院（盖章）</td>
                    <td style="height:80px;"></td>
                </tr>
                 <!-- <tr>
                    <td class="label" style="border:none">转诊注意事项</td>
                    <td colspan="3" style="border:none">{{data.extension&&data.extension.notes}}</td>
                </tr>
                <tr style="height:70px;"></tr>
                <tr>
                    <td class="label" style="border:none">转诊时限 </td>
                    <td colspan="3" style="border:none">{{transferdate[0]}} 至 {{transferdate[1]}}</td>
                </tr> 
                 <tr>
                    <td class="label">主管医生</td>
                    <td>{{items.maindoctor}}</td>
                    <td></td>
                    <td class="label">联系电话 {{items.doctortel}}</td>
                </tr>
                <tr>
                    <td class="label">转诊机构名称</td>
                    <td  colspan="2">{{currentHospital}}</td>
                    <td class="label">联系电话</td>
                </tr>
                <tr>
                    <td class="label">患者签字</td>
                    <td></td>
                    <td class="label">转诊医生、审复核人签名</td>
                    <td></td>
                </tr>  -->
            </table>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            data: {
                default () {
                    return {};
                }
            }
        },
        computed: {
            patient() {
                return this.data.patient || {};
            },
            items() {
                return this.data.items || {};
            },
            organization(){
                return this.data.target&&this.data.target.split("-");
            },
            printDate(){
                return Sunset.Dates.format(new Date().getTime(),'yyyy-MM-dd HH:mm')
            },
            currentHospital(){
                return GlobalService.getCurrentUserSync().relation.hospital[0].name
            },
            transferreason(){
                return Sunset.Service.Dictionary.transcode('REFERRAL_FLOW_CAUSE',this.items.transferreason);
            },
            transferdate(){
                if(this.data.items){
                    return this.data.items.transferdate?this.data.items.transferdate.map(v=>{
                        return Sunset.Dates.format(new Date(v).getTime(),'yyyy-MM-dd')
                    }):[]
                }else{
                    return []
                }
            },
            patientAge(){
                return this.patient.patientAge?this.patient.patientAge.replace(',',''):''
            },
            patientSex(){
                return Sunset.Service.Dictionary.transcode('SEX',this.patient.sex)
            },
            socialCard(){
                return Sunset.Service.Dictionary.transcode('MEDICARE',this.patient.socialCard)
            }
        }
    }
</script>