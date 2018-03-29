var validators = {};

//身份证
validators['IdCard'] = {
    message: '身份证格式不合法',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return true
        }else{
            return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(v);
        }
    }
};
//用户名
validators['userName'] = {
    message: '4-24位数字、字母、下划线及汉字组合',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return true
        }else{
            return /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,24}$/.test(v);
        }
    }
};
//姓名 名称
validators['fullName'] = {
    message: '2-18位数字、字母、下划线、间隔号及汉字组合',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return true
        }else{
            return /^[a-zA-Z0-9_·\u4e00-\u9fa5]{2,18}$/.test(v);
        }
    }
};
//医院名称
validators['hospitalName'] = {
    message: '2-50位数字、字母、下划线及汉字组合',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return true
        }else{
            return /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,50}$/.test(v);
        }
    }
};
//编号（数字加字母）
validators['uniqueNumber'] = {
    message: '仅支持4至20位数字',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return true
        }else{
            return /^[0-9]{4,20}$/.test(v);
        }
    }
};
//日期
validators['dateRequired'] = {
    message: '不能为空',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return false
        }else{
            var date = v.split(',');
            return date[0]&&v[1];
        }
    }
};
//年龄
validators['validateAge'] = {
    message: '年龄格式不合法',
    check: function (v) {
        if(v == undefined || v.trim()==""){
            return false
        }else{
            return /^[0-9]{1,3}$/.test(v.split(",")[0]);
        }
    }
};
//眼科筛查活动地点
validators['validateAddr'] = {
    message: '地址不合法',
    check: function (v) {
        if(v == undefined || v.trim()=="" || v.indexOf("请选择")==0 || v.indexOf("请选择")==v.length-3){
            return false
        }else{
            return true
        }
    }
};

module.exports = validators;