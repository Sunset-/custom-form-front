<style>
	#physicalcheck .sunset-form-field .sunset-field-label{
		text-align: left;
	}
</style>
<template>
	<div id="physicalcheck">
		<!-- <sunset-toolbar style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
		<history-view v-show="!editing" :data="data"></history-view> -->
		<sunset-custom-form style="padding-top:8px;" :no="config.formNo" v-ref:form :options="formOptions" @signal="operateSignal"></sunset-custom-form>
	</div>
</template>
<script>
	import physicalcheckView from './View';

	export default {
		components: {
			physicalcheckView
		},
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
				},
			}
		},
		methods: {
			init() {
				// if (GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias('SYSTEM_ACCOUNT_TYPE',
				// 		'ASSISTANT')) {
				// 	this.editing = !this.data;
					this.$refs.form.reset(this.data);
				// }
			},
			getEditingData() {
				return this.$refs.form.getModel();
			},
			setEditingData(data) {
				this.editing = true;
				return this.$refs.form.reset(data);
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
				return [
					// {
					// 	id: data.historyCardId,
					// 	viewName: config.historyCardName,
					// 	entity: config.historyEntity && config.historyEntity(data),
					// 	digest: config.historyDigest && config.historyDigest(data),
					// 	extension: history
					// },
					{
						id: data.checkCardId,
						viewName: config.checkCardName,
						entity: config.checkEntity && config.checkEntity(data),
						digest: config.checkDigest && config.checkDigest(data),
						extension: check
					}
				];
			}
		},
		ready() {
			this.init();
			$(".md-detail-wrap .md-detail").css({"height":"auto","min-height":"100%"});
		},
		watch: {
			data(v) {
				this.init();
			}
		}
	}
</script>
