;
import Vue from 'vue';

var Base = window.Base = {};

//业务钩子
Base.hooks = {};

//系统基础类
Base.transcode = function (type, value) {
    return Base.ENUM_MAP && Base.ENUM_MAP[type] && Base.ENUM_MAP[type][value] || value;
}
Base.dictionary = function (type) {
    return Base.ENUMS && Base.ENUMS[type] || [];
}

//业务基础类
Base.transformNfsFilePath = function (id) {
    return '/upload/api/1.0.0/file/acquisition/' + id;
};
Base.transformDicomThumbnail = function (id) {
    return '/dicom-service/fileRes/dcmPicture?listId=' + id;
};
Base.transformCateyesUrl = function (id) {
    return '/cateyes/cateyes.html?studyIds=' + id + `&which=dicom-service`;
};
Base.openCateyes = function (id, isLocalImage, hidePatientInfo) {
    return window.open(`/cateyes/cateyes.html?studyIds=${id}&which=dicom-service&show=${hidePatientInfo?'false':'true'}`);
}
Base.openEagleeyes = function (id, type) {
    return window.open(`/eagleeyes/eagleeyes.html?studyIds=${id}&type=${type}`, '', `height=${window.screen.height},width=${window.screen.width},top=0,left=0,channelmode=yes`);
}
const DEFAULT_IMAGE = {
    DEFAULT: '/assets/img/icon-img.png',
    TEAM: '/assets/img/team-error.png',
    DOCTOR: '/assets/img/default.png',
    USER: '/assets/img/user-default.png'
}
Base.defaultImage = function (type) {
    return DEFAULT_IMAGE[type] || DEFAULT_IMAGE.DEFAULT;
}


/**
 * 业务DICOM缩略图路径转换
 */
Vue.filter('dicom-thumbnail', function (value) {
    return Base.transformDicomThumbnail(value);
});

/**
 * 业务NFS文件路径转换
 */
Vue.filter('upload-image', function (value) {
    return Base.transformNfsFilePath(value);
});

/**
 * 报告副标题
 */
Vue.filter('DeviceSubTitle', function (type) {
    if (type == 'CT') {
        return 'CT检查报告单';
    } else if (type == 'MR') {
        return '核磁检查报告单';
    } else {
        return '放射检查报告单';
    }
});
Vue.filter('age', function (age) {
    if (parseInt(age) == age) {
        return `${age}岁`;
    } else {
        return age;
    }
});
Vue.filter('qrcode', function (url) {
    return url && jrQrcode.getQrBase64(url) || '';
});


/**
 * 计算年龄
 */
Base.calculateAge = function (birthday, date) {
    var age = '';
    if (birthday && date) {
        if ((date).getFullYear() -
            (birthday).getFullYear() ==
            0) {
            if ((date).getMonth() -
                (birthday).getMonth() ==
                0) {
                return age = (
                        date
                    ).getDate() - (
                        birthday)
                    .getDate() + ',' +
                    '天'
            } else {
                if (date
                    .getMonth() - birthday.getMonth() ==
                    1 && date
                    .getDate() < birthday
                    .getDate()) {
                    return age =
                        31 - (birthday
                            .getDate() -
                            date
                            .getDate()) +
                        ',' + '天'
                } else {
                    return age =
                        (date)
                        .getMonth() - (
                            birthday
                        ).getMonth() +
                        ',' + '月'
                }
            }
        } else {
            if (date.getFullYear() -
                birthday.getFullYear() ==
                1 && date
                .getMonth() < birthday
                .getMonth()) {
                if (date
                    .getDate() < birthday
                    .getDate()) {
                    return age =
                        12 - (birthday
                            .getMonth() -
                            date
                            .getMonth()
                        ) + ',' + '月'
                } else if (date
                    .getDate() > birthday
                    .getDate()) {
                    return age =
                        13 - (birthday
                            .getMonth() -
                            date
                            .getMonth()
                        ) + ',' + '月'
                }
            } else if (date
                .getFullYear() - birthday
                .getFullYear() == 1 &&
                date.getMonth() ==
                birthday.getMonth() &&
                date.getDate() <
                birthday.getDate()
            ) {
                return age = 12 -
                    (birthday.getMonth() -
                        date
                        .getMonth()) +
                    ',' + '月';
            } else {
                return age = (
                        date
                    ).getFullYear() - (
                        birthday)
                    .getFullYear() +
                    ',' + '岁'
            }
        }
    }
};

/**
 * 分享链接生成
 */
Base.Share = {};
//QQ分享
Base.Share.QQ = function (options) {
    var pics = '';
    if (options.pics && Array.isArray(options.pics)) {
        pics = options.pics[0];
    } else if (options.pics) {
        pics = options.pics;
    }
    let config = {
        url: options.url,
        desc: '',
        title: options.title || '',
        summary: options.summary || '',
        pics: pics,
        falsh: '',
        site: 'QQ',
        style: '201',
        width: 32,
        height: 32
    };
    let c = [];
    for (let k in config) {
        c.push(k + '=' + encodeURIComponent(config[k]));
    }
    return 'http://connect.qq.com/widget/shareqq/index.html?' + c.join('&');
}
//微博分享
Base.Share.Sina = function (options) {
    var pics = '';
    if (options.pics && Array.isArray(options.pics)) {
        for (var i = 0, len = options.pics.length; i < len; i++) {
            if (i > 0) {
                pics += '||';
            }
            pics += options.pics[i];
        }
    }
    const config = {
        url: options.url,
        title: options.title || '',
        summary: options.summary || '',
        pic: pics,
        language: 'zh_cn',
        searchPic: 'true',
        style: 'number'
    };
    let c = [];
    for (let k in config) {
        c.push(k + '=' + encodeURIComponent(config[k]));
    }
    return 'http://service.weibo.com/share/share.php?' + c.join('&');
}
//微信分享
Base.Share.Wechat = function (options) {
    return jrQrcode.getQrBase64(options.url);
}
//读取身份证信息
Base.getIDCardInfo = function () {
    let getRandomNum = function () {
        var random = parseInt(Math.random() * 10000);
        return random;
    };
    let getAge = function (value) {
        let curTime = new Date();
        let birthday = new Date();
        birthday.setFullYear(value.substring(0, 4));
        birthday.setMonth(parseInt(value.substring(4, 6) - 1));
        birthday.setDate(value.substring(6, 8));
        let age = '';
        if (curTime.getFullYear() - birthday.getFullYear() == 0) {
            if (curTime.getMonth() - birthday.getMonth() == 0) {
                age = curTime.getDate() - birthday.getDate() + ',' + '天'
            } else {
                if (curTime.getMonth() - birthday.getMonth() == 1 && curTime.getDate() < birthday.getDate()) {
                    age = 31 - (birthday.getDate() - curTime.getDate()) + ',' + '天'
                } else {
                    age = curTime.getMonth() - (birthday).getMonth() + ',' + '月'
                }
            }
        } else {
            if (curTime.getFullYear() - birthday.getFullYear() == 1 && curTime.getMonth() < birthday.getMonth()) {
                if (curTime.getDate() < birthday.getDate()) {
                    age = 12 - (birthday.getMonth() - curTime.getMonth()) + ',' + '月'
                } else if (curTime.getDate() > birthday.getDate()) {
                    age = 13 - (birthday.getMonth() - curTime.getMonth()) + ',' + '月'
                }
            } else if (curTime.getFullYear() - birthday.getFullYear() == 1 && curTime.getMonth() == birthday.getMonth() && curTime.getDate() < birthday.getDate()) {
                age = 12 - (birthday.getMonth() - curTime.getMonth()) + ',' + '月';
            } else {
                age = curTime.getFullYear() - (birthday).getFullYear() + ',' + '岁'
            }
        }
        return age
    };
    let getSex = function (value) {
        if (value == '男') {
            value = '0';
        } else if (value == '女') {
            value = '1';
        } else {
            value = '2';
        }
        return value;
    };
    let birthday = function (value) {
        var y = value.slice(0, 4),
            m = value.slice(4, 6) - 1,
            d = value.slice(6, 8);
        return new Date(y, m < 10 ? '0' + m : m, d)
    };
    let obj = {};
    //接口返回值
    // const interfaceResult= 
    // {
    //     0:{mean:"成功",message:"二代身份证读取成功！",type:"success"},
    //     1:{mean:"端口打开失败",message:"未检测到二代身份证阅读器！",type:"warning"},
    //     2:{mean:"数据传输超时",message:"未检测到二代身份证阅读器！",type:"error"},
    //     10:{mean:"没有找到卡",message:"未读取到身份证，请重新刷卡！",type:"warning"},
    //     11:{mean:"读卡操作失败",message:"未检测到二代身份证阅读器！",type:"error"},
    //     20:{mean:"自检失败",message:"二代身份证读取失败！",type:"error"},
    //     30:{mean:"其他错误",message:"二代身份证读取失败！",type:"error"},
    //     40:{mean:"相片解码失败",message:"二代身份证读取失败！",type:"error"},
    //     100:{mean:"超时",message:"未读取到身份证，请重新刷卡！",type:"warning"},
    //     200:{mean:"GetBase64PhotoData",message:"二代身份证读取失败！",type:"error"}
    // },
    return $.ajax({
            url: "http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&common=1" + "&random=" + getRandomNum()
        }).then(res => {
            let data = eval('(' + res + ')');
            if (data.ret == 0) {
                obj.name = data.Certificate.Name;
                obj.sex = getSex(data.Certificate.Sex);
                obj.number = data.Certificate.IDNumber;
                obj.age = getAge(data.Certificate.Birthday);
                obj.addr = data.Certificate.Address;
                obj.birthday = birthday(data.Certificate.Birthday);
                return obj;
            }
        })
        .catch(err => {
            console.log(err)
        });
}

module.exports = Base;