<style lang="sass">
    .md-card {
        position: relative;
        .card-remover {
            position: absolute;
            right: 12px;
            top: -3px;
            z-index: 10;
            color: #FFF;
            background: #aaa;
            font-size: 11px;
            width: 16px;
            height: 16px;
            border-radius: 10px;
            text-align: center;
            line-height: 16px;
            cursor: pointer;
            transform: scale(0.9);
            &:hover {
                background: #999;
            }
        }
        &.has-new {
            .card_title>label {
                position: relative;
                display: inline-block;
                &:after {
                    position: relative;
                    top: -5px;
                    left: 5px;
                    content: '';
                    z-index: 10;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 5px;
                    background: red;
                }
            }
        }
    }
</style>


<template>
    <div :class="['md-card',active?'active':'',card._editing?'editing':'',card.id?'':'new',card.hasNew?'has-new':'']" @click="onClick">
        <Icon v-if="!card.id&&card.viewName!='historyandbodycheck'" class="card-remover" type="close-round" @click.stop="remove"></Icon>
        <component v-if="widget" v-ref:card :is="widget" :active="active" :card="card" :data="card&&card.digest" :config="config"></component>
    </div>
</template>

<script>
    import MedicalDataStore from './MedicalDataStore.js';

    export default {
        props: {
            card: {

            },
            active: {
                type: Boolean,
                default: false
            },
            options: {

            }
        },
        data() {
            return {
                widget: null
            }
        },
        methods: {
            init() {
                if (this.card) {
                    MedicalDataStore.getCard(this.card.viewName).then(cardInfo => {
                        this.widget = 'md-'+this.card.viewName + '-card';
                        this.config = cardInfo.config;
                    });
                }
            },
            onClick() {
                this.$emit('active', this.card);
            },
            remove() {
                this.$emit('remove', this.card);
            }
        },
        ready() {
            this.init();
        }
    }
</script>