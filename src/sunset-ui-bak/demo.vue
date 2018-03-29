<template>
	<validator name="validation">
		<div :class="['form-group',invalid?'has-error':'']">
			<label class="control-label col-xs-3">{{options.label}}</label>
			<div class="input-group col-xs-7">
				<i-input :type="type" :value.sync="value" :maxlength="maxlength" :disabled="options.disabled" :readonly="options.readonly" :placeholder="options.placeholder" :icon="options.icon" :size="options.size" :style="options.style">
					<span v-if="options.prepend" slot="prepend">{{options.prepend}}</span>
					<span v-if="options.append" slot="append">{{options.append}}</span>
				</i-input>
				<input type="hidden" :maxlength="maxlength" field="field" v-model="value" v-validate="options.validate" />
				<i v-show="invalid" class="glyphicon glyphicon-exclamation-sign text-danger sunset-pop" :data-content="invalidMsg"></i>
			</div>
		</div>
	</validator>
</template>
<script>
	export default {
		props: {
			options: {
				type: Object
			},
			value: {}
		},
		data() {
			return {};
		},
		computed: {
			type() {
				return this.options.type == 'input' ? 'text' : this.options.type;
			},
			maxlength() {
				return this.options.maxlength || this.options.validate && this.options.validate.maxlength && this.options.validate.maxlength
					.rule;
			},
			invalid() {
				return this.options.validate && this.$validation.field.invalid;
			},
			invalidMsg() {
				return this.options.validate && this.$validation.field.errors && this.$validation.field.errors.length && this.$validation
					.field.errors[0].message;
			}
		}
	};
</script>