<style>
.inspection_apply_list{
	padding:20px 0;
}
</style>
<template>
	<div class="inspection_apply_list">
		<!-- <print-inspection-apply v-show="!editing" v-on:edit="edit" :print-data='data' :card='card'></print-inspection-apply> -->
		<sunset-custom-form :no='config.formNo' v-ref:formapi :options="formOptions"></sunset-custom-form>
	</div>
</template>
<script>
// import PrintInspectionApply from "./PrintInspectionApplycation";
import MedicalDataStore from "../MedicalDataStore.js";
export default {
	props: {
		card : {},
		data: {},
		config: {},
		routeData:{}
	},
	components: {
		// PrintInspectionApply
	},
	data() {
		return {
			editing: false,
			result: '',
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
						var digest = {method:[]};
						var entity = {itemList:[]};
						var obj={};
						var nameList=[];
						for (var item in data) {
							if(item=="diagnose"){
								entity.initialDiagnose=data[item];
								continue
							}else if(item.indexOf("laboratorytype")== 0){
								if(data[item]){
									digest.method.push(data[item]);
									digest.id= GlobalService.getCurrentUserSync().user.userId;
									digest.doctor= GlobalService.getCurrentUserSync().user.name;
									nameList.push(data[item]);
								}else{
									Sunset.tip("请填写化验内容","warning");
									return
								}
							};
						};
						if(nameList.length){
							obj.name = nameList.join(",")
							obj.sample = data.sample;
							obj.purpose = data.purpose;
							obj.laboratorytitle = data.laboratorytitle;
							entity.itemList.push(obj);
						}
						var para = {
							flowId: this.routeData,
							digest: digest,
							extension: JSON.parse(JSON.stringify(data)),
							entity: entity
						};
						this.$emit('save', para);
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
						}
				}]
			}
		}
	},
	methods: {
		setData(data) {
			data = JSON.parse(data);
			this.$refs.formapi.reset(data);
		},
		edit() {
			this.editing = this.data;
			this.$refs.formapi.reset(this.data);
          	this.$emit('signal', 'EDIT')
		}
	},
	ready() {
		this.$refs.formapi.reset(this.data);
	}
}
</script>