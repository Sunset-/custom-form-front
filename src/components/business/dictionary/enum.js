const DictionaryMap = {
    PATIENT_SEX: {
        '0': '男',
        '1': '女',
        '2': '不详'
    },
    DICOM_TYPE: {
        CT: 'CT',
        MR: 'MR',
        DX: 'DX',
        DSA: 'DSA',
        MG: 'MG',
        CR: 'CR'
    },
    PATIENT_HOSPITAL_TYPE: {
        '1': '门诊',
        '2': '住院',
        '4': '体检',
        '8': '急诊'
    },
    EXPERT_TYPE: {
        '1': '医生',
        '2': '医生团队'
    },
    REPORT_STATUS: {
        '0': '未报告',
        '1': '已书写',
        '3': '待审核',
        '4': '已审核',
        '5': '驳回'
    },
    REPORT_TASK_STATUS: {
        '1': '待处理',
        '2': '待分配',
        '3': '待处理',
        '4': '正在处理',
        '5': '处理完成',
        '6': '已归档',
        '7': '已退回',
        '8': '申请取消',
        '9': '已取消'
    },
    TASK_BACK_REASON: {
        '1': {
            alias: 'IMAGE',
            text: '因图像质量原因被退回。'
        },
        '2': {
            alias: 'NEED_INFO',
            text: '因患者信息描述太少被退回。'
        },
        '3': {
            alias: 'PATIENT_IMAGE',
            text: '患者信息与图像不符被退回。'
        },
        '4': {
            alias: 'CHECK_POINT',
            text: '因检查部位与图像显示不符被退回。'
        }
    },
    CUSTOMER_TASK_UPLOAD_STATUS: {
        '0': '成功',
        '1': '上传中',
        '2': '上传完成',
        '3': '上传中',
        '5': '失败',
        '6': '重复提交'
    },
    DORCTOR_REPORT_PRIVILEGE: {
        '1': '实习',
        '2': '写报告',
        '3': '审核报告'
    },
    DOCTOR_TEAM_MEMBER_TYPE: {
        '0': '普通成员',
        '1': '管理员',
        '2': '超级管理员',
        '3': '团队创建人'
    },
    HOSPITAL_DOCTOR_TYPE: {
        // '0': '科主任',
        '1': '影像医生',
        '2': '临床医生',
        '3': '技师'
    },
    SEX: {
        '0': '男',
        '1': '女'
    },
    DUTY: {
        '0': '副主任',
        '1': '主任',
        '2': '副院长',
        '3': '院长'
    },
    HOSPITAL_DUTY: {
        '0': '技师',
        '1': '住院医师',
        '2': '主治医师',
        '3': '副主任医师',
        '4': '主任医师',
        '5': '技士',
        '6': '主管技师',
        '7': '副主任技师',
        '8': '主任技师'
    },
    EDUCATIONAL_TITLE: {
        '0': '助教',
        '1': '讲师',
        '2': '副教授',
        '3': '教授'
    }
};


const enums = [];
Object.keys(DictionaryMap).forEach(type => {
    Object.keys(DictionaryMap[type]).forEach(key => {
        var value = DictionaryMap[type][key],
            alias;
        if (Sunset.isObject(value)) {
            alias = value.alias;
            value = value.text;
        }
        enums.push({
            type: type,
            key: key,
            value: value,
            alias: alias
        });
    });
});

module.exports = enums;