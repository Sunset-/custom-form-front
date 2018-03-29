const URLS = {
    ALL_CARDS: '/service/business/view',
    GET_CARD: '/service/business/view',
    GET_CARD_DATA: '/service/business/card',
    SAVE_CARD_DATA: '/service/business/card',
    REMOVE_CARD: '/service/business/card/delete',
    GET_VISITINGCARDS_BY_RECORDIDS: '/service/business/registration/search'
}

const Card_Cache = {};

var CardDetail_Cache = {};

export default {
    //获取所有卡片配置
    getAllCards: Sunset.wait(function () {
        return $http({
            url: URLS.ALL_CARDS,
            data: {
                systemId: GlobalService.getSystemId()
            }
        }).then(res => {
            var result = {};
            res && res.forEach(item => {
                result[item.viewName] = this._cast(item);
            });
            return result;
        });
    }, Card_Cache),
    //获取单个卡片配置
    getCard(cardNos) {
        cardNos = cardNos && cardNos.split(',');
        return this.getAllCards().then(cache => {
            if (cardNos.length == 1) {
                return cache[cardNos[0]];
            } else {
                return cardNos.map(no => cache[no]);
            }
        });
    },
    _cast(card) {
        if (card) {
            try {
                if (card.operation) {
                    var config = {};
                    var operation = JSON.parse(card.operation);
                    if (operation.other) {
                        try {
                            Object.assign(config, eval('(' + operation.other + ')'));
                            delete operation.other;
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    Object.assign(config, operation);
                    card.config = config;
                }
            } catch (e) {
                console.error(e);
            }
        }
        return card;
    },
    //通过患者ID获取就诊记录
    loadVisitingRecords(patientId, pageSize) {
        return $http({
            url: URLS.GET_CARD_DATA,
            data: {
                patientId,
                includeViewName: 'registration',
                pageNumber: 0,
                pageSize: pageSize || 999,
                order: 'DESC'
            }
        }).then(res => {
            return res && this._castCard(res.rows) || [];
        });
    },
    //通过就诊id获取卡片列表数据
    getCardsData(patientId, registrationRecordId) {
        return $http({
            url: URLS.GET_CARD_DATA,
            data: {
                patientId,
                registrationRecordId,
                excludeViewName: 'registration,patient',
                pageNumber: 0,
                pageSize: 999,
                order: 'ASC'
            }
        }).then(res => {
            return res && this._castCard(res.rows) || [];
        });
    },
    //获取卡片详情数据
    getCardsDetailData(cardIds) {
        return Promise.resolve().then(() => {
            var result = [];
            var ids = cardIds.split(','),
                unCacheIds = [];
            ids.forEach(id => {
                if (CardDetail_Cache[id]) {
                    result.push(CardDetail_Cache[id])
                } else {
                    unCacheIds.push(id);
                }
            });
            if (!unCacheIds.length) {
                return result;
            } else {
                return $http({
                    url: URLS.GET_CARD_DATA,
                    data: {
                        cardIds: unCacheIds.join(','),
                        pageNumber: 0,
                        pageSize: 999
                    }
                }).then(res => {
                    var cardDatas = res && this._castCard(res.rows) || [];
                    cardDatas.forEach(cd => {
                        CardDetail_Cache[cd.id] = cd;
                    });
                    result = result.concat(cardDatas);
                    return result;
                });
            }
        });
    },
    _castCard(cards) {
        cards && cards.forEach(card => {
            if (card.digest) {
                try {
                    card.digest = JSON.parse(card.digest);
                } catch (e) {
                    console.error(e);
                }
            }
            card.digest = card.digest || {};
            if (card.extension) {
                try {
                    card.extension = JSON.parse(card.extension);
                } catch (e) {
                    console.error(e);
                }
            }
            card._editing = false;
        });
        return cards;
    },
    //保存卡片数据
    saveCardData(datas) {
        if (!Sunset.isArray(datas)) {
            datas = [datas];
        }
        return $http({
            url: URLS.SAVE_CARD_DATA,
            type: 'POST',
            json: true,
            data: datas
        }).then(res => {
            var cardDatas = res && this._castCard(res) || [];
            cardDatas.forEach(cd => {
                CardDetail_Cache[cd.id] = cd;
            });
            return cardDatas;
        });
    },
    clearCardCache() {
        CardDetail_Cache = {};
    },
    removeCards(ids) {
        return $http({
            url: URLS.REMOVE_CARD,
            type: 'POST',
            data: {
                ids
            }
        })
    },
    getVisitingcardsByRecordids(recordIds) {
        return $http({
            url: URLS.GET_VISITINGCARDS_BY_RECORDIDS,
            data: {
                recordIds
            }
        }).then(res => {
            var cardDatas = res && this._castCard(res) || [];
            cardDatas.forEach(cd => {
                CardDetail_Cache[cd.id] = cd;
            });
            return res;
        });
    }
}