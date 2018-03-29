<style lang="sass">
	.patient_info {
		padding-top: 8px;
	}
</style>
<template>
	<div class="patient_info">
		<sunset-custom-form :no="config.formNo" v-ref:formapi :options="formOptions" @signal="operateSignal"></sunset-custom-form>
	</div>
</template>
<script>
	export default {
		components: {

		},
		props: {
			data: {},
			config: {}
		},
		computed: {

		},
		data() {
			return {
				editing: false,
				formOptions: {
					cols: 4,
					cast(model) {
						return model;
					},
					validate: (model) => {
						return true;
					},

					submit: (data) => {
						var digest = '';
						var entity = {};
						data['birthday'] = new Date(data['birthday']).getTime();
						Object.keys(data).forEach((v) => {
							entity[v] = data[v]
						});
						var para = {
							digest: digest,
							extension: data,
							entity: entity
						};
						this.$emit('save', para);
					}
					// tools: [{
					// 	label: '保存',
					// 	color: 'success',
					// 	operate: (data) => {
					// 		var digest = '';
					// 		var entity={};
					// 		data['birthday'] = new Date(data['birthday']).getTime();
					// 		Object.keys(data).forEach((v)=>{
					// 				entity[v] = data[v]
					// 		});
					// 		var para = {
					// 			digest: digest,
					// 			extension: data,
					// 			entity: entity
					// 		};
					// 		this.$emit('save', para);
					// 	}
					// }, {
					// 	label: '取消',
					// 	color: 'ghost',
					// 	operate: (data) => {
					// 		this.$emit('signal', 'HOME');
					// 	}
					// }]
				}
			}
		},
		methods: {
			operateSignal(signal) {
				if (signal == 'CANCEL') {
					this.$emit('signal', 'HOME');
				}
			},
			setData(data) {
				this.data = data;
				data = JSON.parse(data);
				this.$refs.formapi.reset(data)
			},
			edit() {
				this.isDoctor = true;
				this.$refs.formapi.reset(this.data.extension)
			}
		},
		ready() {
			this.$refs.formapi.reset(this.data)
		},
		watch: {
			data(v) {
				this.$refs.formapi.reset(v);
			}
		}
	}
</script>