<template>
	<div>
		<sunset-form v-ref:form v-if="formOptions" :options="formOptions" @signal="popSignal"></sunset-form>
	</div>
</template>
<script>
	import CustomFormStore from './CustomFormStore';

	export default {
		props: {
			no: {},
			format : {},
			options: {

			}
		},
		data() {
			return {
				formOptions: null,
				dirty: false
			}
		},
		methods: {
			init() {
				this.dirty = false;
				if (this.no) {
					CustomFormStore.getFormConfig(this.no).then(config => {
						if (config) {
							Object.assign(config, this.options);
							if(Sunset.isFunction(this.format)){
								this.format.call(config,config);
							}
							this.formOptions = config;
							this.$nextTick(() => {
								this.waitRecord && this.reset(this.waitRecord);
							});
						}
					});
				}
			},
			getOptions() {
				return this.formOptions;
			},
			reset(record) {
				if (this.$refs.form) {
					this.$refs.form.reset(record);
					this.waitRecord = null;
				} else {
					this.waitRecord = record;
				}
			},
			submit() {
				return this.$refs.form && this.$refs.form.submit();
			},
			getModel(origin) {
				return this.$refs.form && this.$refs.form.getModel(origin);
			},
			generateModel() {
				return this.$refs.form && this.$refs.form.generateModel();
			},
			popSignal(signal) {
				if (!this.dirty && signal == 'DIRTY') {
					this.dirty = true;
					this.$dispatch('sunset-customform-dirty');
				}
				this.$emit.apply(this, ['signal'].concat([].slice.call(arguments, 0)));
			}
		},
		ready() {
			this.init();
		}
	}
</script>