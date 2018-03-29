<style lang="sass">

</style>
<template>
	<div class="common_card">
		<div class="card_title"><label>病历附件</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
		<div class="card_content">附件文件：{{safeData.count}}</div>
		<div class="card_footer">医助 : {{safeData.userName}}</div>
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
			}
		},
		methods: {}
	}
</script>