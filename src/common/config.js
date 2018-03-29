//DEPENDENTS
import FontAwesome from 'font-awesome';
import $ from 'jquery';

window.$http = function (...args) {
	return new Promise((resolve, reject) => {

		//json提交方式处理
		var ops = args[0];
		if (ops.json === true && (Sunset.isObject(ops.data) || Sunset.isArray(ops.data) || Sunset.isString(ops.data))) {
			ops.headers = ops.headers || {};
			ops.headers['Content-Type'] = 'application/json';
			ops.data = Sunset.isString(ops.data) ? ops.data : JSON.stringify(ops.data);
		}

		$.ajax.apply($, args).then((res) => {
			if (typeof res == 'string') {
				try {
					res = JSON.parse(res);
				} catch (e) {

				}
			}
			if (typeof res == 'object' && res.code) {
				if (res.code == 200) {
					resolve(res.data);
				} else if (res.code == 4101) {
					GlobalService && GlobalService.clearCurrentUser && GlobalService.clearCurrentUser();
					reject(res);
					if (Router) {
						if (!Router._currentRoute.skipAuth) {
							Router.go('/sign');
						}
					}
				} else {
					Sunset.tip && Sunset.tip(res.message || Sunset.Service.Dictionary.transcode('ERROR_CODE', res.code) || '服务异常', 'warning');
					reject(res);
				}
			} else {
				reject(res);
			}
		}, (err) => {
			console.log(err.message || err);
			reject(err);
		});
	});
}

//禁用回退
//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外 
function banBackSpace(e) {
	var ev = e || window.event; //获取event对象 
	var obj = ev.target || ev.srcElement; //获取事件源 
	var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
	//获取作为判断条件的事件类型 
	var vReadOnly = obj.getAttribute('readonly');
	var vEnabled = obj.getAttribute('enabled');
	//处理null值情况 
	vReadOnly = (vReadOnly == null) ? false : vReadOnly;
	vEnabled = (vEnabled == null) ? true : vEnabled;
	//当敲Backspace键时，事件源类型为密码或单行、多行文本的， 
	//并且readonly属性为true或enabled属性为false的，则退格键失效 
	var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") &&
		(vReadOnly == true || vEnabled != true)) ? true : false;
	//当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效 
	var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea") ?
		true : false;
	//判断 
	if (flag2) {
		return false;
	}
	if (flag1) {
		return false;
	}
}
//禁止后退键 作用于Firefox、Opera 
document.onkeypress = banBackSpace;
//禁止后退键 作用于IE、Chrome 
document.onkeydown = banBackSpace;


window.jQuery = $;
window.$ = $;