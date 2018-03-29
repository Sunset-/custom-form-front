import config from './common/config';
import Base from './common/base';
import './common/GlobalService';
import './vendor/ztree/jquery.ztree.all-3.5.min';
import './vendor/ztree/zTreeStyle/zTreeStyle.css';

import Vue from 'vue';
import Router from 'vue-router';
import UEditorConfig from 'ueditor-config';
import UEditor from 'ueditor';
import 'iview-style';
import iview from 'iview';
import SunsetUI from 'sunset-ui';
import SunsetUIExt from './sunset-ui-ext';
import Validators from './common/validators';

import video_js from 'video.js';
import 'video.js/dist/video-js.min.css';
window.videojs = video_js;
import flexHandler from './vendor/flexView/flexpaper_handlers';
import flexPaper from './vendor/flexView/flexpaper';

Vue.use(Router);
Vue.use(iview);
Vue.use(SunsetUI);
SunsetUI.config({
	FORM_FIELD_LABEL_WIDTH: 100
});

import jrQrcode from './vendor/qrcode/jr-qrcode.min';
import jqPrint from './vendor/jqprint/jquery.jqprint-0.3';


import App from './components/App.vue';
import Modules from './components/AppModules.vue';
import './components/common/index';

import Sign from './components/sign/Sign.vue';
import SignStore from './components/sign/SignStore';

//字典
SunsetUI.installDictionary(require('./components/business/dictionary/enum'));

//模块
import AppModules from './app.modules';
import DictionaryStore from './components/business/dictionary/DictionaryStore';

window.Base = Base;

var router = new Router();

window.Router = router;


router.beforeEach(function (transition) {
	if (GlobalService.isUploading()) {
		Sunset.tip('正在上传，请稍后');
		transition.abort();
	}
	if (transition.to.path != '/sign') {
		if (transition.to.skipAuth) {
			transition.next();
		} else {
			SignStore.currentUser().then(data => {
				transition.next();
			}, err => {
				transition.abort();
				router.go('/sign');
			});
		}
	} else {
		SignStore.currentUser().then(data => {
			transition.abort();
			router.go(AppModules.navs[0].path);
		}, err => {
			transition.next();
		});
	}
})




Promise.all([
	DictionaryStore.getAll(),
	GlobalService.getSystemConfig(),
	GlobalService.getSystemModules()
]).then(res => {
	var dictionary = res[0];
	//安装字典
	Sunset.Service.Dictionary.install(dictionary);
	//安装校验器
	Object.keys(Validators).forEach(key => {
		Sunset.registValidator(key, Validators[key]);
	});
	//安装菜单
	AppModules.setup(GlobalService.getSystemModules());
	router.map({
		'/sign': {
			component: Sign,
			skipAuth: true
		},
		'/': {
			component: Modules,
			subRoutes: AppModules.routes
		}
	});

	//开始
	router.start(App, 'app');
});