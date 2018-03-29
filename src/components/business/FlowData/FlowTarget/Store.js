const URLS = {
    LOAD_RELS_FROM_A: '/service/business/scenes/partya'
};

export default {
    loadRelsFromA(filter){
        return $http({
            url: URLS.LOAD_RELS_FROM_A,
            data : filter
        });
    }
}