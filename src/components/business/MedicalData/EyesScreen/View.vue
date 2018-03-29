<style lang="sass">
    .video-card-view {
        font-size: 14px;
        color: #333;
        padding-bottom: 10px;
        &>h3 {
            font-weight: bold;
            padding: 15px 0px;
        }
        &>table {
            width: 100%;
            border-collapse: collapse;
            td {
                padding: 10px;
                border: 1px solid #CCC;
                &.label {
                    background: #F2F2F2;
                    font-weight: bold;
                    width: 100px;
                    padding: 15px 5px;
                    text-align: left;
                }
                &.short-value {}
            }
        }
    }
</style>
<template>
    <div class="video-card-view">
        <h3>眼科筛查 <span> ({{card.lastModifyDate | time 'yyyy/MM/dd HH:mm'}}  {{card.creator.name}}编辑) </span></h3>
        <table class="history-table">
            <tr v-if="chronicDisease">
                <td class="label">慢性疾病史</td>
                <td>{{chronicDisease}}</td>
            </tr>
            <tr v-if="showCheckItem('blood_pressure')&&bloodpressure">
                <td class="label">血压</td>
                <td>{{{bloodpressure}}}</td>
            </tr>
            <tr v-if="showCheckItem('blood_sugar')&&sugar">
                <td class="label">血糖</td>
                <td>{{{sugar}}}</td>
            </tr>
            <tr v-if="showCheckItem('eye_vision')&&vision">
                <td class="label">视力</td>
                <td>{{{vision}}}</td>
            </tr>
            <tr v-if="showCheckItem('eye_pressure')&&pressure">
                <td class="label">眼压</td>
                <td>{{{pressure}}}</td>
            </tr>
            <tr v-if="showCheckItem('eye_light')&&lxd">
                <td class="label">裂隙灯</td>
                <td>{{lxd}}</td>
            </tr>
            <tr v-if="showCheckItem('eye_bottom')&&images">
                <td class="label">眼底照片</td>
                <td>
                    <div v-if="images.length==0">未填写</div>
                    <div v-if="images.length!=0">
                        <div style="display:inline-block;" v-for="image in images">
                            <div :class="['eye-picture-viewitem',image.items.length>1?'multi':'']" v-show="$index==0" v-for="item in image.items">
                                <img class="viewer-image" :group="image.type" :src="item.result.md5 | upload-image" />
                            </div>
                            <p style="text-align:center;">{{image.type}}（{{image.items.length}}张）</p>
                        </div>
                    </div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_bottom')">
                <td class="label">眼底结论</td>
                <td>
                    {{!safeData.eyeBottomResult?'未填写':safeData.eyeBottomResult | enum 'NORMAL_ABNORMAL'}}
                    <p v-if="safeData.eyeBottomResultRemark">
                        结论：{{safeData.eyeBottomResultRemark||''}}
                    </p>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_lid')&&eyelidCheck">
                <td class="label">眼睑检查</td>
                <td>
                    <div v-if="eyelidCheck.length==0">未填写</div>
                    <div v-if="eyelidCheck.length!=0">
                        <checkimage-card v-for="attachment in eyelidCheck" group="eyeslid" :data="attachment"></checkimage-card>
                    </div>
                </td>
            </tr>
            <tr v-if="showCheckItem('eye_lid')&&eyeslidResult">
                <td class="label">眼睑结论</td>
                <td>
                    {{eyeslidResult}}
                </td>
            </tr>
            <tr>
                <td class="label">建议进一步跟踪治疗</td>
                <td>{{safeData.isTarget?'是':'否'}}</td>
            </tr>
        </table>
        <div style="margin-top:20px;overflow:hidden;">
            <div style="font-size:16px;font-weight:bold;">
                医生建议：
            </div>
            <div>
                {{{safeData.suggest?safeData.suggest:'未填写'}}}
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            card: {},
            data: {

            }
        },
        data() {
            return {
            }
        },
        computed: {
            safeData() {
                return this.data || {};
            },
            allCheck() {
                return this.card.visiting.checks && this.card.visiting.checks[0] && this.card.visiting.checks[0].value ||
                    0;
            },
            chronicDisease() {
                var chronicDisease = this.safeData.chronicDisease?this.safeData.chronicDisease.split(','):[];
                return Sunset.Service.Dictionary.getEnums('EYES_SCREEN_HISTORY').filter(item => ~chronicDisease.indexOf(
                    item.key)).map(item => item.value).join(',');
            },
            vision() {
                var vision = this.safeData.vision ? JSON.parse(this.safeData.vision) : {};
                return `<span>右眼</span>&nbsp;(${vision.right=="-1"?"未知":vision.right || '未填写'})，<span>左眼</span>&nbsp;(${vision.left=="-1"?"未知":vision.left || '未填写'})`;
            },
            bloodpressure() {
                var pressure = this.safeData.bloodpressure ? JSON.parse(this.safeData.bloodpressure) : {};
                return `<span>收缩压</span>&nbsp;(${pressure.low?pressure.low + 'mmHg':'未填写'})，<span>舒张压</span>&nbsp;(${pressure.high?pressure.high + 'mmHg':'未填写'})`;
            },
            sugar() {
                var sugar = this.safeData.bloodsugar ? JSON.parse(this.safeData.bloodsugar) : {};
                return `<span>空腹</span>&nbsp;(${sugar.empty?sugar.empty + 'mmol/L':'未填写'})，<span>随机</span>&nbsp;(${sugar.random?sugar.random + 'mmol/L':'未填写'})`;
            },
            pressure() {
                var pressure = this.safeData.eyeballTension ? JSON.parse(this.safeData.eyeballTension) : {};
                return `<span>右眼</span>&nbsp;(${pressure.r1&&pressure.r2?(`${pressure.r2}&nbsp;mmHg(${pressure.r1}&nbsp;kPa)`):'未填写'})，<span>左眼</span>&nbsp;(${pressure.l1&&pressure.l2?(`${pressure.l2}&nbsp;mmHg(${pressure.l1}&nbsp;kPa)`):'未填写'})`;
            },
            lxd() {
                var leftSlitLamp = this.safeData.lxd && JSON.parse(this.safeData.lxd).left || '';
                var rightSlitLamp = this.safeData.lxd && JSON.parse(this.safeData.lxd).right || '';
                var left, right;
                if (leftSlitLamp === "" || leftSlitLamp === void 0) {
                    left = "未填写";
                } else if (leftSlitLamp == '0') {
                    left = '正常';
                } else {
                    left = leftSlitLamp.split(',').sort().map(item => Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',
                        item)).join(
                        ',');
                }
                if (rightSlitLamp === "" || rightSlitLamp === void 0) {
                    right = "未填写";
                } else if (rightSlitLamp == '0') {
                    right = '正常';
                } else {
                    right = rightSlitLamp.split(',').sort().map(item => Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',
                        item)).join(
                        ',')
                }
                return `右眼(${right})，左眼(${left})`;
            },
            images() {
                var osu = {};
                var images = this.safeData.eyeBottom;
                if (images) {
                    images = JSON.parse(images);
                    images.sort((a, b) => {
                        return (a.result.fileName == '右眼' && b.result.fileName == '左眼') ? -1 : ((a.result.fileName ==
                            '左眼' && b.result.fileName == '右眼') ? 1 : 0);
                    });
                    images.forEach(item => {
                        osu[item.result.fileName] = osu[item.result.fileName] || [];
                        osu[item.result.fileName].push(item);
                    })
                }
                var result = Object.keys(osu).map(key => {
                    return {
                        type: key,
                        items: osu[key]
                    };
                }).filter(item => item.items.length);
                return result;
            },
            eyelidCheck() {
                var eyelidCheck = this.safeData.eyelidCheck;
                return eyelidCheck ? JSON.parse(eyelidCheck) : [];
            },
            eyeslidResult() {
                var leftSlitLamp = this.safeData.eyeslidResult && JSON.parse(this.safeData.eyeslidResult).left || '';
                var rightSlitLamp = this.safeData.eyeslidResult && JSON.parse(this.safeData.eyeslidResult).right || '';
                var left, right;
                if (leftSlitLamp === "" || leftSlitLamp === void 0) {
                    left = "未填写";
                } else if (leftSlitLamp == '0') {
                    left = '正常';
                } else {
                    left = leftSlitLamp.split(',').sort().map(item => Sunset.Service.Dictionary.transcode(
                        'EYESLID_CHECK_RESULT',
                        item)).join(
                        ',');
                }
                if (rightSlitLamp === "" || rightSlitLamp === void 0) {
                    right = "未填写";
                } else if (rightSlitLamp == '0') {
                    right = '正常';
                } else {
                    right = rightSlitLamp.split(',').sort().map(item => Sunset.Service.Dictionary.transcode(
                        'EYESLID_CHECK_RESULT',
                        item)).join(
                        ',')
                }
                return `右眼(${right})，左眼(${left})`;
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