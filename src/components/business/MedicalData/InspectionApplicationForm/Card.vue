<style lang="sass">
</style>
<template>
	<div class="common_card orange">
		<div class="card_title">
			<label>化验申请单</label>
			<span class="card_creat_date">{{createTime}}</span>
		</div>
		<div class="card_content"><span v-for="item in cardMethod" track-by="$index">{{item}}; </span></div>
		<div class="card_footer">专家 :{{doctorName}}</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			currentDoctor: GlobalService.getCurrentUserSync().user.name
		}
	},
	props: {
		data: {

		},
		config: {

		},
		active: {

		},
		card:{

		}
	},
	computed:{
		doctorName(){
			return this.data?this.data.doctor:this.currentDoctor
		},
		cardMethod(){
			return this.data ? this.data.method:''
		},
		createTime(){
			if(this.card.createDate){
				return Sunset.Dates.format(this.card.createDate,'yyyy-MM-dd HH:mm');
			}
		}  
	}
}
</script>
