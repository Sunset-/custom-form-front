<template>
    <!-- 检查申请单 -->
    <style>
        body {
            -webkit-print-color-adjust: exact;
        }

        .print-template-eyesscreenform {
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            color: #333;
        }

        .print-template-eyesscreenform .footer {
            position: absolute;
            right: 20px;
            bottom: 20px;
        }

        .print-template-eyesscreenform .title-qrcode {
            display: inline-block;
            vertical-align: top;
            float: left;
            margin: 5px;
        }

        .print-template-eyesscreenform .title-wrap {
            display: inline-block;
            vertical-align: top;
            text-align: center;
            padding-top: 25px;
            margin-left: -20px;
        }

        .print-template-eyesscreenform .title-qrcode img {
            display: block;
            width: 100px;
            height: 100px;
            margin: 0px auto;
        }

        .print-template-eyesscreenform .title-qrcode span {
            font-size: 14px;
        }

        .print-template-eyesscreenform .title {
            font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
            font-weight: 700;
            font-style: normal;
            font-size: 26px;
            text-align: center;
            position: relative;
            left: -50px;
        }

        .print-template-eyesscreenform .patient-info {
            font-size: 0px;
            padding: 5px 30px;
        }

        .print-template-eyesscreenform .patient-info>div {
            display: inline-block;
            font-size: 16px;
            width: 33%;
            padding-left: 25px;
            box-sizing: border-box;
        }

        .print-template-eyesscreenform .check-info {
            border-collapse: collapse;
            width: 95%;
            margin: 0px auto;
            border: 1px solid #444;
        }

        .print-template-eyesscreenform .check-info .group {
            font-size: 18px;
            color: #444;
            text-align: center;
            background: #E4E4E4 !important;
            border-top: 1px solid #444;
            border-bottom: 1px solid #444;
        }

        .print-template-eyesscreenform .check-info>div {
            border-bottom: 1px solid #444;
        }

        .print-template-eyesscreenform .check-info>div:last-child {
            border-bottom: none;
        }

        .print-template-eyesscreenform .check-info .checkbox {
            display: inline-block;
            margin-right: 50px;
            margin-bottom: 10px;
        }

        .print-template-eyesscreenform .check-info .checkbox>i {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 1px solid #444;
            vertical-align: middle;
        }

        .print-template-eyesscreenform .check-info .checkbox>span {
            display: inline-block;
            vertical-align: middle;
        }

        .print-template-eyesscreenform .yandi-qrcode {
            position: relative;
            width: 130px;
            border: 1px dashed #444;
            padding-top: 10px;
            display: inline-block;
        }

        .print-template-eyesscreenform .yandi-qrcode img {
            width: 100px;
            height: 100px;
        }

        .print-template-eyesscreenform .yandi-qrcode>div {
            text-align: center;
            font-size: 14px;
            margin-top: -5px;
        }

        .print-template-eyesscreenform .yandi-qrcode>label {
            position: absolute;
            font-size: 14px;
            background: #FFF;
            top: -10px;
            left: 15px;
        }
    </style>
    <div class="print-template-eyesscreenform">
        <div style="text-align:center;overflow:hidden;">
            <div class="title-qrcode">
                <img :src="data.patientUrl | qrcode" />
                <span>ID:{{data.patientId||''}}</span>
            </div>
            <div class="title-wrap">
                <div class="title">{{data.hospitalName||''}}</div>
                <div class="title" style="font-size:18px;">眼科筛查表</div>
            </div>
        </div>
        <div class="patient-info">
            <div>
                <label>姓名：</label>
                <span>{{data.patientName||''}}</span>
            </div>
            <div>
                <label>性别：</label>
                <span>{{data.patientSex||''}}</span>
            </div>
            <div>
                <label>年龄：</label>
                <span>{{data.patientAge||''}}</span>
            </div>
        </div>
        <table class="check-info">
            <tr>
                <td class="group" colspan="2">
                    慢性疾病史
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding:10px 10px 0px 60px;">
                    <div class="checkbox">
                        <i></i>
                        <span style="font-size:14px;">无</span>
                    </div>
                    <div class="checkbox" v-for="item in history">
                        <i></i>
                        <span style="font-size:14px;">{{item}}</span>
                    </div>
                </td>
            </tr>
            <tr v-if="showCheckItem('blood_pressure')||showCheckItem('blood_sugar')">
                <td class="group" colspan="2">
                    {{bloodPressureSugarTitle}}
                </td>
            </tr>
            <tr v-if="showCheckItem('blood_pressure')||showCheckItem('blood_sugar')">
                <td v-if="showCheckItem('blood_pressure')" :colspan="showCheckItem('blood_sugar')?1:2" style="border-right:1px solid #444;">
                    <div style="display:inline-block;font-size:14px;width:80px;border-right:1px solid #444;text-align:center;padding:10px 0px;">血压</div>
                </td>
                <td v-if="showCheckItem('blood_sugar')" :colspan="showCheckItem('blood_pressure')?1:2">
                    <div style="display:inline-block;font-size:14px;width:80px;border-right:1px solid #444;text-align:center;padding:10px 0px;">血糖</div>
                    <span style="display:inline-block;padding-right:80px;font-size:14px;">空腹</span>
                    <span style="display:inline-block;font-size:14px;">随机</span>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_vision')">
                <td class="group" colspan="2">
                    视力
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_vision')">
                <td style="border-right:1px solid #444;">
                    <div style="display:inline-block;font-size:14px;width:80px;border-right:1px solid #444;text-align:center;padding:10px 0px;">右眼</div>
                </td>
                <td>
                    <div style="display:inline-block;font-size:14px;width:80px;border-right:1px solid #444;text-align:center;padding:10px 0px;">左眼</div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_pressure')">
                <td class="group" colspan="2">
                    <div style="position:relative;">
                        眼压<span style="font-size:12px;position:absolute;top:8px;right:50px;">正常值：(10～21)mmHg/1.33～2.80)kPa </span>
                    </div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_pressure')">
                <td style="border-right:1px solid #444;">
                    <div style="display:inline-block;font-size:14px;width:80px;border-right:1px solid #444;text-align:center;padding:10px 0px;">右眼</div>
                    <div style="display:inline-block;font-size:14px;width:33%;text-align:center;padding:10px 0px;text-align:right;padding-left:70px;">mmHg&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;kPa&nbsp;)</div>
                </td>
                <td>
                    <div style="display:inline-block;font-size:14px;width:80px;border-right:1px solid #444;text-align:center;padding:10px 0px;">左眼</div>
                    <div style="display:inline-block;font-size:14px;width:33%;text-align:center;padding:10px 0px;text-align:right;padding-left:70px;">mmHg&nbsp;(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;kPa&nbsp;)</div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_light')">
                <td class="group" colspan="2">
                    裂隙灯
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_light')">
                <td style="border-right:1px solid #444;padding:10px 0px;font-size:14px;text-align:center;border-bottom:1px solid #444;">
                    右眼
                </td>
                <td style="padding:10px 0px;text-align:center;border-bottom:1px solid #444;font-size:14px;">
                    左眼
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_light')">
                <td style="border-right:1px solid #444;padding:10px 0px;text-align:left;font-size:0px;">
                    <div v-for="item in lxds" style="display:inline-block;margin-right:0px;padding-left:30px;width:50%;font-size:14px;box-sizing:border-box;"
                        class="checkbox">
                        <i></i>
                        <span>{{item}}</span>
                    </div>
                </td>
                <td style="padding:10px 0px;text-align:left;font-size:0px;">
                    <div v-for="item in lxds" style="display:inline-block;margin-right:0px;padding-left:30px;width:50%;font-size:14px;box-sizing:border-box;"
                        class="checkbox">
                        <i></i>
                        <span>{{item}}</span>
                    </div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_bottom')">
                <td class="group" colspan="2">
                    眼底
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_bottom')">
                <td style="padding:10px 0px;text-align:center;border-bottom:1px solid #444;">
                    <div style="display:inline-block;width:50%;padding:10px 30px 0px 30px;text-align:center;">
                        <div class="yandi-qrcode">
                            <label>请拍摄此二维码</label>
                            <img :src="data.eyesBottomCheckRightUrl | qrcode" />
                            <div>{{data.patientName||''}} {{idCard}}</div>
                        </div>
                        <div>右眼</div>
                    </div>
                </td>
                <td style="padding:10px 0px;text-align:center;border-bottom:1px solid #444;">
                    <div style="display:inline-block;width:50%;padding:10px 30px 0px 30px;text-align:center;">
                        <div class="yandi-qrcode">
                            <label>请拍摄此二维码</label>
                            <img :src="data.eyesBottomCheckLeftUrl | qrcode" />
                            <div>{{data.patientName||''}} {{idCard}}</div>
                        </div>
                        <div>左眼</div>
                    </div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_lid')">
                <td class="group" colspan="2">
                    眼睑
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_lid')">
                <td colspan="2" style="border-right:1px solid #444;padding:10px 0px;border-bottom:1px solid #444;text-align:left;">
                    <div style="display:inline-block;font-size:14px;box-sizing:border-box;margin-left:50px;" class="checkbox">
                        <i></i>
                        <span>正常</span>
                    </div>
                    <div style="display:inline-block;font-size:14px;box-sizing:border-box;margin-left:30px;" class="checkbox">
                        <i></i>
                        <span>异常</span>
                        <span style="display:inline-block;border-bottom:1px solid #444;width:350px;margin-left:20px;position:relative;top:15px;"></span>
                    </div>
                </td>
            </tr>
        </table>
        <div class="footer">
            检查日期：{{date}}
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
        computed: {
            allCheck() {
                return this.data.checks && this.data.checks[0] && this.data.checks[0].value || 0;
            },
            history() {
                return Sunset.Service.Dictionary.getEnums('EYES_SCREEN_HISTORY').map(item => item.value);
            },
            lxds() {
                return ['正常'].concat(Sunset.Service.Dictionary.getEnums('EYES_SCREEN_LXD').map(item => item.value));
            },
            date() {
                return Sunset.Dates.format(this.data.date || new Date(), 'yyyy年 MM月 dd日');
            },
            idCard() {
                var card = this.data.idCard;
                return card && card.substr(-4, 4) || '';
            },
            bloodPressureSugarTitle() {
                var title = [];
                if (this.showCheckItem('blood_pressure')) {
                    title.push('血压');
                }
                if (this.showCheckItem('blood_sugar')) {
                    title.push('血糖');
                }
                return title.join(' / ');
            }
        },
        methods: {
            showCheckItem(alias) {
                return (this.allCheck & Sunset.Service.Dictionary.alias('SCREENING_EYES_DEPT', alias)) == Sunset.Service
                    .Dictionary.alias('SCREENING_EYES_DEPT', alias);
            }
        }
    }
</script>