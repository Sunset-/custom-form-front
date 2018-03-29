<style lang="sass">

</style>
<template>
	<div class="common_card">
		<div class="card_title"><label>眼科筛查</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
		<div class="card_content">
			<div v-if="safeData.diagnose">诊断：{{safeData.diagnose}}</div>
			<div>血压：{{bloodPressure.low||"未填写"}}&nbsp;{{bloodPressure.high||"未填写"}}</div>
			<div>血糖：空腹 {{bloodGlucose.empty||"未填写"}}&nbsp;,&nbsp;随机 {{bloodGlucose.random||"未填写"}}</div>
			<div>视力：右眼 {{safeData.rightVision||"未填写"}}&nbsp;,&nbsp;左眼 {{safeData.leftVision||"未填写"}}</div>
			<div>眼压：右眼 {{safeData.rightPressure||"未填写" }}<br>左眼 {{safeData.leftPressure||"未填写"}}</div>
			<div>裂隙灯：{{lxd}}</div>
			<div>眼睑照片：{{safeData.eyeLidFileCount||'未填写'}}</div>
			<div>眼底照片：{{safeData.eyeGroundFileCount||'未填写'}}</div>
		</div>
		<!-- <div class="card_footer">医助 : {{safeData.userName}}</div> -->
	</div>
</template>
<script>
	export default {
		props: {
			card: {

			},
			data: {

			},
			config: {

			},
			active: {

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
			bloodPressure() {
				if (this.data) {
					return this.data.bloodPressure ? {
						low: this.data.bloodPressure.split(',')[0] ? this.data.bloodPressure.split(',')[0] + 'mmHg ,' : '未填写',
						high: this.data.bloodPressure.split(',')[1] ? this.data.bloodPressure.split(',')[1] + 'mmHg' : '未填写'
					} : '未填写'
				} else {
					return {
						low: '未填写',
						high: ''
					}
				}
			},
			bloodGlucose() {
				if (this.data) {
					return this.data.bloodGlucose ? {
						empty: this.data.bloodGlucose.split(',')[0] ? this.data.bloodGlucose.split(',')[0] + 'mmol/L' : '未填写',
						random: this.data.bloodGlucose.split(',')[1] ? this.data.bloodGlucose.split(',')[1] + 'mmol/L' : '未填写'
					} : '未填写'
				} else {
					return {
						empty: '未填写',
						random: '未填写'
					}
				}
			},
			lxd() {
				var leftSlitLamp = this.safeData.leftSlitLamp;
				var rightSlitLamp = this.safeData.rightSlitLamp;
				var left, right;
				if (leftSlitLamp == '0') {
					left = '正常';
				} else if (leftSlitLamp == ''||leftSlitLamp==undefined) {
					left = '未填写';
				} else {
					if(Sunset.isArray(leftSlitLamp)){
						left=leftSlitLamp.sort().map(item => Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',
                        item)).join(',');
					}else{
						left=Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',
                        leftSlitLamp);
					}
				}
				if (rightSlitLamp == '0') {
					right = '正常';
				} else if (rightSlitLamp == ''||rightSlitLamp==undefined) {
					right = '未填写';
				} else {
					if(Sunset.isArray(rightSlitLamp)){
						right = rightSlitLamp.sort().map(item => Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',
							item)).join(',')
					}else{
						right = Sunset.Service.Dictionary.transcode('EYES_SCREEN_LXD',
							rightSlitLamp);
					}
				}
				return `右眼（${right}）, 左眼（${left}）`;
			},
			rightSlitLamp() {

			}
		},
		methods: {}
	}
</script>