<style lang="sass">
  .check_apply_list {
    padding:20px 0;
  }
</style>
<template>
	<div class="check_apply_list">
		<!-- <print-check-apply  :print-data='data' :card='card'></print-check-apply> -->
		<sunset-custom-form  :no='config.formNo' v-ref:form :options="formOptions"></sunset-custom-form>
	</div>
</template>
<script>
// import PrintCheckApply from "./PrintCheckApply";
export default {
	components: {
		// PrintCheckApply
	},
	props: {
		card : {},
		data: {},
		config: {},
		routeData:{}
	},
	computed: {
		patient() {
			return localStorage.getItem('patient')
		}
	},
	data() {
		return {
			editing:false,
			formOptions: {
				cast(model) {
					return model;
				},
				format: (model) => {
					return {

					};
				},
				validate: (model) => {
					return true;
				},
				tools: [{
					label: '保存',
					color: 'success',
					operate: (data) => {
						var a=this.card,b=this.data;
						var digest = {method:[]};
						var entity = {itemList:[]};
						for (var item in data) {
							if(item=="diagnose"){
								entity.initialDiagnose=data[item];
								continue
							}else if(item.indexOf("checkapply")== 0){
								if(data[item]){
									var obj={};
									digest.method.push(JSON.parse(data[item]).checkmethod);
									digest.doctor= GlobalService.getCurrentUserSync().user.name;
									digest.id= GlobalService.getCurrentUserSync().user.userId;
									obj.name = JSON.parse(data[item]).checkmethod;
									obj.point = JSON.parse(data[item]).checkpoint;
									obj.purpose = JSON.parse(data[item]).checktarget;
									entity.itemList.push(obj);
								}else{
									Sunset.tip("请填写检查内容","warning");
									return
								}
							};
						};
						var para = {
							flowId: this.routeData,
							digest: digest,
							extension: JSON.parse(JSON.stringify(data)),
							entity: entity
						};
						this.$emit('save', para);
						this.printData=para;
                        this.$emit('signal', 'EDIT');
					}
				}, {
					label: '取消',
					color: 'ghost',
					operate: (data) => {
						if (this.data) {
							this.editing = false;
							this.$emit('signal', 'CANCEL');
						} else {
							this.$emit('signal', 'HOME');
						}
						// this.$emit('signal', 'cancel', data)
					}
				}]
			}
		}
	},
	methods: {
		getEditingData() {
			return this.$refs.form.getModel();
		},
		setEditingData(data) {
			this.editing = true;
			return this.$refs.form.reset(data);
		},
		setData(data) {
			this.data = data;
			data = JSON.parse(data);
			this.$refs.form.reset(data)
		},
		edit() {
			this.editing = this.data;
			this.$refs.form.reset(this.data);
          	this.$emit('signal', 'EDIT')
		}
	},
	watch: {
		data(v) {
			this.editing = !this.data;
			this.$refs.form.reset(this.data)
		}
	},
	ready() {
		this.editing = !this.data;
			this.$refs.form.reset(this.data)
	}
}
</script>