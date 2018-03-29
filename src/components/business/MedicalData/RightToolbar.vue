<template>
    <sunset-toolbar :options="toolbarOption"></sunset-toolbar>
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
                        return cards.map(card => ({
                            label: card.label,
                            color: card.color,
                            operate: () => {
                                this.newCard(card.name)
                            }
                        }))
                    })()
                }
            };
        },
        methods: {
            newCard(cardName) {
                this.$emit('new-card', cardName);
            }
        }
    }
</script>