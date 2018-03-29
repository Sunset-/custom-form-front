<style>
	#patienthistory .sunset-field{
		text-align: center;
	}
	#patienthistory .sunset-field-label{
    text-align: left;
    min-width: 175px !important;
	}
	#patienthistory .sunset-field{
		padding-left: 0px important;
	}
	#patienthistory .ivu-select-selected-value{
		text-align: left;
	}
	#patienthistory .ivu-input-group-prepend{
		padding-right: 25px;
	}
	#patienthistory .ivu-select-arrow{
		right:0;
	}
</style>
<template>
	<div id="patienthistory">
		<sunset-custom-form style="padding-top:8px;" :no="config.formNo" v-ref:formd :options="formOptions" @signal="operateSignal"></sunset-custom-form>
	</div>
</template>
<script>

	export default {
		props: {
			data: {

			},
			config: {

			}
		},
		data() {
			return {
				editing: false,
				formOptions: {
					submit: (data) => {
						this.$emit('save', this.splitSaveData(data));
					}
				}
			}
		},
		methods: {
			init() {
				this.$refs.formd.reset(this.data);
			},
			operateSignal(signal) {
				if (signal == 'CANCEL') {
					this.editing = false;
					this.$emit('signal', 'CANCEL');
				}
			},
			splitSaveData(data) {
				var config = this.config,
					history = {},
					check = {},
					historyFieldChecker = config.historyFieldChecker;
				Object.keys(data).forEach(key => {
					if (historyFieldChecker && historyFieldChecker.test(key)) {
						history[key] = data[key];
					} else {
						check[key] = data[key];
					}
				});
				return [{
						id: data.historyCardId,
						viewName: config.historyCardName,
						entity: config.historyEntity && config.historyEntity(data),
						digest: config.historyDigest && config.historyDigest(data),
						extension: history
					}
					// {
					// 	id: data.checkCardId,
					// 	viewName: config.checkCardName,
					// 	entity: config.checkEntity && config.checkEntity(data),
					// 	digest: config.checkDigest && config.checkDigest(data),
					// 	extension: check
					// }
				];
			}
		},
		ready() {
			this.init();
		},
		watch: {
			data(v) {
				this.init();
			}
		}
	}
</script>