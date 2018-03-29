class DictionaryStore extends Sunset.Service.Store {

	constructor() {
		super();
	}

	URLS = {
		ALL: '/service/business/dictionary/all'
	}

	METHODS = {
		DELETE: 'POST'
	}

	callbacks = {
		afterList: (data) => {
			data && data.rows && data.rows.forEach(item => {
				item.isAccessmentCase = item.desc == 'ACCESSMENT_CASE';
			});
			return data;
		}
	}

	getAll() {
		return $http({
			url: this.URLS.ALL
		}).then(data => {
			return this.cacheDictionary(data);
		});
	}

	cacheDictionary(data) {
		var dictionaryItems = [];
		if (data && data.length) {
			var ENUMS = {},
				ENUM_MAP = {},
				enumItem;
			//按type分类
			data.forEach(item => {
				var enums = ENUMS[item.dictionaryType] || (ENUMS[item.dictionaryType] = []),
					enumMap = ENUM_MAP[item.dictionaryType] || (ENUM_MAP[item.dictionaryType] = {});
				enums.push(enumItem = {
					type: item.dictionaryType,
					key: item.value,
					value: item.name,
					alias: item.aliasName
				});
				enumMap[item.value] = item.name;
				dictionaryItems.push(enumItem);
			});
			//挂载到全局业务对象中
			Base.ENUMS = ENUMS;
			Base.ENUM_MAP = ENUM_MAP;
		}
		return dictionaryItems;
	}



}

export default new DictionaryStore();

// import Enums from './enum';
// import DictionaryStore from './dictionary/DictionaryStore';

// var BusinessDictionaryStore = {
//     /**
//      * 获取检查方法
//      */
//     getCheckMethods: Sunset.wait(() => {
//         return $http({
//             url: '/service/template/find_template_base'
//         });
//     }),
//     /**
//      * 获取检查部位
//      */
//     getCheckPlaces: Sunset.wait(() => {
//         return $http({
//             url: '/service/template/find_template_place'
//         });
//     }),
//     /**
//      * 获取检查方法
//      */
//     getLocalCheckMethods: Sunset.wait(() => {
//         return $http({
//             url: '/local_service/template/find_template_base'
//         });
//     }),
//     /**
//      * 获取检查部位
//      */
//     getLocalCheckPlaces: Sunset.wait(() => {
//         return $http({
//             url: '/local_service/template/find_template_place'
//         });
//     }),
//     /**
//      * 获取发现分类总字典
//      */
//     getFindCategory: Sunset.wait(() => {
//         return $http({
//             url: '/service/dictionary/all/list'
//         });
//     }),
//     getDiseaseVariety() {
//         return this.getFindCategory().then(res => {
//             return res && res.DiseaseVariety;
//         });
//     },
//     getMedicalBodyCategory() {
//         return this.getFindCategory().then(res => {
//             return res && res.MedicalBodyCategory;
//         });
//     },
//     /** 
//      * 加载通用字典
//      */
//     loadCommonDicationary() {
//         DictionaryStore.cacheDictionary(Enums);
//     }
// }


// BusinessDictionaryStore.loadCommonDicationary();

// module.exports = BusinessDictionaryStore;