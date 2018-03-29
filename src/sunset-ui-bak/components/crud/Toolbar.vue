<style lang="sass">
	.sunset-toolbar {
		display: inline-block;
		vertical-align: top;
		.sunset-toolbar-item {
			display: inline-block;
			padding: 0px 3px;
		}
	}
</style>
<template>
	<div class="sunset-toolbar" :style="style">
		<template v-for="tool in showTools">
			<div v-permission="tool.permission" class="sunset-toolbar-item">
				<template v-if="!tool.type">
					<i-button :size="size" :type="tool.color||'primary'" :icon="tool.icon" @click="operate(tool)">{{tool.label}}</i-button>
				</template>
				<template v-if="tool.type=='file'">
					<tool-file :options="tool" :ctx="ctx"></tool-file>
				</template>
				<template v-if="tool.type=='dropdown'">
					<Dropdown>
						<i-button :icon="tool.icon" :type="tool.color||'primary'">
							{{tool.label}}
							<Icon type="arrow-down-b"></Icon>
						</i-button>
						<Dropdown-menu slot="list" style="text-align:left;">
							<Dropdown-item v-for="item in tool.items" :divided="item.divided" @click="operate(item)">
								<Icon v-if="item.icon" :type="item.icon"></Icon>
								{{item.label}}
							</Dropdown-item>
						</Dropdown-menu>
					</Dropdown>
				</template>
			</div>
		</template>
	</div>
</template>
<script>
	import jqueryForm from '../../vendor/jquery/jquery.form';
	import ToolFile from './tools/File.vue';

	export default {
		components: {
			ToolFile
		},
		props: {
			options: {
				type: Array
			},
			ctx: {},
			size: {},
			style: {}
		},
		computed: {
			btnClass() {
				if (this.size == "small") {
					return 'btn-xs';
				}
			},
			showTools() {
				return this.options && this.options.filter(item => {
					if (item.premise && Sunset.isFunction(item.premise)) {
						return item.premise(this.ctx);
					} else {
						return true;
					}
				});
			}
		},
		methods: {
			operate(tool) {
				if (tool.signal) {
					this.$emit('signal', tool.signal, this.ctx);
				} else if (Sunset.isFunction(tool.operate)) {
					if (tool.confirm) {
						return Promise.resolve().then(() => {
							return Sunset.isFunction(tool.confirm) ? tool.confirm(this.ctx) : tool.confirm;
						}).then(confirmMsg => {
							var clear = Sunset.confirm({
								content: confirmMsg,
								loading: true,
								onOk: () => {
									Promise.resolve().then(() => {
										return tool.operate(this.ctx);
									}).then(res => {
										clear();
									});
								}
							});
						});
					} else {
						tool.operate(this.ctx);
					}
				}
			}
		}

	}
</script>