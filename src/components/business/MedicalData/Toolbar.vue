<style lang="sass">
    .visiting-top-toolbar{
        .ivu-dropdown{
            &>div:first-child{
                height:50px;
            }
        }
        .ivu-select-dropdown{
            width:120px;
            line-height:20px;
        }
    }
</style>


<template>
    <sunset-toolbar class="visiting-top-toolbar" :options="toolbarOption"></sunset-toolbar>
</template>

<script>
    export default {
        computed: {
            currentUserType() {
                return GlobalService.getCurrentUserSync().user.userType;
            },
            isAssistant() {
                return this.currentUserType == Sunset.Service.Dictionary.alias(
                    'SYSTEM_ACCOUNT_TYPE', 'ASSISTANT');
            },
            isDoctor() {
                return this.currentUserType == Sunset.Service.Dictionary.alias(
                    'SYSTEM_ACCOUNT_TYPE', 'DOCTOR');
            }
        },
        data() {
            return {
                toolbarOption: {
                    tools: (() => {
                        var cards = GlobalService.getSystemConfig().cardPermissions(GlobalService.getCurrentUserSync());
                        return cards.map(card => (card.name?({
                            label: card.label,
                            color: card.color,
                            icon: 'android-add',
                            operate: () => {
                                this.newCard(card)
                            }
                        }):({
                            label : card.label,
                            color: card.color,
                            icon: 'android-add',
                            type : 'dropdown',
                            items : card.items.map(item=>({
                                label : item.label,
                                icon: 'android-add',
                                operate: () => {
                                    this.newCard(item)
                                }
                            }))
                        })))
                    })()
                }
            };
        },
        methods: {
            newCard(cardAlias) {
                this.$emit('new-card', cardAlias);
            }
        }
    }
</script>