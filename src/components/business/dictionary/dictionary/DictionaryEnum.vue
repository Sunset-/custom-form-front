<style lang="sass">
	.dictionary-enum-model {
		.ivu-modal-footer {
			display: none;
		}
	}
</style>
<template>
	<Modal class="dictionary-enum-model" :visible.sync="show" title="字典枚举" :width="800">
		<sunset-table v-ref:table :options="tableOptions"></sunset-table>
		<h5>添加枚举</h5>
		<sunset-form v-ref:form :options="formOptions" @signal="operateSignal"></sunset-form>
		<div slot="footer">
		</div>
	</Modal>
</template>
<script>
	import DictionaryStore from './DictionaryStore';

	export default {
		data() {
			return {
				tableOptions: {
					columns: [{
						title: '枚举名称',
						name: 'name'
					}, {
						title: '枚举值',
						name: 'value'
					}],
					showIndex: true,
					pageSize: 10,
					localPage: true,
					multiCheck: false,
					sortable: true,
					format: {
						list: '',
						count: 'length',
						pageSize: 'pageSize',
						currentPage: 'pageNumber'
					},
					//表格工具栏
					toolbar: [],
					//表格搜索
					filter: false,
					deleteMethod: 'removeEnum',
					//数据条目操作
					recordTools: [{
						label: '修改',
						icon: 'edit',
						color: 'warning',
						permission: 'Dictionary_ENUM_UPDATE',
						operate: (record) => {
							this.edit(record);
						}
					}, {
						label: '删除',
						icon: 'trash-a',
						color: 'error',
						permission: 'Dictionary_ENUM_DELETE',
						signal: 'DELETE'
					}, {
						label: '上移',
						icon: 'arrow-up-c',
						color: 'info',
						permission: 'Dictionary_ENUM_ORDER',
						operate: (record) => {
							DictionaryStore.order(record.id, record.type, 'UP').then(res => {
								this.$refs.table.refresh(void 0, true);
							});
						}
					}, {
						label: '下移',
						icon: 'arrow-down-c',
						color: 'info',
						permission: 'Dictionary_ENUM_ORDER',
						operate: (record) => {
							DictionaryStore.order(record.id, record.type, 'DOWN').then(res => {
								this.$refs.table.refresh(void 0, true);
							});
						}
					}],
					datasource: () => {
						return this.record ? DictionaryStore.loadEnums(this.record.type).then(data => {
							return data || [];
						}) : [];
					},
					store: DictionaryStore
				},
				formOptions: {
					cols: 2,
					fields: [{
						label: '枚举名称',
						name: 'name',
						type: 'input',
						validate: {
							required: true,
							maxlength: 24
						}
					}, {
						label: '枚举值',
						name: 'value',
						type: 'input',
						validate: {
							required: true,
							maxlength: 24
						}
					}],
					format: (model) => {
						model.type = this.record.type;
						return model;
					},
					hideBtns: true,
					store: DictionaryStore,
					method: 'saveEnum'
				},
				show: false,
				record: null
			};
		},
		methods: {
			loadEnums(page) {
				this.$refs.table.refresh(page, true);
			},
			edit(item) {
				this.$refs.form.reset(Object.assign({}, item));
			},
			operateSignal(signal) {
				if (signal == 'SAVED') {
					this.$refs.form.reset();
					this.loadEnums(void 0);
				} else if (signal == 'CANCEL') {
					this.show = false;
				}
			}
		},
		events: {
			DICTIONARY_ENUM_SHOW(record) {
				this.record = record;
				this.loadEnums(1);
				this.show = true;
			}
		}
	}
</script>