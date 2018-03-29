import DictionaryStore from '../dictionary/DictionaryStore';

const URLS = {
    LIST: '/service/discoveries/list',
    GET_BY_ID: '/service/discoveries/list/{id}',
    ADD_COMMENT: '/service/comment/add',
    COMMENTS: '/service/comment/list'
}

module.exports = {
    MedicalBodyCategoryMap: null,
    DiseaseVarietyMap: null,
    list(filter, lastItem) {
        var params = Object.assign({}, filter);
        if (lastItem) {
            params.createDate = lastItem.createDate;
            params.lastDiscId = lastItem.id;
        }
        params.createBy = 'peaimage';
        params.size = 10;
        return Promise.all([
            $http({
                url: URLS.LIST,
                data: params
            }),
            Promise.resolve().then(() => {
                if (this.MedicalBodyCategoryMap) {
                    return this.MedicalBodyCategoryMap;
                } else {
                    return DictionaryStore.getMedicalBodyCategory().then(res => {
                        var map = {};
                        res && res.forEach(item => {
                            map[item.value] = item.name;
                        });
                        return this.MedicalBodyCategoryMap = map;
                    });
                }
            }),
            Promise.resolve().then(() => {
                if (this.DiseaseVarietyMap) {
                    return this.DiseaseVarietyMap;
                } else {
                    return DictionaryStore.getDiseaseVariety().then(res => {
                        var map = {};
                        res && res.forEach(item => {
                            map[item.value] = item.name;
                        });
                        return this.DiseaseVarietyMap = map;
                    });
                }
            })
        ]).then(res => {
            var MedicalBodyCategoryMap = this.MedicalBodyCategoryMap,
                DiseaseVarietyMap = this.DiseaseVarietyMap,
                list = res && res[0] || [];
            list.forEach(item => {
                var labels = [];
                labels.push({
                    text: MedicalBodyCategoryMap[item.medicalBodyCategory],
                    color : 'warning'
                });
                labels.push({
                    text: DiseaseVarietyMap[item.diseaseVariety],
                    color : 'danger'
                });
                item.labels = labels;
            });
            return list;
        });
    },
    getById(id) {
        return $http({
            url: URLS.GET_BY_ID.replace(/\{id\}/, id)
        }).then(res => {
            if (res && res.imageInfo) {
                try {
                    res.imageInfo = JSON.parse(res.imageInfo);
                } catch (e) {
                    console.error('影像信息JSON格式错误');
                }
            }
            return res;
        })
    },
    listComments(topicId, filter) {
        return $http({
            url: URLS.COMMENTS,
            data: {
                topicId: topicId,
                select: JSON.stringify(filter)
            }
        });
    },
    addComment(comment) {
        return $http({
            url: URLS.ADD_COMMENT,
            type: 'POST',
            data: comment
        });
    }
};