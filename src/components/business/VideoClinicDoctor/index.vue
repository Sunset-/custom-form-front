<style lang="sass">
	.videoclinic-hospital-container {
		margin: 10px;
		.no_data{
			display:block;
			margin:140px auto;
		}
		.videoclinic-tip-wrap {
			text-align: center;
			.videoclinic-tip {
				display: inline-block;
				border: 2px solid green;
				margin: 10px auto;
				min-width: 200px;
				&>:first-child {
					background: green;
					color: #FFF;
					text-align: center;
					padding: 5px;
				}
				&>:last-child {
					padding: 10px 10px;
					font-size: 24px;
					color: #111;
					font-weight: bold;
				}
			}
		}
		.video-patientinfo-container {
			position: absolute;
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
		}
		.patient_edit_page .patient_card_bar .visiting_records_box {
			top: 130px;
		}
	}
</style>
<template>
	<div class="videoclinic-hospital-container">
		<div v-show="!isShowDetail">
			<sunset-filter :options="filterOptions" @filter="filterData" style="margin-bottom:10px;"></sunset-filter>
			<sunset-toolbar :options="toolbarOptions" style="float:right;"></sunset-toolbar>
			<sunset-filter v-ref:rightfilter :options="rightFilter" style="float:right;"></sunset-filter>
			<sunset-table v-ref:table :options="tableOptions">
                <img class="no_data" slot="empty" src="/assets/img/nodata.png">
			</sunset-table>
		</div>
		<div v-show="isShowDetail" class="video-patientinfo-container">
			<patient-detail v-if="patientId" :patient-id="patientId" :sidebar="sidebarOptions">
				<div slot="lefttitle" style="font-size:18px;color:red;font-weight:bold;text-align:center;padding-top:5px;">
					当前排队患者：{{queueCount}}人
				</div>
			</patient-detail>
		</div>
	</div>
</template>
<script>
	import PatientDetail from '../PatientDetail/PatientDetail';
	import Store from '../VideoClinicHospital/Store.js';
	import SunsetWebsocket from '../../../common/ws.js';
	import EquipmentStore from '../Equipment/Store.js';
	export default {
		components: {
			PatientDetail
		},
		computed: {
			isShowDetail() {
				return this.$route.path.endsWith('/detail');
			}
		},
		data() {
			return {
				queueCount: 0,
				patientId: this.$route.params.patientId,
				deptId: this.$route.params.deptId,
				queue: [],
				wsTopic: null,
				filterOptions: {
					fields: [{
						widget: 'radio',
						name: 'status',
						type: 'button',
						enum: 'VIDEOCLINICI_FLOW_STATUS',
						defaultFirst: true,
						changeFilter: true,
						data: () => {
							return [{
								value: ['LINEUP', 'PROCESSING', 'RELINEUP'].map(item => Sunset.Service
									.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', item)).join(
									','),
								text: '排队中'
							}, {
								value: Sunset.Service.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS',
									'PROCESSED'),
								text: '已完成'
							}];
						}
					}]
				},
				rightFilter: {
					fields: [{
						name: 'deptId',
						widget: 'select',
						textPlace: 'equipName',
						valuePlace: 'id',
						defaultFirst: true,
						style: 'min-width :120px;margin-right:20px;',
						data: () => {
							var currentUser = GlobalService.getCurrentUserSync();
							var ownHospital = currentUser.relation.hospital.filter(
								item => {
									return currentUser.user.userType == Sunset.Service.Dictionary.alias(
											'SYSTEM_ACCOUNT_TYPE', 'DOCTOR') && item.property == Sunset
										.Service.Dictionary.alias('USER_HOSPITAL_PROPERTY', 'In');
								});
							if (ownHospital.length) {
								return EquipmentStore.loadAll(ownHospital[
									0].id).then(res => {
									return (res || []).concat([{
										equipName: '当前设备视频',
										id: '_'
									}])
								});
							} else {
								return [{
									equipName: '当前设备视频',
									id: '_'
								}];
							}
						},
						validate: {
							required: true
						}
					}]
				},
				toolbarOptions: {
					tools: [{
						label: '开始接诊',
						color: 'info',
						operate: () => {
							if (this.queue.length == 0) {
								return;
							}
							var filter = this.$refs.rightfilter.getFilter();
							var deptId = filter.filter.deptId;
							if (deptId) {
								this.deptId = deptId;
								Promise.resolve().then(() => {
									var processing = this.queue.filter(item => item.status ==
										Sunset.Service.Dictionary
										.alias(
											'VIDEOCLINICI_FLOW_STATUS',
											'PROCESSING'));
									if (processing.length) {
										Store.notice(deptId, processing[0].id);
										return processing[0];
									} else {
										if(deptId=='_'){
											GlobalService.OpenVideoTalk(null);
										}
										return Store.next(deptId).then(res => {
											this.$refs.table.refresh();
											if (res.patientId) {
												return res;
											}
										});
									}
								}).then(res => {
									res && this.openVideo(res);
								});
							} else {
								Sunset.tip('请选择设备');
							}
						}
					}, {
						label: '刷新',
						color: 'success',
						operate: () => {
							this.$refs.table.refresh();
						}
					}]
				},
				tableOptions: {
					columns: [{
						title: '患者编号',
						name: 'patientNumber'
					}, {
						title: '姓名',
						name: 'patient.name'
					}, {
						title: '来自医院',
						name: 'hospital.name'
					}, {
						title: '状态',
						name: 'status',
						format(v) {
							var Dictionary = Sunset.Service.Dictionary;
							if (v == Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', 'PROCESSING')) {
								return `<span style="color:#39f">${Dictionary.transcode('VIDEOCLINICI_FLOW_STATUS',v)}</span>`;
							} else {
								return Dictionary.transcode('VIDEOCLINICI_FLOW_STATUS', v);
							}
						}
					}, {
						title: '登记时间',
						name: 'joinTime',
						format: 'DATETIME'
					}],
					format: {
						list: 'rows',
						count: 'totalCount',
						pageSize: 'pageSize',
						currentPage: 'pageNumber'
					},
					lazy: true,
					pageNumberStart: 0,
					recordTools: [{
						label: '查看',
						color: 'info',
						icon: 'eye',
						operate: (model) => {
							this.sidebarOptions = [{
								label: '返回',
								color: 'danger',
								operate: () => {
									this.back();
								}
							}];
							var path = this.$route.path;
							if (path.endsWith('/detail')) {
								path = path.substring(0, path.indexOf('VideoClinicDoctor') +
									'VideoClinicDoctor'.length)
							}
							path = path + `/${model.patientId}/${model.flowId}/detail`;
							this.patientId = model.patientId;
							this.deptId = null;
							Router.go(path);
						}
					}],
					datasource: (filter) => {
						filter.expertUserId = GlobalService.getCurrentUserSync().user.userId;
						return Store.queue(filter).then(res => {
							this.queue = res.rows || [];
							return res;
						});
					}
				},
				sidebarOptions: this.$route.params.deptId ? [
					[{
						label: '返回',
						color: 'danger',
						operate: () => {
							this.back();
						}
					}, {
						label: '下一位',
						color: 'success',
						operate: () => {
							var clear = Sunset.confirm({
								content: '接诊下一位患者？',
								loading: true,
								onOk: () => {
									if(this.deptId=='_'){
										GlobalService.OpenVideoTalk(null);
									}
									Store.next(this.deptId).then(res => {
										this.$refs.table.refresh();
										clear();
										if (res.patientId) {
											this.openVideo(res);
										} else {
											GlobalService.CloseVideoTalk();
											var path = this.$route.path;
											path = path.substring(0,
												path.indexOf('VideoClinicDoctor') +
												'VideoClinicDoctor'.length);
											Router.go(path);
										}
									}).catch(e => {
										console.error(e);
										clear();
									});
								}
							});
						}
					}]
				] : [{
					label: '返回',
					color: 'danger',
					operate: () => {
						this.back();
					}
				}],
				videoSidebarOptions: [
					[{
						label: '返回',
						color: 'danger',
						operate: () => {
							this.back();
						}
					}, {
						label: '下一位',
						color: 'success',
						operate: () => {
							var clear = Sunset.confirm({
								content: '接诊下一位患者？',
								loading: true,
								onOk: () => {
									if(this.deptId=='_'){
										GlobalService.OpenVideoTalk(null);
									}
									Store.next(this.deptId).then(res => {
										this.$refs.table.refresh();
										clear();
										if (res.patientId) {
											this.openVideo(res);
										} else {
											GlobalService.CloseVideoTalk();
											var path = this.$route.path;
											path = path.substring(0,
												path.indexOf('VideoClinicDoctor') +
												'VideoClinicDoctor'.length);
											Router.go(path);
										}
									}).catch(e => {
										console.error(e);
										clear();
									});
								}
							});
						}
					}]
				]
			};
		},
		methods: {
			filterData(filter) {
				this.$refs.table.search(filter);
			},
			openVideo(model) {
				var path = this.$route.path;
				if (path.endsWith('/detail')) {
					path = path.substring(0, path.indexOf('VideoClinicDoctor') + 'VideoClinicDoctor'.length)
				}
				path = path + `/${model.patientId}/${this.deptId}/${model.flowId}/detail`;
				this.patientId = model.patientId;
				this.sidebarOptions = this.videoSidebarOptions;
				Router.go(path);
				if (this.deptId == '_') {
					GlobalService.OpenVideoTalk(
						`/video.html?room=${model.deptId||model.hospitalId}&target=${model.hospital.name}:${model.patient.name}`
					);
				} else {
					// alert('tip')
				}
			},
			refreshQueueCount() {
				Store.queue({
					pageNumber: 0,
					pageSize: 1,
					expertUserId: GlobalService.getCurrentUserSync().user.userId,
					status: ['LINEUP', 'RELINEUP'].map(item => Sunset.Service
						.Dictionary.alias('VIDEOCLINICI_FLOW_STATUS', item)).join(
						',')
				}).then(res => {
					this.queueCount = res.totalCount;
				})
			},
			initWebSocket() {
				var topic = this.wsTopic =
					`${GlobalService.getSystemConfig().videoClinicWebsocketPrefix}/business/ws?clientId=${GlobalService.getCurrentUserSync().user.userId}&clientType=EXPERT`;
				
				
				SunsetWebsocket.listen(topic, SunsetWebsocket.EVENTS.MESSAGE, (res) => {
					if (res.content) {
						if (res.content.messageType == 'ACTION') {
							this.$refs.table.refresh();
							this.refreshQueueCount();
						}
					}
				});
				
				
				
				SunsetWebsocket.connect({
					url: topic,
					json: true
				});
			},
			back() {
				var path = this.$route.path;
				if (path.endsWith('/detail')) {
					path = path.substring(0, path.indexOf('VideoClinicDoctor') +
						'VideoClinicDoctor'.length)
				}
				Router.go(path);
			}
		},
		watch: {
			patientId(v) {
				this.refreshQueueCount();
			}
		},
		beforeDestroy() {
			SunsetWebsocket.disconnect(this.wsTopic);
		},
		ready() {
			if (GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias(
					'SYSTEM_ACCOUNT_TYPE', 'DOCTOR')) {
				this.refreshQueueCount();
				this.initWebSocket();
			}
		}
	}
</script>