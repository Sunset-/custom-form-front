<template>
    <div>
        <sunset-toolbar style="float:right;padding:10px 0px;" v-show="!editing" :options="toolbarOptions"></sunset-toolbar>
        <history-view v-show="!editing" :data="data"></history-view>
        <sunset-custom-form style="padding-top:8px;" v-show="editing" :no="config.formNo" v-ref:form :options="formOptions" @signal="operateSignal"></sunset-custom-form>
    </div>
</template>
<script>
    import HistoryView from './View';

    export default {
        components: {
            HistoryView
        },
        props: {
            card: {

            },
            data: {

            },
            config: {

            }
        },
        data() {
            return {
                editing: false,
                formOptions: {
                    submit: (data) => {
                        data.tangscreeningId = this.card.digest.tangscreeningId;
                        var config = this.config;
                        this.$emit('save', {
                            digest: config.digest && config.digest(data),
                            entity: config.entity && config.entity(data),
                            extension: data,
                            associatedCardId : data.tangscreeningId
                        });
                    }
                },
                toolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '编辑',
                        color: 'info',
                        premise: () => {
                            return (this.card.digest.userId == GlobalService.getCurrentUserSync().user.userId);
                        },
                        operate: () => {
                            this.editing = true;
                            this.$refs.form.reset(this.data);
                            this.$emit('signal', 'EDIT');
                        }
                    }]
                }
            }
        },
        methods: {
            init() {
                this.editing = !this.data;
            },
            getEditingData() {
                return this.$refs.form.getModel();
            },
            setEditingData(data) {
                this.editing = true;
                return this.$refs.form.reset(data);
            },
            operateSignal(signal) {
                if (signal == 'CANCEL') {
                    if (this.data) {
                        this.editing = false;
                        this.$emit('signal', 'CANCEL');
                    } else {
                        this.$emit('signal', 'HOME');
                    }
                }
            }
        },
        ready() {
            this.init();
        },
        watch: {
            data(v) {
                this.init();
            }
        }
    }
</script>