<style>

</style>
<template>
	<div>
		<sunset-custom-form style="padding-top:8px;" :no="config.formNo" v-ref:form :options="formOptions" @signal="operateSignal"></sunset-custom-form>
	</div>
</template>
<script>
	export default {
		props: {
			card:{},
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
						var config = this.config;
						this.$emit('save', {
							digest: config.digest && config.digest(data),
							entity: config.entity && config.entity(data),
							extension: data
						});
					}
				}
			}
		},
		methods: {
			operateSignal(signal) {
				if (signal == 'CANCEL') {
					this.$emit('signal', 'HOME');
				}
			}
		},
		ready() {
			this.data.birthday = this.card.patient.birthday; 
			this.$refs.form.reset(this.data);
		},
		watch: {
			data(v) {
				this.$refs.form.reset(v);
			}
		}
	}
</script>