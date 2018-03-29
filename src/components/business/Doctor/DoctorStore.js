class DoctorStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    URLS = {
        LIST: '/service/business/agency',
        SAVE: '/service/business/agency',
        REVIEW: '/service/business/agency/review'
    }

    METHODS = {
        SAVE : 'POST'
    }

    callbacks = {
        beforeSave(params) {
            params.json = true;
            return params;
        }
    }
    retPwd(data){ 
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/safety/rpwd',
                type: 'POST',
                data:data
            });
        })
    }
    delete(userId){
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/agency/user/virtual_delete',
                type: 'GET',
                data:{
                    userId:userId
                }
            });
        })
    }
    isExist(data){
        return Promise.resolve().then(() => {
           return $http({
                url: '/service/business/user/exist',
                type: 'GET',
                data:data
            });
        })
    }
    review(userId,isPass){
        return $http({
            url: this.URLS.REVIEW,
            type: 'POST',
            data : {
                userId : userId,
                isPass : !!isPass
            }
        });
    }

}

export default new DoctorStore();