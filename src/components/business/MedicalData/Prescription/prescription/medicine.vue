<style lang="sass" scoped>
    .medicine {
        padding: 5px;
        border: 1px solid #ccc;
        margin: 5px 0px;
        position: relative;
    }

    .header {
        .right {
            display: inline-block;
            float: right;
        }
    }

    .footer {
        .right {
            display: inline-block;
            float: right;
            margin-bottom: 5px;
        }
    }

    .main {
        table {
            width: 100%;
        }
    }
</style>

<style lang="sass">
    .medicine {
        .ivu-radio-wrapper {
            margin: 0px 10px;
            border-radius: 4px 4px 4px 4px !important;
            border-left: 1px solid #d7dde4;
        }
        .ivu-radio-wrapper.ivu-radio-group-item.ivu-radio-wrapper-checked {
            background: #3399ff !important;
            color: white;
            .ivu-radio.ivu-radio-checked {
                color: white;
            }
        }

        .main {
            table {
                td {
                    padding-top: 10px;
                }
            }
        }
    }
</style>

<template>
    <div class="medicine">
        <div class="header">
            <strong>处方{{index+1}}</strong>
            <div class="right">
                <i-button type="ghost" @click="$refs.prescribe.open()" size="small">选择常用处方</i-button>
                <i-button type="ghost" @click="savePrescribe()" size="small">存为常用处方</i-button>
                <i-button type="error" @click="$emit('delete-medicine',value,index)" size="small">删除该处方</i-button>
            </div>
            <div style="clear:both;"></div>
        </div>
        <div class="main">
            <div>
                <Radio-group :model.sync="value.marker" type="button">
                    <Radio :value="item" v-for=" item in markerData"></Radio>
                </Radio-group>
            </div>

            <div>
                <table>
                    <tr>
                        <th>组号</th>
                        <th>药品名称</th>
                        <th>给药途径</th>
                        <th>频次</th>
                        <th>单次剂量</th>
                        <th>天数</th>
                        <th>总量</th>
                        <th>备注</th>
                    </tr>
                    <template v-for="medicine in value.medicines">
                        <medicine-item :value.sync="medicine" :options="options" @delete-item="deleteItem">
                        </medicine-item>
                    </template>
                </table>
                <i-button type="text" @click="addMedicine" style="margin-top:5px;padding-left:0px;"><span style="color:#06F;">+&nbsp;添加药品</span></i-button>
            </div>
        </div>
        <div class="footer">
            <div>
                其他嘱托
                <div class="right">
                    <i-button type="ghost" @click="$refs.entrust.open()" size="small">选择常用嘱托</i-button>
                    <i-button type="ghost" @click="saveEntrust" size="small">存为常用嘱托</i-button>
                </div>
            </div>
            <div>
                <medicine-textarea :value.sync="value.entrust"></medicine-textarea>
            </div>
        </div>

        <sunset-table-modal v-ref:prescribe :options="prescribeOpt"></sunset-table-modal>
        <sunset-table-modal v-ref:entrust :options="entrustOpt"></sunset-table-modal>
    </div>
</template>

<script>
    import MedicineItem from './medicineItem.vue'

    import MedicineEntrust from './MedicineEntrust.vue';

    import MedicinePrescribe from './MedicinePrescribe.vue';


    import MedicineTextarea from './MedicineTextarea.vue';
    export default {
        name: "Medicine",
        props: {
            value: {
                type: Object
            },
            options: {
                type: Object
            },
            index: {
                type: Number
            }
        },
        components: {
            MedicineItem,
            MedicineEntrust,
            MedicinePrescribe,
            MedicineTextarea
        },
        data() {
            let self = this;

            this.value.marker = this.value.marker || '普通';
            let entrustOpt = {
                title: "选择常用嘱托",
                checked: false,
                tableOptions: {
                    columns: [{
                        title: '嘱托',
                        name: 'name'
                    }],
                    showIndex: true,
                    pageNumberStart: 0,
                    pageSize: 10,
                    // localPage: true,
                    multiCheck: false,
                    // sortable: true,
                    idKey: 'id',
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    recordTools: [{
                        label: '选择',
                        icon: 'trash-a',
                        color: 'info',
                        operate: (record) => {
                            this.$refs.entrust.cancel();
                            this.value.entrust = `${this.value.entrust} ${record.name}`;
                        },
                    }, {
                        label: '删除',
                        icon: 'trash-a',
                        color: 'error',
                        // confirm: '确定删除此申请?',
                        operate: (record) => {
                            return $http({
                                method: "POST",
                                url: '/service/business/favorite/del',
                                data: {
                                    ids: record.id
                                }
                            }).then(res => {
                                self.$refs.entrust.filterData();
                            })
                        },
                    }],
                    emptyTip: '无常用嘱托',
                    datasource: (v) => {
                        return $http({
                            url: '/service/business/favorite',
                            data: {
                                ...v,
                                type: 'ENTRUST'
                            }
                        })
                    }
                }
            };

            let prescribeOpt = {}

            Object.assign(prescribeOpt, entrustOpt, {
                title: '选择常用处方',
                tableOptions: {
                    columns: [{
                        title: '处方',
                        name: 'name'
                    }, {
                        title: '药品',
                        name: 'medicineNames'
                    }],
                    showIndex: true,
                    pageNumberStart: 0,
                    pageSize: 10,
                    // localPage: true,
                    multiCheck: false,
                    // sortable: true,
                    idKey: 'id',
                    format: {
                        list: 'rows',
                        count: 'totalCount',
                        pageSize: 'pageSize',
                        currentPage: 'pageNumber'
                    },
                    recordTools: [{
                        label: '选择',
                        icon: 'trash-a',
                        color: 'info',
                        operate: (record) => {
                            this.$refs.prescribe.cancel();
                            try {
                                this.value = JSON.parse(record.content);
                            } catch (e) {
                                console.warn(e)
                            }
                        }
                    }, {
                        label: '删除',
                        icon: 'trash-a',
                        color: 'error',
                        // confirm: '确定删除此申请?',
                        operate: (record) => {
                            return $http({
                                url: '/service/business/favorite/del',
                                method: "POST",
                                data: {
                                    ids: record.id
                                }
                            }).then(res => {
                                self.$refs.prescribe.filterData();
                            })
                        },
                    }],
                    emptyTip: '无常用处方',
                    datasource: (v) => {
                        return $http({
                            url: '/service/business/favorite',
                            data: {
                                ...v,
                                type: 'PRESCRIBE'
                            }
                        }).then(res => {
                            res.rows.forEach(item => {
                                let medicines = JSON.parse(item.content).medicines;
                                item.medicineNames = medicines.map(item => item.name).join(
                                    '');
                            });
                            return res;
                        })
                    }
                }
            });
            return {
                prescribeOpt,
                entrustOpt,
                markerData: ['普通', '急诊', '儿科', '麻醉'],
            }
        },
        methods: {
            addMedicine() {
                this.value.medicines = this.value.medicines || []
                this.value.medicines.push(this.initMedicine());
            },
            deleteItem(val) {
                this.value.medicines.splice(this.value.medicines.indexOf(val), 1);
            },
            savePrescribe() {
                let self = this;
                var value = Sunset.clone(self.value);
                if (!value.medicines || value.medicines.filter(item => !!item.name).length == 0) {
                    Sunset.tip('请选择处方药品');
                    return;
                }
                delete value.entrust;
                let prompt = Sunset.prompt({
                    icon: 'info',
                    title: '处方名称',
                    loading: false,
                    maxlength : 30,
                    onOk: (a) => {
                        if (!a || !a.trim()) {
                            Sunset.tip('请输入处方名称');
                            throw new Error();
                            return;
                        }
                        let model = {
                            name: a,
                            type: 'PRESCRIBE',
                            content: JSON.stringify(value)
                        };
                        saveHandler(model).then(res => {
                            prompt.remove();
                        })
                    }
                });
            },
            saveEntrust() {
                if (!this.value.entrust || !this.value.entrust.trim()) {
                    Sunset.tip('请输入嘱托内容');
                    return;
                }
                let model = {
                    name: this.value.entrust,
                    type: 'ENTRUST',
                    content: this.value.entrust
                };
                saveHandler(model).then(res => {
                    Sunset.tip('保存成功', 'success');
                })
            },
            initMedicine() {
                return {
                    groupNo: 0,
                    name: '',
                    useMethod: '',
                    useFrequency: "",
                    perWeight: '',
                    dataLength: "",
                    totalWeight: '',
                    specification: '',
                    remarks: '',
                    productArea: ''
                };
            }
        },
        ready() {
            this.value = this.value || {};

            if (!this.value) {
                this.value = {};
                this.value.medicines = [
                    this.initMedicine(),
                    this.initMedicine(),
                    this.initMedicine(),
                    this.initMedicine()
                ];
                this.value.marker = ''; // 类型
                this.value.entrust = ''; // 嘱托
            }

            if (!this.value.medicines || this.value.medicines.length == 0) {
                this.value.medicines = [
                    this.initMedicine(),
                    this.initMedicine(),
                    this.initMedicine(),
                    this.initMedicine()
                ];
            }

        }
    }
    /**
     * 保存常用数据
     * 
    id                  主键        String       无                 更新时必填，添加不填
    name                名称        String       无                 required
    content             内容        String       无                 required
    saveType            数据类型    String       无                 required
    saveProperty        属性        Integer       1                 required
     */
    function saveHandler(model) {
        return $http({
            url: '/service/business/favorite',
            data: model,
            json: true,
            method: "POST"
        }).then(res => {
            Sunset.tip('保存成功', 'success');;
            return res;
        })
    }
</script>