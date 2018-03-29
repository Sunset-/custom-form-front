<style lang="sass">

</style>
<template>
	<div class="common_card orange">
		<div class="card_title"><label>快速回复</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
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
			}
		},
		methods: {}
	}
</script>