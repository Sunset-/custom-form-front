class DictionaryStore extends Sunset.Service.Store {

	constructor() {
		super();
		//this.getAll();
	}

	URLS = {
		LIST: '/service/system/dictionaryType',
		SAVE: '/service/system/dictionaryType',
		DELETE: '/service/system/dictionaryType/{id}',
		ALL: '/service/system/dictionaryItem/use/all',
		LOAD_ENUM: '/service/system/dictionaryItem/getByType/{type}',
		SAVE_ENUM: '/service/system/dictionaryItem',
		DELETE_ENUM: '/service/system/dictionaryItem/{id}',
		ORDER_ENUM: '/service/system/dictionaryItem/order/{id}'
	}

	callbacks = {
		afterList: (data) => {
			data && data.rows && data.rows.forEach(item => {
				item.isAccessmentCase = item.desc == 'ACCESSMENT_CASE';
			});
			return data;
		}
	}

	order(id, type, arrow) {
		return $http({
			url: this.URLS.ORDER_ENUM.replace(/\{id\}/, id),
			type: 'POST',
			data: {
				type: type,
				arrow: arrow
			}
		});
	}

	getAll() {
		$http({
			url: this.URLS.ALL,
			async: false,
			success: (data) => {
				this.cacheDictionary(data.data);
			}
		});
	}

	cacheDictionary(data) {
		if (data && data.length) {
			var ENUMS = {},
				ENUM_MAP = {};
			//按type分类
			data.forEach(item => {
				var enums = ENUMS[item.type] || (ENUMS[item.type] = []),
					enumMap = ENUM_MAP[item.type] || (ENUM_MAP[item.type] = {});
				enums.push({
					key: item.value,
					value: item.name
				});
				enumMap[item.value] = item.name;
			});
			//挂载到全局业务对象中
			Base.ENUMS = ENUMS;
			Base.ENUM_MAP = ENUM_MAP;
		}
	}

	/**
	 * 获取某类型的字典
	 * @param  {String} type 字典类型
	 * @return {[type]}      [description]
	 */
	getEnums(type) {
		return this.ENUMS[type] || [];
	}

	/**
	 * 转码
	 * @param  {String} type 字典类型
	 * @param  {String} key  字典key
	 * @return {[type]}      [description]
	 */
	transcode(type, key) {
		return this.ENUM_MAP[type] && this.ENUM_MAP[type][key];
	}

	loadEnums(type) {
		return $http({
			url: this.URLS.LOAD_ENUM.replace(/\{type\}/, type),
		});
	}

	saveEnum(model) {
		return $http({
			url: this.URLS.SAVE_ENUM,
			type: model.id ? 'PUT' : 'POST',
			data: model
		});
	}

	removeEnum(id) {
		return $http({
			url: this.URLS.DELETE_ENUM.replace(/\{id\}/, id),
			type: 'DELETE'
		});
	}



}

export default new DictionaryStore();