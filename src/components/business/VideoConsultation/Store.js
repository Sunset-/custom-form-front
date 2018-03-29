const URLS = {
    LOAD_RELS_FROM_A: '/service/business/scenes/partya',
    GET_DOCTOR: '/service/business/relation/hospital/team',//院外人员
    GET_ASSITANT: '/service/business/relation/hospital/user',//院内人员
    SUBMIT_FLOW:'/service/business/video_book',//发送视频预约
    ALL: '/service/business/relation/hospital/equipment',//获取设备
    EQUIPMENTPOST:'/service/business/ws_equipment/',//发送视频预约
    USERSETTING: '/service/business/user_settings',//current settingpeizhi
};
var CurrentUserCacheHolder = {
	cache: null
};

export default {
    loadRelsFromA(filter){
        console.log("filter");
        console.log(filter);
        return $http({
            url: URLS.LOAD_RELS_FROM_A,
            data : filter
        });
    },
    loadAssistantInHospital(model){
        return $http({
            url: URLS.GET_ASSITANT,
            type: 'GET',
            data: model
        })
    },
    loadDoctorInHospital(model){
        return $http({
            url: URLS.GET_DOCTOR,
            type: 'GET',
            data: model
        })
    },
    // 获取团队人员
    getTeamMembers(id){
        return Promise.resolve().then(()=>{
            return $http({
                url: `/service/business/expert_team/${id}`,
                type: 'GET'
            })
        })
    },





    // 提交预约视频
    submitFlow(data) {
        return $http({
            url: URLS.SUBMIT_FLOW,
            type: 'POST',
            json: true,
            data: data
        });
    },

    //  获取视频列表
    list(filter) {
        console.log(filter);
        // filter.status="";
        // filter.hospitalId="";
        // filter.systemId="";
        return $http({
            url: URLS.SUBMIT_FLOW,
            type: 'GET',
            data: filter
        }).then(data=>{
            data.rows&&data.rows.forEach(item=>{
                // item.flow.extension = JSON.parse(item.flow.extension);
                // item.dicomArchivesInfo = item.flow.extension.extension;
                // item.dicomArchivesInfo.dicomfileInfo = item.dicomArchivesInfo.dicomfile?JSON.parse(item.dicomArchivesInfo.dicomfile):{};
            });
            return data;
        })
    },
    // 获取设备
    loadAll(hospitalId) {
        return $http({
            url: URLS.ALL,
            data: {
                hospitalId
            }
        });
    },
    selectequipment(code) {
        return $http({
            url: URLS.ALL,
            data: {
                code
            }
        });
    },
    getTeamMembers(id){
        return $http({
            url: `/service/business/expert_team/${id}`,
            type: 'GET'
        })
    },
    //  ws => http
    wssquipment(code) {
        return $http({
            type: 'POST',
            json: true,
            url: URLS.EQUIPMENTPOST+code.equipmentId,
            data: code.body
        });
    },
// 发送常用设备信息配置
    usersetting(settings) {
        return $http({
            type: 'POST',
            json: true,
            url: URLS.USERSETTING,
            data: settings
        });
    },

}