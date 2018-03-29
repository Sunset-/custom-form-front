const URLS = {
    LOAD_HOSPITAL: '/service/business/group/search',
    SAVE_HOSPITAL: '/service/business/group/add',
    UPDATE_HOSPITAL: '/service/business/group/update',
    GET_DOCTOR: '/service/business/relation/hospital/team',
    GET_ASSITANT: '/service/business/relation/hospital/user',
    RELATIVE_DOCTOR: '/service/business/v2.1/relation/hospital/user',
    RELATIVE_TEAM: '/service/business/v2.1/relation/hospital/team',
}

module.exports = {
    loadHospital(filter) {
        filter = filter || {};
        filter.category = Sunset.Service.Dictionary.alias('ORG_CODE', 'HOSPITAL');
        filter.pageNumber = 0;
        filter.pageSize = 999;
        return $http({
            url: URLS.LOAD_HOSPITAL,
            data: filter
        }).then(res => {
            return (res && res.rows || []).map(item => {
                item.extension = item.extension ? JSON.parse(item.extension) : {};
                return item;
            });
        })
    },
    saveHospital(model) {
        return $http({
            url: model.id ? URLS.UPDATE_HOSPITAL : URLS.SAVE_HOSPITAL,
            type: 'POST',
            json: true,
            data: model
        })
    },
    relativeDoctor(model) {
        return $http({
            url: URLS.RELATIVE_DOCTOR,
            type: 'POST',
            json: true,
            data: model
        })
    },
    relativeTeam(model) {
        return $http({
            url: URLS.RELATIVE_TEAM,
            type: 'POST',
            json: true,
            data: model
        })
    },
    loadAssistantInHospital(model) {
        return $http({
            url: URLS.GET_ASSITANT,
            type: 'GET',
            data: model
        })
    },
    loadDoctorInHospital(model) {
        return $http({
            url: URLS.GET_DOCTOR,
            type: 'GET',
            data: model
        })
    }
}