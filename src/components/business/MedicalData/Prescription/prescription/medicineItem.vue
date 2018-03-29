<style lang="sass">
    .medicine-item {
        height: 50px;
        vertical-algin: top;
        .name-opt {
            .sunset-searchinput-searchresults {
                width: 250px;
            }
        }
        .usemethod {
            .sunset-searchinput-searchresults {
                width: 150px;
            }
        }
        .use-ferquency {
            .sunset-searchinput-searchresults {
                width: 150px;
            }
        }
        .data-length {
            .sunset-searchinput-searchresults {
                width: 150px;
            }
        }
        .specification {
            .sunset-searchinput-searchresults {
                width: 150px;
            }
        }

        .additor-message {
            position: absolute;
            display: inline-block;
            width: 300px;
            top: 45px;
            left: 45px;
        }
    }
</style>

<template>
    <tr class="medicine-item">
        <td style="position:relative;">
            <i-select :model.sync="value.groupNo" size="small" style="width:40px" placeholder="">
                <i-option v-for="item in 5" :value="item">{{ item==0?'-':item}}</i-option>
            </i-select>
            <div class="additor-message">
                {{{value.specification}}}&nbsp;{{{value.productArea}}}
            </div>
        </td>
        <td class="name-opt">
            <sunset-search-input v-if="nameOpt" :value.sync="value.name" size="small" :options="nameOpt"></sunset-search-input>
        </td>
        <td class="usemethod">
            <sunset-search-input :value.sync="value.useMethod" size="small" :options="options.useMethodOpt"></sunset-search-input>
        </td>
        <td class="use-ferquency">
            <sunset-search-input :value.sync="value.useFrequency" size="small" :options="options.useFrequencyOpt"></sunset-search-input>
        </td>
        <td>
            <div>
                <sunset-input :value.sync="value.perWeight" size="small" :options="options.perWeightOpt"></sunset-search-input>
            </div>
        </td>
        <td class="data-length">
            <Input-number :value.sync="value.dateLength" size="small" :min="1" style="width:40px"></Input-number>
        </td>
        <td>
            <sunset-input :value.sync="value.totalWeight" size="small" :options="options.totalWeightOpt"></sunset-search-input>
        </td>
        <td>
            <i-input :value.sync="value.remarks" size="small"> </i-input>
        </td>
        <td>
            <i-button type="text" @click="$emit('delete-item',value)">
                <Icon type="ios-trash-outline" style="font-size:18px;"></Icon>
            </i-button>
        </td>
    </tr>
</template>

<script>
    export default {
        name: "MedicineItem",
        props: {
            value: {
                type: Object,
                default: function () {
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
                    }
                }
            },
            options: {
                type: Object
            }
        },
        data() {
            let self = this;
            return {
                nameOpt: null
            }
        },
        methods: {
            blurWeight(){
                alert(this.value.perWeight)
            }
        },
        ready() {
            this.nameOpt = Object.assign({}, this.options.nameOpt)
            this.nameOpt.onSelected = (v) => Object.assign(this.value, {
                useMethod: v.usePathway,
                productArea: v.productArea,
                specification: v.specification,
                perWeight: [1, v.drugUnit].join(','),
                totalWeight: [1, v.plcUnit].join(',')
            });
        }

    }
</script>