<style lang="sass" scoped>
	.treatment {
		width: 100%;
		overflow: scroll;
	}
</style>

<template>
	<div class="sunset-field treatment-comp">
		<h4>初步诊断</h4>
		<i-input type="textarea" :value.sync="tentativeDiagnosis" :maxlength="100" :autosize="{minRows: 2}" placeholder="请输入初步诊断" style="margin:5px 0px;"></i-input>
		<div>
			<i-button icon="plus-round" type="primary" @click="addValue('medicine')">新增处方</i-button>
			<!-- <i-button type="ghost" @click="addValue('operate')">+治疗方案</i-button>
      <i-button type="ghost" @click="addValue('remarks')">+备注</i-button> -->

			<div style="margin-top:10px;">
				<div v-if="widgetValue&&widgetValue.medicine&&widgetValue.medicine.length>0">
					<medicine :value.sync="item" v-for="item in widgetValue.medicine" :options="options.medicine" :index="$index" @delete-medicine="deleteMedicine"></medicine>
				</div>
				<template v-if="widgetValue">
					<treatment-textarea :value.sync="widgetValue.operate" :options="options.operate"></treatment-textarea>
				</template>

				<template v-if="widgetValue">
					<treatment-textarea :value.sync="widgetValue.remarks" :options="options.remarks">
					</treatment-textarea>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	import Medicine from './medicine.vue'
	import TreatmentTextarea from './TreatmentTextarea.vue'


	const UPDATE_FORCE = true;
	const UPDATE_LOW = false;
	const LOCK_UP = true;
	const LOCK_DOWN = false;


	export default {
		name: "TreatmentComp",
		props: {
			options: {
				type: Object
			},
			value: {
				type: String
			}
		},
		components: {
			Medicine,
			TreatmentTextarea
		},
		data() {
			return {
				valueLock: false,
				widgetValueLock: false,
				tentativeDiagnosis: '',
				widgetValue: [{
					medicines: [],
					marker: '',
					entrust: ''
				}]
			}
		},
		watch: {
			value(value) {
				if (!this.widgetValueLock) {
					this.valueLock = true;
					this.refreshValue(value);
				}
			},
			widgetValue: {
				handler(value) {
					if (!this.valueLock) {
						this.widgetValueLock = true;
						this.refreshWidgetValue(value)
					}
				},
				deep: true
			},
			tentativeDiagnosis() {
				if (!this.valueLock) {
					this.widgetValueLock = true;
					this.refreshWidgetValue()
				}
			}
		},
		methods: {
			refreshValue(value) {
				if (!this.valueLock) {
					return false;
				}
				try {
					var valueObject = JSON.parse(value);
					this.tentativeDiagnosis = valueObject.tentativeDiagnosis;
					this.widgetValue = valueObject.prescriptions || this.initValue();
				} catch (e) {
					this.tentativeDiagnosis = '';
					this.widgetValue = this.initValue();
				}
				this.$nextTick(res => {
					this.valueLock = false;
				})
			},
			refreshWidgetValue() {
				if (!this.widgetValueLock) {
					return false;
				}
				try {
					this.value = JSON.stringify({
						tentativeDiagnosis: this.tentativeDiagnosis,
						prescriptions: this.widgetValue || this.initValue()
					})
				} catch (e) {
					this.value = {
						tentativeDiagnosis: '',
						prescriptions: this.initValue()
					};
				}
				this.$nextTick(res => {
					this.widgetValueLock = false;
				})
			},
			initValue() {
				return {
					operate: null,
					medicine: [{
						medicines: [],
						marker: '',
						entrust: ''
					}],
					remarks: null
				}
			},
			addValue(type) {
				if (type === 'operate') {
					this.widgetValue.operate = this.widgetValue.operate || '';
				}
				if (type === 'medicine') {
					this.widgetValue.medicine = this.widgetValue.medicine || [];
					this.widgetValue.medicine.push({
						medicines: [],
						marker: '',
						entrust: ''
					});
				}
				if (type === 'remarks') {
					this.widgetValue.remarks = this.widgetValue.remarks || '';
				}
			},
			deleteMedicine(val, index) {
				this.widgetValue.medicine.splice(index, 1);
			}
		},
		ready() {
			this.value = this.value || JSON.stringify(this.initValue());
		}
	}

	/**
	 *  value:{
	 *    operate,
	 *    medicine,
	 *    remarks
	 * }
	 */
</script>