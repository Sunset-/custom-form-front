<style lang="sass">
    .classic-case-filter {
        padding: 15px;
        &>div {
            display: table;
            padding: 0px 0px;
            label {
                font-size: 14px;
                display: table-cell;
                white-space: nowrap;
            }
            .case-filter-item {
                margin-right: 10px;
                margin-bottom: 10px;
            }
        }
    }
</style>
<template>
    <div class="classic-case-filter">
        <div>
            <label>系统分类：</label>
            <div>
                <i-button class="case-filter-item" :type="filter.medicalBodyCategory?'ghost':'primary'" @click="change('medicalBodyCategory',null)">全部</i-button>
                <i-button class="case-filter-item" :type="filter.medicalBodyCategory==item.value?'primary':'ghost'" @click="change('medicalBodyCategory',item.value)"
                    v-for="item in medicalBodyCategory">{{item.name}}</i-button>
            </div>
        </div>
        <div>
            <label>疾病分类：</label>
            <div>
                <i-button class="case-filter-item" :type="filter.diseaseVariety?'ghost':'primary'" @click="change('diseaseVariety',null)">全部</i-button>
                <i-button class="case-filter-item" :type="filter.diseaseVariety==item.value?'primary':'ghost'" @click="change('diseaseVariety',item.value)"
                    v-for="item in diseaseVariety">{{item.name}}</i-button>
            </div>
        </div>
    </div>
</template>

<script>
    import DictionaryStore from '../dictionary/DictionaryStore';

    export default {
        data() {
            return {
                diseaseVariety: [],
                medicalBodyCategory: [],
                filter: {
                    diseaseVariety: null,
                    medicalBodyCategory: null
                }
            }
        },
        methods: {
            init() {
                DictionaryStore.getDiseaseVariety().then(res => {
                    this.diseaseVariety = res || [];
                });
                DictionaryStore.getMedicalBodyCategory().then(res => {
                    this.medicalBodyCategory = res || [];
                });
            },
            change(name, value) {
                this.filter[name] = value;
                this.$emit('change', this.filter);
            }
        },
        ready() {
            this.init();
        }
    }
</script>