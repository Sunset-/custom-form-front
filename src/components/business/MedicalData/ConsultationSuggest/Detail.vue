<template>
    <div>
        <sunset-form style="padding-top:8px;" v-ref:form :options="formOptions" @signal="operateSignal"></sunset-form>
    </div>
</template>
<script>
    export default {
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
					fields:[{
						group:'会诊意见',
						label:'意见',
						name:'suggest',
						widget:'textarea',
                        monopolize: true,
                        validate: {
                            required: true,
                            maxlength:1000
                        }
					}],
                    submit: (data) => {
                        var data1 = Object.assign(data,{expert:GlobalService.getCurrentUserSync().user.name});
                        var config = this.config;
                        this.$emit('save', {
                            digest: config.digest && config.digest(data1),
                            entity: config.entity && Object.assign(config.entity(data),{type:'CONSULTSUGGEST'}),
                            extension: data1
                        });
                    }
                },
                // toolbarOptions: {
                //     align: 'center',
                //     tools: [{
                //         label: '编辑',
                //         color: 'info',
                //         premise: () => {
                //             return (this.card.digest.userId == GlobalService.getCurrentUserSync().user.userId);
                //         },
                //         operate: () => {
                //             this.editing = true;
                //             this.$refs.form.reset(this.data);
                //             this.$emit('signal', 'EDIT');
                //         }
                //     }]
                // }
            }
        },
        methods: {
            init() {
                return this.$refs.form.reset(this.data);
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