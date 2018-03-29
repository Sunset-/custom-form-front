<style>
.dicomarchives .sunset-form-field .sunset-field-label {
    text-align: left;
}
</style>



<template>
    <div class="dicomarchives">
        <sunset-custom-form style="padding-top:8px;" :no="config.formNo" v-ref:form :options="formOptions" @signal="operateSignal"></sunset-custom-form>
    </div>
</template>
<script>

    export default {
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
                            extension: data
                        });
                    }
                },
            }
        },
        methods: {
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
            this.$refs.form.reset(this.data);
        }
    }
</script>