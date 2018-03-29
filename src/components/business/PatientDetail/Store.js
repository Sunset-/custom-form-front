const URLS = {
    SAVE_VISITING: '/service/business/registration/add'
};

export default {
    saveVisiting(model) {
        return $http({
            url: URLS.SAVE_VISITING,
            type: 'POST',
            data: model
        })
    },
    getDate() {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/common/time',
                type: 'GET'
            })
        })
    },
    getTeams(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/relation/hospital/team',
                type: 'GET',
                data: data
            })
        })
    },
    doctorInFlow(id) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/flow/processing_experts',
                type: 'GET',
                data: {
                    patientId: id
                }
            })
        })
    },
    saveExperts(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/flow',
                type: 'POST',
                json: true,
                data: data
            })
        })
    },
    isRegistrationExist(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/record/count_un_finish',
                type: 'GET',
                data: data
            });
        })
    },
    newRegistration(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/card',
                type: 'POST',
                json: true,
                data: data
            })
        })
    },
    savePatient(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/card',
                type: 'POST',
                json: true,
                data: data
            })
        })
    },
    isTriaged(id) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business//flow/is_wait_triage',
                type: 'GET',
                data: {
                    patientId: id
                }
            })
        })
    }
}