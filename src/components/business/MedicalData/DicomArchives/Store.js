var CheckMethods_Cache = null;
var CheckPoints_Cache = null;
const URLS = {
    SAVE_VISITING: '/service/business/flow2'
};

var api = {
    getCheckMethods(type) {
        return Promise.resolve().then(() => {
            if (CheckMethods_Cache) {
                return CheckMethods_Cache;
            } else {
                return $http({
                    url: '/medical/check/templatebase'
                }).then(res => {
                    return CheckMethods_Cache = res;
                })
            }
        }).then(res => {
            if (Sunset.isString(type)) {
                return res.filter(item => item.classification == type);
            } else if (Sunset.isRegExp(type)) {
                return res.filter(item => type.test(item.classification));
            } else {
                return res;
            }
        })
    },
    getCheckPoints(type) {
        return Promise.resolve().then(() => {
            if (CheckMethods_Cache) {
                return CheckPoints_Cache;
            } else {
                return $http({
                    url: '/medical/check/templatepoint'
                }).then(res => {
                    return CheckPoints_Cache = res;
                })
            }
        }).then(res => {
            if (Sunset.isString(type)) {
                return res.filter(item => item.classification == type);
            } else if (Sunset.isRegExp(type)) {
                return res.filter(item => type.test(item.classification));
            } else {
                return res;
            }
        })
    },
    // 申请报告
    saveVisiting(model) {
        console.log(model);
        return $http({
            url: URLS.SAVE_VISITING,
            type: 'POST',
            data: model,
            json:true
        })
    },
}

GlobalService.getCheckMethods = function (type) {
    return api.getCheckMethods(type);
}
GlobalService.getCheckPoints = function (type) {
    return api.getCheckPoints(type);
}

module.exports = api;