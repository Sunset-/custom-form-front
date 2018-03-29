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
			<div class="card-report"><div><p>{{{'影像提示 :'+ (safeData.imagingTips||"未填写")}}}</p><p>{{{'报告标签 :'+ positiveNegative}}}</p></div></div>
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

			},
		},
		data() {
			return {

			}
		},
		computed: {
			safeData() {
				// debugger;
				// console.log("safeData111");
				// console.log(this.data);
				// this.data.createTime = Sunset.Dates.format(this.card.createDate,'yyyy-MM-dd HH:mm');
				return this.data || {};
			},
            createTime(){
				if(this.card.createDate){
					// debugger;
					return Sunset.Dates.format(this.card.createDate,'yyyy-MM-dd HH:mm');
				}
			},
  
			imageMark(){
                return Sunset.Service.Dictionary.transcode('DR',this.safeData.imageMark)
			},
			imagingFinding(){
                return Sunset.Service.Dictionary.transcode('DME',this.safeData.imagingFinding)
			},
			positiveNegative(){
				// debugger
				var type="";
				// this.safeData.positiveNegative=2?type="阳性":this.safeData.positiveNegative=1?type="阴性":type=" ";
				if(this.safeData.positiveNegative=="2"){type="阳性"};if(this.safeData.positiveNegative=="1"){type="阴性"}if(this.safeData.positiveNegative==""){type="未填写"}
				return type;
			}
		},
		methods: {}
	}
</script>