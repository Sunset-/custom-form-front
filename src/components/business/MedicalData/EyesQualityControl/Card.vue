<style lang="sass">

</style>
<template>
	<div class="common_card danger">
		<div class="card_title"><label>质量反馈</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
		<div class="card_content">
			<div v-if="dataIntegrity">资料完整性：{{dataIntegrity}}</div>
			<div v-if="image">眼底像缺陷：{{image}}</div>
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
			dataIntegrity(){
				return this.safeData.dataIntegrity.split(',').map(item=>Sunset.Service.Dictionary.transcode('TAND_FLOW_SENDBACK_DATAINTEGRITY',item)).join(',')||'';
			},
			image(){
				return this.safeData.image&&this.safeData.image.split(',').map(item=>Sunset.Service.Dictionary.transcode('TANG_FLOW_SENDBACK_IMAGEQUALITY',item)).join(',')||'';
			}
		},
		methods: {}
	}
</script>