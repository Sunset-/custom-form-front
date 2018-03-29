class AssistantStore extends Sunset.Service.Store {

    constructor() {
        super();
    }

    URLS = {
        LIST: '/service/business/v2.1/agency',
        SAVE: '/service/business/v2.1/agency'
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

}

export default new AssistantStore();