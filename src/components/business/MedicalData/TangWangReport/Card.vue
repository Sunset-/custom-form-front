<style lang="sass">
	.card-report{
		&>div>p{
			white-space:nowrap;
			overflow:hidden;
			text-overflow:ellipsis;
			&>p{
				display:inline;
			}
		}
	}
</style>
<template>
	<div class="common_card orange">
		<div class="card_title"><label>诊断报告</label><span class="card_creat_date">{{createTime}}</span></div>
		 <div class="card_content">
			<div class="card-report"><div><p>{{{'右眼：'+ (safeData.righteye||"未填写")}}}</p><p>{{{'左眼：'+ (safeData.lefteye||"未填写")}}}</p></div></div>
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
            rightDR(){
                return this.safeData.DRright?Sunset.Service.Dictionary.transcode('DR',this.safeData.DRright):'未填写'
            },
            leftDR(){
                return this.safeData.DRleft?Sunset.Service.Dictionary.transcode('DR',this.safeData.DRleft):'未填写'
            },
            rightDME(){
                return this.safeData.DMEright?Sunset.Service.Dictionary.transcode('DME',this.safeData.DMEright):'未填写'
            },
            leftDME(){
                return this.safeData.DMEleft?Sunset.Service.Dictionary.transcode('DME',this.safeData.DMEleft):'未填写'
            },
		},
		methods: {}
	}
</script>