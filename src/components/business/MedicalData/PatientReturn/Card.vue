<style lang="sass">

</style>
<template>
	<div class="common_card orange">
		<div class="card_title"><label>患者沟通记录</label></div>
		<div class="card_footer">回访日期 : {{safeData.date | time "yyyy-MM-dd HH:mm" }}</div>
		<div class="card_footer">沟通方式 : {{safeData.contact | enum 'CONTACT_WAY'}}</div>
		<div class="card_footer">信息记录 : {{safeData.notes}}</div>
		<div class="card_footer">{{safeData.expert}}</div>
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