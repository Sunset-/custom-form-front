const members = {};

class DoctorPatient {
    // list(filter) {
    //     return $http({
    //         url: '/service/business/patient/list',
    //         type: 'GET',
    //         data: filter
    //     }).then(res => {
    //         res && res.rows.forEach(item => {
    //             if (item.firstRegistration && item.firstRegistration.digest) {
    //                 item.firstRegistration.digest = JSON.parse(item.firstRegistration.digest);
    //             }
    //         });
    //         return res;
    //     });
    // }

    // listLinkMe(filter) {
    //     return $http({
    //         url: '/service/business/patient/joined',
    //         type: 'GET',
    //         data: filter
    //     }).then(res => {
    //         res && res.rows.forEach(item => {
    //             if (item.firstRegistration && item.firstRegistration.digest) {
    //                 item.firstRegistration.digest = JSON.parse(item.firstRegistration.digest);
    //             }
    //         });
    //         return res;
    //     });
    // }
    
    list(filter) {
        return $http({
            url: '/service/business/patient/search',
            type: 'GET',
            data: filter
        }).then(res => {
            res && res.rows.forEach(item => {
                if (item.firstRegistration && item.firstRegistration.digest) {
                    item.firstRegistration.digest = JSON.parse(item.firstRegistration.digest);
                }
            });
            return res;
        });
    }
    
    getDate() {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/common/time',
                type: 'GET'
            })
        })
    }
    saveExperts(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/flow',
                type: 'POST',
                json: true,
                data: data
            })
        })
    }
    getRemoteData(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/flowlog',
                type: 'GET',
                data: data
            })
        })
    }
    getConsultList(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/flow',
                type: 'GET',
                data: data
            })
        })
    }
    getConsultDetail(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/card',
                type: 'GET',
                data: data
            })
        })
    }
    newPatient(data) {
        data.viewNames = GlobalService.getSystemConfig().addUserWithEmptyCards;
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/add',
                type: 'POST',
                data: data
            });
        })
    }
    getStore(name) {
        return localStorage.getItem(name);
    }
    save(name, data) {
        return Promise.resolve().then(() => {
            return localStorage.setItem(name, data);
        })
    }
    finishClinic(flowId) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/flow/finish',
                type: 'POST',
                data: {
                    flowId: flowId
                }
            });
        })
    }
    isRegistrationExist(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/patient/record/count_un_finish',
                type: 'GET',
                data: data
            });
        })
    }
    newRegistration(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/card',
                type: 'POST',
                json: true,
                data: data
            })
        })
    }
    newRegistrationCard(data) {
        return Promise.resolve().then(() => {
            return $http({
                url: '/service/business/registration/add',
                type: 'POST',
                data: data
            })
        })
    }
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

export default new DoctorPatient();