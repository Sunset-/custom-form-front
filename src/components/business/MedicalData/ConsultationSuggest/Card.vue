<style lang="sass">

</style>
<template>
	<div class="common_card orange">
		<div class="card_title"><label>会诊诉求</label></div>
		<div class="card_footer">专家 : {{safeData.userName}}</div>
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