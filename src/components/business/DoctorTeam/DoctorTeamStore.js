const URLS = {
    ALL: '/service/business/group/search',
    SAVE: '/service/business/group/add',
    UPDATE: '/service/business/group/update',
    REMOVE: '/service/business/group/member/delete',
    LOAD_DOCTORS: '/service/business/group/member/search',
    ADD_DOCTORS: '/service/business/group/member/batchAdd'
};

export default {
    loadAll() {
        return $http({
            url: URLS.ALL,
            data: {
                pageNumber: 0,
                pageSize: 999,
                category: Sunset.Service.Dictionary.alias('ORG_CODE', 'TEAM')
            }
        }).then(res => {
            return res && res.rows && res.rows.map(item => {
                item.extension = item.extension ? JSON.parse(item.extension) : {};
                return item;
            }) || [];
        });
    },
    save(model) {
        return $http({
            url: model.id ? URLS.UPDATE : URLS.SAVE,
            type: 'POST',
            json: true,
            data: model
        });
    },
    remove(model) {
        return $http({
            url: URLS.REMOVE,
            data: {
                organizationId: model.organizationId,
                memberEntityId: model.memberEntityId
            }
        });
    },
    loadDoctors(filter) {
        return $http({
            url: URLS.LOAD_DOCTORS,
            data: filter
        });
    },
    addDoctors(doctors) {
        return $http({
            url: URLS.ADD_DOCTORS,
            type: 'POST',
            json: true,
            data: doctors
        });
    }
}