<template>
    <sunset-form-modal v-ref:registrationformmodal :options="options"></sunset-form-modal>
</template>

<script>
    import Store from './TestStore';

    export default {
        data() {
            return {
                options: {
                    title: '搞个测试',
                    width: 1000,
                    style: 'max-height:400px;text-align:left;',
                    formOptions: {
                        cols: 4,
                        tools: false,
                        fields: [],
                        format: (model) => {
                            var registration = {
                                patientType: model.patientType || null,
                                patientNumber: model.patientNumber,
                                registeredDept: model.registeredDept,
                                patientAge: model.patientAge,
                                registeredDate: new Date(model.registeredDate).getTime()
                            };
                            var param = {};
                            param.patientId = model.patientId;
                            param.viewName = "registration";
                            param.viewType = "StandardForm";
                            param.digest = param.extension = JSON.stringify(Object.assign({}, registration));
                            param.hospitalId = GlobalService.getCurrentUserSync().relation.hospital[0].id;
                            Object.assign(param, registration);
                            return {
                                registration: JSON.stringify(param),
                                viewNames : GlobalService.getSystemConfig().addUserWithEmptyCards
                            };
                        },
                        submit: (m) => {
                            return Store.saveVisiting(m).then(res => {
                                Sunset.tip('添加成功', 'success');
                                this.$emit('saved');
                            })
                        }
                    }
                }
            }
        },
        methods: {
            open(visiting) {
                Promise.resolve().then(() => {
                    return GlobalService.getCustomForm('test')
                }).then(res => {
                    this.options.formOptions.fields = res.fields;
                    this.$refs.registrationformmodal.open(visiting);
                });
            }
        }
    }
</script>