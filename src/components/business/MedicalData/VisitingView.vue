<style lang="sass">
    .visiting-view {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        .vv-toolbar {
            height: 60px;
            line-height: 60px;
            padding-left: 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #b0b0b0;
            background:#FFF;
            button {
                background: #fff;
                font-size: 15px;
                color: #454545;
                border:1px dashed #ccc;
            }
             :hover>button {
                color: #fff;
                background: #9a8a8a;
            }
        }
        .vv-content {
            position: absolute;
            top: 60px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            border: 5px solid transparent;
            overflow: auto;
            .vv-card-view {
                width: 100%;
                padding: 10PX;
                background: #FFF;
                border: 1px solid #E1E1E1;
                box-shadow: 2px 2px 5px #ddd;
                margin-bottom: 5px;
                .history-bodycheck-view>h3,
                .video-card-view>h3 {
                    color: #8d8d8d;
                    font-weight: 500;
                    span {
                        font-size: 1rem;
                        font-weight: normal;
                    }
                }
            }
        }
        &.hide-toolbar {
            .vv-toolbar {
                display: none;
            }
            .vv-content {
                top: 0px;
            }
        }
        .viewbtn {
            margin-top: -45px;
            .sunset-toolbar-item button {
                background: none;
                border: none;
                color: #4fb79f;
                padding: 6px 10px;
                font-size: 15px;
                span {
                    text-decoration: underline;
                }
            }
             :hover>button {
                color: black;
            }
        }
    }
</style>
<template>
    <div :class="['visiting-view',!isOwnHospitalPatient?'hide-toolbar':'']">
        <div class="vv-toolbar">
            <md-Toolbar @new-card="newCard"></md-toolbar>
        </div>
        <div class="vv-content">
            <img v-if="cards.length==0" style="display:block;margin:50px auto;" class="no_data" src="/assets/img/nodata.png">
            <div v-for="card in cards" class="vv-card-view">
                <component :is="'md-'+card.viewName+'-view'" :card="card" :data="card.extension" :patient="patient" :visitings="visitings"
                    @edit-card="editCard(card)" @remove-card="removeCard(card)" @refresh-flows="refreshFlows"></component>
            </div>
        </div>
    </div>
</template>
<script>
    import MdToolbar from './Toolbar';
    import MdView from './View';

    import MedicalDataStore from './MedicalDataStore';

    export default {
        components: {
            MdToolbar
        },
        props: {
            patient: {},
            data: {},
            visitings: {}
        },
        ready() {
            this.init();
            this.data.refresh = () => {
                this.init();
            }
        },
        data() {
            return {
                cards: []
            }
        },
        computed: {
            isOwnHospitalPatient() {
                return GlobalService.getCurrentUserSync().relation.hospital[0].id == this.patient.hospitalId;
            }
        },
        methods: {
            init() {
                var vr = this.data.visiting;
                if (vr) {
                    MedicalDataStore.getCardsData(vr.patientId, vr.registrationRecordId).then(cards => {
                        this.cards = cards;
                    });
                }
            },
            newCard(cardAlias) {
                var vr = this.data.visiting;
                this.$emit('edit-card', {
                    lastModifyDate: 0,
                    viewName: cardAlias.name,
                    patientId: vr.patientId,
                    registrationRecordId: vr.registrationRecordId,
                    digest: {},
                    visiting: this.data.visiting,
                    _editing: true,
                    _dirty: true
                }, cardAlias.title || cardAlias.label);
            },
            editCard(card) {
                card.visiting = this.data.visiting;
                MedicalDataStore.getCard(card.viewName).then(cardTemplate => {
                    this.$emit('edit-card', card, cardTemplate.viewLabel);
                });
            },
            removeCard(card) {
                var clear = Sunset.confirm({
                    content: '确定删除此资料？',
                    loading: true,
                    onOk: () => {
                        MedicalDataStore.removeCards(card.id).then(res => {
                            this.$emit('refresh');
                        });
                        clear();
                    }
                });
            },
            refreshFlows(){
                this.$emit('refresh-flows');
            }
        }
    }
</script>