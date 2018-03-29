<template>
    <div>
        <sunset-custom-form style="padding-top:8px;" :no="config.formNo" v-ref:form :options="formOptions" @signal="operateSignal"></sunset-custom-form>
    </div>
</template>
<script>
    // import HistoryView from './View';

    export default {
        components: {
            // HistoryView
        },
        props: {
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
                        var config = this.config;
                        this.$emit('save', {
                            digest: config.digest && config.digest(data),
                            entity: config.entity && config.entity(data),
                            extension: data,
                        });
                    }
                }
            }
        },
        methods: {
            init() {
                this.$refs.form.reset(this.data);
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