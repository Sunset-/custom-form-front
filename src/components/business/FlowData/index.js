// 注册医疗资料卡片

import Vue from 'vue';
//文件夹 名字
var cards = [
    'ConsultationApply',
    'TransferTreatment',
    'ApplyDicomReport',
    'OrderCheck'
    // 'RemoteReport'
];

cards.forEach(name => {
    var m = require(`./${name}/index`);
    Object.keys(m).forEach(mName => {
        m[mName].view && Vue.component(`flow-view-${mName}`, m[mName].view);
        m[mName].card && Vue.component(`flow-card-${mName}`, m[mName].card);
    })
});
