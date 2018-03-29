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
                        label: '日期',
                        name: 'date',
                        widget: 'date',
                        newline: true,
                        type:'datetime',
                        default : new Date(),
						validate: {
							required: true
                        }
                    },{
                        label: '沟通方式',
                        name: 'contact',
                        widget: 'radio',
                        monopolize: true,
						validate: {
							required: true
                        },
                        enum:'CONTACT_WAY'
                    },{
                        label: '信息记录',
                        name: 'notes',
                        widget: 'textarea',
						validate: {
							required: true
                        },
                        monopolize: true
                    }],
                    format:(model)=>{
                       model.date = new Date(model.date).getTime();
                       return model;
                    },
                    submit: (data) => {
                        var data1 = Object.assign(data,{expert:GlobalService.getCurrentUserSync().user.name});
                        var config = this.config;
                        this.$emit('save', {
                            digest: config.digest && config.digest(data1),
                            entity: config.entity && config.entity(data),
                            extension: data1
                        });
                    }
                }
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