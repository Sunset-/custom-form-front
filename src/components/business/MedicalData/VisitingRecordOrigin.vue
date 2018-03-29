<style lang="sass">
    .visiting-records {
        width: 275px;
        min-height: 100%;
        .visiting-record {
            width: 100%;
            padding-bottom: 10px;
            .visiting-title {
                position: relative;
                padding: 10px 0px;
                padding-left: 15px;
                text-align: left;
                color: #777;
                border-radius: 100px;
                cursor: pointer;
                background: #cdcdcd;
                width: 275px;
                .visiting-label {
                    position: absolute;
                    right: 20px;
                    top: 0px;
                    padding: 1px 5px;
                    background: #999999;
                    border-radius: 0px 0px 3px 3px;
                }
                a {
                    color: #777;
                    text-decoration: underline;
                    font-size: 12px;
                    margin-left: 5px;
                }
            }
            .visiting-content {
                display: none;
                margin-left: 15px;
                padding-top: 15px;
            }
            .visiting-footer {
                margin-left: 15px;
                height: 0px;
            }
            &.active {
                .visiting-title {
                    background: #0099FF;
                    color: #FFF;
                    .visiting-label {
                        background: #4BB6FE;
                    }
                    a {
                        color: #FFF;
                    }
                }
                .visiting-content {
                    display: block;
                }
            }
        }
    }
</style>
<template>
    <div :class="['visiting-record',active?'active':'']">
        <div class="visiting-title" @click="activeRecord">
            {{safeVisiting.registeredDate | time 'yyyy-MM-dd'}} | {{safeVisiting.patientNumber}}
            <a class="modify_visiting" href="javascript:;" v-if="isAssistant" @click.stop="editRecord">修改</a>
            <label class="visiting-label" v-if="false">初诊</label>
        </div>
        <div class="visiting-content">
            <medicaldata-card v-for="card in showCards" :card="card" :active="card==currentCard" @active="activeCard" @remove="removeCard"></medicaldata-card>
        </div>
        <div class="visiting-footer"></div>
    </div>
</template>
<script>
    import MedicalDataStore from './MedicalDataStore.js';

    const HISTORYANDBODYCHECK_CARDNAME = "historyandbodycheck";
    const PATIENTHISTORY_CARDNAME = "patienthistory";
    const PHYSICALCHECK_CARDNAME = "physicalcheck";

    export default {
        props: {
            visiting: {},
            isFirst: {},
            filter: {

            },
            active: {

            }
        },
        data() {
            return {
                cards: [],
                historyAndCheckCard: null,
                currentCard: null
            }
        },
        computed: {
            isAssistant() {
                return GlobalService.getCurrentUserSync().user.userType == Sunset.Service.Dictionary.alias(
                    'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT');
            },
            showCards() {
                var cards = this.cards;
                var cardFilter = this.filter;
                if (cardFilter) {
                    var showCards = cards.filter(cardFilter);
                    if (showCards.indexOf(this.currentCard) < 0 && this.currentCard != this.visiting) {
                        this.home();
                    }
                    return showCards;
                } else {
                    return cards;
                }
            },
            safeVisiting() {
                return this.visiting && this.visiting.digest || {};
            },
            historyCardId() {
                return this.historyAndCheckCard && this.historyAndCheckCard.historyCardId;
            }
        },
        methods: {
            init() {
                var vr = this.visiting;
                if (vr) {
                    MedicalDataStore.getCardsData(vr.patientId, vr.registrationRecordId).then(cards => {
                        var standardCards = [];
                        //病史及体格检查组合卡片
                        var historyAndCheckCard = {
                            id: '',
                            historyCardId: null,
                            checkCardId: null,
                            lastModifyDate: null,
                            patientId: vr.patientId,
                            registrationRecordId: vr.registrationRecordId,
                            viewName: HISTORYANDBODYCHECK_CARDNAME,
                            digest: {},
                            _editing: true,
                            _used: false
                        };
                        cards.forEach(c => {
                            if (c.viewName == PATIENTHISTORY_CARDNAME) {
                                historyAndCheckCard.historyCardId = c.id;
                                historyAndCheckCard.id += historyAndCheckCard.id.length ? `,${c.id}` :
                                    c.id;
                                historyAndCheckCard.lastModifyDate = Math.max(historyAndCheckCard.lastModifyDate ||
                                    0, c.lastModifyDate);
                                historyAndCheckCard._editing = false;
                                historyAndCheckCard._used = true;
                            } else if (c.viewName == PHYSICALCHECK_CARDNAME) {
                                historyAndCheckCard.checkCardId = c.id;
                                historyAndCheckCard.id += historyAndCheckCard.id.length ? `,${c.id}` :
                                    c.id;
                                historyAndCheckCard.lastModifyDate = Math.max(historyAndCheckCard.lastModifyDate ||
                                    0, c.lastModifyDate);
                                historyAndCheckCard._editing = false;
                                historyAndCheckCard._used = true;
                            } else {
                                standardCards.push(c);
                            }
                        });
                        if (historyAndCheckCard._used) {
                            standardCards.unshift(this.historyAndCheckCard = historyAndCheckCard);
                        }
                        this.cards = standardCards;
                        this.isFirst && this.activeCard(this.cards[0]);
                    });
                }
            },
            newCard(card) {
                this.cards.push(card);
                this.activeCard(card);
            },
            addCard(card, slient) {
                this.cards.push(card);
                slient || this.activeCard(card);
            },
            removeCard(card) {
                this.cards.splice(this.cards.indexOf(card), 1);
                this.activeCard(this.cards[0], true);
            },
            home() {
                if (this.currentCard && !this.currentCard.id && this.currentCard.viewName !=
                    HISTORYANDBODYCHECK_CARDNAME) {
                    this.removeCard(this.currentCard);
                }
                this.activeCard(this.cards[0], true);
            },
            editRecord() {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                this.$emit('detail', this.visiting);
                this.currentCard = this.visiting;
            },
            activeRecord() {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                this.$emit('active', this.visiting);
                this.activeCard(this.cards[0], true);
            },
            activeCard(card, force) {
                if (GlobalService.isUploading()) {
                    Sunset.tip('正在上传，请稍后');
                    return false;
                }
                if ((force || this.currentCard != card) && card) {
                    this.currentCard = card;
                    card.visiting = this.visiting.digest;
                    Promise.resolve().then(() => {
                        if (this.historyCardId) {
                            return MedicalDataStore.getCardsDetailData(this.historyCardId).then(res => {
                                return res && res[0] && res[0].extension || {};
                            });
                        } else {
                            return {};
                        }
                    }).then((history) => {
                        card.history = history;
                        this.$emit('detail', card);
                    });
                }
            },
            haveEditing() {
                var cards = this.cards;
                for (var i = 0, l = cards.length; i < l; i++) {
                    if (cards[i]._editing === true && cards[i]._dirty === true) {
                        return true;
                    }
                }
                return false;
            }
        },
        ready() {
            this.init();
        }
    }
</script>