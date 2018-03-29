<style lang="sass">
    .prescription-carddetail-container {}
</style>
<template>
    <div class="prescription-carddetail-container">
        <!-- <sunset-toolbar style="float:right;padding:10px 0px;" v-show="!editing" :options="mainToolbarOptions"  v-ref:formapi ></sunset-toolbar> -->
        <!-- <prescription-view  :card="card" :data="data" ></prescription-view> -->
        <div style="padding-top:10px;">
            <prescription :options="prescriptionOptions" :value.sync="result"></prescription>
            <div style="margin-top:10px;text-align:center;">
                <sunset-toolbar :options="toolbarOptions" v-ref:formapi ></sunset-toolbar>
            </div>
        </div>
    </div>
</template>

<script>
    import DictionaryStore from './Store.js';
    import Prescription from './prescription/index.vue';
    // import PrescriptionView from './View.vue';

    export default {
        components: {
            Prescription,
            // PrescriptionView
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
                mainToolbarOptions: {
                    align: 'center',
                    tools: [{
                        label: '编辑',
                        color: 'info',
                        premise: () => {
                            return (this.card.digest.userId == GlobalService.getCurrentUserSync().user.userId);
                        },
                        operate: () => {
                            this.editing = true;
                            this._format();
                            this.$emit('signal', 'EDIT');
                        }
                    }]
                },
                result: '',
                prescriptionOptions: {
                    label: '',
                    name: 'treatment',
                    widget: 'treatmentComp',
                    medicine: {
                        nameOpt: {
                            multi: false,
                            format: v => v.studyName,
                            template: v => `${v.studyName} ${v.specification} ${v.productArea}`,
                            all: v => DictionaryStore.getMedicineKinds({}).then(res => res.rows),
                            search: word => DictionaryStore.getMedicineKinds({
                                keyword: word
                            }).then(res => res.rows)
                        },
                        useMethodOpt: {
                            format: v => v.name,
                            template: v => v.name,
                            filterable: true,
                            all: v => DictionaryStore.getMedicineRoute(),
                            search: word => DictionaryStore.getMedicineRoute({
                                keyword: word
                            }).then(res => res.filter(item => item.name.indexOf(word) > -1))
                        },
                        useFrequencyOpt: {
                            format: v => v.name,
                            template: v => v.name,
                            all: v => DictionaryStore.getMedicineFrequency(),
                            search: v => DictionaryStore.getMedicineFrequency({}).then(res => res.filte(
                                item => item.name.indexOf(word) > -1))
                        },
                        perWeightOpt: {
                            widget: 'number',
                            size: 'small',
                            min: 1,
                            append: {
                                style: 'width:60px;',
                                default: '片',
                                data: keyword => DictionaryStore.getMedicineDose({
                                    keyword
                                }).then(res => res.map(item => {
                                    var v = item.name && item.name.trim();
                                    return {
                                        text: v,
                                        value: v
                                    };
                                }))
                            }
                        },
                        totalWeightOpt: {
                            widget: 'number',
                            size: 'small',
                            min: 1,
                            append: {
                                style: 'width:60px;',
                                default: '盒',
                                data: keyword => DictionaryStore.getMedicineAllUnit({
                                    keyword
                                }).then(res => res.map(item => {
                                    item.text = item.name;
                                    item.value = item.name;
                                    return item;
                                }))
                            }
                        }
                    },
                    operate: {
                        label: '治疗方案',
                        placeholder: '治疗方案指导....',
                    },
                    remarks: {
                        label: '备注',
                        placeholder: '备注'
                    }
                },
                toolbarOptions: {
                    tools: [{
                        label: '保存',
                        color: 'success',
                        operate: () => {
                            if (!this.result) {
                                Sunset.tip('请填写处方');
                                return;
                            }
                            var data = this._cast(this.result),
                                config = this.config;
                            if (data.prescriptions.medicine.length == 0) {
                                Sunset.tip('请填写处方');
                                return;
                            }
                            if (data) {
                                this.$emit('save', {
                                    digest: config.digest && config.digest(data),
                                    entity: config.entity && config.entity(data),
                                    extension: data,
                                });
                            }
                        }
                    }, {
                        label: '取消',
                        color: 'ghost',
                        operate: () => {
                            if (this.data) {
                                this.editing = false;
                                this.$emit('signal', 'CANCEL');
                            } else {
                                this.$emit('signal', 'HOME');
                            }
                        }
                    }]
                }
            }
        },
        methods: {
            init() {
                // this.editing = !this.data;
                // if (this.editing) {
                    this._format();
                // }
            },
            getEditingData() {
                return this.result;
            },
            setEditingData(data) {
                this.editing = true;
                return this.result = data;
            },
            _cast(json) {
                var data;
                try {
                    data = JSON.parse(json);
                    data.prescriptions.medicine = data.prescriptions.medicine.filter(m => {
                        m.medicines = m.medicines.filter(item => !!item.name);
                        return m.medicines.length > 0;
                    });
                } catch (e) {
                    console.error(e);
                }
                return data;
            },
            _format() {
                if (this.data) {
                    this.result = JSON.stringify(this.data);
                } else {
                    this.result = JSON.stringify({
                        operate: null,
                        medicine: [{
                            medicines: [],
                            marker: '',
                            entrust: ''
                        }],
                        remarks: null
                    });
                }
            }
        },
        ready() {
                // this.$refs.formapi.reset(this.data);            
            this.init();
        },
        // watch: {
        //     data(v) {
        //         this.init();
        //     }
        // }
    }
</script>