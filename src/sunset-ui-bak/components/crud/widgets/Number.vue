<template>
	<div :class="['sunset-field-wrap',invalid?'field-invalid':'']">
		<label class="sunset-field-label">{{options.label}}</label>
		<div class="sunset-field">
			<Input-number :style="options.style" :max="options.max" :min="options.min" :value.sync="value" :disabled="options.disabled"
							:step="options.step||1"></Input-number>
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			options: {
				type: Object
			},
			value: {
				default : 0
			}
		},
		data() {
			return {};
		},
		computed: {
		}
	};
</script>