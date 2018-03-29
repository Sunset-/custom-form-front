class EyeScreen {
    list(filter) {
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity',
                type: 'GET',
                data: filter
            });
        })
    }
    createActivity(data) {
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity',
                type: 'POST',
                data: data,
                json:true
            });
        })
    }
    getActivityMember(data) {
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/relation/hospital/user',
                type: 'GET',
                data: data
            });
        })
    }
    getActivityInfo(id) {
        return Promise.resolve().then(() => {
           return $http({
                url: `/service/business/activity/${id}`,
                type: 'GET'
            });
        })
    }
    createPatient(data) {
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity/register',
                type: 'POST',
                data: data
            });
        })
    }
    isRegistered(data) {
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity/has_register',
                type: 'GET',
                data: data
            });
        })
    }
    PatientList(data){
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity/register',
                type: 'GET',
                data: data
            });
        })
    }
}

export default new EyeScreen();