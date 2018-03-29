const URLS = {
    ALL: '/service/business/relation/hospital/equipment',
    SAVE: '/service/business/relation/hospital/equipment',
    REMOVE: '/service/business/relation/hospital/equipment/del',

};

export default {
    loadAll(hospitalId) {
        return $http({
            url: URLS.ALL,
            data: {
                hospitalId
            }
        });
    },
    save(model) {
        return $http({
            url: URLS.ALL,
            type: 'POST',
            json: true,
            data: model
        });
    },
    remove(id) {
        return $http({
            url: URLS.REMOVE,
            type: 'POST',
            data: {
                ids: id
            }
        });
    }
}