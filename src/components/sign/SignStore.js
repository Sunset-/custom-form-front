import Vue from 'vue';
import modules from '../../app.modules';
import MessageCenter from './MessageCenter';

const URLS = {
	LOGIN: '/service/business/v2.1/user/login',
	CURRENT: '/service/business/v2.1/user/current',
	// CURRENT_OPC: '/local_service/user/currentlogin',
	LOGOUT: '/service/business/user/logout',
	UPDATE_PASSWORD: '/service/business/v2.1/safety/upwd',
	FEEDBACK: '/service/common/feedback',
	CODE: '/service/user/code',
	OPC_CONFIG: '/service/opc/profile'
};

var CurrentUserCacheHolder = {
	cache: null
};

var api = {
	login(model) {
		model.agencyCode = GlobalService.getSystemAgencyCode();
		return $http({
			url: URLS.LOGIN,
			type: 'POST',
			data: model
		}).then(data => {
			if (data) {
				var user = data.content;
				var hospitalArr = [];
				this.getOwnHospital(user.relation, hospitalArr);
				user.relation.hospital = hospitalArr;
				CurrentUserCacheHolder.cache = user;
				user && this.updatePermission(user);
				return CurrentUserCacheHolder.cache;
			}
		});
	},
	getOwnHospital(organization, hospitalArr) {
		organization.uppers && organization.uppers.forEach(nextOrg => {
			if (nextOrg.entity && nextOrg.entity.category && nextOrg.entity.category.indexOf(Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL')) == 0) {
				if (Object.keys(nextOrg.entity).length != 0) {
					hospitalArr.push(nextOrg.entity);
				}
			} else {
				return this.getOwnHospital(nextOrg, hospitalArr);
			}
		});
	},
	logout() {
		return $http({
			url: URLS.LOGOUT
		}).then(data => {
			return CurrentUserCacheHolder.cache = null;
		});
	},
	currentUser: Sunset.wait(function () {
		return $http({
			url: URLS.CURRENT
		}).then(data => {
			if (data) {
				var user = data.content;
				var hospitalArr = [];
				this.getOwnHospital(user.relation, hospitalArr);
				user.relation.hospital = hospitalArr;
				CurrentUserCacheHolder.cache = user;
				user && this.updatePermission(user);
				return CurrentUserCacheHolder.cache;
			}
		});
	}, CurrentUserCacheHolder),
	getCurrentUserSync() {
		return CurrentUserCacheHolder.cache;
	},
	clearCurrentUser() {
		CurrentUserCacheHolder.cache = null;
	},
	_sendCodeLock: false,
	sendCode(phone) {
		if (this._sendCodeLock) {
			return Promise.reject();
		} else {
			this._sendCodeLock = true;
			return $http({
				url: URLS.CODE,
				type: 'POST',
				data: {
					acc: phone
				}
			}).then(data => {
				this._sendCodeLock = false;
				return data;
			});
		}

	},
	/**
	 * 修改密码
	 * 
	 * @param {any} model 
	 * @returns 
	 */
	updatePassword(model) {
		return $http({
			url: URLS.UPDATE_PASSWORD,
			type: 'POST',
			data: model
		});
	},
	/**
	 * 反馈意见
	 * 
	 * @param {any} model 
	 * @returns 
	 */
	feedback(model) {
		return $http({
			url: URLS.FEEDBACK,
			type: 'POST',
			data: model
		});
	},
	updatePermission(data) {
		//判断当前用户的系统归属
		if (data.user.systemId != GlobalService.getSystemId()) {
			this.logout().then(res => {
				Router.go('/sign');
			});
			return;
		}
		//分析用户所属
		var Dictionary = Sunset.Service.Dictionary;
		var userHospital = null,
			office = null,
			offices = [],
			ownHospital = [],
			ownTeams = [],
			ownGroups = [],
			ownScenes = [],
			ownScenesMemberIds = [];
		data.relation.uppers.forEach(rel => {
			var uppers = rel.uppers;
			uppers.forEach(item => {
				var entity = item.memberCategory ? item.entity : item;
				if(!entity.category){
					return;
				}
				if (entity.category.indexOf(Dictionary.alias('ORG_GROUP_CODE', 'DEPT')) == 0) {
					if (office && office.id == entity.id) {
						Sunset.tip('组织结构异常：用户归属多个科室。', 'danger');
						return;
					}
					//业务科室（临床或放射）
					if (entity.category == Dictionary.alias('ORG_CODE', 'CLINICAL') || entity.category == Dictionary.alias('ORG_CODE', 'RADIOLOGY')) {
						office = entity;
					}
					//所属科室列表
					entity.userProperty = rel.property;
					entity.memberId = item.id;
					offices.push(entity);
					//向上获取所属医院
					item.uppers && item.uppers.forEach(hospital => {
						var hospitalEntity = hospital.memberCategory ? hospital.entity : hospital;
						if (hospitalEntity.category == Dictionary.alias('ORG_CODE', 'HOSPITAL')) {
							if (userHospital && userHospital.id != hospitalEntity.id) {
								Sunset.tip('组织结构异常：科室归属多个医院。', 'danger');
								return;
							}
							userHospital = hospitalEntity;
							hospitalEntity.scenes = hospital.uppers && hospital.uppers[0];
							if (hospital.memberCategory) {
								ownHospital.push(hospital);
							}
						} else {
							var hospitalArr = [];
							this.getOwnHospital(hospital, hospitalArr);
							hospitalArr[0].scenes = hospital.uppers && hospital.uppers[0];
							userHospital = hospitalArr[0];
							if (hospital.memberCategory) {
								ownHospital.push(hospital);
							}
						}
					})
				} else if (entity.category == Dictionary.alias('ORG_CODE', 'TEAM')) {
					ownTeams.push(item.memberCategory ? item.entity : item);
				} else if (entity.category == Dictionary.alias('ORG_CODE', 'GROUP')) {
					ownGroups.push(item.memberCategory ? item.entity : item);
				} else if (entity.category == Dictionary.alias('ORG_CODE', 'SCENES')) {
					ownScenesMemberIds.push(rel.id);
					ownScenes.push(rel);
				}
			})
		});
		//所属医院
		data.relation.hospital = userHospital ? [userHospital] : [{
			id: null
		}];
		//所属医院携带member信息
		data.relation.flowHospital = ownHospital;
		//所属业务科室
		data.relation.office = office || {
			id: ''
		};
		//所属所有科室（含行政科室）
		data.relation.offices = offices;
		//业务科室的权限串
		data.relation.officesDesc = JSON.stringify(offices.filter(item => (item.category == Dictionary.alias('ORG_CODE', 'CLINICAL') || item.category == Dictionary.alias('ORG_CODE', 'RADIOLOGY'))).map(item => ({
			entityId: item.id,
			duty: item.userProperty,
			category: item.category
		})));
		//非业务科室的权限串
		data.relation.adminOfficesDesc = JSON.stringify(offices.filter(item => (item.category != Dictionary.alias('ORG_CODE', 'CLINICAL') && item.category != Dictionary.alias('ORG_CODE', 'RADIOLOGY'))).map(item => ({
			entityId: item.id,
			duty: item.userProperty,
			category: item.category
		})));
		//全院的权限串
		data.relation.hospitalDesc = JSON.stringify(offices.map(item => ({
			entityId: item.id,
			duty: item.userProperty,
			category: item.category
		})));
		//用户是否属于某类型科室
		data.relation.isBelongToOfficeCategory = function(category){
			return offices.filter(item=>item.category==category).length>0;
		};
		data.relation.isBelongToBusinessOffice = function(category){
			return offices.filter(item=>(item.category == Dictionary.alias('ORG_CODE', 'CLINICAL') || item.category == Dictionary.alias('ORG_CODE', 'RADIOLOGY'))).length>0;
		};
		//所属团队
		data.relation.teams = ownTeams;
		//所属小组
		data.relation.groups = ownGroups;
		//直属圈子
		data.relation.scenes = ownScenes;
		//个人直属圈子的成员IDs
		data.relation.scenesMemberIds = ownScenesMemberIds.join(',');

		var permissions = {};
		if (GlobalService.getSystemConfig().modulePermissions) {
			permissions = GlobalService.getSystemConfig().modulePermissions(data, GlobalService.Modules.permissions) || {};
		}
		//设置模块权限
		var userType = data.user.userType,
			Dictionary = Sunset.Service.Dictionary;
		Base.permissions = permissions;
		//设置业务权限
		// Base.busenissPermissions = permissions;
		//重置路由
		for (var i = 0, nav; nav = modules.navs[i++];) {
			if (permissions[nav.name]) {
				for (var j = 0, menu; menu = nav.menus[j++];) {
					if (permissions[menu.name]) {
						nav.path = menu.path;
						break;
					}
				}
			}
		}
		Vue.directive('mdp-permission', {
			update: function (newValue, oldValue) {
				if (newValue && !(Base && Base.permissions[newValue])) {
					$(this.el).remove();
				}
			}
		});
		MessageCenter.start();
	},
	/**
	 *OPC 信息 
	 hospitalId
	 */
	OPC_CONFIG(model) {
		return $http({
			url: URLS.OPC_CONFIG,
			data: model
		});
	}
}


Vue.directive('permission', {
	update: function (newValue, oldValue) {}
});

GlobalService && (GlobalService.getCurrentUserSync = function () {
	return api.getCurrentUserSync();
});
GlobalService && (GlobalService.clearCurrentUser = function () {
	return api.clearCurrentUser();
});

export default api;