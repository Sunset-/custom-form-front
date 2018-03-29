import SunsetWebsocket from './ws.js';

(function (window) {

    //全局服务
    var GlobalService = window.GlobalService = window.GlobalService || {};

    //同步获取当前系统信息
    GlobalService.getSystemAgencyCode = null;
    GlobalService.getSystemId = function () {
        return $('#global-system-id').text().trim();
    };
    GlobalService.getSystemConfig = function () {
        return $http({
            url: `/service/business/system/${GlobalService.getSystemId()}`,
        }).then(res => {
            GlobalService.getSystemAgencyCode = function () {
                return res.agencyCode
            };
            try {
                var config = eval('(' + (res.config || '{}') + ')');
                GlobalService.getSystemConfig = function () {
                    return config;
                }
            } catch (e) {
                console.error(e);
            }
        });
    }
    GlobalService.getSystemModules = function () {
        return $http({
            url: `/service/business/relation/system/module`,
            data: {
                systemId: GlobalService.getSystemId()
            }
        }).then(res => {
            var modules = res || [];
            GlobalService.getSystemModules = function () {
                return modules;
            }
            return modules;
        });
    }

    //同步获取当前登录用户
    GlobalService.getCurrentUserSync = null;

    //获取自定义表单
    GlobalService.getCustomForm = null;

    //打印
    GlobalService.CommonPrint = null;

    //查看文档
    GlobalService.openDocument = null;

    //检查方法
    GlobalService.getCheckMethods = null;

    //检查部位
    GlobalService.getCheckPoints = null;

    //是否正在上传
    GlobalService.uploadingStatus = {};
    GlobalService.isUploading = function () {
        return Object.keys(GlobalService.uploadingStatus).length > 0;
    };

    //打开Dicom影像窗口

    //阅片工具单例window
    GlobalService.openCateyesWindow = function (url) {
        var codeurl = encodeURI(encodeURI(url));
        if (window.cateyesSingleWindow && (!window.cateyesSingleWindow.closed)) {
            window.cateyesSingleWindow.location = codeurl;
        } else {
            window.cateyesSingleWindow = window.open(codeurl, '', `height=${Math.max(window.screen.height/2,520)},width=${Math.max(window.screen.width/2,800)},top=0,left=0`);
        }
    }

    //语音播报
    GlobalService.BroadcastSpeek = (function () {
        var utterThis = null;
        var speekTimer = null;
        var speekTimer2 = null;
        return function (text) {
            var dingdong = document.getElementById('global-broadcast-speek');
            if (!dingdong) {
                $('body').append('<audio style="display:none;" id="global-broadcast-speek" src="/assets/audio/dingdong.mp3" controls="controls"></audio>')
                dingdong = document.getElementById('global-broadcast-speek');
            }
            dingdong.play();
            window.speechSynthesis.speaking && window.speechSynthesis.cancel(utterThis);
            clearTimeout(speekTimer);
            clearTimeout(speekTimer2);
            speekTimer = setTimeout(function () {
                utterThis = new window.SpeechSynthesisUtterance(text);
                utterThis.lang = 'zh-cn';
                window.speechSynthesis.speak(utterThis);
                speekTimer2 = setTimeout(function () {
                    window.speechSynthesis.speak(utterThis);
                }, 1000);
            }, 2500);
        }
    })();


    //视频通话
    GlobalService.OpenVideoTalk = (function () {
        var lastUrl = null;
        return function (url) {
            var codeurl = encodeURI(encodeURI(url));
            if (window.GlobalVideoWindow && (!window.GlobalVideoWindow.closed)) {
                if (lastUrl != url && url) {
                    lastUrl = url;
                    // window.GlobalVideoWindow.focus();
                    window.GlobalVideoWindow.location = codeurl;
                }
            } else {
                lastUrl = null;
                window.GlobalVideoWindow = window.open(codeurl, '', `height=${window.screen.height/2},width=${window.screen.width/2},top=0,left=0`);
            }
        };
    })();
    GlobalService.CloseVideoTalk = function () {
        window.GlobalVideoWindow && window.GlobalVideoWindow.close && window.GlobalVideoWindow.close();
        window.GlobalVideoWindow = null;
    };

    //视频叫号屏
    GlobalService.OpenVideoClinicTipView = function (hospitalId) {
        if (window.GlobalVideoQueueWindow && (!window.GlobalVideoQueueWindow.closed)) {
            window.GlobalVideoQueueWindow.location =
                `video-queue.html?hospitalId=${hospitalId}`;
        } else {
            window.GlobalVideoQueueWindow = window.open(
                `video-queue.html?hospitalId=${hospitalId}`, '',
                `height=${window.screen.height},width=${window.screen.width},top=0,left=0,channelmode=yes`
            );
        }
        window.GlobalVideoQueueWindow.focus();
    };
    GlobalService.InitVideoClinicTipView = (function () {
        var inited = false;
        var callbacks = {
            VIDEO_CLINIC_HOSPITAL_TIP: function (content) {
                if (content.messageType == 'MESSAGE' && content.nextOne) {
                    if (window.GlobalVideoQueueWindow) {
                        window.GlobalVideoQueueWindow.refreshQueue(true);
                    }
                } else if (content.messageType == 'ACTION') {
                    if (window.GlobalVideoQueueWindow) {
                        window.GlobalVideoQueueWindow.refreshQueue();
                    }
                }
            }
        };
        GlobalService.AddVideoClinicTipViewCallback = function (key, callback) {
            callbacks[key] = callback;
        }
        GlobalService.TriggerVideoClinicTipViewCallback = function (key) {
            if (callbacks[key]) {
                callbacks[key].apply(null, [].slice.call(arguments, 1));
            }
        }
        GlobalService.removeVideoClinicTipViewCallback = function (key) {
            delete callbacks[key];
        }
        'VIDEO_CLINIC_HOSPITAL_TIP'

        function init() {
            if (inited) {
                return;
            }
            if (!GlobalService.getSystemConfig().videoClinicWebsocketPrefix) {
                console.error('缺少系统配置参数：videoClinicWebsocketPrefix');
            }
            var topic =
                `${GlobalService.getSystemConfig().videoClinicWebsocketPrefix}/business/ws?clientId=${GlobalService.getCurrentUserSync().user.userId}&clientType=ASSISTANT`;
            SunsetWebsocket.listen(topic, SunsetWebsocket.EVENTS.MESSAGE, (res) => {
                if (res.content) {
                    Object.keys(callbacks).forEach(key => {
                        if (Sunset.isFunction(callbacks[key])) {
                            callbacks[key](res.content);
                        }
                    })
                }
            });
            SunsetWebsocket.connect({
                url: topic,
                json: true
            });
        }
        return init;
    })();

    //扫码枪监听
    // var $saomaqiang = $(`<input id="saomaqiang-input" type="text" />`).appendTo($("body"));
    // var saomaqiangCallbacks = {};
    // var saomaqiangTimer = null;
    // $saomaqiang.on('change', function () {
    //     var v = this.value;
    //     this.value == "";
    //     saomaqiangTimer && Object.keys(saomaqiangCallbacks).forEach(key => {
    //         saomaqiangCallbacks[key](v);
    //     });
    // })
    GlobalService.listenSaomaqiang = function (topic, cb) {
        saomaqiangCallbacks[topic] = cb;
    }
    // GlobalService.saomaqiangStartWork = function () {
    //     GlobalService.saomaqiangStopWork();
    //     saomaqiangTimer = setInterval(() => {
    //         var active = document.activeElement;
    //         if (active.id != "saomaqiang-input" && active.tagName != "INPUT" && active.tagName != "TEXTAREA") {
    //             $saomaqiang.focus();
    //         }
    //     }, 500);
    // }
    // GlobalService.saomaqiangStopWork = function () {
    //     clearTimeout(saomaqiangTimer);
    //     saomaqiangTimer = null;
    // }

})(window);