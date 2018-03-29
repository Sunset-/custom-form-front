const URLS = {
    LOAD_HOSPITAL: '/service/business/v2.1/hospital',
    SAVE_HOSPITAL: '/service/business/v2.1/hospital',
    GET_DOCTOR: '/service/business/relation/hospital/team',
    GET_ASSITANT: '/service/business/relation/hospital/user',
    RELATIVE_DOCTOR: '/service/business/v2.1/relation/hospital/user',
    RELATIVE_TEAM: '/service/business/v2.1/relation/hospital/team',
}

module.exports = {
    relativeDoctor(model){
        return $http({
            url: URLS.RELATIVE_DOCTOR,
            type: 'POST',
            json: true,
            data: model
        })
    },
    relativeTeam(model){
        return $http({
            url: URLS.RELATIVE_TEAM,
            type: 'POST',
            json: true,
            data: model
        })
    },
    loadHospital(filter) {
        filter = filter || {};
        filter.pageNumber = 0;
        filter.pageSize = 999;
        return $http({
            url: URLS.LOAD_HOSPITAL,
            data: filter
        }).then(res => {
            return res && res.rows || [];
        })
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
    saveHospital(model) {
        return $http({
            url: URLS.SAVE_HOSPITAL,
            type: 'POST',
            json: true,
            data: model
        })
    }
}