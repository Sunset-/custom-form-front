<template>
    <!-- 处方 -->
    <style>
        .print-template-prescription {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 20px;
            bottom: 20px;
            color: #333333;
        }

        .print-template-prescription .title {
            text-align: center;
            font-family: 'Arial Narrow Bold', 'Arial';
            font-weight: 700;
            font-style: normal;
            font-size: 28px;
        }

        .print-template-prescription .sub-title {
            text-align: center;
            font-size: 18px;
            font-family: 'Arial Normal', 'Arial';
            font-weight: 400;
            font-style: normal;
            margin-top: 15px;
        }

        .print-template-prescription .prescription-tag {
            position: absolute;
            right: 10px;
            top: 0px;
            padding: 10px 15px;
            border: 1px solid #777;
        }

        .print-template-prescription .short-infos {
            padding: 10px 20px 5px 20px;
            font-size: 14px;
            border-bottom: 1px solid #666;
            margin-bottom: 0px;
        }

        .print-template-prescription .short-infos li {
            display: inline-block;
            min-width: 180px;
            padding: 10px 10px;
        }

        .print-template-prescription .short-infos li label {
            display: inline-block;
            min-width: 60px;
        }

        .print-template-prescription .clinical-diagnose {
            padding: 20px 20px;
            border-bottom: 2px solid #444;
        }

        .print-template-prescription .clinical-diagnose label {
            display: inline-block;
            padding-right: 30px;
        }


        .print-template-prescription .prescriptions {
            padding: 15px 20px 15px 20px;
            font-size: 14px;
        }

        .print-template-prescription .prescriptions table {
            display: block;
            padding: 5px 0px;
            margin-left: 20px;
            margin-bottom: 5px;
        }

        .print-template-prescription .prescriptions table.group-prescriptions {
            border-left: 2px solid #666;
        }

        .print-template-prescription .prescriptions table td {
            vertical-align: top;
        }

        .print-template-prescription .prescriptions table td.drug-name {
            width: 200px;
            text-align: center;
            padding-top: 10px;
            padding-right: 15px;
            padding-left: 10px;
        }

        .print-template-prescription .prescriptions table span {
            display: inline-block;
            padding: 10px 20px 5px 0px;
        }

        .print-template-prescription .other-remark {
            font-size: 14px;
            padding: 5px 20px;
        }

        .print-template-prescription .other-remark>div {
            padding-top: 15px;
            padding-left: 20px;
        }

        .print-template-prescription .end-line {
            position: relative;
            width: 100%;
            text-align: center;
        }

        .print-template-prescription .end-line:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0px;
            z-index: 0;
            width: 100%;
            border-top: 1px solid #777;
        }

        .print-template-prescription .end-line span {
            position: relative;
            z-index: 1;
            padding: 0px 5px;
            display: inline-block;
            background: white;
        }

        .print-template-prescription .footer {
            position: absolute;
            bottom: 0px;
            width: 100%;
            font-size: 0px;
            margin-top: 5px;
            padding-top: 5px;
        }
    </style>
    <div class="print-template-prescription">
        <div class="title">{{data.hospital}}</div>
        <div class="sub-title">{{data.subTitle}}</div>
        <div class="prescription-tag">{{data.tag}}</div>
        <ul class="short-infos">
            <li v-for="label in labels">
                <label>{{label.label}}</label>
                <span>{{label.value}}</span>
            </li>
        </ul>
        <div class="clinical-diagnose" style="font-size: 14px;">
            <label style="font-size: 14px;">临床诊断</label>{{data.clinicalDiagnose}}
        </div>
        <div class="prescriptions">
            <span style="padding-bottom:10px;display:block;font-size:16px;">RP</span>
            <table :class="[pgroup.length>1?'group-prescriptions':'']" v-for="pgroup in groups">
                <tr v-for="drug in pgroup">
                    <td class="drug-name" style="font-size:14px;">{{drug.name}}</td>
                    <td>
                        <div v-for="infos in drug.infos">
                            <span v-for="info in infos" style="font-size:14px;">{{info}}</span>
                        </div>
                    </td>
                </tr>
            </table>
            <p v-for="item in items" track-by="$index">
                <label>{{item.label}}</label>
                <span>{{item.value}}</span>
            </p>
        </div>
        <div class="other-remark">
            其他说明
            <div>{{data.otherRemark}}</div>
        </div>
        <div class="end-line">
            <span>处方完毕，以下为空</span>
        </div>
        <div class="footer">
            <div style="font-size:14px;overflow:hidden;padding:5px 0px;">
                <div style="display:inline-block;width:200px;">
                    审核
                </div>
                <div style="display:inline-block;">
                    发药
                </div>
                <div style="display:inline-block;min-width:180px;float:right;">开单医生&nbsp;&nbsp;{{data.diagnoseDoctor}}</div>
            </div>
            <div style="border-top: 1px solid #666;font-size:14px;padding:5px 0px;">
                <div style="display:inline-block;">此处方有效期为三天，请遵医嘱服药</div>
                <div style="display:inline-block;min-width:180px;float:right;">开单日期&nbsp;&nbsp;{{data.createDate}}</div>
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
                        hospital: '南昌市人民医院',
                        subTitle: '检查申请单',
                        labels: [{
                            label: '编号',
                            value: 'P20165985'
                        }, {
                            label: '姓名',
                            value: '张三'
                        }, {
                            label: '性别',
                            value: '男'
                        }, {
                            label: '年龄',
                            value: '25岁'
                        }, {
                            label: '病人类型',
                            value: '门诊'
                        }, {
                            label: '科室',
                            value: '口腔科'
                        }, {
                            label: '检查日期',
                            value: '2017-5-15'
                        }],
                        groups: [
                            [{
                                name: '阿莫西林',
                                infos: [
                                    ['1盒', '30人份/盒1人份/袋30袋/盒'],
                                    ['口服', '1日1次', '1粒']
                                ]
                            }, {
                                name: '头孢',
                                infos: [
                                    ['1盒', '50ml：盐酸曲马多0.1g与氯化钠0.45g'],
                                    ['口服', '1日1次', '2粒']
                                ]
                            }],
                            [{
                                name: '双黄连',
                                infos: [
                                    ['1盒', '50ml：盐酸曲马多0.1g与氯化钠0.45g'],
                                    ['口服', '1日1次', '2粒']
                                ]
                            }]
                        ]
                    };
                }
            }
        },
        computed: {
            labels() {
                return this.data.labels || [];
            },
            groups() {
                return this.data.groups || [];
            }
        }
    }
</script>