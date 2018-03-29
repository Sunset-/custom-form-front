const URLS = {
    ALL: '/service/business/group/search',
    SAVE: '/service/business/group/add',
    UPDATE: '/service/business/group/update',
    REMOVE: '/service/business/group/member/delete/{memberId}',
    LOAD_MEMBERS: '/service/business/group/member/search',
    ADD_MEMBERS: '/service/business/group/member/batchAdd',
    LOAD_RELS_FROM_A: '/service/business/scenes/partya',
    SAVE_REL: '/service/business/scenes/add_update',
    REMOVE_REL: '/service/business/scenes/delete/{id}'
};

export default {
    loadAll() {
        return $http({
            url: URLS.ALL,
            data: {
                pageNumber: 0,
                pageSize: 999,
                category: Sunset.Service.Dictionary.alias('ORG_CODE', 'SCENES')
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
    remove(memberId) {
        return $http({
            url: URLS.REMOVE.replace(/\{memberId\}/, memberId)
        });
    },
    loadMembers(filter) {
        filter.pageSize = 9999;
        return $http({
            url: URLS.LOAD_MEMBERS,
            data: filter
        });
    },
    addMembers(members) {
        return $http({
            url: URLS.ADD_MEMBERS,
            type: 'POST',
            json: true,
            data: members
        });
    },
    saveRel(rel) {
        return $http({
            url: URLS.SAVE_REL,
            type: 'POST',
            json: true,
            data: rel
        });
    },
    removeRel(id) {
        return $http({
            url: URLS.REMOVE_REL.replace(/\{id\}/, id),
            type: 'POST'
        });
    },
    loadRelsFromA(filter){
        return $http({
            url: URLS.LOAD_RELS_FROM_A,
            data : filter
        });
    }
}