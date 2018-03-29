<style lang="sass">
    .md-detail {
        .sunset-form .group-title {
            padding-left: 0px;
        }
        .sunset-field-label,
        .ivu-input,
        .sunset-form-field span {
            font-size: 14px;
        }
        .sunset-form-field .sunset-field-label {
            min-width: 100px !important;
        }
        .md-empty-detail {}
    }
</style>


<template>
    <div :class="['md-detail',cardData?'':'md-empty-detail']">
        <component v-if="widget" :is="widget" v-ref:detail :card="cardDigest" :route-data="routeData" :data="cardData" :print-data="printData "
            :config="cardTemplate&&cardTemplate.config" @save="save" @new-card="newCard" @signal="operateSignal" @sunset-customform-dirty="changeDirty"></component>
    </div>
</template>

<script>
    import MedicalDataStore from './MedicalDataStore.js';

    export default {
        data() {
            return {
                widget: null,
                cardTemplate: null,
                cardDigest: null,
                cardData: {},
                config: null,
                editingData: null,
                printData: null
            }
        },
        props: {
            options: {

            },
            routeData: {},
            patientInfo: {},
            flow: {},
            edit : {}
        },
        computed: {
            changed() {
                return
            }
        },
        methods: {
            set(cardDigest) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                this.cardDigest = cardDigest;
                // if(this.cardDigest&&!this.cardDigest._dirty){
                //     this.cardDigest._dirty = false;
                // }
                Promise.all([this.getCardConfig(cardDigest.viewName), this.getCardData(cardDigest)]).then(result => {
                    cardDigest.hasNew = false;
                    this.widget = `md-${cardDigest.viewName}-detail`;
                    this.cardTemplate = result[0];
                    this.cardData = result[1];
                    this.resumeEditingData();
                });
            },
            save(cardDatas) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                var cardTemplate = this.cardTemplate,
                    cardDigest = this.cardDigest;
                if (!Sunset.isArray(cardDatas)) {
                    cardDatas = [cardDatas];
                };
                cardDatas.length && MedicalDataStore.saveCardData(cardDatas.map(cardData => {
                    return {
                        flowId: this.flow && this.flow.flowId,
                        hospitalId: this.patientInfo.hospitalId,
                        patientId: cardDigest.patientId, //患者ID
                        viewType: cardData.viewType || cardTemplate.viewType, //卡片类型，字典信息见说明
                        viewName: cardData.viewName || cardTemplate.viewName, //卡片名称
                        dataId: cardData.id || cardDigest.id, //真实ID
                        entity: Sunset.isObject(cardData.entity) ? JSON.stringify(cardData.entity) : cardData
                            .entity, //卡片实体数据(json字符串)
                        extension: Sunset.isObject(cardData.extension) ? JSON.stringify(cardData.extension) :
                            cardData.extension, //扩展信息，前台任意存储
                        digest: Sunset.isObject(cardData.digest) ? JSON.stringify(cardData.digest) : cardData
                            .digest, //摘要信息
                        registrationRecordId: cardDigest.registrationRecordId, //就诊记录ID
                        associatedCardId: cardData.associatedCardId //关联卡片数据ID
                    }
                })).then(res => {
                    Sunset.tip('保存成功', 'success');
                    this.$emit('refresh', true);
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
                    this.cardDigest.lastModifyDate = res && res[0] && res[0].lastModifyDate;
                    this.cardDigest.digest = digest;
                    this.cardDigest.extension = data;
                    this.cardData = data;
                    if (cardTemplate.viewName == 'historyandbodycheck') {
                        this.cardDigest.id = `${res[0].id},${res[1].id}`;
                        if (res[0].viewName == 'patienthistory') {
                            this.cardData.historyCardId = this.cardDigest.historyCardId = res[0].id;
                            this.cardData.checkCardId = this.cardDigest.checkCardId = res[1].id;
                        } else {
                            this.cardData.historyCardId = this.cardDigest.historyCardId = res[1].id;
                            this.cardData.checkCardId = this.cardDigest.checkCardId = res[0].id;
                        }
                    } else {
                        this.cardData.id = this.cardDigest.id = res[0].id;
                    }
                    this.$emit('signal', 'SAVED', cardTemplate.viewName);
                    if (this.cardDigest.viewName == 'registration') {
                        this.$emit('signal', 'HOME');
                    }
                    this.cardDigest._editing = false;
                });
            },
            getCardConfig(cardNo) {
                return MedicalDataStore.getCard(cardNo) || {};
            },
            getCardData(cardDigest) {
                return Promise.resolve().then(() => {
                    if (cardDigest && cardDigest.id) {
                        if (cardDigest.viewName == 'historyandbodycheck') {
                            return MedicalDataStore.getCardsDetailData(cardDigest.id).then(res => {
                                var data = {};
                                res && res.forEach(item => {
                                    try {
                                        Object.assign(data, item.extension);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                });
                                data.historyCardId = cardDigest.historyCardId;
                                data.checkCardId = cardDigest.checkCardId;
                                return data;
                            });
                        } else {
                            return MedicalDataStore.getCardsDetailData(cardDigest.id).then(res => {
                                var isAssistant = GlobalService.getCurrentUserSync().user.userType ==
                                    Sunset.Service
                                    .Dictionary
                                    .alias(
                                        'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT');
                                var data = this.edit && isAssistant ? null : {};
                                if (res && res[0]) {
                                    try {
                                        if (data) {
                                            Object.assign(data, res[0].extension);
                                        } else {
                                            data = res[0].extension;
                                        }
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }
                                return data;
                            });
                        }
                    } else {
                        return null;
                    }
                });
            },
            operateSignal(signal) {
                if (signal == 'EDIT') {
                    this.cardDigest._editing = true;
                    if (arguments[1] === true) {
                        this.cardDigest._dirty = true;
                    }
                } else if (signal == 'CANCEL') {
                    this.cardDigest._editing = false;
                    GlobalService.uploadingStatus = {};
                } else if (signal == 'HOME') {
                    GlobalService.uploadingStatus = {};
                }
                this.$emit.apply(this, ['signal'].concat([].slice.call(arguments, 0)));
            },
            resumeEditingData() {
                var v = this.cardDigest;
                if (v._editing) {
                    this.editingData = v._editing_data;
                    this.$nextTick(() => {
                        this.$refs.detail.setEditingData && this.$refs.detail.setEditingData(v._editing_data);
                    });
                } else {
                    this.editingData = null;
                }
            },
            changeDirty() {
                this.cardDigest && (this.cardDigest._dirty = true);
            },
            newCard() {
                this.$emit.apply(this, ['new-card'].concat([].slice.call(arguments)));
            }
        },
        watch: {
            cardDigest(v, oldV) {
                if (oldV && oldV._editing) {
                    Promise.resolve(this.$refs.detail.getEditingData && this.$refs.detail.getEditingData()).then(data => {
                        oldV._editing_data = data;
                    });
                }
            },
            cardData() {
                this.resumeEditingData();
            }
        }
    }
</script>