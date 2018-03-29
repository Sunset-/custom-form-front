<style lang="sass">

</style>
<template>
	<div class="common_card orange">
		<div class="card_title"><label>治疗建议</label><span class="card_creat_date">{{card.lastModifyDate | time 'yyyy-MM-dd HH:mm:ss'}}</span></div>
		<div class="card_content">
			<div v-if="safeData.diagnose">诊断：{{safeData.diagnose}}</div>
			<div>治疗建议：{{safeData.haveSuggestion}}</div>
			<div>材料：{{safeData.materialCount||'无'}}</div>
		</div>
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