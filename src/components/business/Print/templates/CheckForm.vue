<template>
    <!-- 检查申请单 -->
    <style>
        .print-template-checkform {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 20px;
            bottom: 20px;
            color: #333333;
        }

        .print-template-checkform .title {
            text-align: center;
            font-family: 'Arial Narrow Bold', 'Arial';
            font-weight: 700;
            font-style: normal;
            font-size: 28px;
        }

        .print-template-checkform .sub-title {
            text-align: center;
            font-size: 18px;
            font-family: 'Arial Normal', 'Arial';
            font-weight: 400;
            font-style: normal;
            margin-top: 15px;
        }

        .print-template-checkform .short-infos {
            padding: 10px 20px 5px 20px;
            font-size: 14px;
            border-bottom: 1px solid #666;
            margin-bottom:0px;
        }

        .print-template-checkform .short-infos li {
            display: inline-block;
            min-width: 180px;
            padding: 10px 0px;
        }

        .print-template-checkform .short-infos li label {
            display: inline-block;
            min-width: 50px;
        }

        
        .print-template-checkform .main-suit {
            padding: 20px 20px;
        }

        .print-template-checkform .main-suit label {
            display: inline-block;
            margin-right: 10px;
            min-width: 70px;
        }

        .print-template-checkform .first-diagnose {
            padding: 0px 20px;
        }

        .print-template-checkform .first-diagnose label {
            display: inline-block;
            margin-right: 10px;
            min-width: 70px;
        }

        .print-template-checkform .long-infos {
            padding: 10px 20px 0px 20px;
        }

        .print-template-checkform .long-infos p {
            display: block;
            padding: 2px 0px;
        }

        .print-template-checkform .long-infos p label {
            display: inline-block;
            min-width: 70px;
        }

        .print-template-checkform .long-infos p label:after {
            content: '';
        }

        .print-template-checkform .footer {
            position: absolute;
            bottom: 0px;
            width: 100%;
        }

        .print-template-checkform .footer label {
            display: inline-block;
            text-align: left;
            min-width: 70px;
        }

        .print-template-checkform .footer>div:first-child {
            text-align: right;
        }

        .print-template-checkform .footer>div:last-child {
            border-top: 1px solid #666;
            margin-top: 5px;
            padding-top: 5px;
        }
        .print-template-checkform .footer>div:last-child .apply_date{
            margin-left: 50px;
        }
        .print-template-checkform .footer>div:last-child div {
            float: right;
        }
    </style>
    <div class="print-template-checkform">
        <div class="title">{{data.hospital}}</div>
        <div class="sub-title">{{data.subTitle}}</div>
        <ul class="short-infos">
            <li v-for="label in labels">
                <label>{{label.label}}</label>
                <span>{{label.value}}</span>
            </li>
        </ul>
        <div class="main-suit">
            <label>主诉</label>{{data.mainSuit}}
        </div>
        <div class="first-diagnose">
            <label>初步诊断</label>{{data.firstDiagnose}}
        </div>
        <div class="long-infos-wrap">
            <div class="long-infos" v-for="item in items" track-by="$index">
                <p v-for="it in item" track-by="$index">
                    <label>{{it.label}}</label>
                    <span>{{it.value}}</span>
                </p>
            </div>
        </div>
        <div class="footer">
            <div></div>
            <div>
                
                <div><label class="apply_doctor">申请医生</label><span>{{data.diagnoseDoctor}}</span>&nbsp;&nbsp;<label class="apply_date">申请时间</label><span>{{data.applyTime}}</span></div>
            </div>
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
            labels() {
                return this.data.labels || [];
            },
            items() {
                return this.data.items || [];
            }
        }
    }
</script>