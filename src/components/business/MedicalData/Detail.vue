<style lang="sass">
    .md-detail-wrap {
        position: absolute;
        top:0px;
        left:0px;
        right:0px;
        bottom:0px;
        width: 100%;
        border: 5px solid transparent;
        overflow-y:auto;
        .md-detail {
            width: 100%;
            height:auto;
            padding: 10PX;
            background: #FFF;
            border: 1px solid #E1E1E1;
            box-shadow: 2px 2px 5px #ddd;
            margin-bottom: 5px;
        }
    }
</style>


<template>
    <div class="md-detail-wrap">
        <div class="md-detail">
            <component v-if="widget" :is="widget" v-ref:detail :card="card" :data="cardData" :config="cardTemplate&&cardTemplate.config"
                @save="save" @new-card="newCard" @signal="operateSignal" @sunset-customform-dirty="changeDirty"></component>
        </div>
    </div>
</template>

<script>
    import MedicalDataStore from './MedicalDataStore.js';

    export default {
        data() {
            return {
                widget: null,
                cardTemplate: null,
                cardData: {}
            }
        },
        props: {
            patient: {

            },
            card: {

            },
            flow: {},
            edit: {}
        },
        ready() {
            this.init();
        },
        computed: {
            changed() {}
        },
        methods: {
            init() {
                var card = this.card;
                Promise.all([this.getCardConfig(card.viewName), this.getCardData(card)]).then(result => {
                    card.hasNew = false;
                    this.widget = `md-${card.viewName}-detail`;
                    this.cardTemplate = result[0];
                    this.cardData = result[1];
                });
            },
            save(cardDatas) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                var cardTemplate = this.cardTemplate,
                    card = this.card;
                if (!Sunset.isArray(cardDatas)) {
                    cardDatas = [cardDatas];
                };
                cardDatas.length && MedicalDataStore.saveCardData(cardDatas.map(cardData => {
                    return {
                        flowId: this.flow && this.flow.id,
                        hospitalId: this.patient.hospitalId,
                        patientId: card.patientId, //患者ID
                        // viewType: cardData.viewType || cardTemplate.viewType, //卡片类型，字典信息见说明
                        viewName: cardData.viewName || cardTemplate.viewName, //卡片名称
                        dataId: cardData.id || card.id, //真实ID
                        entity: Sunset.isObject(cardData.entity) ? JSON.stringify(cardData.entity) : cardData
                            .entity, //卡片实体数据(json字符串)
                        extension: Sunset.isObject(cardData.extension) ? JSON.stringify(cardData.extension) :
                            cardData.extension, //扩展信息，前台任意存储
                        digest: Sunset.isObject(cardData.digest) ? JSON.stringify(cardData.digest) : cardData
                            .digest, //摘要信息
                        registrationRecordId: card.registrationRecordId, //就诊记录ID
                        associatedCardId: cardData.associatedCardId //关联卡片数据ID
                    }
                })).then(res => {
                    var digest = {},
                        data = {};
                    res.forEach(item => {
                        try {
                            Object.assign(digest, item.digest);
                            Object.assign(data, item.extension);;
                        } catch (e) {
                            console.error(e);
                        }
                    });
                    this.card.lastModifyDate = res && res[0] && res[0].lastModifyDate;
                    this.card.digest = digest;
                    this.card.extension = data;
                    Sunset.tip('保存成功', 'success');
                    this.$emit('saved');
                });
            },
            getCardConfig(cardNo) {
                return MedicalDataStore.getCard(cardNo) || {};
            },
            getCardData(card) {
                return Promise.resolve().then(() => {
                    if (card && card.id) {
                        return MedicalDataStore.getCardsDetailData(card.id).then(res => {
                            var data = {};
                            if (res && res[0]) {
                                Object.assign(data, res[0].extension);
                            }
                            return data;
                        });
                    } else {
                        return null;
                    }
                });
            },
            operateSignal(signal) {
                if (signal == 'EDIT') {
                    this.card._editing = true;
                    if (arguments[1] === true) {
                        this.card._dirty = true;
                    }
                } else if (signal == 'CANCEL') {
                    this.$emit('close');
                } else if (signal == 'HOME') {
                    this.$emit('close');
                }
                this.$emit.apply(this, ['signal'].concat([].slice.call(arguments, 0)));
            },
            changeDirty() {
                this.card && (this.card._dirty = true);
            },
            newCard() {
                this.$emit.apply(this, ['edit-card'].concat([].slice.call(arguments)));
            }
        }
    }
</script>