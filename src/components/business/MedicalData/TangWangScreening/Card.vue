<style lang="sass">

</style>
<template>
	<div class="common_card">
		<div class="card_title"><label>患者资料</label><span class="card_creat_date">{{createTime}}</span></div>
		 <div class="card_content">
			<div>检查图片：{{safeData.pictures}}</div>
			<div>报告文件：{{safeData.attachment}}</div>
		</div> 
		 <div class="card_footer">{{safeData.userName}}</div> 
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
		ready(){
		},
		computed: {
			safeData() {
				return this.data || {};
			},
            createTime(){
				if(this.card.createDate){
					return Sunset.Dates.format(this.card.createDate,'yyyy-MM-dd HH:mm');
				}
			},
			bloodPressure() {
				if (this.data) {
					return this.data.bloodPressure ? {
						low: this.data.bloodPressure.split(',')[0] ? this.data.bloodPressure.split(',')[0] + 'mmHg /' : '未填写',
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
				var enums = Sunset.Service.Dictionary.getEnums('EYES_SCREEN_LXD');
				if (leftSlitLamp == '0') {
					left = '正常';
				} else if (leftSlitLamp == '') {
					left = '未填写';
				} else {
					left = enums.filter(item => ((+item.key) & (+leftSlitLamp)) == item.key).map(item => item.value).join(',');
				}
				if (rightSlitLamp == '0') {
					right = '正常';
				} else if (rightSlitLamp == '') {
					right = '未填写';
				} else {
					right = enums.filter(item => ((+item.key) & (+rightSlitLamp)) == item.key).map(item => item.value).join(',')
				}
				return `右眼（${right}）, 左眼（${left}）`;
			},
			rightSlitLamp() {

			}
		},
		methods: {}
	}
</script>