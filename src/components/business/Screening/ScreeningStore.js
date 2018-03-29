class Screening {
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
                data: data,
                json:true
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
    creatPatient(data) {
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity/register',
                type: 'POST',
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
    ActivityCount(id){
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/activity/stats',
                type: 'GET',
                data: id
            });
        })
    }
}

export default new Screening();